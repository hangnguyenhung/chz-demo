"use client";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Download, X} from "lucide-react";

export function InventoryDataTableToolbar({table}) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-1 flex-wrap items-center gap-2">
                <Input
                    placeholder="Search inventory..."
                    value={table.getColumn("name")?.getFilterValue() ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="h-9 w-[150px] lg:w-[250px]"
                />

                <Select
                    value={table.getColumn("quantity")?.getFilterValue() ?? "all"}
                    onValueChange={(value) => {
                        // Set quantity filter based on status
                        if (value === "instock") {
                            table.getColumn("quantity")?.setFilterValue((quantity) => quantity > 3);
                        } else if (value === "lowstock") {
                            table
                                .getColumn("quantity")
                                ?.setFilterValue((quantity) => quantity > 0 && quantity <= 3);
                        } else if (value === "outofstock") {
                            table
                                .getColumn("quantity")
                                ?.setFilterValue((quantity) => quantity <= 0);
                        } else {
                            table.getColumn("quantity")?.setFilterValue("");
                        }
                    }}
                >
                    <SelectTrigger className="h-9 w-[130px]">
                        <SelectValue placeholder="Stock Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Stock Status</SelectLabel>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="instock">In Stock</SelectItem>
                            <SelectItem value="lowstock">Low Stock</SelectItem>
                            <SelectItem value="outofstock">Out of Stock</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-9 px-2 lg:px-3"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-9">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                </Button>
            </div>
        </div>
    );
}
