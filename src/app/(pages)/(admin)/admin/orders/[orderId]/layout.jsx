"use client";

import React, {useEffect, useState} from "react";
import {useParams, usePathname} from "next/navigation";
import Link from "next/link";
import {getOrderById} from "../../../_feature/orders/data/service";
import {FileText, PackageCheck, Truck} from "lucide-react";
import {cn} from "@/lib/utils";

export default function OrderDetailLayout({children}) {
    const pathname = usePathname();
    const params = useParams();
    const orderId = params.orderId;
    const [order, setOrder] = useState(null);

    useEffect(() => {
        // Fetch order data to determine if shipping tab should be visible
        try {
            const orderData = getOrderById(orderId);
            setOrder(orderData);
        } catch (err) {
            console.error("Failed to load order data:", err);
        }
    }, [orderId]);

    // Determine which tab is active
    const isOrderDetailsActive = pathname === `/admin/orders/${orderId}`;
    const isInvoiceActive = pathname === `/admin/orders/${orderId}/invoice`;
    const isShippingActive = pathname === `/admin/orders/${orderId}/shipping`;

    // Determine if shipping tab should be visible
    const showShippingTab =
        order && (order.status === "In transit" || order.status === "Delivered");

    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <div
                    className={`grid w-full max-w-md rounded-md bg-muted p-1 ${showShippingTab ? "grid-cols-3" : "grid-cols-2"}`}
                >
                    <Link
                        href={`/admin/orders/${orderId}`}
                        className={cn(
                            "flex h-10 items-center justify-center gap-2 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
                            isOrderDetailsActive
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <PackageCheck className="h-4 w-4" />
                        <span>Details</span>
                    </Link>
                    <Link
                        href={`/admin/orders/${orderId}/invoice`}
                        className={cn(
                            "flex h-10 items-center justify-center gap-2 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
                            isInvoiceActive
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <FileText className="h-4 w-4" />
                        <span>Invoice</span>
                    </Link>
                    {showShippingTab && (
                        <Link
                            href={`/admin/orders/${orderId}/shipping`}
                            className={cn(
                                "flex h-10 items-center justify-center gap-2 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
                                isShippingActive
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <Truck className="h-4 w-4" />
                            <span>Shipping</span>
                        </Link>
                    )}
                </div>
            </div>
            {children}
        </div>
    );
}
