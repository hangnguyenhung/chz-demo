import {inventoryItems} from "../../orders/data/inventory";

// Get all inventory items
export const getAllInventoryItems = () => {
    return inventoryItems;
};

// Get inventory items by status
export const getInventoryItemsByStatus = (status) => {
    return inventoryItems.filter((item) => item.status === status);
};

// Get inventory items by quantity range
export const getInventoryItemsByQuantityRange = (min, max) => {
    return inventoryItems.filter((item) => item.quantity >= min && item.quantity <= max);
};

// Search inventory items by name or specs
export const searchInventoryItems = (query) => {
    const lowercaseQuery = query.toLowerCase();
    return inventoryItems.filter(
        (item) =>
            item.name.toLowerCase().includes(lowercaseQuery) ||
            item.spec1.toLowerCase().includes(lowercaseQuery) ||
            item.spec2.toLowerCase().includes(lowercaseQuery)
    );
};

// Calculate total inventory value
export const calculateTotalInventoryValue = () => {
    return inventoryItems.reduce((total, item) => total + item.price * item.quantity, 0);
};
