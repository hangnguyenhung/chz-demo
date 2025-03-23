"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {bikes} from "../../_store/products";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

export default function Home() {
    return (
        <div className="container mx-auto py-8">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold tracking-tight">Azure Velo Bicycles</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Choose your perfect ride and customize it with our premium components
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {bikes.map((bike) => (
                    <Card key={bike.id} className="flex flex-col overflow-hidden">
                        <div className="relative aspect-square bg-muted bg-white">
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
                                    <span className="text-muted-foreground">
                                        No image available
                                    </span>
                                </div>
                            )}
                        </div>
                        <CardHeader>
                            <CardTitle>{bike.name}</CardTitle>
                            <CardDescription>
                                {bike.category.charAt(0).toUpperCase() + bike.category.slice(1)}{" "}
                                Bike
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="mb-2 line-clamp-2">{bike.description}</p>
                            <p className="text-lg font-bold">${bike.price.toFixed(2)}</p>
                        </CardContent>
                        <CardFooter className="mt-auto">
                            <Link href={`/customer/bikes/${bike.id}`} className="w-full">
                                <Button className="w-full">Customize & Order</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
