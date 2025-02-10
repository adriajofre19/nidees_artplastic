import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        console.log("🔹 Intentando loguear usuario:", email);

        // Buscar usuario en la base de datos
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            console.error("❌ Usuario no encontrado:", email);
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 });
        }

        console.log("✅ Usuario encontrado:", user.email);

        // Verificar la contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            console.error("❌ Contraseña incorrecta para:", email);
            return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
        }

        console.log("✅ Contraseña correcta para:", email);

        // Generar JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        console.log("✅ Token generado:", token);

        // Guardar el token en una cookie HTTP-only
        const response = NextResponse.json({ success: true, user });
        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7 días
        });

        return response;
    } catch (error) {
        console.error("❌ Error en el login:", error);
        return NextResponse.json({ error: "Error en el login" }, { status: 500 });
    }
}
