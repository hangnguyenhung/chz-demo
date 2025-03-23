"use client";

import {Badge} from "@/components/ui/badge";

// Status badge styles
const inventoryStatuses = {
    instock: "bg-green-100 text-green-800 hover:bg-green-100",
    lowstock: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    outofstock: "bg-red-100 text-red-800 hover:bg-red-100",
};

// Helper function to determine status based on quantity
const determineStatus = (quantity) => {
    if (quantity <= 0) return "outofstock";
    if (quantity <= 3) return "lowstock";
    return "instock";
};

export const columns = [
    {
        accessorKey: "name",
        header: "Product",
        cell: ({row}) => {
            return <div className="font-medium">{row.getValue("name")}</div>;
        },
    },
    {
        accessorKey: "spec1",
        header: "Spec 1",
        cell: ({row}) => <div>{row.getValue("spec1")}</div>,
    },
    {
        accessorKey: "spec2",
        header: "Spec 2",
        cell: ({row}) => <div>{row.getValue("spec2")}</div>,
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
        cell: ({row}) => {
            const quantity = row.getValue("quantity");
            const status = determineStatus(quantity);

            return (
                <div className="flex items-center">
                    <span className="mr-2">{quantity}</span>
                    <Badge className={inventoryStatuses[status]}>
                        {status === "instock"
                            ? "In Stock"
                            : status === "lowstock"
                              ? "Low Stock"
                              : "Out of Stock"}
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({row}) => {
            const price = parseFloat(row.getValue("price"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(price);

            return <div className="font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: "value",
        header: "Total Value",
        cell: ({row}) => {
            const price = parseFloat(row.getValue("price"));
            const quantity = parseInt(row.getValue("quantity"));
            const totalValue = price * quantity;

            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(totalValue);

            return <div className="font-medium">{formatted}</div>;
        },
    },
];
