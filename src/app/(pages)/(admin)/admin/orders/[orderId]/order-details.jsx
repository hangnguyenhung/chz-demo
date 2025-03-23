"use client";

import React, {useEffect, useState} from "react";
import {getOrderById, getOrderHistory} from "../../../_feature/orders/data/service";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
    ArrowLeft,
    Clock,
    PackageCheck,
    User,
    CheckCircle,
    CreditCard,
    UserCheck,
    Package,
    PackageOpen,
    Truck,
    AlertTriangle,
    ShoppingBag,
} from "lucide-react";
import {format} from "date-fns";
import {cn} from "@/lib/utils";
import {Separator} from "@/components/ui/separator";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Link from "next/link";
import {orderStatuses} from "../../../_feature/orders/data/data";
import {useParams} from "next/navigation";

const shippingStatusColors = {
    "Not started": "text-gray-500 border-gray-500",
    "In progress": "text-yellow-500 border-yellow-500",
    Done: "text-green-500 border-green-500",
};

export default function OrderDetails() {
    const [order, setOrder] = useState(null);
    const [orderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const params = useParams();
    const orderId = params.orderId;
    useEffect(() => {
        try {
            // In a real app, this would be an API call
            const fetchedOrder = getOrderById(orderId);
            const fetchedHistory = getOrderHistory(orderId);

            if (!fetchedOrder) {
                setError("Order not found");
            } else {
                setOrder(fetchedOrder);
                setOrderHistory(fetchedHistory);
            }
        } catch (err) {
            setError("Failed to load order details");
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    if (!order) {
        return <div className="p-4 text-red-500">Order not found</div>;
    }

    const calculateTotal = (items) => {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    // Helper function to get icon for timeline event
    const getEventIcon = (action) => {
        switch (action) {
            case "Order Created":
                return <ShoppingBag className="h-5 w-5 text-blue-500" />;
            case "Payment Confirmed":
                return <CreditCard className="h-5 w-5 text-green-500" />;
            case "Order Assigned":
                return <UserCheck className="h-5 w-5 text-purple-500" />;
            case "Started Assembling":
                return <Package className="h-5 w-5 text-amber-500" />;
            case "Started Packing":
                return <PackageOpen className="h-5 w-5 text-indigo-500" />;
            case "Shipped":
                return <Truck className="h-5 w-5 text-cyan-500" />;
            case "Delivered":
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case "Order Rejected":
                return <AlertTriangle className="h-5 w-5 text-red-500" />;
            default:
                return <Clock className="h-5 w-5 text-gray-500" />;
        }
    };

    // Helper to get event color
    const getEventColor = (action) => {
        switch (action) {
            case "Order Created":
                return "bg-blue-100";
            case "Payment Confirmed":
                return "bg-green-100";
            case "Order Assigned":
                return "bg-purple-100";
            case "Started Assembling":
                return "bg-amber-100";
            case "Started Packing":
                return "bg-indigo-100";
            case "Shipped":
                return "bg-cyan-100";
            case "Delivered":
                return "bg-green-100";
            case "Order Rejected":
                return "bg-red-100";
            default:
                return "bg-gray-100";
        }
    };

    return (
        <>
            {(order.status === "In transit" || order.status === "Delivered") && (
                <div className="mb-6 flex items-center gap-3 rounded-lg border border-primary/20 bg-muted p-4">
                    <Truck className="h-5 w-5 text-primary" />
                    <div>
                        <h3 className="font-medium">Shipping Information Available</h3>
                        <p className="text-sm text-muted-foreground">
                            {order.status === "In transit"
                                ? "Your order is on its way! Track its progress on the shipping tab."
                                : "Your order has been delivered. View delivery details on the shipping tab."}
                        </p>
                    </div>
                    <div className="ml-auto">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/orders/${order.id}/shipping`}>View Shipping</Link>
                        </Button>
                    </div>
                </div>
            )}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Order Summary Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                        <CardDescription>Basic information about this order</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Order ID:</span>
                            <span className="font-mono font-medium">{order.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Date:</span>
                            <span>{format(new Date(order.orderDate), "PPP")}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge
                                variant="outline"
                                className={cn(orderStatuses.get(order.status))}
                            >
                                {order.status}
                            </Badge>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Shipping Status:</span>
                            {order.shippingStatus ? (
                                <Badge
                                    variant="outline"
                                    className={cn(shippingStatusColors[order.shippingStatus])}
                                >
                                    {order.shippingStatus}
                                </Badge>
                            ) : (
                                <span className="text-muted-foreground">N/A</span>
                            )}
                        </div>
                        {(order.status === "In transit" || order.status === "Delivered") && (
                            <div className="flex justify-end">
                                <Button variant="outline" size="sm" asChild className="mt-2">
                                    <Link href={`/admin/orders/${order.id}/shipping`}>
                                        <Truck className="mr-2 h-4 w-4" />
                                        View Shipping Details
                                    </Link>
                                </Button>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Amount:</span>
                            <span className="font-semibold">
                                {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                }).format(order.total)}
                            </span>
                        </div>
                        {order.notes && (
                            <div>
                                <span className="text-muted-foreground">Notes:</span>
                                <p className="mt-1 text-sm">{order.notes}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Customer Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Customer Information</CardTitle>
                        <CardDescription>Details about the customer</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">{order.customerName}</span>
                        </div>
                        <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Contact details:</div>
                            <div>{order.customerInfo.email}</div>
                            <div>{order.customerInfo.phone}</div>
                        </div>
                        <div className="space-y-1 pt-2">
                            <div className="text-sm text-muted-foreground">Shipping address:</div>
                            <div>{order.customerInfo.address.street}</div>
                            <div>
                                {order.customerInfo.address.city},{" "}
                                {order.customerInfo.address.state} {order.customerInfo.address.zip}
                            </div>
                            <div>{order.customerInfo.address.country}</div>
                        </div>
                    </CardContent>
                </Card>

                {/* Assignment Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Assignment Details</CardTitle>
                        <CardDescription>Staff assigned to handle this order</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {order.status === "Rejected" ? (
                            // Display rejection information for rejected orders
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2 text-red-500">
                                    <AlertTriangle className="h-5 w-5" />
                                    <span className="font-medium">Rejected</span>
                                </div>
                                {order.rejectedBy && (
                                    <div className="space-y-1">
                                        <div className="text-sm text-red-500">Rejected by:</div>
                                        <div>Admin: {order.rejectedBy}</div>
                                        {order.rejectionReason && (
                                            <>
                                                <div className="mt-1 text-sm text-red-500">
                                                    Reason:
                                                </div>
                                                <div>{order.rejectionReason}</div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Display assignment information for non-rejected orders
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <PackageCheck className="h-5 w-5 text-muted-foreground" />
                                    <span className="font-medium">
                                        {order.assignedTo || "Not assigned"}
                                    </span>
                                </div>
                                {order.assignedTo && (
                                    <>
                                        <div className="space-y-1">
                                            <div className="text-sm text-muted-foreground">
                                                Role:
                                            </div>
                                            <div>Order Fulfillment Specialist</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-sm text-muted-foreground">
                                                Contact:
                                            </div>
                                            <div>staff@example.com</div>
                                            <div>Ext. 4567</div>
                                        </div>
                                    </>
                                )}
                                {order.status === "Delivered" && order.deliveryDate && (
                                    <div className="space-y-1 pt-2">
                                        <div className="text-sm text-green-500">Delivered on:</div>
                                        <div>{format(new Date(order.deliveryDate), "PPP")}</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Order Items */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                    <CardDescription>Products included in this order</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Specifications</TableHead>
                                <TableHead className="text-right">Unit Price</TableHead>
                                <TableHead className="text-center">Quantity</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
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
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{itemName}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {itemSpecs}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {new Intl.NumberFormat("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                            }).format(item.price)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {item.quantity}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {new Intl.NumberFormat("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                            }).format(item.price * item.quantity)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <div className="mt-4 flex justify-end border-t pt-4">
                        <div className="space-y-2 text-right">
                            <div className="flex items-center justify-between space-x-8">
                                <span className="text-muted-foreground">Subtotal:</span>
                                <span>
                                    {new Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    }).format(order.total)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between space-x-8">
                                <span className="text-muted-foreground">Shipping:</span>
                                <span>$0.00</span>
                            </div>
                            <div className="flex items-center justify-between space-x-8">
                                <span className="text-muted-foreground">Tax:</span>
                                <span>$0.00</span>
                            </div>
                            <div className="flex items-center justify-between space-x-8 border-t pt-2">
                                <span className="font-medium">Total:</span>
                                <span className="text-lg font-bold">
                                    {new Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    }).format(order.total)}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Order History */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Order Timeline</CardTitle>
                    <CardDescription>History and status changes of this order</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        {orderHistory.map((event, index) => (
                            <div key={event.id} className="flex">
                                <div className="123 mr-4 flex flex-col items-center">
                                    <div
                                        className={`flex aspect-square h-12 w-12 items-center justify-center rounded-full ${getEventColor(event.action)}`}
                                    >
                                        {getEventIcon(event.action)}
                                    </div>
                                    {index < orderHistory.length - 1 && (
                                        <div className="mt-1 h-full w-0.5 bg-gradient-to-b from-primary/20 to-muted" />
                                    )}
                                </div>
                                <div className="flex-1 space-y-2 pb-8 pt-1">
                                    <div className="flex items-baseline justify-between">
                                        <p className="text-base font-medium text-primary">
                                            {event.action}
                                        </p>
                                        <time className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                                            {format(new Date(event.date), "PPpp")}
                                        </time>
                                    </div>
                                    <p className="flex items-center text-sm text-muted-foreground">
                                        <User className="mr-1 h-3 w-3" /> {event.user}
                                    </p>
                                    {event.notes && (
                                        <p className="mt-1 border-l-2 border-muted pl-3 text-sm italic">
                                            {event.notes}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Order Actions</CardTitle>
                    <CardDescription>Manage this order</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4">
                    <Link href={`/admin/orders/${orderId}/invoice`}>
                        <Button variant="outline">Print Invoice</Button>
                    </Link>
                    <Button variant="outline">Send Email</Button>
                    <Button variant="destructive">Cancel Order</Button>
                </CardContent>
            </Card>
        </>
    );
}
