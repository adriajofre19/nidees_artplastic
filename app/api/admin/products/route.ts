import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

// Configurar Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            include: { category: true },
            orderBy: { id: 'asc' }
        });
        return NextResponse.json(products);
    } catch (error) {
        console.error("[PRODUCTS_GET]", error);
        return NextResponse.json({ error: "Error al obtenir els productes" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const price = parseFloat(formData.get("price") as string);
        const categoryId = formData.get("categoryId") as string;
        const imageFile = formData.get("image") as File;

        if (!name || !price || !categoryId || !imageFile) {
            return NextResponse.json({ error: "Falten camps obligatoris" }, { status: 400 });
        }

        // Generar un ID basado en el nombre
        const id = name.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quitar acentos
            .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres no válidos
            .replace(/^-+|-+$/g, '');

        // Generar Slug basado en el nombre
        const genSlug = id;

        // Convertir archivo a Buffer
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Subir imagen a Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "products" }, // Carpeta en Cloudinary
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        // Obtener la URL de la imagen subida
        const imageUrl = (uploadResult as any).secure_url;

        // Crear producto en la base de datos
        const product = await prisma.product.create({
            data: {
                id,
                name,
                description,
                price,
                image: imageUrl, // Guardar la URL de Cloudinary
                categoryId,
                slug: genSlug
            },
            include: { category: true }
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("[PRODUCTS_POST]", error);
        return NextResponse.json({ error: "Error al crear el producte" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "ID de producte no proporcionat" }, { status: 400 });
        }

        // Buscar el producto antes de eliminarlo
        const product = await prisma.product.findUnique({ where: { id } });

        if (!product) {
            return NextResponse.json({ error: "Producte no trobat" }, { status: 404 });
        }

        // Eliminar imagen de Cloudinary si existe
        if (product.image) {
            const publicId = product.image.split("/").pop()?.split(".")[0]; // Obtener el publicId de Cloudinary
            await cloudinary.uploader.destroy(`products/${publicId}`);
        }

        // Eliminar el producto de la base de datos
        await prisma.product.delete({ where: { id } });

        return NextResponse.json({ message: "Producte eliminat correctament" });
    } catch (error) {
        console.error("[PRODUCTS_DELETE]", error);
        return NextResponse.json({ error: "Error al eliminar el producte" }, { status: 500 });
    }
}
