"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuccessPage() {
    const router = useRouter();
    const { clearCart } = useCart();

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center space-y-6 p-8">
                <div className="flex justify-center">
                    <CheckCircle className="h-16 w-16 text-emerald-600" />
                </div>
                <h1 className="text-3xl font-light">Gràcies per la teva compra!</h1>
                <p className="text-gray-600 max-w-md mx-auto">
                    La teva comanda s&apos;ha processat correctament. Rebràs un email amb els detalls de la compra.
                </p>

                <Button
                    onClick={() => router.push("/")}
                    className="bg-emerald-600 hover:bg-emerald-700 mt-4">
                    Continuar Comprant
                </Button>

            </div>
        </div>
    );
}