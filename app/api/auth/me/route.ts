import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
    try {
        const token = req.headers.get("cookie")?.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

        if (!token) {
            return NextResponse.json({ error: "No autoritzat" }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, name: true, email: true },
        });

        if (!user) {
            return NextResponse.json({ error: "Usuari no trobat" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: "Token invàlid o expirat" }, { status: 401 });
    }
}

export async function PUT(req: Request) {
    try {
        const token = req.headers.get("cookie")?.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

        if (!token) {
            return NextResponse.json({ error: "No autoritzat" }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const { name, email } = await req.json();

        const updatedUser = await prisma.user.update({
            where: { id: decoded.id },
            data: { name, email },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json({ error: "Error en actualitzar l'usuari" }, { status: 500 });
    }
}
