"use client"; // Asegura que este componente se ejecute en el cliente

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cart-context";

export default function AddToCartButton({ product }: { product: any }) {
    const { addItem } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
        });
    };

    return (
        <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700" onClick={handleAddToCart}>
            <ShoppingCart className="h-5 w-5 mr-2" />
            Afegir a la cistella
        </Button>
    );
}
