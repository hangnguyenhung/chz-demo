import React from "react";
import {X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {DataTableFacetedFilter} from "./data-table-faceted-filter";
import {DataTableViewOptions} from "./data-table-view-options";

export function OrdersDataTableToolbar({table, statuses, filterColumn}) {
    const isFiltered = table.getState().columnFilters.length > 0;

    // Shipping status options for filter
    const shippingStatuses = [
        {value: "Not started", label: "Not started"},
        {value: "In progress", label: "In progress"},
        {value: "Done", label: "Done"},
    ];

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
                <Input
                    placeholder="Filter orders..."
                    value={table.getColumn("customerName")?.getFilterValue() ?? ""}
                    onChange={(event) =>
                        table.getColumn("customerName")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                <div className="flex gap-x-2">
                    {table.getColumn(filterColumn) && (
                        <DataTableFacetedFilter
                            column={table.getColumn(filterColumn)}
                            title="Status"
                            options={statuses}
                        />
                    )}
                    {table.getColumn("shippingStatus") && (
                        <DataTableFacetedFilter
                            column={table.getColumn("shippingStatus")}
                            title="Shipping"
                            options={shippingStatuses}
                        />
                    )}
                </div>
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    );
}
