"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    Package,
    LogOut,
} from "lucide-react";

const menuItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Usuaris",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Categories",
        href: "/admin/categories",
        icon: ShoppingBag,
    },
    {
        title: "Productes",
        href: "/admin/products",
        icon: Package,
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col w-64 bg-white border-r">
            <div className="flex items-center h-16 px-6 border-b">
                <h1 className="text-xl font-semibold text-emerald-600">Admin Panel</h1>
            </div>

            <nav className="flex-1 p-4">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                                        pathname === item.href
                                            ? "bg-gray-100 text-gray-900"
                                            : "hover:bg-gray-50"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.title}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t">
                <Link href="/"

                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-50 w-full"
                >
                    <LogOut className="h-5 w-5" />
                    Tornar a la web
                </Link>
            </div>
        </div>
    );
}