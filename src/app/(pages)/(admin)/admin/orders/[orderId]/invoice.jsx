"use client";

import React, {useEffect, useState} from "react";
import {useParams, usePathname, useRouter} from "next/navigation";
import {getOrderById} from "../../../_feature/orders/data/service";
import {format} from "date-fns";
import {Button} from "@/components/ui/button";
import {ArrowLeft, Printer} from "lucide-react";
import {cn} from "@/lib/utils";

export default function OrderInvoice() {
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const params = useParams();
    const orderId = params.orderId;

    useEffect(() => {
        try {
            // In a real app, this would be an API call
            const fetchedOrder = getOrderById(orderId);

            if (!fetchedOrder) {
                setError("Order not found");
            } else {
                setOrder(fetchedOrder);
            }
        } catch (err) {
            setError("Failed to load order details");
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    const handlePrint = () => {
        window.print();
    };

    const handleBack = () => {
        router.back();
    };

    if (loading) {
        return <div className="flex justify-center p-10">Loading invoice...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    if (!order) {
        return <div className="p-4 text-red-500">Order not found</div>;
    }

    return (
        <div className="print:p-10">
            <div className="mb-8 flex items-center justify-between print:hidden">
                <h1 className="text-3xl font-bold">Invoice</h1>
                <div className="flex space-x-2">
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print Invoice
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border bg-white p-8 shadow-sm print:border-none print:p-0 print:shadow-none">
                {/* Header */}
                <div className="mb-8 flex items-start justify-between border-b pb-6 print:border-b-2 print:pb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 print:text-3xl">INVOICE</h1>
                        <p className="text-gray-500">#{order.id}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-semibold print:text-2xl">
                            Your Company Name
                        </div>
                        <div className="text-gray-500">123 Business Street</div>
                        <div className="text-gray-500">Business City, ST 12345</div>
                        <div className="text-gray-500">contact@yourcompany.com</div>
                    </div>
                </div>

                {/* Dates & Customer Info */}
                <div className="mb-8 grid grid-cols-2 gap-8 print:gap-4">
                    <div className="print:text-sm">
                        <h2 className="mb-2 text-lg font-semibold">Bill To:</h2>
                        <div className="text-gray-700">{order.customerName}</div>
                        <div className="text-gray-500">{order.customerInfo.address.street}</div>
                        <div className="text-gray-500">
                            {order.customerInfo.address.city}, {order.customerInfo.address.state}{" "}
                            {order.customerInfo.address.zip}
                        </div>
                        <div className="text-gray-500">{order.customerInfo.address.country}</div>
                        <div className="mt-2 text-gray-500">{order.customerInfo.email}</div>
                        <div className="text-gray-500">{order.customerInfo.phone}</div>
                    </div>
                    <div className="text-right print:text-sm">
                        <div className="mb-2">
                            <span className="font-semibold">Invoice Date:</span>{" "}
                            {format(new Date(), "PPP")}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Order Date:</span>{" "}
                            {format(new Date(order.orderDate), "PPP")}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Order Status:</span> {order.status}
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold">Payment Method:</span> Credit Card
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <table className="mb-8 w-full print:text-sm">
                    <thead>
                        <tr className="border-b-2 border-gray-200">
                            <th className="py-2 text-left">Item</th>
                            <th className="py-2 text-left">Specifications</th>
                            <th className="py-2 text-right">Unit Price</th>
                            <th className="py-2 text-center">Qty</th>
                            <th className="py-2 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item) => {
                            // Extract specs from item name if present
                            let itemName = item.name;
                            let itemSpecs = "";

                            if (item.name.includes("(")) {
                                const nameParts = item.name.split("(");
                                itemName = nameParts[0].trim();
                                itemSpecs = nameParts[1].replace(")", "").trim();
                            }

                            return (
                                <tr key={item.id} className="border-b border-gray-100">
                                    <td className="py-3">{itemName}</td>
                                    <td className="py-3 text-gray-500">{itemSpecs}</td>
                                    <td className="py-3 text-right">
                                        {new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                        }).format(item.price)}
                                    </td>
                                    <td className="py-3 text-center">{item.quantity}</td>
                                    <td className="py-3 text-right">
                                        {new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                        }).format(item.price * item.quantity)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="mb-8 flex justify-end">
                    <div className="w-64 print:w-48 print:text-sm">
                        <div className="flex justify-between py-2">
                            <span>Subtotal:</span>
                            <span>
                                {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                }).format(order.total)}
                            </span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span>Tax (0%):</span>
                            <span>$0.00</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span>Shipping:</span>
                            <span>$0.00</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 py-2 pt-2 font-bold">
                            <span>Total:</span>
                            <span>
                                {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                }).format(order.total)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                <div className="border-t border-gray-200 pt-8 print:pt-4 print:text-sm">
                    <h3 className="mb-2 font-semibold">Notes:</h3>
                    <p className="text-gray-600">{order.notes || "No additional notes."}</p>
                    <p className="mt-4 text-gray-600 print:mt-8 print:text-center print:font-semibold">
                        Thank you for your business!
                    </p>
                </div>
            </div>

            <div className="mt-16 border-t pt-4 text-center text-sm text-muted-foreground">
                <p>This is a computer-generated document. No signature is required.</p>
            </div>
        </div>
    );
}
