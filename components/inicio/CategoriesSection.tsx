import Link from "next/link";
import Image from "next/image";
import prisma from '@/lib/prisma';

export default async function CategoriesSection() {
    const categories = await prisma.category.findMany();
    return (
        <>
            {/* First row: 3 categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 h-[120vh] md:h-[50vh] mb-4 gap-4">
                {categories.slice(0, 3).map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>

            {/* Second row: 2 categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 h-[120vh] md:h-[50vh] mb-4 gap-4">
                {categories.slice(3, 5).map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>

            {/* Third row: 3 categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 h-[120vh] md:h-[50vh] mb-4 gap-4">
                {categories.slice(5, 8).map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>

            {/* Fourth row: 2 categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 h-[100vh] md:h-[50vh] gap-4 mb-4">
                {categories.slice(8, 10).map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>

            {/* Fifth row: 3 category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 h-[120vh] md:h-[50vh] mb-4 gap-4">
                {categories.slice(10, 13).map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>

            {/* Sixth row: 2 categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 h-[100vh] md:h-[50vh] mb-4 gap-4">
                {categories.slice(13, 15).map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>

            {/* Seventh row: 3 categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 h-[120vh] md:h-[50vh] mb-4 gap-4">
                {categories.slice(15, 18).map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>

            {/* Eighth row: 2 categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 h-[100vh] md:h-[50vh] mb-4 gap-4">
                {categories.slice(18, 20).map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>

            {/* Ninth row: 3 categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 h-[120vh] md:h-[50vh] mb-4 gap-4">
                {categories.slice(20, 23).map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>

        </>
    );
}

interface CategoryCardProps {
    category: {
        id: string;
        name: string;
        image: string;
        slug: string;
    };
}

function CategoryCard({ category }: CategoryCardProps) {
    return (
        <Link
            href={`/categories/${category.slug}`}
            className="relative group block h-full"
        >
            <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-xl md:text-3xl font-light text-white tracking-wider transform group-hover:scale-110  transition-transform duration-300">
                    {category.name}
                </h2>
            </div>
        </Link>
    );
}