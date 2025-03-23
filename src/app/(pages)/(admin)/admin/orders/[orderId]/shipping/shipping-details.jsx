"use client";

import React, {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {getOrderById} from "../../../../_feature/orders/data/service";
import {format} from "date-fns";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {
    Truck,
    Package,
    PackageCheck,
    MapPin,
    Home,
    ArrowLeft,
    AlertTriangle,
    CheckCircle2,
} from "lucide-react";
import Link from "next/link";

// Shipping locations for tracking visualization
const shippingLocations = [
    {
        id: "warehouse",
        name: "Warehouse",
        address: "123 Shipping Ave, Warehouse District",
        date: null, // Will be populated based on order status
        icon: Package,
    },
    {
        id: "distribution",
        name: "Distribution Center",
        address: "456 Logistics Blvd, Distribution Zone",
        date: null,
        icon: PackageCheck,
    },
    {
        id: "transit",
        name: "In Transit",
        address: "On delivery vehicle",
        date: null,
        icon: Truck,
    },
    {
        id: "local",
        name: "Local Facility",
        address: "789 Delivery Road, Local Area",
        date: null,
        icon: MapPin,
    },
    {
        id: "delivered",
        name: "Delivered",
        address: "Customer Address",
        date: null,
        icon: Home,
    },
];

// Generate tracking updates based on order status
const generateTrackingUpdates = (order) => {
    const locations = [...shippingLocations];

    // Set base date from order date
    const baseDate = new Date(order.orderDate);

    // Warehouse (always shown as the starting point)
    const warehouseDate = new Date(baseDate);
    warehouseDate.setHours(warehouseDate.getHours() + 2);
    locations[0].date = warehouseDate;

    // Distribution center
    const distributionDate = new Date(baseDate);
    distributionDate.setHours(distributionDate.getHours() + 6);
    locations[1].date = distributionDate;

    // In transit - only if status is at least "In transit"
    if (order.status === "In transit" || order.status === "Delivered") {
        const transitDate = new Date(baseDate);
        transitDate.setHours(transitDate.getHours() + 12);
        locations[2].date = transitDate;

        // Local facility - only if status is at least "In transit" and some time has passed
        if (order.status === "In transit" && new Date() > transitDate) {
            // Simulate being at local facility if in transit for over 24 hours
            const localDate = new Date(baseDate);
            localDate.setHours(localDate.getHours() + 24);

            if (new Date() > localDate) {
                locations[3].date = localDate;
            }
        }

        // If delivered, show all steps
        if (order.status === "Delivered") {
            const localDate = new Date(baseDate);
            localDate.setHours(localDate.getHours() + 24);
            locations[3].date = localDate;

            const deliveredDate =
                order.deliveryDate || new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000);
            locations[4].date = deliveredDate;
        }
    }

    return locations;
};

export default function ShippingDetails() {
    const params = useParams();
    const orderId = params.orderId;
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [trackingLocations, setTrackingLocations] = useState([]);

    useEffect(() => {
        // Fetch order data
        try {
            const orderData = getOrderById(orderId);
            setOrder(orderData);

            if (orderData) {
                // Check if order status is allowed for viewing shipping details
                if (orderData.status !== "In transit" && orderData.status !== "Delivered") {
                    setError(
                        "This order is not in transit or delivered yet. Shipping details are only available for orders in transit or delivered."
                    );
                } else {
                    // Generate tracking data
                    setTrackingLocations(generateTrackingUpdates(orderData));
                }
            } else {
                setError("Order not found");
            }
        } catch (err) {
            setError("Failed to load order data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (error) {
        return (
            <div className="container mx-auto py-10">
                <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Access Denied</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button asChild variant="outline">
                    <Link href={`/admin/orders/${orderId}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Order Details
                    </Link>
                </Button>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto py-10">
                <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Order Not Found</AlertTitle>
                    <AlertDescription>The requested order could not be found.</AlertDescription>
                </Alert>
                <Button asChild variant="outline">
                    <Link href="/admin/orders">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Orders
                    </Link>
                </Button>
            </div>
        );
    }

    // Get the current location (most recent with a date)
    const currentLocationId = trackingLocations
        .filter((loc) => loc.date)
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.id;

    return (
        <div className="container mx-auto py-10">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Shipping Details</h1>
                    <p className="text-muted-foreground">
                        Order #{order.id} • {order.status}
                    </p>
                </div>
                <Button asChild variant="outline">
                    <Link href={`/admin/orders/${orderId}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Order Details
                    </Link>
                </Button>
            </div>

            {/* Current Status Card */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Current Status</CardTitle>
                    <CardDescription>Real-time tracking information</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 rounded-lg bg-muted p-4">
                        {order.status === "Delivered" ? (
                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                        ) : (
                            <Truck className="h-8 w-8 animate-pulse text-blue-500" />
                        )}
                        <div>
                            <h3 className="text-xl font-medium">
                                {order.status === "Delivered"
                                    ? "Package Delivered"
                                    : "Package In Transit"}
                            </h3>
                            <p className="text-muted-foreground">
                                {order.status === "Delivered"
                                    ? `Delivered on ${format(new Date(order.deliveryDate || Date.now()), "PPP")}`
                                    : "Your package is on its way"}
                            </p>
                        </div>
                    </div>

                    {order.assignedTo && (
                        <div className="mt-4">
                            <h4 className="font-medium">Delivery Agent</h4>
                            <p>{order.assignedTo}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card>
                <CardHeader>
                    <CardTitle>Shipment Progress</CardTitle>
                    <CardDescription>Track your order's journey</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute bottom-0 left-9 top-0 w-0.5 bg-muted-foreground/20" />

                        {/* Timeline items */}
                        <div className="space-y-8">
                            {trackingLocations.map((location, index) => {
                                const isActive = location.date !== null;
                                const isCurrent = location.id === currentLocationId;

                                return (
                                    <div key={location.id} className="relative flex gap-6">
                                        <div
                                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                                                isCurrent
                                                    ? "border-primary bg-primary text-primary-foreground"
                                                    : isActive
                                                      ? "border-primary"
                                                      : "border-muted-foreground/20"
                                            } mt-1 ring-8 ring-background`}
                                        >
                                            <location.icon className="h-3 w-3" />
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex flex-wrap gap-x-2">
                                                <h3
                                                    className={`text-base font-semibold ${isCurrent ? "text-primary" : ""}`}
                                                >
                                                    {location.name}
                                                </h3>
                                                {isActive && (
                                                    <time className="text-sm tabular-nums text-muted-foreground">
                                                        {format(
                                                            new Date(location.date),
                                                            "MMM d, h:mm a"
                                                        )}
                                                    </time>
                                                )}
                                            </div>
                                            <p className="mt-0.5 text-sm text-muted-foreground">
                                                {location.address}
                                            </p>
                                            {isCurrent && order.status === "In transit" && (
                                                <div className="mt-2 w-fit animate-pulse rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                                    Current Location
                                                </div>
                                            )}
                                            {location.id === "delivered" && isActive && (
                                                <div className="mt-2 w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                                                    Delivered Successfully
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Delivery Information */}
            {order.status === "Delivered" && (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Delivery Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium">Delivered To</h4>
                                <p className="text-muted-foreground">
                                    {order.customer?.name || "Customer"}
                                </p>
                            </div>
                            <div>
                                <h4 className="font-medium">Delivery Address</h4>
                                <p className="text-muted-foreground">
                                    {order.customer?.address || "Customer Address"}
                                </p>
                            </div>
                            <div>
                                <h4 className="font-medium">Delivery Date</h4>
                                <p className="text-muted-foreground">
                                    {format(
                                        new Date(order.deliveryDate || Date.now()),
                                        "PPP 'at' h:mm a"
                                    )}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
