"use client";

import { useState, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

interface CategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category?: any;
    onClose: () => void;
}

export function CategoryDialog({ open, onOpenChange, category, onClose }: CategoryDialogProps) {
    const [formData, setFormData] = useState({
        name: category?.name || "",
        description: category?.description || "",
        slug: category?.slug || "",
    });
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/^-+|-+$/g, '');
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData({
            ...formData,
            name,
            slug: generateSlug(name),
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("slug", formData.slug);

            if (imageFile) {
                formDataToSend.append("image", imageFile);
            }

            const response = await fetch(
                category ? `/api/admin/categories/${category.id}` : "/api/admin/categories",
                {
                    method: category ? "PUT" : "POST",
                    body: formDataToSend,
                }
            );

            if (!response.ok) throw new Error("Error saving category");

            onClose();
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{category ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nom</Label>
                        <Input id="name" value={formData.name} onChange={handleNameChange} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descripció</Label>
                        <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">Imatge</Label>
                        <div className="flex items-center gap-4">
                            <Input id="image" type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden" />
                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                <ImageIcon className="h-4 w-4 mr-2" />
                                Seleccionar Imatge
                            </Button>
                        </div>
                        {category?.image && (
                            <div className="mt-4">
                                <Image src={`/images/${category.image}`} alt="Preview" className="max-w-full h-48 object-cover rounded-lg" />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel·lar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Desant...</> : category ? "Actualitzar" : "Crear"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
