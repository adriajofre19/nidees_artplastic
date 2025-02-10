import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
}

export async function POST(req: Request) {
    const { name, description, image, slug } = await req.json();
    const newCategory = await prisma.category.create({ data: { name, description, image, slug } });
    return NextResponse.json(newCategory);
}

export async function DELETE(req: Request) {
    const { id } = await req.json();
    const deletedCategory = await prisma.category.delete({ where: { id } });
    return NextResponse.json(deletedCategory);
}
