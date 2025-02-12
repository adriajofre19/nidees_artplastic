"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/cart-context";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function CheckoutForm() {
    const router = useRouter();
    const { items, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        city: "",
        postalCode: "",
        phone: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Create Checkout Session
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items,
                    customerData: formData,
                }),
            });

            const { sessionId } = await response.json();

            // Redirect to Stripe Checkout
            const stripe = await stripePromise;
            if (!stripe) throw new Error("Failed to load Stripe");

            const { error: stripeError } = await stripe.redirectToCheckout({
                sessionId,
            });

            if (stripeError) {
                setError(stripeError.message || "Error al processar el pagament");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            setError("Hi ha hagut un error processant la comanda. Si us plau, torna-ho a provar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nom complet</label>
                        <Input
                            required
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="El teu nom complet"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                            placeholder="El teu email"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Adreça</label>
                    <Input
                        required
                        value={formData.address}
                        onChange={(e) =>
                            setFormData({ ...formData, address: e.target.value })
                        }
                        placeholder="La teva adreça"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Ciutat</label>
                        <Input
                            required
                            value={formData.city}
                            onChange={(e) =>
                                setFormData({ ...formData, city: e.target.value })
                            }
                            placeholder="La teva ciutat"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Codi Postal</label>
                        <Input
                            required
                            value={formData.postalCode}
                            onChange={(e) =>
                                setFormData({ ...formData, postalCode: e.target.value })
                            }
                            placeholder="El teu codi postal"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Telèfon</label>
                        <Input
                            required
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                                setFormData({ ...formData, phone: e.target.value })
                            }
                            placeholder="El teu telèfon"
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                    {error}
                </div>
            )}

            <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={loading}
            >
                {loading ? "Processant..." : "Procedir al Pagament"}
            </Button>
        </form>
    );
}