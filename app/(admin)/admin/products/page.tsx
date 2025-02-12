"use client";

import useSWR from "swr";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Plus, Trash2, Edit, Search } from "lucide-react";
import Image from "next/image";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ProductsPage() {
    const { data: products, error: productsError, mutate: mutateProducts } = useSWR("/api/admin/products", fetcher);
    const { data: categories } = useSWR("/api/admin/categories", fetcher);
    const [loading, setLoading] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    if (productsError) return (
        <div className="p-4 text-red-500">Error al cargar los productos</div>
    );

    if (!products || !categories) return (
        <div className="p-4 text-gray-500">Cargando...</div>
    );

    const filteredProducts = products.filter((product: any) => {
        const matchesSearch = (
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const matchesCategory = selectedCategory === "all" || product.categoryId === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const deleteProduct = async (id: string) => {
        if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) return;

        await fetch("/api/admin/products", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });

        mutateProducts();
    };

    const createProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            const res = await fetch("/api/admin/products", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                mutateProducts();
                setCreateOpen(false);
                (e.target as HTMLFormElement).reset();
            }
        } catch (error) {
            console.error("Error creating product:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        formData.append("id", selectedProduct.id);

        try {
            const res = await fetch("/api/admin/products/update", {
                method: "PUT",
                body: formData,
            });

            if (res.ok) {
                mutateProducts();
                setEditOpen(false);
                setSelectedProduct(null);
            }
        } catch (error) {
            console.error("Error updating product:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product: any) => {
        setSelectedProduct(product);
        setEditOpen(true);
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold">Productes</h1>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-initial">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Cercar productes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 w-full md:w-[300px]"
                        />
                    </div>
                    <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                    >
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Filtrar per categoria" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Totes les categories</SelectItem>
                            {categories.map((category: any) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Nou Producte
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Afegir Nou Producte</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={createProduct} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nom</label>
                                    <Input type="text" name="name" required />
                                </div>



                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Descripció</label>
                                    <Textarea name="description" required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Preu</label>
                                    <Input type="number" name="price" step="0.01" required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Categoria</label>
                                    <Select name="categoryId" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona una categoria" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category: any) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Imatge</label>
                                    <Input type="file" name="image" required />
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Creant..." : "Crear Producte"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Edit Product Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Producte</DialogTitle>
                    </DialogHeader>
                    {selectedProduct && (
                        <form onSubmit={updateProduct} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nom</label>
                                <Input
                                    type="text"
                                    name="name"
                                    defaultValue={selectedProduct.name}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Descripció</label>
                                <Textarea
                                    name="description"
                                    defaultValue={selectedProduct.description}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Preu</label>
                                <Input
                                    type="number"
                                    name="price"
                                    step="0.01"
                                    defaultValue={selectedProduct.price}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Categoria</label>
                                <Select
                                    name="categoryId"
                                    defaultValue={selectedProduct.categoryId}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona una categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category: any) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Imatge Actual</label>
                                <div className="relative h-40 rounded-lg overflow-hidden">
                                    <Image
                                        src={selectedProduct.image}
                                        alt={selectedProduct.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nova Imatge (opcional)</label>
                                <Input type="file" name="image" />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Actualitzant..." : "Actualitzar Producte"}
                            </Button>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No s'han trobat productes que coincideixin amb la cerca
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product: any) => (
                        <Card key={product.id}>
                            <CardHeader className="relative pb-0">
                                <div className="aspect-video relative rounded-lg overflow-hidden">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg">{product.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                                        <div className="mt-2">
                                            <span className="text-emerald-600 font-semibold">{product.price}€</span>
                                            <span className="text-sm text-gray-500 ml-2">
                                                {product.category?.name}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(product)}
                                            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteProduct(product.id)}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}