"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, CreditCard } from "lucide-react";

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then(res => res.json());

interface PaymentMethod {
    id: string;
    cardNumber: string;
    expiryDate: string;
    cardHolder: string;
}

export function PaymentMethodForm() {
    const { data: paymentMethods, error, mutate } = useSWR<PaymentMethod[]>("/api/profile/payment-methods", fetcher);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        cardNumber: "",
        expiryDate: "",
        cardHolder: "",
        cvv: "",
    });

    if (error) return <div>Error carregant els mètodes de pagament</div>;
    if (!paymentMethods) return <div>Carregant...</div>;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/profile/payment-methods", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Error adding payment method");
            }

            await mutate();
            setShowForm(false);
            setFormData({
                cardNumber: "",
                expiryDate: "",
                cardHolder: "",
                cvv: "",
            });
        } catch (error) {
            console.error("Error:", error);
            alert("Error en afegir el mètode de pagament");
        } finally {
            setLoading(false);
        }
    };

    const deletePaymentMethod = async (id: string) => {
        try {
            const response = await fetch(`/api/profile/payment-methods/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Error deleting payment method");
            }

            await mutate();
        } catch (error) {
            console.error("Error:", error);
            alert("Error en eliminar el mètode de pagament");
        }
    };

    return (
        <div className="space-y-6">
            {/* List of existing payment methods */}
            <div className="space-y-4">
                {paymentMethods.map((method) => (
                    <div
                        key={method.id}
                        className="flex justify-between items-center p-4 border rounded-lg"
                    >
                        <div className="flex items-center gap-4">
                            <CreditCard className="h-6 w-6 text-gray-400" />
                            <div>
                                <p className="font-medium">•••• •••• •••• {method.cardNumber.slice(-4)}</p>
                                <p className="text-sm text-gray-600">
                                    {method.cardHolder} - Exp: {method.expiryDate}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deletePaymentMethod(method.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                            <Trash2 className="h-5 w-5" />
                        </Button>
                    </div>
                ))}
            </div>

            {/* Add new payment method button/form */}
            {!showForm ? (
                <Button
                    onClick={() => setShowForm(true)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Afegir Nou Mètode de Pagament
                </Button>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="cardHolder" className="text-sm font-medium">
                            Titular de la targeta
                        </label>
                        <Input
                            id="cardHolder"
                            value={formData.cardHolder}
                            onChange={(e) => setFormData({ ...formData, cardHolder: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="cardNumber" className="text-sm font-medium">
                            Número de targeta
                        </label>
                        <Input
                            id="cardNumber"
                            value={formData.cardNumber}
                            onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                            required
                            maxLength={19}
                            placeholder="0000 0000 0000 0000"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="expiryDate" className="text-sm font-medium">
                                Data de caducitat
                            </label>
                            <Input
                                id="expiryDate"
                                value={formData.expiryDate}
                                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                required
                                placeholder="MM/YY"
                                maxLength={5}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="cvv" className="text-sm font-medium">
                                CVV
                            </label>
                            <Input
                                id="cvv"
                                type="password"
                                value={formData.cvv}
                                onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                                required
                                maxLength={4}
                                placeholder="***"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button
                            type="submit"
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                            disabled={loading}
                        >
                            {loading ? "Afegint..." : "Afegir Targeta"}
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