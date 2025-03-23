"use client";

import Link from "next/link";
import {FacebookIcon, InstagramIcon, TwitterIcon} from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-100 py-10">
            <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Store Info */}
                    <div>
                        <h3 className="mb-4 text-lg font-bold">CHZ</h3>
                        <p className="text-sm text-gray-600">
                            Your one-stop shop for quality products at affordable prices.
                        </p>
                        <div className="mt-4 flex space-x-4">
                            <Link href="#" className="text-gray-600 hover:text-primary">
                                <FacebookIcon className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-gray-600 hover:text-primary">
                                <InstagramIcon className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-gray-600 hover:text-primary">
                                <TwitterIcon className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-4 text-lg font-bold">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/customer"
                                    className="text-sm text-gray-600 hover:text-primary"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/customer/products"
                                    className="text-sm text-gray-600 hover:text-primary"
                                >
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/customer/categories"
                                    className="text-sm text-gray-600 hover:text-primary"
                                >
                                    Categories
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/customer/about"
                                    className="text-sm text-gray-600 hover:text-primary"
                                >
                                    About Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="mb-4 text-lg font-bold">Customer Service</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/customer/contact"
                                    className="text-sm text-gray-600 hover:text-primary"
                                >
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/customer/faq"
                                    className="text-sm text-gray-600 hover:text-primary"
                                >
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/customer/shipping"
                                    className="text-sm text-gray-600 hover:text-primary"
                                >
                                    Shipping & Returns
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/customer/privacy"
                                    className="text-sm text-gray-600 hover:text-primary"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="mb-4 text-lg font-bold">Newsletter</h3>
                        <p className="mb-4 text-sm text-gray-600">
                            Subscribe to receive updates on new products and special promotions.
                        </p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="w-full rounded-l-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <button className="rounded-r-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-8 text-center">
                    <p className="text-sm text-gray-600">
                        © {new Date().getFullYear()} CHZ. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
