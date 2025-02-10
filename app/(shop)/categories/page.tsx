import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({
        include: {
            products: true,
        },
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-light mb-12">Els nostres productes</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        className="group block"
                    >
                        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                        </div>
                        <div className="mt-4">
                            <h2 className="text-2xl font-light mb-2">{category.name}</h2>
                            <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                            <span className="text-sm font-medium text-emerald-600">
                                {category.products.length} productos
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
