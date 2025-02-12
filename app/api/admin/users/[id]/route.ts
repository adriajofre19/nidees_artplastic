import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await req.json();
        const { name, email, password } = body;

        if (!name || !email) {
            return NextResponse.json(
                { error: "El nom i el correu electrònic són obligatoris" },
                { status: 400 }
            );
        }

        // Check if email is already taken by another user
        const existingUser = await prisma.user.findFirst({
            where: {
                email,
                NOT: {
                    id,
                },
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Aquest correu electrònic ja està en ús" },
                { status: 400 }
            );
        }

        // Prepare update data
        const updateData: any = {
            name,
            email,
        };

        // Only update password if provided
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        // Update user
        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("[USER_UPDATE]", error);
        return NextResponse.json(
            { error: "Error intern del servidor" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // Delete user
        await prisma.user.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[USER_DELETE]", error);
        return NextResponse.json(
            { error: "Error intern del servidor" },
            { status: 500 }
        );
    }
}