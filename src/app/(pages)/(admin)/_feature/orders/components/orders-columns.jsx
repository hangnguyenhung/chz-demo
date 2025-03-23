import {cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import {Checkbox} from "@/components/ui/checkbox";
import {orderStatuses} from "../data/data";
import {OrdersRowActions} from "./orders-row-actions";
import {format} from "date-fns";
import {DataTableColumnHeader} from "./data-table-column-header";

// Shipping status colors for badges
const shippingStatusColors = {
    "Not started": "text-gray-500 border-gray-500",
    "In progress": "text-yellow-500 border-yellow-500",
    Done: "text-green-500 border-green-500",
};

export const columns = [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        meta: {
            className: cn(
                "sticky md:table-cell left-0 z-10 rounded-tl",
                "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted"
            ),
        },
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: ({column}) => <DataTableColumnHeader column={column} title="Order ID" />,
        cell: ({row}) => (
            <div className="max-w-[180px] font-mono font-medium">{row.getValue("id")}</div>
        ),
        meta: {
            className: cn(
                "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none",
                "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
                "sticky left-6 md:table-cell"
            ),
        },
        enableHiding: false,
    },
    {
        accessorKey: "orderDate",
        header: ({column}) => <DataTableColumnHeader column={column} title="Order Date" />,
        cell: ({row}) => format(new Date(row.getValue("orderDate")), "PPP"),
        enableSorting: true,
    },
    {
        accessorKey: "customerName",
        header: ({column}) => <DataTableColumnHeader column={column} title="Customer" />,
        cell: ({row}) => row.getValue("customerName"),
        enableSorting: true,
    },
    {
        accessorKey: "total",
        header: ({column}) => <DataTableColumnHeader column={column} title="Total" />,
        cell: ({row}) => {
            const amount = parseFloat(row.getValue("total"));
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);
            return formatted;
        },
        enableSorting: true,
    },
    {
        accessorKey: "status",
        header: ({column}) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({row}) => {
            const status = row.getValue("status");
            const badgeColor = orderStatuses.get(status);
            return (
                <div className="flex space-x-2">
                    <Badge variant="outline" className={cn("capitalize", badgeColor)}>
                        {status}
                    </Badge>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableSorting: true,
    },
    {
        accessorKey: "shippingStatus",
        header: ({column}) => <DataTableColumnHeader column={column} title="Shipping Status" />,
        cell: ({row}) => {
            const status = row.getValue("shippingStatus");
            if (!status) return <span className="text-muted-foreground">N/A</span>;

            const badgeColor = shippingStatusColors[status];
            return (
                <div className="flex space-x-2">
                    <Badge variant="outline" className={cn("capitalize", badgeColor)}>
                        {status}
                    </Badge>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            const status = row.getValue(id);
            return !status ? false : value.includes(status);
        },
        enableSorting: true,
    },
    {
        accessorKey: "assignedTo",
        header: ({column}) => <DataTableColumnHeader column={column} title="Assigned To" />,
        cell: ({row}) =>
            row.getValue("assignedTo") || (
                <span className="text-muted-foreground">Not assigned</span>
            ),
        enableSorting: true,
    },
    {
        id: "actions",
        cell: OrdersRowActions,
    },
];
