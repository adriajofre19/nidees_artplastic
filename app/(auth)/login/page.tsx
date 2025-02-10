"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
            credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
            // 🔥 Forcem l'actualització del Navbar amb `SWR`
            mutate("/api/auth/me");

            // 🔄 Esperem una mica per garantir la sincronització
            setTimeout(() => {
                router.refresh();
                router.push("/profile");
            }, 100);
        } else {
            setError(data.error || "Error en l'inici de sessió");
        }
    };

    return (


        <div className="min-h-screen flex">
            {/* Left side - Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-light text-gray-900">
                            Benvingut/da de nou
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            No tens compte?{" "}
                            <Link href="/register" className="text-emerald-600 hover:text-emerald-500">
                                Registra&apos;t aquí
                            </Link>
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
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

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <Link
                                    href="/forgot-password"
                                    className="text-emerald-600 hover:text-emerald-500"
                                >
                                    Has oblidat la contrasenya?
                                </Link>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700"

                        >Iniciar sessió

                        </Button>
                    </form>
                </div>
            </div>

            {/* Right side - Image */}
            <div className="hidden lg:flex h-screen">
                <img src="/bolso_auth.png" alt="Logo" className="h-full w-auto" />
            </div>
        </div>
    );
}
