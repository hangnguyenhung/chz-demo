import {z} from "zod";

const orderStatusSchema = z.union([
    z.literal("Assembling"),
    z.literal("Packing"),
    z.literal("In transit"),
    z.literal("Delivered"),
    z.literal("Rejected"),
]);

const shippingStatusSchema = z
    .union([z.literal("Not started"), z.literal("In progress"), z.literal("Done")])
    .nullable();

const orderSchema = z.object({
    id: z.string(),
    orderDate: z.coerce.date(),
    customerName: z.string(),
    items: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            quantity: z.number(),
            price: z.number(),
        })
    ),
    total: z.number(),
    status: orderStatusSchema,
    shippingStatus: shippingStatusSchema,
    assignedTo: z.string().nullable(),
});

const orderListSchema = z.array(orderSchema);

export {orderStatusSchema, shippingStatusSchema, orderSchema, orderListSchema};
