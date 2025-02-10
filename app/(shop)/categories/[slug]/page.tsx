import prisma from '@/lib/prisma';
import Image from "next/image";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import AddToCartButton from '@/components/AddToCartButton';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const category = await prisma.category.findUnique({
        where: { slug: params.slug },
        include: { products: true },
    });

    if (!category) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <h2 className="text-2xl font-light text-gray-600 mb-4">Aquesta categoria no existeix</h2>
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
            {/* Category Header */}
            <div className="mb-12">
                <Link
                    href="/categories"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-emerald-600 mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Tornar a categories
                </Link>
                <h1 className="text-4xl font-light mb-4">{category.name}</h1>
                {category.description && (
                    <p className="text-gray-600 max-w-3xl">{category.description}</p>
                )}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.products.map((product) => (
                    <div key={product.id} className="flex flex-col">
                        <Link
                            href={`/producte/${product.slug}`}
                            className="group block"
                        >
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                                <div className="relative aspect-square">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-emerald-600">
                                            {typeof product.price === 'number'
                                                ? `${product.price.toFixed(2)}€`
                                                : `${parseFloat(product.price).toFixed(2)}€`
                                            }
                                        </span>
                                        <span className="text-sm text-emerald-600 group-hover:underline">
                                            Veure Detalls →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <AddToCartButton product={product} />
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {category.products.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">No hi ha productes en aquesta categoria</p>
                </div>
            )}
        </div>
    );
}