"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, CreditCard, MapPin, Lock, LogOut } from "lucide-react";
import { AddressForm } from "@/components/profile/address-form";
import { PaymentMethodForm } from "@/components/profile/payment-form";
import { SecurityForm } from "@/components/profile/security-form";

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then(res => res.json());

export default function ProfilePage() {
    const router = useRouter();
    const { data: user, error, mutate } = useSWR("/api/auth/me", fetcher);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name,
                email: user.email,
                phone: user.phone,
            });
        }
    }, [user]);

    if (error) {
        router.push("/login");
        return null;
    }

    if (!user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <p className="text-gray-600">Carregant...</p>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/auth/me", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Error en actualitzar el perfil");
            }

            await mutate();
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error en actualitzar el perfil");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-light mb-8">El Meu Perfil</h1>

            <Tabs defaultValue="personal" className="space-y-6">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <TabsTrigger value="personal" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="hidden md:inline">Informació Personal</span>
                    </TabsTrigger>
                    <TabsTrigger value="addresses" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="hidden md:inline">Adreces</span>
                    </TabsTrigger>
                    <TabsTrigger value="payment" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span className="hidden md:inline">Mètodes de Pagament</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        <span className="hidden md:inline">Seguretat</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="personal">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informació Personal</CardTitle>
                            <CardDescription>
                                Actualitza la teva informació personal
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">
                                        Nom complet
                                    </label>
                                    <Input
                                        id="name"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">
                                        Correu electrònic
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-medium">
                                        Telèfon
                                    </label>
                                    <Input
                                        id="phone"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                                    disabled={loading}
                                >
                                    {loading ? "Actualitzant..." : "Actualitzar Perfil"}
                                </Button>
                            </form>


                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="addresses">
                    <Card>
                        <CardHeader>
                            <CardTitle>Les Meves Adreces</CardTitle>
                            <CardDescription>
                                Gestiona les teves adreces d&apos;enviament
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AddressForm />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="payment">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mètodes de Pagament</CardTitle>
                            <CardDescription>
                                Gestiona els teus mètodes de pagament
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PaymentMethodForm />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Seguretat</CardTitle>
                            <CardDescription>
                                Gestiona la teva contrasenya i seguretat del compte
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SecurityForm />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}