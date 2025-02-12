import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

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

        // Solo actualizar la imagen si se proporciona una nueva
        if (imageFile && imageFile.size > 0) {
            const imagesDir = join(process.cwd(), "public/images/categories");
            await mkdir(imagesDir, { recursive: true });

            const imageExt = imageFile.name.split('.').pop() || 'jpg';
            const imageName = `${id}.${imageExt}`;
            const imagePath = join(imagesDir, imageName);

            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            await writeFile(imagePath, new Uint8Array(buffer));

            updateData.image = `/images/categories/${imageName}`;
        }

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
