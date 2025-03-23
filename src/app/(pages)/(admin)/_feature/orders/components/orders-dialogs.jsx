"use client";

import {useOrdersContext} from "../context/orders-context";
import {OrdersAssignDialog} from "./orders-assign-dialog";
import {OrdersRejectDialog} from "./orders-reject-dialog";
import {OrdersUpdateStatusDialog} from "./orders-update-status-dialog";

export function OrdersDialog() {
    const {
        assignDialogOpen,
        setAssignDialogOpen,
        orderToAssign,
        rejectDialogOpen,
        setRejectDialogOpen,
        orderToReject,
        updateStatusDialogOpen,
        setUpdateStatusDialogOpen,
        orderToUpdate,
    } = useOrdersContext();

    const handleAssign = (staffName) => {
        // In a real app, this would send an API request to update the order
        // For this demo, we'll just mock it in the UI
        if (orderToAssign) {
            // Find the order in the table and update its status/assignee
            orderToAssign.status = "Assembling";
            orderToAssign.assignedTo = staffName;
            // Set shipping status to "Not started" when assigned
            orderToAssign.shippingStatus = "Not started";
        }
    };

    const handleReject = (staffName, reason) => {
        // In a real app, this would send an API request to update the order
        // For this demo, we'll just mock it in the UI
        if (orderToReject) {
            // Find the order in the table and update its status
            orderToReject.status = "Rejected";
            // Track who rejected the order
            orderToReject.rejectedBy = staffName;
            // Set rejection reason if provided
            if (reason) {
                orderToReject.rejectionReason = reason;
            }
            // Set shipping status to null for rejected orders
            orderToReject.shippingStatus = null;
            // Clear assigned staff for rejected orders
            orderToReject.assignedTo = null;
        }
    };

    const handleUpdateStatus = (newStatus, staffName) => {
        // In a real app, this would send an API request to update the order
        // For this demo, we'll just mock it in the UI
        if (orderToUpdate?.order) {
            const order = orderToUpdate.order;

            // Update order status
            order.status = newStatus;

            // If this is a rejection, don't update staff assignment
            if (newStatus !== "Rejected") {
                // Assign staff for all non-rejected statuses
                order.assignedTo = staffName;
            }

            // Update shipping status based on new order status
            switch (newStatus) {
                case "Assembling":
                case "Packing":
                    order.shippingStatus = "Not started";
                    break;
                case "In transit":
                    order.shippingStatus = "In progress";
                    break;
                case "Delivered":
                    order.shippingStatus = "Done";
                    break;
                case "Rejected":
                    // Set shipping status to null for rejected orders
                    order.shippingStatus = null;
                    break;
                default:
                    // Keep existing shipping status
                    break;
            }
        }
    };

    return (
        <>
            <OrdersAssignDialog
                open={assignDialogOpen}
                onOpenChange={setAssignDialogOpen}
                order={orderToAssign}
                onAssign={handleAssign}
            />

            <OrdersRejectDialog
                open={rejectDialogOpen}
                onOpenChange={setRejectDialogOpen}
                order={orderToReject}
                onReject={handleReject}
            />

            <OrdersUpdateStatusDialog
                open={updateStatusDialogOpen}
                onOpenChange={setUpdateStatusDialogOpen}
                orderData={orderToUpdate}
                onUpdateStatus={handleUpdateStatus}
            />
        </>
    );
}
