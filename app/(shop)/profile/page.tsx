"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then(res => res.json());

export default function ProfilePage() {
    const router = useRouter();
    const { data: user, error, mutate } = useSWR("/api/auth/me", fetcher);

    const [form, setForm] = useState({ name: "", email: "" });

    useEffect(() => {
        if (user) {
            setForm({ name: user.name, email: user.email });
        }
    }, [user]);

    if (error) return <p>Error carregant l'usuari</p>;
    if (!user) return <p>Carregant...</p>;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/auth/me", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
            credentials: "include",
        });

        if (res.ok) {
            mutate();
        } else {
            alert("Error en actualitzar el perfil");
        }
    };

    const logout = () => {
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        router.push("/login");
    };

    return (
        <div className="max-w-lg mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Perfil d'Usuari</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="text"
                            placeholder="Nom"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                        <Input
                            type="email"
                            placeholder="Correu electrònic"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                        <Button type="submit" className="w-full">Guardar Canvis</Button>
                    </form>
                    <Button onClick={logout} variant="destructive" className="w-full mt-4">Tancar Sessió</Button>
                </CardContent>
            </Card>
        </div>
    );
}
