"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/cart-context";

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-light mb-8">La teva Cistella</h1>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-8">La teva cistella està buida</p>
          <Button
            variant="outline"
            asChild
            className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
          >
            <Link href="/tienda">
              Continuar Comprant
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-light mb-12">La teva cistella</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-8">
          <div className="space-y-8">
            {items.map((item) => (
              <div key={item.id} className="flex gap-6 pb-6 border-b">
                <div className="relative h-40 w-40 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-medium mb-2">{item.name}</h3>
                      <p className="text-lg font-bold text-emerald-600">
                        {item.price}€
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button
              variant="outline"
              asChild
              className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
            >
              <Link href="/tienda">
                Continuar Comprant
              </Link>
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-medium mb-6">Resum de la Comanda</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{subtotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Enviament</span>
                <span className="text-emerald-600">Gratuït</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold text-lg">{total.toFixed(2)}€</span>
              </div>
            </div>

            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
              Tramitar Comanda
            </Button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Enviament gratuït a tota la península
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}