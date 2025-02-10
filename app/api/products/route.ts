import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
}

export async function POST(req: Request) {
    const { name, description, image, price, categoryId, slug } = await req.json();
    const newProduct = await prisma.product.create({ data: { name, description, image, price, categoryId, slug } });
    return NextResponse.json(newProduct);
}

export async function DELETE(req: Request) {
    const { id } = await req.json();
    const deletedProduct = await prisma.product.delete({ where: { id } });
    return NextResponse.json(deletedProduct);
}
