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
import {Textarea} from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {staff} from "../data/data";
import {toast} from "sonner";

export function OrdersRejectDialog({open, onOpenChange, order, onReject}) {
    const [reason, setReason] = React.useState("");
    // Default to James Wilson (ID: 5) as the admin user
    const [selectedStaff, setSelectedStaff] = React.useState("5");
    const [isLoading, setIsLoading] = React.useState(false);

    // Reset form when dialog opens/closes, but keep admin user selected
    React.useEffect(() => {
        if (open) {
            setReason("");
            // Keep the default admin user (ID: 5) selected
            setSelectedStaff("5");
        }
    }, [open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedStaff) return;

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            const staffMember = staff.find((s) => s.id === selectedStaff);
            const staffName = staffMember ? staffMember.name : "Unknown";

            onReject(staffName, reason);
            toast.error("Order rejected", {
                description: `Order ${order.id} has been rejected by ${staffName}`,
            });
            setIsLoading(false);
            onOpenChange(false);
        }, 600);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Reject Order</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to reject this order?
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
                                Rejected By
                            </Label>
                            <Select required value={selectedStaff} onValueChange={setSelectedStaff}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select rejecting staff" />
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
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="reason" className="pt-2 text-right">
                                Reason
                            </Label>
                            <Textarea
                                id="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Please provide a reason for rejection (optional)"
                                className="col-span-3 resize-none"
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={isLoading || !selectedStaff}
                        >
                            {isLoading ? "Rejecting..." : "Reject Order"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
