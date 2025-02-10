import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
}

export async function POST(req: Request) {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = formData.get("categoryId") as string;
    const slug = formData.get("slug") as string;
    const imageFile = formData.get("image") as File | null;

    let imagePathInDB = "";

    if (imageFile) {
        // Ruta de la carpeta on desarem la imatge
        const imagesDir = path.join(process.cwd(), "public/images");

        try {
            await fs.access(imagesDir);
        } catch (error) {
            await fs.mkdir(imagesDir, { recursive: true });
        }

        // Guardem la imatge com "/images/slug.jpg"
        const imageName = `${slug}.jpg`;
        const imagePath = path.join(imagesDir, imageName);

        // Convertir el fitxer a buffer i desar-lo
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        await fs.writeFile(imagePath, buffer);

        // Guardar el camí relatiu de la imatge a la base de dades
        imagePathInDB = `/images/${imageName}`;
    }

    const newProduct = await prisma.product.create({
        data: { name, description, price, categoryId, slug, image: imagePathInDB },
    });

    return NextResponse.json(newProduct);
}
