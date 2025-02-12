"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then(res => res.json());

interface Address {
    id: string;
    name: string;
    street: string;
    city: string;
    postalCode: string;
    province: string;
}

export function AddressForm() {
    const { data: addresses, error, mutate } = useSWR<Address[]>("/api/profile/addresses", fetcher);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        street: "",
        city: "",
        postalCode: "",
        province: "",
    });

    if (error) return <div>Error carregant les adreces</div>;
    if (!addresses) return <div>Carregant...</div>;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/profile/addresses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Error adding address");
            }

            await mutate(); // Revalidate the data
            setShowForm(false);
            setFormData({
                name: "",
                street: "",
                city: "",
                postalCode: "",
                province: "",
            });
        } catch (error) {
            console.error("Error:", error);
            alert("Error en afegir l'adreça");
        } finally {
            setLoading(false);
        }
    };

    const deleteAddress = async (id: string) => {
        try {
            const response = await fetch(`/api/profile/addresses/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Error deleting address");
            }

            await mutate();
        } catch (error) {
            console.error("Error:", error);
            alert("Error en eliminar l'adreça");
        }
    };

    return (
        <div className="space-y-6">
            {/* List of existing addresses */}
            <div className="space-y-4">
                {addresses.map((address) => (
                    <div
                        key={address.id}
                        className="flex justify-between items-center p-4 border rounded-lg"
                    >
                        <div>
                            <p className="font-medium">{address.name}</p>
                            <p className="text-sm text-gray-600">{address.street}</p>
                            <p className="text-sm text-gray-600">
                                {address.postalCode} {address.city}, {address.province}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteAddress(address.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                            <Trash2 className="h-5 w-5" />
                        </Button>
                    </div>
                ))}
            </div>

            {/* Add new address button/form */}
            {!showForm ? (
                <Button
                    onClick={() => setShowForm(true)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Afegir Nova Adreça
                </Button>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            Nom de l&apos;adreça
                        </label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ex: Casa, Feina..."
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="street" className="text-sm font-medium">
                            Carrer i número
                        </label>
                        <Input
                            id="street"
                            value={formData.street}
                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="postalCode" className="text-sm font-medium">
                                Codi Postal
                            </label>
                            <Input
                                id="postalCode"
                                value={formData.postalCode}
                                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="city" className="text-sm font-medium">
                                Ciutat
                            </label>
                            <Input
                                id="city"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="province" className="text-sm font-medium">
                            Província
                        </label>
                        <Input
                            id="province"
                            value={formData.province}
                            onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                            disabled={loading}
                        >
                            {loading ? "Afegint..." : "Afegir Adreça"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowForm(false)}
                            className="flex-1"
                        >
                            Cancel·lar
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}