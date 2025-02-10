"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import useSWR from "swr";
import { CategoryDialog } from "@/components/admin/category-dialog";
import { ProductDialog } from "@/components/admin/product-dialog";
import Image from "next/image";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminPage() {
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

  const { data: users, error: usersError, mutate: mutateUsers } = useSWR('/api/users', fetcher);
  const { data: categories, mutate: mutateCategories } = useSWR('/api/categories', fetcher);
  console.log(categories);
  const { data: products, mutate: mutateProducts } = useSWR('/api/products', fetcher);

  if (usersError) return <p>Error al cargar</p>;
  if (!users || !categories || !products) return <p>Cargando...</p>;

  const deleteUser = async (id: number) => {
    if (!confirm("Estàs segur que vols eliminar aquest usuari?")) return;

    await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    mutateUsers();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Estàs segur que vols eliminar aquesta categoria?")) return;

    await fetch('/api/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    mutateCategories();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Estàs segur que vols eliminar aquest producte?")) return;

    await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    mutateProducts();
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Users Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Usuaris</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user: any) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteUser(user.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categories Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Categories</CardTitle>
          <Button onClick={() => setIsCategoryDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Categoria
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category: any) => (
              <div key={category.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <Image
                    src={category.image}
                    alt={category.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteCategory(category.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Products Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Productes</CardTitle>
          <Button onClick={() => setIsProductDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nou Producte
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product: any) => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.price}€</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteProduct(product.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <CategoryDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        onClose={() => setIsCategoryDialogOpen(false)}
      />

      <ProductDialog
        open={isProductDialogOpen}
        onOpenChange={setIsProductDialogOpen}
        categories={categories}
        onClose={() => setIsProductDialogOpen(false)}
      />
    </div>
  );
}