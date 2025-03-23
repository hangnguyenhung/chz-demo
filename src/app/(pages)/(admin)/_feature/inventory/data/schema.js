import * as z from "zod";

// Define the schema for a single inventory item
export const inventoryItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    spec1: z.string(),
    spec2: z.string(),
    status: z.string(),
    quantity: z.number(),
    price: z.number(),
});

// Define the schema for a list of inventory items
export const inventoryListSchema = z.array(inventoryItemSchema);
