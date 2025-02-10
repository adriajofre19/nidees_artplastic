import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function getUserFromToken(req: Request) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return null;
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });
        return user;
    } catch (error) {
        return null;
    }
}

// DELETE /api/profile/addresses/[id] - Delete an address
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUserFromToken(req);

        if (!user) {
            return NextResponse.json(
                { error: "No autoritzat" },
                { status: 401 }
            );
        }

        // First verify the address belongs to the user
        const address = await prisma.adress.findUnique({
            where: {
                id: params.id,
            },
        });

        if (!address) {
            return NextResponse.json(
                { error: "Adreça no trobada" },
                { status: 404 }
            );
        }

        if (address.userId !== user.id) {
            return NextResponse.json(
                { error: "No autoritzat" },
                { status: 403 }
            );
        }

        // Delete the address
        await prisma.adress.delete({
            where: {
                id: params.id,
            },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[ADDRESS_DELETE]", error);
        return NextResponse.json(
            { error: "Error intern del servidor" },
            { status: 500 }
        );
    }
}

// PUT /api/profile/addresses/[id] - Update an address
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUserFromToken(req);

        if (!user) {
            return NextResponse.json(
                { error: "No autoritzat" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { name, street, city, postalCode, province } = body;

        // Validate required fields
        if (!name || !street || !city || !postalCode || !province) {
            return NextResponse.json(
                { error: "Tots els camps són obligatoris" },
                { status: 400 }
            );
        }

        // First verify the address belongs to the user
        const existingAddress = await prisma.adress.findUnique({
            where: {
                id: params.id,
            },
        });

        if (!existingAddress) {
            return NextResponse.json(
                { error: "Adreça no trobada" },
                { status: 404 }
            );
        }

        if (existingAddress.userId !== user.id) {
            return NextResponse.json(
                { error: "No autoritzat" },
                { status: 403 }
            );
        }

        // Update the address
        const address = await prisma.adress.update({
            where: {
                id: params.id,
            },
            data: {

                street,
                city,

            },
        });

        return NextResponse.json(address);
    } catch (error) {
        console.error("[ADDRESS_PUT]", error);
        return NextResponse.json(
            { error: "Error intern del servidor" },
            { status: 500 }
        );
    }
}