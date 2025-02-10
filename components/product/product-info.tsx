"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { useContext } from "react";
import { ToastContext } from "@/components/ui/custom-toast";
import AddToCartButton from "../AddToCartButton";

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    details?: string[];
  };
  category: {
    id: string;
    name: string;
  };
}

export function ProductInfo({ product, category }: ProductInfoProps) {
  const { addItem } = useCart();
  const toast = useContext(ToastContext);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    toast?.showToast(
      "Producte afegit",
      "S'ha afegit el producte a la cistella",
    );
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href={`/categories/${category.slug}`}
          className="text-sm text-gray-600 hover:text-emerald-600"
        >
          ← Volver a {category.name}
        </Link>
      </div>

      <h1 className="text-3xl font-light mb-4">{product.name}</h1>
      <p className="text-2xl font-bold text-emerald-600 mb-6">
        {product.price}€
      </p>
      <div className="prose prose-gray mb-8">
        <p className="text-gray-600">{product.description}</p>
      </div>

      {/* Product Details */}
      <div className="border-t pt-6 mb-8">
        <h3 className="font-semibold mb-4">Detalles del producto</h3>
        <ul className="space-y-2 text-gray-600">
          <li>• Material: Plástico reciclado</li>
          <li>• Hecho a mano</li>
          <li>• Producto sostenible</li>
          <li>• Diseño único</li>
          {product.details?.map((detail, index) => (
            <li key={index}>• {detail}</li>
          ))}
        </ul>
      </div>

      {/* Add to Cart */}

      <AddToCartButton product={product} />
    </div>
  );
}