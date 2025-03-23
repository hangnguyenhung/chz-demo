"use client";

import React, {useState, useEffect} from "react";
import Link from "next/link";
import {useParams, useRouter} from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ArrowLeft, ShoppingCart, CheckCircle, ClipboardList} from "lucide-react";

export default function OrderDetail() {
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const {orderId} = useParams();

    useEffect(() => {
        // In a real app, this would be an API call
        // For now, we'll retrieve from localStorage
        const storedOrders = JSON.parse(localStorage.getItem("customerOrders") || "[]");
        const matchingOrder = storedOrders.find((o) => o.id === orderId);

        if (matchingOrder) {
            setOrder(matchingOrder);
        }

        setLoading(false);
    }, [orderId]);

    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case "Pending":
                return "warning";
            case "Processing":
                return "default";
            case "Shipped":
                return "secondary";
            case "Delivered":
                return "success";
            default:
                return "outline";
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-8 text-center">
                <p>Loading order details...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto p-8">
                <div className="mb-4">
                    <Link
                        href="/customer/orders"
                        className="flex items-center text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Orders
                    </Link>
                </div>
                <Card>
                    <CardContent className="p-8 text-center">
                        <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h2 className="mt-4 text-xl font-semibold">Order Not Found</h2>
                        <p className="mt-2 text-muted-foreground">
                            We couldn't find an order with ID: {orderId}
                        </p>
                        <Link href="/customer/orders" className="mt-6 inline-block">
                            <Button>View All Orders</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4">
                <Link
                    href="/customer/orders"
                    className="flex items-center text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Orders
                </Link>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
                <div className="mt-2 flex items-center space-x-4">
                    <p className="text-muted-foreground">
                        Order ID: <span className="font-medium text-foreground">{order.id}</span>
                    </p>
                    <p className="text-muted-foreground">
                        Placed on:{" "}
                        <span className="font-medium text-foreground">
                            {formatDate(order.date)}
                        </span>
                    </p>
                    <Badge variant={getStatusBadgeColor(order.status)}>{order.status}</Badge>
                </div>
            </div>

            {/* Order summary card */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                    <CardDescription>
                        Details of your customized bike and components
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Specifications</TableHead>
                                <TableHead className="text-right">Unit Price</TableHead>
                                <TableHead className="text-center">Qty</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.items.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>
                                        {item.spec1} • {item.spec2}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        ${item.price.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="text-right">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="mt-6 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>${order.totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Tax</span>
                            <span>Included</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>${order.totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Order status card */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Status</CardTitle>
                    <CardDescription>Current status and delivery information</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative pb-12">
                        <div className="absolute left-4 top-0 h-full w-0.5 bg-muted"></div>

                        <div className="relative mb-8 flex items-center">
                            <div className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <CheckCircle className="h-4 w-4" />
                            </div>
                            <div className="ml-12">
                                <h3 className="font-semibold">Order Confirmed</h3>
                                <p className="text-sm text-muted-foreground">
                                    Your order has been received and is being processed
                                </p>
                                <p className="text-sm font-medium">{formatDate(order.date)}</p>
                            </div>
                        </div>

                        <div className="relative mb-8 flex items-center">
                            <div
                                className={`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full ${order.status !== "Pending" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                            >
                                {order.status !== "Pending" ? (
                                    <CheckCircle className="h-4 w-4" />
                                ) : (
                                    "2"
                                )}
                            </div>
                            <div className="ml-12">
                                <h3
                                    className={`font-semibold ${order.status === "Pending" ? "text-muted-foreground" : ""}`}
                                >
                                    Processing
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Your customized bike is being built by our experts
                                </p>
                                {order.status !== "Pending" && (
                                    <p className="text-sm font-medium">
                                        Estimated:{" "}
                                        {formatDate(
                                            new Date(
                                                new Date(order.date).getTime() +
                                                    2 * 24 * 60 * 60 * 1000
                                            )
                                        )}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="relative mb-8 flex items-center">
                            <div
                                className={`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full ${order.status === "Shipped" || order.status === "Delivered" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                            >
                                {order.status === "Shipped" || order.status === "Delivered" ? (
                                    <CheckCircle className="h-4 w-4" />
                                ) : (
                                    "3"
                                )}
                            </div>
                            <div className="ml-12">
                                <h3
                                    className={`font-semibold ${!(order.status === "Shipped" || order.status === "Delivered") ? "text-muted-foreground" : ""}`}
                                >
                                    Shipped
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Your order is on its way to you
                                </p>
                                {(order.status === "Shipped" || order.status === "Delivered") && (
                                    <p className="text-sm font-medium">
                                        Estimated delivery:{" "}
                                        {formatDate(
                                            new Date(
                                                new Date(order.date).getTime() +
                                                    5 * 24 * 60 * 60 * 1000
                                            )
                                        )}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="relative flex items-center">
                            <div
                                className={`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full ${order.status === "Delivered" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                            >
                                {order.status === "Delivered" ? (
                                    <CheckCircle className="h-4 w-4" />
                                ) : (
                                    "4"
                                )}
                            </div>
                            <div className="ml-12">
                                <h3
                                    className={`font-semibold ${order.status !== "Delivered" ? "text-muted-foreground" : ""}`}
                                >
                                    Delivered
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Your order has been delivered
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                        <Link href="/customer/home">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Continue Shopping
                        </Link>
                    </Button>
                    <Button disabled={order.status !== "Delivered"}>Submit Review</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
