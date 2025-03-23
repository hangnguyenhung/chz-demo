"use client";

import Link from "next/link";
import {ShoppingCart, User, Search, Menu} from "lucide-react";
import {Button} from "@/components/ui/button";
import useCartStore from "../_store/useCartStore";

export default function Header() {
    // Get the total number of items from the cart store
    const totalItems = useCartStore((state) => state.totalItems);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white">
            <div className="mx-auto flex h-16 w-full max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <div className="flex items-center">
                    <Link href="/customer" className="text-xl font-bold">
                        CHZ
                    </Link>
                </div>

                {/* Navigation - Desktop */}
                <nav className="hidden space-x-6 md:flex">
                    <Link href="/customer" className="text-sm font-medium hover:text-primary">
                        Home
                    </Link>
                    <Link
                        href="/customer/products"
                        className="text-sm font-medium hover:text-primary"
                    >
                        Products
                    </Link>
                    <Link
                        href="/customer/categories"
                        className="text-sm font-medium hover:text-primary"
                    >
                        Categories
                    </Link>
                    <Link href="/customer/about" className="text-sm font-medium hover:text-primary">
                        About
                    </Link>
                    <Link
                        href="/customer/contact"
                        className="text-sm font-medium hover:text-primary"
                    >
                        Contact
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" aria-label="Search">
                        <Search className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Account">
                        <User className="h-5 w-5" />
                    </Button>
                    <Link href="/customer/cart">
                        <Button
                            variant="ghost"
                            className="relative"
                            size="icon"
                            aria-label="Shopping Cart"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                                {totalItems}
                            </span>
                        </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
