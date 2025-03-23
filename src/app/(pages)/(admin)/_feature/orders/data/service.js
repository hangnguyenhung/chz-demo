import {orders} from "./orders";

// Get a single order by ID
export const getOrderById = (id) => {
    return orders.find((order) => order.id === id) || null;
};

// Get order history (mock - in a real app this would be from a database)
export const getOrderHistory = (orderId) => {
    const order = getOrderById(orderId);
    if (!order) return [];

    // Create a realistic timeline based on order status and dates
    const history = [];

    // Start with order creation
    history.push({
        id: `${orderId}-event-1`,
        action: "Order Created",
        date: order.orderDate,
        user: "System",
        notes: "Order was placed successfully",
    });

    // Add payment confirmation after 10 minutes
    const paymentDate = new Date(order.orderDate);
    paymentDate.setMinutes(paymentDate.getMinutes() + 10);
    history.push({
        id: `${orderId}-event-2`,
        action: "Payment Confirmed",
        date: paymentDate,
        user: "Payment System",
        notes: "Payment was processed successfully",
    });

    // Assignment event
    if (order.assignedTo) {
        const assignmentDate = new Date(order.orderDate);
        assignmentDate.setHours(assignmentDate.getHours() + 2);
        history.push({
            id: `${orderId}-event-3`,
            action: "Order Assigned",
            date: assignmentDate,
            user: "System",
            notes: `Order assigned to ${order.assignedTo}`,
        });
    }

    // Status events based on current order status
    if (
        order.status === "Assembling" ||
        order.status === "Packing" ||
        order.status === "In transit" ||
        order.status === "Delivered"
    ) {
        const assemblingDate = new Date(order.orderDate);
        assemblingDate.setHours(assemblingDate.getHours() + 3);
        history.push({
            id: `${orderId}-event-4`,
            action: "Started Assembling",
            date: assemblingDate,
            user: order.assignedTo || "System",
            notes: "Order items are being collected and prepared",
        });
    }

    if (
        order.status === "Packing" ||
        order.status === "In transit" ||
        order.status === "Delivered"
    ) {
        const packingDate = new Date(order.orderDate);
        packingDate.setHours(packingDate.getHours() + 6);
        history.push({
            id: `${orderId}-event-5`,
            action: "Started Packing",
            date: packingDate,
            user: order.assignedTo || "System",
            notes: "Items are being packaged for shipping",
        });
    }

    if (order.status === "In transit" || order.status === "Delivered") {
        const transitDate = new Date(order.orderDate);
        transitDate.setHours(transitDate.getHours() + 8);
        history.push({
            id: `${orderId}-event-6`,
            action: "Shipped",
            date: transitDate,
            user: order.assignedTo || "System",
            notes: "Order has been shipped and is on its way",
        });
    }

    if (order.status === "Delivered") {
        history.push({
            id: `${orderId}-event-7`,
            action: "Delivered",
            date:
                order.deliveryDate || new Date(order.orderDate.getTime() + 2 * 24 * 60 * 60 * 1000),
            user: order.assignedTo || "Courier",
            notes: order.notes || "Order has been delivered successfully",
        });
    }

    // Generate timeline entries for order rejection
    if (order.status === "Rejected") {
        const rejectionDate = new Date(order.orderDate);
        rejectionDate.setHours(rejectionDate.getHours() + 4);
        history.push({
            id: `${orderId}-event-rejected`,
            action: "Order Rejected",
            date: rejectionDate,
            user: `Admin: ${order.rejectedBy || "James Wilson"}`,
            notes: order.rejectionReason || "Order was rejected",
        });
    }

    // Sort history by date
    return history.sort((a, b) => new Date(a.date) - new Date(b.date));
};
