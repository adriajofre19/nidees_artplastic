import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

// Configurar Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function PUT(req: Request) {
    try {
        const formData = await req.formData();
        const id = formData.get("id") as string;
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const price = formData.get("price") as string;
        const categoryId = formData.get("categoryId") as string;
        const imageFile = formData.get("image") as File | null;

        if (!id || !name || !price || !categoryId) {
            return NextResponse.json(
                { error: "Falten camps obligatoris" },
                { status: 400 }
            );
        }

        // Obtener el producto actual
        const currentProduct = await prisma.product.findUnique({
            where: { id }
        });

        if (!currentProduct) {
            return NextResponse.json(
                { error: "Producte no trobat" },
                { status: 404 }
            );
        }

        const updateData: any = {
            name,
            description,
            price: parseFloat(price),
            categoryId,
            image: currentProduct.image // Mantener la imagen actual por defecto
        };

        // Solo actualizar la imagen si se proporciona una nueva
        if (imageFile && imageFile.size > 0) {
            // Eliminar imagen antigua de Cloudinary
            if (currentProduct.image) {
                const publicId = currentProduct.image.split("/").pop()?.split(".")[0];
                if (publicId) {
                    await cloudinary.uploader.destroy(`products/${publicId}`);
                }
            }

            // Convertir archivo a Buffer
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Subir nueva imagen a Cloudinary
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

            // Guardar nueva URL de la imagen
            updateData.image = (uploadResult as any).secure_url;
        }

        // Actualizar el producto en la base de datos
        const product = await prisma.product.update({
            where: { id },
            data: updateData,
            include: { category: true }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("[PRODUCTS_UPDATE]", error);
        return NextResponse.json(
            { error: "Error al actualitzar el producte" },
            { status: 500 }
        );
    }
}
