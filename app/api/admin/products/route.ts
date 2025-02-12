import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true
            },
            orderBy: {
                name: 'asc'
            }
        });
        return NextResponse.json(products);
    } catch (error) {
        console.error("[PRODUCTS_GET]", error);
        return NextResponse.json(
            { error: "Error al obtenir els productes" },
            { status: 500 }
        );
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
            return NextResponse.json(
                { error: "Falten camps obligatoris" },
                { status: 400 }
            );
        }

        // Generate URL-friendly ID from name
        const id = name.toLowerCase()
            .replace(/[àáâãäçèéêëìíîïñòóôõöùúûüýÿ]/g, c =>
                'aaaaaceeeeiiiinooooouuuuyy'['àáâãäçèéêëìíîïñòóôõöùúûüýÿ'.indexOf(c)])
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        // Generate URL-friendly Slug from name
        const genSlug = name.toLowerCase().replace(/[àáâãäçèéêëìíîïñòóôõöùúûüýÿ]/g, c =>
            'aaaaaceeeeiiiinooooouuuuyy'['àáâãäçèéêëìíîïñòóôõöùúûüýÿ'.indexOf(c)])
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');


        // Ensure images directory exists
        const imagesDir = join(process.cwd(), "public/images/products");
        await mkdir(imagesDir, { recursive: true });

        // Save image with product ID as filename
        const imageExt = imageFile.name.split('.').pop() || 'jpg';
        const imageName = `${id}.${imageExt}`;
        const imagePath = join(imagesDir, imageName);

        // Convert File to Buffer and save
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(imagePath, buffer);

        // Create product in database
        const product = await prisma.product.create({
            data: {
                id,
                name,
                description,
                price,
                image: `/images/products/${imageName}`,
                categoryId,
                slug: genSlug
            },
            include: {
                category: true
            }
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("[PRODUCTS_POST]", error);
        return NextResponse.json(
            { error: "Error al crear el producte" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json(
                { error: "ID de producte no proporcionat" },
                { status: 400 }
            );
        }

        const product = await prisma.product.delete({
            where: { id }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("[PRODUCTS_DELETE]", error);
        return NextResponse.json(
            { error: "Error al eliminar el producte" },
            { status: 500 }
        );
    }
}