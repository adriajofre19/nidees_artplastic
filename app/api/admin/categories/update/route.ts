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
        const imageFile = formData.get("image") as File | null;

        if (!id || !name) {
            return NextResponse.json(
                { error: "Falten camps obligatoris" },
                { status: 400 }
            );
        }

        // Obtener la categoría actual
        const currentCategory = await prisma.category.findUnique({
            where: { id }
        });

        if (!currentCategory) {
            return NextResponse.json(
                { error: "Categoria no trobada" },
                { status: 404 }
            );
        }

        const updateData: any = {
            name,
            description,
            image: currentCategory.image // Mantener la imagen actual por defecto
        };

        // Si se sube una nueva imagen, eliminar la anterior y subir la nueva
        if (imageFile && imageFile.size > 0) {
            // Eliminar imagen antigua de Cloudinary
            if (currentCategory.image) {
                const publicId = currentCategory.image.split("/").pop()?.split(".")[0];
                if (publicId) {
                    await cloudinary.uploader.destroy(`categories/${publicId}`);
                }
            }

            // Convertir archivo a Buffer
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Subir nueva imagen a Cloudinary
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

            // Guardar la nueva URL de la imagen
            updateData.image = (uploadResult as any).secure_url;
        }

        // Actualizar la categoría en la base de datos
        const category = await prisma.category.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error("[CATEGORIES_UPDATE]", error);
        return NextResponse.json(
            { error: "Error al actualitzar la categoria" },
            { status: 500 }
        );
    }
}
