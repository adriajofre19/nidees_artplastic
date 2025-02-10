"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCart } from "@/context/cart-context";
import { Search, ShoppingBag, Menu, X, User, LogOut } from "lucide-react";

const fetcher = async (url: string) => {
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) return null; // 🔥 Si no està autenticat, torna `null`
    return res.json();
};

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { data: user, error } = useSWR("/api/auth/me", fetcher);
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { items } = useCart();
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        setCartCount(items.reduce((total, item) => total + item.quantity, 0));
    }, [items]); // Se actualizará cada vez que `items` cambie



    useEffect(() => {
        if (user !== undefined) setLoading(false);
    }, [user]);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });

        // 🔥 Esborrem la memòria cau de `SWR`
        mutate("/api/auth/me", null, { revalidate: true });

        // 🔄 Esperem un petit delay per garantir la revalidació
        setTimeout(() => {
            router.refresh(); // 🔥 Això forçarà la renderització de Next.js
            router.push("/");
        }, 100);
    };

    return (







        <nav className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <img src="/logo.png" alt="NiDEES" className="h-8" />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/categories" className="text-gray-700 hover:text-emerald-600">
                            PRODUCTES
                        </Link>
                        <Link href="/nosaltres" className="text-gray-700 hover:text-emerald-600">
                            NOSALTRES
                        </Link>
                        <Link href="/contacto" className="text-gray-700 hover:text-emerald-600">
                            CONTACTE
                        </Link>

                        <Link href="/carrito">
                            <Button variant="ghost" size="icon" className="relative">
                                <ShoppingBag className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Button>
                        </Link>

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center space-x-2">
                                        <User className="h-5 w-5" />
                                        <span>{user.name}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem className="text-gray-700 items-center">
                                        <Link href="/perfil">El meu perfil</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Tancar sessió
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div>
                                <Link href="/login">
                                    <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700">
                                        Iniciar sessió
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700">
                                        Registra't
                                    </Button>
                                </Link>
                            </div>

                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <Link href="/carrito" className="mr-4">
                            <Button variant="ghost" size="icon" className="relative">
                                <ShoppingBag className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link
                            href="/tienda"
                            className="block px-3 py-2 text-gray-700 hover:text-emerald-600"
                        >
                            Tienda
                        </Link>
                        <Link
                            href="/sobre-nosotros"
                            className="block px-3 py-2 text-gray-700 hover:text-emerald-600"
                        >
                            Sobre Nosotros
                        </Link>
                        <Link
                            href="/contacto"
                            className="block px-3 py-2 text-gray-700 hover:text-emerald-600"
                        >
                            Contacto
                        </Link>
                        {user ? (
                            <>
                                <div className="px-3 py-2 text-gray-700">
                                    {user.name}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700"
                                >
                                    Tancar sessió
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="block px-3 py-2 text-emerald-600 hover:text-emerald-700"
                            >
                                Iniciar sessió
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

function NavItem({ href, pathname, children }: { href: string; pathname: string; children: React.ReactNode }) {
    return (
        <Link href={href}>
            <Button variant={pathname === href ? "default" : "ghost"}>{children}</Button>
        </Link>
    );
}
