"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Trash, Plus, Minus} from "lucide-react";
import Link from "next/link";
import {useCartStore} from "../_store";

export default function Cart() {
    const {items, totalItems, totalPrice, removeItem, updateQuantity, clearCart} = useCartStore();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        updateQuantity(productId, newQuantity);
    };

    const handleCheckout = () => {
        setIsCheckingOut(true);
        // Simulate checkout process
        setTimeout(() => {
            clearCart();
            setIsCheckingOut(false);
            alert("Checkout completed successfully!");
        }, 2000);
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="mb-6 text-3xl font-bold">Your Cart</h1>
                <div className="mx-auto max-w-md rounded-lg border p-8 shadow-sm">
                    <p className="mb-6 text-gray-600">Your cart is empty</p>
                    <Link href="/customer/products">
                        <Button>Continue Shopping</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                    {/* Cart Items */}
                    <div className="rounded-lg border shadow-sm">
                        <div className="p-4">
                            <div className="mb-4 grid grid-cols-12 border-b pb-2 text-sm font-medium text-gray-500">
                                <div className="col-span-6">Product</div>
                                <div className="col-span-2 text-center">Price</div>
                                <div className="col-span-2 text-center">Quantity</div>
                                <div className="col-span-2 text-right">Total</div>
                            </div>

                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-12 items-center border-b py-4"
                                >
                                    <div className="col-span-6 flex items-center">
                                        <div className="mr-4 h-16 w-16 flex-shrink-0 bg-gray-200"></div>
                                        <div>
                                            <h3 className="font-medium">{item.name}</h3>
                                            <p className="text-sm text-gray-500">{item.category}</p>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-center">
                                        ${item.price.toFixed(2)}
                                    </div>
                                    <div className="col-span-2">
                                        <div className="mx-auto flex w-24 items-center justify-between rounded-md border">
                                            <button
                                                className="px-2 py-1 text-gray-500 hover:text-gray-700"
                                                onClick={() =>
                                                    handleQuantityChange(item.id, item.quantity - 1)
                                                }
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="px-2">{item.quantity}</span>
                                            <button
                                                className="px-2 py-1 text-gray-500 hover:text-gray-700"
                                                onClick={() =>
                                                    handleQuantityChange(item.id, item.quantity + 1)
                                                }
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-span-2 flex items-center justify-end space-x-2">
                                        <span className="font-medium">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                        <button
                                            className="text-gray-400 hover:text-red-500"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex justify-between">
                        <Link href="/customer/products">
                            <Button variant="outline">Continue Shopping</Button>
                        </Link>
                        <Button variant="outline" onClick={clearCart}>
                            Clear Cart
                        </Button>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="rounded-lg border p-4 shadow-sm">
                    <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Items ({totalItems}):</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping:</span>
                            <span>Free</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax:</span>
                            <span>${(totalPrice * 0.1).toFixed(2)}</span>
                        </div>
                        <div className="border-t pt-2">
                            <div className="flex justify-between font-bold">
                                <span>Total:</span>
                                <span>${(totalPrice + totalPrice * 0.1).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    <Button
                        className="mt-6 w-full"
                        onClick={handleCheckout}
                        disabled={isCheckingOut}
                    >
                        {isCheckingOut ? "Processing..." : "Checkout"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
