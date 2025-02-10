"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, User, Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function RegisterPage() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            router.push("/login");
        } else {
            alert("Error en el registro");
        }
    };

    return (


        <div className="min-h-screen flex">
            {/* Left side - Image */}
            <div className="hidden lg:flex h-screen relative">
                <Image
                    src="/bolso_auth.png"
                    alt="Register"
                    className="w-auto h-full"
                />
            </div>

            {/* Right side - Form */}
            <div className="w-full flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-light text-gray-900">
                            Crea el teu compte
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Ja tens compte?{" "}
                            <Link href="/login" className="text-emerald-600 hover:text-emerald-500">
                                Inicia sessió
                            </Link>
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    type="text"
                                    placeholder="Nom complet"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="pl-10"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    type="email"
                                    placeholder="Correu electrònic"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="pl-10"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Contrasenya"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="pl-10 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>


                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                            disabled={loading}
                        >
                            {loading ? "Registrant..." : "Registrar-se"}
                        </Button>

                        <p className="text-xs text-center text-gray-600">
                            En registrar-te, acceptes els nostres{" "}
                            <Link href="/terms" className="text-emerald-600 hover:text-emerald-500">
                                Termes i Condicions
                            </Link>{" "}
                            i la nostra{" "}
                            <Link href="/privacy" className="text-emerald-600 hover:text-emerald-500">
                                Política de Privacitat
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
