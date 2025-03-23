"use client";

import React, {useState, useEffect} from "react";
import {useParams, useRouter} from "next/navigation";
import Image from "next/image";
import {getBikeById} from "../../../_store/products";
import {inventoryItems} from "../../../../(admin)/_feature/orders/data/inventory";
import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {CheckCircle, Plus, Minus, ShoppingCart, ArrowLeft} from "lucide-react";
import Link from "next/link";

// Group inventory items by main category (first word of name)
const groupInventoryByCategory = () => {
    const categories = {};

    inventoryItems.forEach((item) => {
        const nameParts = item.name.split(" ");
        let category = nameParts[0].toLowerCase();

        // Special case for some categories
        if (nameParts.includes("Hub")) {
            category = "hub";
        } else if (nameParts.includes("Spoke")) {
            category = "spoke";
        } else if (nameParts.includes("Saddle")) {
            category = "saddle";
        } else if (nameParts.includes("Handlebar")) {
            category = "handlebar";
        } else if (nameParts.includes("Box")) {
            category = "box";
        } else if (nameParts.includes("Nipple")) {
            category = "nipple";
        } else if (nameParts.includes("Tape")) {
            category = "tape";
        } else if (nameParts.includes("Extender")) {
            category = "valve";
        } else if (nameParts.includes("Brake")) {
            category = "brake";
        } else if (nameParts.includes("Tire")) {
            category = "tire";
        } else if (nameParts.includes("Chain")) {
            category = "chain";
        }

        if (!categories[category]) {
            categories[category] = [];
        }

        categories[category].push(item);
    });

    return categories;
};

export default function BikeDetails() {
    const router = useRouter();
    const [bike, setBike] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedParts, setSelectedParts] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [activeCategory, setActiveCategory] = useState("hub");
    const [categorizedInventory, setCategorizedInventory] = useState({});

    const {bikeId} = useParams();

    useEffect(() => {
        // Get bike details
        const bikeData = getBikeById(bikeId);
        if (!bikeData) {
            router.push("/customer/home");
            return;
        }

        setBike(bikeData);
        setTotalPrice(bikeData.price);
        setLoading(false);

        // Setup categorized inventory
        const groupedInventory = groupInventoryByCategory();
        setCategorizedInventory(groupedInventory);

        // Set active category to the first available category
        if (Object.keys(groupedInventory).length > 0) {
            setActiveCategory(Object.keys(groupedInventory)[0]);
        }
    }, [bikeId, router]);

    const handleAddPart = (part) => {
        setSelectedParts((prev) => {
            // Check if already in cart
            if (prev[part.id]) {
                return {
                    ...prev,
                    [part.id]: {
                        ...prev[part.id],
                        quantity: prev[part.id].quantity + 1,
                    },
                };
            }

            // Add new part
            return {
                ...prev,
                [part.id]: {
                    ...part,
                    quantity: 1,
                },
            };
        });

        // Update total price
        setTotalPrice((prev) => prev + part.price);
    };

    const handleRemovePart = (partId) => {
        setSelectedParts((prev) => {
            // Get current quantity
            const currentQty = prev[partId]?.quantity || 0;

            if (currentQty <= 1) {
                // Remove entirely if quantity would be 0
                const newParts = {...prev};
                setTotalPrice((prevTotal) => prevTotal - (newParts[partId]?.price || 0));
                delete newParts[partId];
                return newParts;
            } else {
                // Reduce quantity
                setTotalPrice((prevTotal) => prevTotal - (prev[partId]?.price || 0));
                return {
                    ...prev,
                    [partId]: {
                        ...prev[partId],
                        quantity: currentQty - 1,
                    },
                };
            }
        });
    };

    const handlePlaceOrder = () => {
        // Convert selected parts to order items format
        const orderItems = Object.values(selectedParts).map((part) => ({
            id: part.id,
            name: part.name,
            spec1: part.spec1,
            spec2: part.spec2,
            price: part.price,
            quantity: part.quantity,
        }));

        // Add the bike as the main item
        orderItems.unshift({
            id: bike.id,
            name: bike.name,
            spec1: bike.category,
            spec2: "Base model",
            price: bike.price,
            quantity: 1,
        });

        // Store in local storage for now (in a real app, would send to API)
        const order = {
            id: `ORD-${Date.now()}`,
            items: orderItems,
            totalPrice: totalPrice,
            date: new Date().toISOString(),
            status: "Pending",
        };

        // Store in local storage
        const existingOrders = JSON.parse(localStorage.getItem("customerOrders") || "[]");
        existingOrders.push(order);
        localStorage.setItem("customerOrders", JSON.stringify(existingOrders));

        // Dispatch a custom event to notify of order changes
        window.dispatchEvent(new Event("ordersUpdated"));

        // Navigate to order confirmation
        router.push(`/customer/orders/${order.id}`);
    };

    if (loading) {
        return (
            <div className="container mx-auto p-8 text-center">
                <p>Loading bike details...</p>
            </div>
        );
    }

    if (!bike) {
        return (
            <div className="container mx-auto p-8 text-center">
                <p>Bike not found.</p>
                <Link href="/customer/home">
                    <Button className="mt-4">Back to Home</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4">
                <Link
                    href="/customer/home"
                    className="flex items-center text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Bikes
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {/* Bike details */}
                <Card className="col-span-1 flex flex-col overflow-hidden md:col-span-1">
                    <div className="relative aspect-square bg-white">
                        {bike.imageUrl ? (
                            <Image
                                src={bike.imageUrl}
                                alt={bike.name}
                                fill
                                className="object-contain"
                                priority
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center bg-secondary/20">
                                <span className="text-muted-foreground">No image available</span>
                            </div>
                        )}
                    </div>
                    <CardHeader>
                        <CardTitle>{bike.name}</CardTitle>
                        <CardDescription>
                            {bike.category.charAt(0).toUpperCase() + bike.category.slice(1)} Bike
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="mb-4">{bike.description}</p>
                        <h3 className="mb-2 text-lg font-semibold">Features:</h3>
                        <ul className="list-disc space-y-1 pl-5">
                            {bike.features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                        <div className="mt-4">
                            <p className="text-lg font-bold">
                                Base Price: ${bike.price.toFixed(2)}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Component selection */}
                <Card className="col-span-1 flex flex-col md:col-span-2">
                    <CardHeader>
                        <CardTitle>Customize Your Bike</CardTitle>
                        <CardDescription>
                            Add premium components to enhance your ride
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <Tabs
                            value={activeCategory}
                            onValueChange={setActiveCategory}
                            className="w-full"
                        >
                            <TabsList className="mb-4 grid h-auto w-full grid-cols-3 md:grid-cols-5">
                                {Object.keys(categorizedInventory).map((category) => (
                                    <TabsTrigger
                                        key={category}
                                        value={category}
                                        className="py-2 capitalize"
                                    >
                                        {category}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {Object.keys(categorizedInventory).map((category) => (
                                <TabsContent
                                    key={category}
                                    value={category}
                                    className="mt-4 space-y-4"
                                >
                                    <h3 className="mb-2 text-lg font-semibold capitalize">
                                        {category} Components
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {categorizedInventory[category].map((part) => (
                                            <div
                                                key={part.id}
                                                className={`rounded-md border p-4 ${
                                                    selectedParts[part.id]
                                                        ? "border-primary bg-primary/10"
                                                        : "border-border"
                                                }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="font-medium">{part.name}</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            {part.spec1} • {part.spec2}
                                                        </p>
                                                        <Badge
                                                            variant={
                                                                part.status === "instock"
                                                                    ? "success"
                                                                    : part.status === "lowstock"
                                                                      ? "warning"
                                                                      : "destructive"
                                                            }
                                                            className="mt-1"
                                                        >
                                                            {part.status === "instock"
                                                                ? "In Stock"
                                                                : part.status === "lowstock"
                                                                  ? "Low Stock"
                                                                  : "Out of Stock"}
                                                        </Badge>
                                                        <p className="mt-2 font-medium">
                                                            ${part.price.toFixed(2)}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center">
                                                        {selectedParts[part.id] && (
                                                            <>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    onClick={() =>
                                                                        handleRemovePart(part.id)
                                                                    }
                                                                    disabled={
                                                                        part.status === "outofstock"
                                                                    }
                                                                >
                                                                    <Minus className="h-4 w-4" />
                                                                </Button>
                                                                <span className="mx-2 font-medium">
                                                                    {
                                                                        selectedParts[part.id]
                                                                            .quantity
                                                                    }
                                                                </span>
                                                            </>
                                                        )}
                                                        <Button
                                                            variant={
                                                                selectedParts[part.id]
                                                                    ? "default"
                                                                    : "outline"
                                                            }
                                                            size="icon"
                                                            onClick={() => handleAddPart(part)}
                                                            disabled={part.status === "outofstock"}
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            {/* Order summary */}
            <Card className="mt-8 flex flex-col">
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                    <CardDescription>Review your customized bike</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <div className="space-y-4">
                        {/* Base bike */}
                        <div className="flex items-start justify-between border-b pb-4">
                            <div>
                                <h4 className="font-medium">{bike.name}</h4>
                                <p className="text-sm text-muted-foreground">Base Model</p>
                            </div>
                            <p className="font-medium">${bike.price.toFixed(2)}</p>
                        </div>

                        {/* Selected components */}
                        {Object.values(selectedParts).length > 0 ? (
                            <div className="space-y-4">
                                {Object.values(selectedParts).map((part) => (
                                    <div key={part.id} className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-medium">{part.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {part.spec1} • {part.spec2}
                                            </p>
                                            <p className="text-sm">Qty: {part.quantity}</p>
                                        </div>
                                        <p className="font-medium">
                                            ${(part.price * part.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="py-4 text-muted-foreground">
                                No additional components selected
                            </p>
                        )}

                        <Separator />

                        {/* Total */}
                        <div className="flex items-center justify-between pt-2">
                            <h3 className="text-lg font-bold">Total</h3>
                            <p className="text-lg font-bold">${totalPrice.toFixed(2)}</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="mt-auto">
                    <Button className="w-full" size="lg" onClick={handlePlaceOrder}>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Place Order
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
