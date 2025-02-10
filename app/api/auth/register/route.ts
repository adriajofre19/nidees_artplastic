import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        console.log("🔹 Intentando registrar usuario:", email);

        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            console.error("❌ Usuario ya existe:", email);
            return NextResponse.json({ error: "El usuario ya existe" }, { status: 400 });
        }

        // Encriptar la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario
        const newUser = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });

        console.log("✅ Usuario registrado:", newUser.email);

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error("❌ Error en el registro:", error);
        return NextResponse.json({ error: "Error en el registro" }, { status: 500 });
    }
}
