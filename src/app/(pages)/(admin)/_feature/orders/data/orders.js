import {faker} from "@faker-js/faker";
import {staff} from "./data";
import {inventoryItems} from "./inventory";

// Set a fixed seed for faker to generate consistent data
faker.seed(123);

// Helper to get random item from the inventory
const getRandomInventoryItems = (count) => {
    const items = [];
    const usedIndexes = new Set();

    while (items.length < count) {
        // Get random index that hasn't been used yet
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * inventoryItems.length);
        } while (usedIndexes.has(randomIndex));

        usedIndexes.add(randomIndex);
        const item = inventoryItems[randomIndex];

        // Determine a random quantity for the order (1-3 items)
        const quantity = Math.floor(Math.random() * 3) + 1;

        items.push({
            id: item.id,
            name: `${item.name} (${item.spec1}, ${item.spec2})`,
            quantity: quantity,
            price: item.price,
        });
    }

    return items;
};

// Create fixed order items for different orders
const createOrderItems = (id) => {
    switch (id) {
        case 1:
            // Bicycle wheel assembly kit - premium
            return {
                items: [
                    inventoryItems.find((item) => item.id === "av-primis-24h-silver"),
                    inventoryItems.find((item) => item.id === "spoke-145-silver"),
                    inventoryItems.find((item) => item.id === "rear-hub-6s-silver"),
                    inventoryItems.find((item) => item.id === "nipple-16-silver"),
                    inventoryItems.find((item) => item.id === "rim-tape-16-silver"),
                ].map((item) => ({
                    id: item.id,
                    name: `${item.name} (${item.spec1}, ${item.spec2})`,
                    quantity: 1,
                    price: item.price,
                })),
                total: 465.75, // Sum of the items' prices
            };
        case 2:
            // Front wheel upgrade
            return {
                items: [
                    inventoryItems.find((item) => item.id === "front-hub-20h-silver"),
                    inventoryItems.find((item) => item.id === "spoke-142-silver"),
                    inventoryItems.find((item) => item.id === "nipple-16-silver"),
                ].map((item) => ({
                    id: item.id,
                    name: `${item.name} (${item.spec1}, ${item.spec2})`,
                    quantity: item.id === "spoke-142-silver" ? 20 : 1,
                    price: item.price,
                })),
                total: 181.05, // Calculated from components
            };
        case 3:
            // Complete wheel set - black
            return {
                items: [
                    inventoryItems.find((item) => item.id === "av-primis-20h-black"),
                    inventoryItems.find((item) => item.id === "front-hub-20h-black"),
                    inventoryItems.find((item) => item.id === "rear-hub-3s-black"),
                    inventoryItems.find((item) => item.id === "spoke-145-black"),
                    inventoryItems.find((item) => item.id === "nipple-16-black"),
                    inventoryItems.find((item) => item.id === "rim-tape-16-silver"),
                ].map((item) => ({
                    id: item.id,
                    name: `${item.name} (${item.spec1}, ${item.spec2})`,
                    quantity: item.id.includes("spoke") ? 40 : item.id.includes("nipple") ? 40 : 1,
                    price: item.price,
                })),
                total: 598.93, // Calculated based on components
            };
        case 4:
            // Basic repair kit
            return {
                items: [
                    inventoryItems.find((item) => item.id === "spoke-132-black"),
                    inventoryItems.find((item) => item.id === "nipple-16-black"),
                    inventoryItems.find((item) => item.id === "rim-tape-16-silver"),
                    inventoryItems.find((item) => item.id === "valve-extender-60-silver"),
                ].map((item) => ({
                    id: item.id,
                    name: `${item.name} (${item.spec1}, ${item.spec2})`,
                    quantity: item.id.includes("spoke") || item.id.includes("nipple") ? 10 : 1,
                    price: item.price,
                })),
                total: 53.75, // Calculated from components
            };
        case 5:
            // Upgraded rear hub
            return {
                items: [
                    inventoryItems.find((item) => item.id === "rear-hub-6s-silver"),
                    inventoryItems.find((item) => item.id === "spoke-145-silver"),
                ].map((item) => ({
                    id: item.id,
                    name: `${item.name} (${item.spec1}, ${item.spec2})`,
                    quantity: item.id.includes("spoke") ? 24 : 1,
                    price: item.price,
                })),
                total: 277.75, // Calculated from components
            };
        default:
            // For any other case, create random items
            const randomItems = getRandomInventoryItems(Math.floor(Math.random() * 3) + 2);
            const total = randomItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
            return {
                items: randomItems,
                total: parseFloat(total.toFixed(2)),
            };
    }
};

// Helper to determine shipping status based on order status
const getShippingStatus = (status) => {
    switch (status) {
        case "In transit":
            // Randomly assign "In progress" or "Done" for orders in transit
            return Math.random() > 0.5 ? "In progress" : "Done";
        case "Delivered":
            return "Done";
        default:
            return "Not started";
    }
};

// Create consistent customer data
const customers = {
    "John Smith": {
        email: "john.smith@example.com",
        phone: "+1 (555) 123-4567",
        address: {
            street: "123 Main Street",
            city: "Boston",
            state: "MA",
            zip: "02108",
            country: "United States",
        },
    },
    "Sarah Davis": {
        email: "sarah.davis@example.com",
        phone: "+1 (555) 234-5678",
        address: {
            street: "456 Oak Avenue",
            city: "San Francisco",
            state: "CA",
            zip: "94107",
            country: "United States",
        },
    },
    "Robert Wilson": {
        email: "robert.wilson@example.com",
        phone: "+1 (555) 345-6789",
        address: {
            street: "789 Pine Road",
            city: "Chicago",
            state: "IL",
            zip: "60601",
            country: "United States",
        },
    },
    "Jennifer Taylor": {
        email: "jennifer.taylor@example.com",
        phone: "+1 (555) 456-7890",
        address: {
            street: "321 Cedar Lane",
            city: "Seattle",
            state: "WA",
            zip: "98101",
            country: "United States",
        },
    },
    "Michael Anderson": {
        email: "michael.anderson@example.com",
        phone: "+1 (555) 567-8901",
        address: {
            street: "654 Maple Drive",
            city: "Denver",
            state: "CO",
            zip: "80202",
            country: "United States",
        },
    },
    "Emily White": {
        email: "emily.white@example.com",
        phone: "+1 (555) 678-9012",
        address: {
            street: "987 Birch Street",
            city: "Austin",
            state: "TX",
            zip: "78701",
            country: "United States",
        },
    },
    "David Brown": {
        email: "david.brown@example.com",
        phone: "+1 (555) 789-0123",
        address: {
            street: "852 Elm Court",
            city: "Portland",
            state: "OR",
            zip: "97201",
            country: "United States",
        },
    },
    "Jessica Lee": {
        email: "jessica.lee@example.com",
        phone: "+1 (555) 890-1234",
        address: {
            street: "147 Spruce Avenue",
            city: "New York",
            state: "NY",
            zip: "10001",
            country: "United States",
        },
    },
    "William Martin": {
        email: "william.martin@example.com",
        phone: "+1 (555) 901-2345",
        address: {
            street: "369 Aspen Circle",
            city: "Miami",
            state: "FL",
            zip: "33101",
            country: "United States",
        },
    },
    "Elizabeth Thompson": {
        email: "elizabeth.thompson@example.com",
        phone: "+1 (555) 012-3456",
        address: {
            street: "258 Willow Lane",
            city: "Atlanta",
            state: "GA",
            zip: "30301",
            country: "United States",
        },
    },
    "Richard Johnson": {
        email: "richard.johnson@example.com",
        phone: "+1 (555) 234-5678",
        address: {
            street: "741 Redwood Road",
            city: "Phoenix",
            state: "AZ",
            zip: "85001",
            country: "United States",
        },
    },
    "Patricia Miller": {
        email: "patricia.miller@example.com",
        phone: "+1 (555) 345-6789",
        address: {
            street: "963 Cherry Street",
            city: "Philadelphia",
            state: "PA",
            zip: "19101",
            country: "United States",
        },
    },
    "Thomas Anderson": {
        email: "thomas.anderson@example.com",
        phone: "+1 (555) 456-7890",
        address: {
            street: "159 Walnut Avenue",
            city: "Las Vegas",
            state: "NV",
            zip: "89101",
            country: "United States",
        },
    },
};

// Fixed order data
export const orders = [
    {
        id: "order-001-abc",
        orderDate: new Date(2024, 2, 15), // March 15, 2024
        customerName: "John Smith",
        customerInfo: customers["John Smith"],
        items: createOrderItems(1).items,
        total: createOrderItems(1).total,
        status: "Assembling",
        shippingStatus: "Not started",
        assignedTo: "Emily Johnson",
        notes: "Customer requested gift wrapping",
    },
    {
        id: "order-002-def",
        orderDate: new Date(2024, 2, 17), // March 17, 2024
        customerName: "Sarah Davis",
        customerInfo: customers["Sarah Davis"],
        items: createOrderItems(2).items,
        total: createOrderItems(2).total,
        status: "Packing",
        shippingStatus: "Not started",
        assignedTo: "Michael Brown",
        notes: "Express shipping requested",
    },
    {
        id: "order-003-ghi",
        orderDate: new Date(2024, 2, 18), // March 18, 2024
        customerName: "Robert Wilson",
        customerInfo: customers["Robert Wilson"],
        items: createOrderItems(3).items,
        total: createOrderItems(3).total,
        status: "In transit",
        shippingStatus: "In progress",
        assignedTo: "Sarah Davis",
        notes: "Delivery to office building - leave with receptionist",
    },
    {
        id: "order-004-jkl",
        orderDate: new Date(2024, 2, 20), // March 20, 2024
        customerName: "Jennifer Taylor",
        customerInfo: customers["Jennifer Taylor"],
        items: createOrderItems(4).items,
        total: createOrderItems(4).total,
        status: "Rejected",
        shippingStatus: null,
        assignedTo: null,
        rejectedBy: "Michael Brown",
        rejectionReason: "Out of stock items",
        notes: "Customer notified about rejection",
    },
    {
        id: "order-005-mno",
        orderDate: new Date(2024, 2, 21), // March 21, 2024
        customerName: "Michael Anderson",
        customerInfo: customers["Michael Anderson"],
        items: createOrderItems(5).items,
        total: createOrderItems(5).total,
        status: "Assembling",
        shippingStatus: "Not started",
        assignedTo: "John Smith",
        notes: null,
    },
    {
        id: "order-006-pqr",
        orderDate: new Date(2024, 2, 22), // March 22, 2024
        customerName: "Emily White",
        customerInfo: customers["Emily White"],
        items: createOrderItems(1).items,
        total: createOrderItems(1).total,
        status: "Packing",
        shippingStatus: "Not started",
        assignedTo: "Emily Johnson",
        notes: "Fragile items - handle with care",
    },
    {
        id: "order-007-stu",
        orderDate: new Date(2024, 2, 22), // March 22, 2024
        customerName: "David Brown",
        customerInfo: customers["David Brown"],
        items: createOrderItems(2).items,
        total: createOrderItems(2).total,
        status: "In transit",
        shippingStatus: "Done",
        assignedTo: "James Wilson",
        notes: "Customer requested delivery after 5 PM",
    },
    {
        id: "order-008-vwx",
        orderDate: new Date(2024, 2, 23), // March 23, 2024
        customerName: "Jessica Lee",
        customerInfo: customers["Jessica Lee"],
        items: createOrderItems(3).items,
        total: createOrderItems(3).total,
        status: "Assembling",
        shippingStatus: "Not started",
        assignedTo: null,
        notes: "First-time customer - extra care requested",
    },
    {
        id: "order-009-yz1",
        orderDate: new Date(2024, 2, 23), // March 23, 2024
        customerName: "William Martin",
        customerInfo: customers["William Martin"],
        items: createOrderItems(4).items,
        total: createOrderItems(4).total,
        status: "Rejected",
        shippingStatus: null,
        assignedTo: null,
        rejectedBy: "Sarah Davis",
        rejectionReason: "Payment verification failed",
        notes: "Customer asked to update payment information",
    },
    {
        id: "order-010-234",
        orderDate: new Date(2024, 2, 23), // March 23, 2024
        customerName: "Elizabeth Thompson",
        customerInfo: customers["Elizabeth Thompson"],
        items: createOrderItems(5).items,
        total: createOrderItems(5).total,
        status: "Packing",
        shippingStatus: "Not started",
        assignedTo: "Michael Brown",
        notes: null,
    },
    {
        id: "order-011-567",
        orderDate: new Date(2024, 2, 14), // March 14, 2024
        customerName: "Richard Johnson",
        customerInfo: customers["Richard Johnson"],
        items: createOrderItems(1).items,
        total: createOrderItems(1).total,
        status: "Delivered",
        shippingStatus: "Done",
        assignedTo: "John Smith",
        deliveryDate: new Date(2024, 2, 16), // March 16, 2024
        notes: "Delivered to neighbor at #743",
    },
    {
        id: "order-012-890",
        orderDate: new Date(2024, 2, 16), // March 16, 2024
        customerName: "Patricia Miller",
        customerInfo: customers["Patricia Miller"],
        items: createOrderItems(3).items,
        total: createOrderItems(3).total,
        status: "Delivered",
        shippingStatus: "Done",
        assignedTo: "Sarah Davis",
        deliveryDate: new Date(2024, 2, 19), // March 19, 2024
        notes: "Left at front door as requested",
    },
    {
        id: "order-013-abc",
        orderDate: new Date(2024, 2, 19), // March 19, 2024
        customerName: "Thomas Anderson",
        customerInfo: customers["Thomas Anderson"],
        items: createOrderItems(2).items,
        total: createOrderItems(2).total,
        status: "Delivered",
        shippingStatus: "Done",
        assignedTo: "Emily Johnson",
        deliveryDate: new Date(2024, 2, 21), // March 21, 2024
        notes: "Customer confirmed receipt",
    },
];
