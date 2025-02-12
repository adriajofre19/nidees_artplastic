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
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { Plus, Trash2, Edit, Search } from "lucide-react";
import Image from "next/image";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function CategoriesPage() {
    const { data: categories, error, mutate } = useSWR("/api/admin/categories", fetcher);
    const [loading, setLoading] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");

    if (error) return (
        <div className="p-4 text-red-500">Error al cargar las categorías</div>
    );

    if (!categories) return (
        <div className="p-4 text-gray-500">Cargando categorías...</div>
    );

    const filteredCategories = categories.filter((category: any) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            category.name.toLowerCase().includes(searchLower) ||
            (category.description && category.description.toLowerCase().includes(searchLower))
        );
    });

    const deleteCategory = async (id: string) => {
        if (!confirm("¿Estás seguro de que quieres eliminar esta categoría?")) return;

        await fetch("/api/admin/categories", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });

        mutate();
    };

    const createCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            const res = await fetch("/api/admin/categories", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                await mutate();
                setCreateOpen(false);
                (e.target as HTMLFormElement).reset();
            }
        } catch (error) {
            console.error("Error creating category:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        formData.append("id", selectedCategory.id);

        try {
            const res = await fetch("/api/admin/categories/update", {
                method: "PUT",
                body: formData,
            });

            if (res.ok) {
                await mutate(); // Wait for the mutation to complete
                setEditOpen(false);
                setSelectedCategory(null);
            }
        } catch (error) {
            console.error("Error updating category:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (category: any) => {
        setSelectedCategory(category);
        setEditOpen(true);
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold">Categories</h1>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-initial">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Cercar categories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 w-full md:w-[300px]"
                        />
                    </div>
                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Nova Categoria
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Afegir Nova Categoria</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={createCategory} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nom</label>
                                    <Input type="text" name="name" required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Descripció</label>
                                    <Textarea name="description" required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Imatge</label>
                                    <Input type="file" name="image" required />
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Creant..." : "Crear Categoria"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Edit Category Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Categoria</DialogTitle>
                    </DialogHeader>
                    {selectedCategory && (
                        <form onSubmit={updateCategory} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nom</label>
                                <Input
                                    type="text"
                                    name="name"
                                    defaultValue={selectedCategory.name}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Descripció</label>
                                <Textarea
                                    name="description"
                                    defaultValue={selectedCategory.description}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Imatge Actual</label>
                                <div className="relative h-40 rounded-lg overflow-hidden">
                                    <Image
                                        src={selectedCategory.image}
                                        alt={selectedCategory.name}
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
                                {loading ? "Actualitzant..." : "Actualitzar Categoria"}
                            </Button>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {filteredCategories.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No s'han trobat categories que coincideixin amb la cerca
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCategories.map(category => (
                        <Card key={category.id}>
                            <CardHeader className="relative pb-0">
                                <div className="aspect-video relative rounded-lg overflow-hidden">
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg">{category.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(category)}
                                            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => deleteCategory(category.id)}
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