"use client";

import React, {useEffect, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {ShoppingCart, LogOut} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {signOut} from "next-auth/react";

export default function CustomerLayout({children}) {
    const router = useRouter();
    const [orderCount, setOrderCount] = useState(0);

    useEffect(() => {
        // Get order count from localStorage
        const getOrderCount = () => {
            const orders = JSON.parse(localStorage.getItem("customerOrders") || "[]");
            setOrderCount(orders.length);
        };

        // Initial load
        getOrderCount();

        // Set up listener for storage changes
        const handleStorageChange = () => {
            getOrderCount();
        };

        window.addEventListener("storage", handleStorageChange);

        // Listen for custom event when orders are added
        const handleCustomEvent = () => {
            getOrderCount();
        };

        window.addEventListener("ordersUpdated", handleCustomEvent);

        // Check for changes every 2 seconds (as a fallback)
        const interval = setInterval(getOrderCount, 2000);

        // Cleanup
        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("ordersUpdated", handleCustomEvent);
            clearInterval(interval);
        };
    }, []);

    const handleLogout = () => {
        signOut({callbackUrl: "/login"});
    };

    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-6">
                        <Link href="/customer/home" className="text-xl font-bold">
                            Azure Velo
                        </Link>
                        <nav className="hidden gap-6 md:flex">
                            <Link
                                href="/customer/home"
                                className="text-sm font-medium transition-colors hover:text-primary"
                            >
                                Bikes
                            </Link>
                            <Link
                                href="/customer/orders"
                                className="text-sm font-medium transition-colors hover:text-primary"
                            >
                                My Orders
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/customer/orders"
                            className="relative flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:bg-muted"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {orderCount > 0 && (
                                <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
                                    {orderCount}
                                </Badge>
                            )}
                            <span className="sr-only">My Orders</span>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                            <LogOut className="h-4 w-4" />
                            <span className="hidden md:inline">Logout</span>
                        </Button>
                    </div>
                </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6">
                <div className="container mx-auto px-4">
                    <p className="text-center text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Azure Velo. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
