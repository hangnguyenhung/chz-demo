"use client";

import React, {useState, useEffect} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
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
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ArrowLeft, ShoppingCart, Eye} from "lucide-react";

export default function OrderHistory() {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, this would be an API call
        // For now, we'll retrieve from localStorage
        const storedOrders = JSON.parse(localStorage.getItem("customerOrders") || "[]");
        setOrders(storedOrders);
        setLoading(false);
    }, []);

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

    if (loading) {
        return (
            <div className="container mx-auto p-8 text-center">
                <p>Loading order history...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Your Orders</h1>
                    <Link href="/customer/home">
                        <Button variant="outline">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Continue Shopping
                        </Button>
                    </Link>
                </div>
                <p className="mt-2 text-muted-foreground">View and track your order history</p>
            </div>

            {orders.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center">
                        <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h2 className="mt-4 text-xl font-semibold">No orders yet</h2>
                        <p className="mt-2 text-muted-foreground">
                            You haven't placed any orders yet. Start shopping to see your orders
                            here.
                        </p>
                        <Link href="/customer/home" className="mt-6 inline-block">
                            <Button>Browse Products</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Order History</CardTitle>
                        <CardDescription>You have placed {orders.length} order(s)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">{order.id}</TableCell>
                                        <TableCell>{formatDate(order.date)}</TableCell>
                                        <TableCell>{order.items.length} items</TableCell>
                                        <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    order.status === "Pending"
                                                        ? "warning"
                                                        : order.status === "Processing"
                                                          ? "default"
                                                          : order.status === "Shipped"
                                                            ? "secondary"
                                                            : order.status === "Delivered"
                                                              ? "success"
                                                              : "outline"
                                                }
                                            >
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/customer/orders/${order.id}`}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
