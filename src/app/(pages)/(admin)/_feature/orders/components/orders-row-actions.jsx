import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {
    MoreHorizontal,
    CheckCircle2,
    XCircle,
    PackageCheck,
    Truck,
    PackageOpen,
    Eye,
} from "lucide-react";
import {useOrdersContext} from "../context/orders-context";
import Link from "next/link";

export function OrdersRowActions({row}) {
    const {
        setAssignDialogOpen,
        setOrderToAssign,
        setRejectDialogOpen,
        setOrderToReject,
        setUpdateStatusDialogOpen,
        setOrderToUpdate,
    } = useOrdersContext();

    const order = row.original;
    const canBeAccepted =
        !order.assignedTo && order.status !== "Rejected" && order.status !== "Delivered";
    const canBeRejected = ["Assembling", "Packing", "In transit"].includes(order.status);

    // Status transition options based on current status
    const getNextStatus = () => {
        switch (order.status) {
            case "Assembling":
                return {
                    next: "Packing",
                    icon: <PackageOpen className="mr-2 h-4 w-4 text-blue-500" />,
                    label: "Move to Packing",
                };
            case "Packing":
                return {
                    next: "In transit",
                    icon: <Truck className="mr-2 h-4 w-4 text-green-500" />,
                    label: "Ship Order (In Transit)",
                };
            case "In transit":
                return {
                    next: "Delivered",
                    icon: <PackageCheck className="mr-2 h-4 w-4 text-purple-500" />,
                    label: "Mark as Delivered",
                };
            default:
                return null;
        }
    };

    const nextStatus = getNextStatus();

    const handleAccept = () => {
        setOrderToAssign(order);
        setAssignDialogOpen(true);
    };

    const handleReject = () => {
        setOrderToReject(order);
        setRejectDialogOpen(true);
    };

    const handleStatusUpdate = () => {
        if (nextStatus) {
            setOrderToUpdate({
                order: order,
                newStatus: nextStatus.next,
            });
            setUpdateStatusDialogOpen(true);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="order-actions h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="order-actions">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={`/admin/orders/${order.id}`}>
                        <Eye className="mr-2 h-4 w-4 text-gray-500" />
                        View Details
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {canBeAccepted && (
                    <DropdownMenuItem onClick={handleAccept}>
                        <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                        Accept Order
                    </DropdownMenuItem>
                )}
                {nextStatus && (
                    <DropdownMenuItem onClick={handleStatusUpdate}>
                        {nextStatus.icon}
                        {nextStatus.label}
                    </DropdownMenuItem>
                )}
                {canBeRejected && (
                    <DropdownMenuItem onClick={handleReject}>
                        <XCircle className="mr-2 h-4 w-4 text-red-500" />
                        Reject Order
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
