"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {toast} from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {staff} from "../data/data";

export function OrdersUpdateStatusDialog({open, onOpenChange, orderData, onUpdateStatus}) {
    const [selectedStaff, setSelectedStaff] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    const {order, newStatus} = orderData || {order: null, newStatus: ""};

    // Always require staff assignment for any status update (except Rejected)
    const needsStaffAssignment = newStatus !== "Rejected";

    // Reset form when dialog opens/closes
    React.useEffect(() => {
        if (open) {
            setSelectedStaff(order?.assignedTo ? order.assignedTo : "");
        }
    }, [open, order]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if staff selection is needed and provided
        if (needsStaffAssignment && !selectedStaff) return;

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            let staffName = selectedStaff;

            // If staff assignment is needed (all statuses except Rejected)
            if (needsStaffAssignment) {
                const staffMember = staff.find((s) => s.id === selectedStaff);
                staffName = staffMember ? staffMember.name : order.assignedTo;
            }

            onUpdateStatus(newStatus, staffName);

            // Show appropriate toast based on the new status
            switch (newStatus) {
                case "Packing":
                    toast.info("Order moved to packing", {
                        description: `Order ${order.id} has been moved to packing stage`,
                    });
                    break;
                case "In transit":
                    toast.info("Order shipped", {
                        description: `Order ${order.id} has been shipped and is now in transit`,
                    });
                    break;
                case "Delivered":
                    toast.success("Order delivered", {
                        description: `Order ${order.id} has been marked as delivered`,
                    });
                    break;
                default:
                    toast.info("Order status updated", {
                        description: `Order ${order.id} has been updated to ${newStatus}`,
                    });
            }

            setIsLoading(false);
            onOpenChange(false);
        }, 600);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Order Status</DialogTitle>
                    <DialogDescription>
                        Change order status from {order?.status} to {newStatus}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="order-id" className="text-right">
                                Order ID
                            </Label>
                            <div className="col-span-3 font-mono">{order?.id || ""}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="current-status" className="text-right">
                                Current Status
                            </Label>
                            <div className="col-span-3">{order?.status || ""}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="new-status" className="text-right">
                                New Status
                            </Label>
                            <div className="col-span-3">{newStatus}</div>
                        </div>

                        {needsStaffAssignment && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="staff" className="text-right">
                                    Assign Staff
                                </Label>
                                <Select
                                    required
                                    value={selectedStaff}
                                    onValueChange={setSelectedStaff}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select staff member" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {staff.map((person) => (
                                            <SelectItem key={person.id} value={person.id}>
                                                {person.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || (needsStaffAssignment && !selectedStaff)}
                        >
                            {isLoading ? "Updating..." : "Update Status"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
