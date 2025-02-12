import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
}

export async function POST(req: Request) {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const slug = formData.get("slug") as string;
    const imageFile = formData.get("image") as File | null;

    let imagePathInDB = "";

    const genSlug = name.toLowerCase().replace(/[àáâãäçèéêëìíîïñòóôõöùúûüýÿ]/g, c =>
        'aaaaaceeeeiiiinooooouuuuyy'['àáâãäçèéêëìíîïñòóôõöùúûüýÿ'.indexOf(c)])
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    if (imageFile) {
        // Definir la ruta de la carpeta
        const imagesDir = path.join(process.cwd(), "public/images");

        try {
            // Comprovar si la carpeta existeix, si no, crear-la
            await fs.access(imagesDir);
        } catch (error) {
            await fs.mkdir(imagesDir, { recursive: true });
        }

        // Guardem la imatge com "slug.jpg"
        const imageName = `${slug}.jpg`;
        const imagePath = path.join(imagesDir, imageName);

        // Convertir el fitxer a buffer i desar-lo
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        await fs.writeFile(imagePath, new Uint8Array(buffer));

        // Guardar el camí relatiu de la imatge a la base de dades
        imagePathInDB = `/images/${imageName}`;
    }

    const newCategory = await prisma.category.create({
        data: { name, description, slug: genSlug, image: imagePathInDB },
    });

    return NextResponse.json(newCategory);
}

export async function DELETE(req: Request) {
    const { id } = await req.json();
    const deletedCategory = await prisma.category.delete({ where: { id } });
    return NextResponse.json(deletedCategory);
}