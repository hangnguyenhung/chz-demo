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
import {orderStatuses} from "../data/data";
import {OrdersDataTableToolbar} from "./orders-data-table-toolbar";
import {useRouter} from "next/navigation";
import {DataTablePagination} from "./data-table-pagination";

export function OrdersTable({data, columns}) {
    const router = useRouter();
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

    const statuses = React.useMemo(() => {
        return Array.from(orderStatuses.keys()).map((status) => ({
            value: status,
            label: status,
        }));
    }, []);

    const handleRowClick = (e, orderId) => {
        // Don't navigate if clicking on action buttons
        if (e.target.closest(".order-actions")) {
            return;
        }
        router.push(`/admin/orders/${orderId}`);
    };

    return (
        <div className="space-y-4">
            <OrdersDataTableToolbar table={table} statuses={statuses} filterColumn="status" />
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
                                    className="group/row cursor-pointer hover:bg-muted/50"
                                    onClick={(e) => handleRowClick(e, row.original.id)}
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
