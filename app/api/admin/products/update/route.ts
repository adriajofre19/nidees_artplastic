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
            const imagesDir = join(process.cwd(), "public/images/products");
            await mkdir(imagesDir, { recursive: true });

            const imageExt = imageFile.name.split('.').pop() || 'jpg';
            const imageName = `${id}.${imageExt}`;
            const imagePath = join(imagesDir, imageName);

            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            await writeFile(imagePath, new Uint8Array(buffer));

            updateData.image = `/images/products/${imageName}`;
        }

        const product = await prisma.product.update({
            where: { id },
            data: updateData,
            include: {
                category: true
            }
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
