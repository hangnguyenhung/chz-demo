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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {staff} from "../data/data";
import {toast} from "sonner";

export function OrdersAssignDialog({open, onOpenChange, order, onAssign}) {
    const [selectedStaff, setSelectedStaff] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    // Reset form when dialog opens/closes
    React.useEffect(() => {
        if (open) {
            setSelectedStaff("");
        }
    }, [open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedStaff) return;

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            // Simulate success
            const staffMember = staff.find((s) => s.id === selectedStaff);
            if (staffMember) {
                onAssign(staffMember.name);
                toast.success("Order assigned", {
                    description: `Order ${order.id} has been assigned to ${staffMember.name}`,
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
                    <DialogTitle>Assign Order</DialogTitle>
                    <DialogDescription>
                        Assign a staff member to handle this order.
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
                            <Label htmlFor="staff" className="text-right">
                                Staff Member
                            </Label>
                            <Select required value={selectedStaff} onValueChange={setSelectedStaff}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a staff member" />
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
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!selectedStaff || isLoading}>
                            {isLoading ? "Assigning..." : "Assign Order"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
