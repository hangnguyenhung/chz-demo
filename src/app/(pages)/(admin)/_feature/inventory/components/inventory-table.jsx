"use client";

import * as React from "react";
import {
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {InventoryDataTableToolbar} from "./inventory-data-table-toolbar";
import {calculateTotalInventoryValue} from "../data/service";
import {DataTablePagination} from "./data-table-pagination";

export function InventoryTable({data, columns}) {
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [sorting, setSorting] = React.useState([]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });

    // Calculate inventory statistics
    const totalItems = data.length;
    const inStockItems = data.filter((item) => item.quantity > 0).length;
    const lowStockItems = data.filter((item) => item.quantity > 0 && item.quantity <= 3).length;
    const outOfStockItems = data.filter((item) => item.quantity <= 0).length;
    const totalValue = calculateTotalInventoryValue();

    return (
        <div className="space-y-4">
            <InventoryDataTableToolbar table={table} />

            {/* Inventory Statistics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Total Items</div>
                    <div className="text-2xl font-bold">{totalItems}</div>
                </div>
                <div className="rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">In Stock</div>
                    <div className="text-2xl font-bold text-green-600">{inStockItems}</div>
                </div>
                <div className="rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Low Stock</div>
                    <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
                </div>
                <div className="rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Out of Stock</div>
                    <div className="text-2xl font-bold text-red-600">{outOfStockItems}</div>
                </div>
                <div className="rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Total Value</div>
                    <div className="text-2xl font-bold">
                        {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                        }).format(totalValue)}
                    </div>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const metaClass = header.column.columnDef.meta?.className || "";
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={metaClass}
                                            colSpan={header.colSpan}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="group/row hover:bg-muted/50"
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        const metaClass =
                                            cell.column.columnDef.meta?.className || "";
                                        return (
                                            <TableCell key={cell.id} className={metaClass}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
