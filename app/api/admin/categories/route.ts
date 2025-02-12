import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

// Configurar Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function GET() {
    try {
        const categories = await prisma.category.findMany();
        return NextResponse.json(categories);
    } catch (error) {
        console.error("[CATEGORIES_GET]", error);
        return NextResponse.json({ error: "Error al obtenir les categories" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const slug = (formData.get("slug") as string) || generateSlug(name);
        const imageFile = formData.get("image") as File | null;

        let imageUrl = "";

        // Subir imagen a Cloudinary si se proporciona
        if (imageFile) {
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "categories" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(buffer);
            });

            imageUrl = (uploadResult as any).secure_url;
        }

        // Crear la categoría en la base de datos
        const newCategory = await prisma.category.create({
            data: { name, description, slug, image: imageUrl },
        });

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        console.error("[CATEGORIES_POST]", error);
        return NextResponse.json({ error: "Error al crear la categoria" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "ID de categoria no proporcionat" }, { status: 400 });
        }

        // Buscar la categoría antes de eliminarla
        const category = await prisma.category.findUnique({ where: { id } });

        if (!category) {
            return NextResponse.json({ error: "Categoria no trobada" }, { status: 404 });
        }

        // Eliminar imagen de Cloudinary si existe
        if (category.image) {
            const publicId = category.image.split("/").pop()?.split(".")[0]; // Obtener el publicId de Cloudinary
            await cloudinary.uploader.destroy(`categories/${publicId}`);
        }

        // Eliminar la categoría de la base de datos
        await prisma.category.delete({ where: { id } });

        return NextResponse.json({ message: "Categoria eliminada correctament" });
    } catch (error) {
        console.error("[CATEGORIES_DELETE]", error);
        return NextResponse.json({ error: "Error al eliminar la categoria" }, { status: 500 });
    }
}

// Función para generar un slug automáticamente
function generateSlug(name: string): string {
    return name.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quitar acentos
        .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres no válidos
        .replace(/^-+|-+$/g, '');
}
