import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton"; // Importa el nuevo componente
import { Suspense } from "react";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";

export default async function ProductPage({ params }: { params: { slug: string } }) {
    const product = await prisma.product.findUnique({
        where: { slug: params.slug },
        include: { category: true },
    });

    const category = product?.category;

    const allImages = [product?.image, 'https://images.unsplash.com/photo-1627123424574-724758594e93', 'https://images.unsplash.com/photo-1604176354204-9268737828e4'].filter((image): image is string => !!image);


    if (!product) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <h2 className="text-2xl font-light text-gray-600 mb-4">Aquest producte no existeix</h2>
                <Link href="/categories">
                    <Button variant="outline" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Tornar a categories
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <Suspense fallback={<div>Loading gallery...</div>}>
                    <ProductGallery images={allImages} productName={product.name} />
                </Suspense>
                {product && category && <ProductInfo product={product} category={category} />}
            </div>
        </div>
    );
}
