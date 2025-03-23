import {create} from "zustand";
import {persist} from "zustand/middleware";

const useCartStore = create(
    persist(
        (set, get) => ({
            // State
            items: [],
            totalItems: 0,
            totalPrice: 0,

            // Actions
            addItem: (product) => {
                const {items} = get();
                const existingItem = items.find((item) => item.id === product.id);

                if (existingItem) {
                    // If item already exists, increase quantity
                    const updatedItems = items.map((item) =>
                        item.id === product.id ? {...item, quantity: item.quantity + 1} : item
                    );

                    set((state) => ({
                        items: updatedItems,
                        totalItems: state.totalItems + 1,
                        totalPrice: state.totalPrice + product.price,
                    }));
                } else {
                    // If item doesn't exist, add it with quantity 1
                    const newItem = {
                        ...product,
                        quantity: 1,
                    };

                    set((state) => ({
                        items: [...state.items, newItem],
                        totalItems: state.totalItems + 1,
                        totalPrice: state.totalPrice + product.price,
                    }));
                }
            },

            removeItem: (productId) => {
                const {items} = get();
                const itemToRemove = items.find((item) => item.id === productId);

                if (!itemToRemove) return;

                // Remove item completely
                const filteredItems = items.filter((item) => item.id !== productId);

                set((state) => ({
                    items: filteredItems,
                    totalItems: state.totalItems - itemToRemove.quantity,
                    totalPrice: state.totalPrice - itemToRemove.price * itemToRemove.quantity,
                }));
            },

            updateQuantity: (productId, quantity) => {
                const {items} = get();
                const itemToUpdate = items.find((item) => item.id === productId);

                if (!itemToUpdate) return;

                const quantityDifference = quantity - itemToUpdate.quantity;
                const updatedItems = items.map((item) =>
                    item.id === productId ? {...item, quantity} : item
                );

                set((state) => ({
                    items: updatedItems,
                    totalItems: state.totalItems + quantityDifference,
                    totalPrice: state.totalPrice + itemToUpdate.price * quantityDifference,
                }));
            },

            clearCart: () => {
                set({
                    items: [],
                    totalItems: 0,
                    totalPrice: 0,
                });
            },
        }),
        {
            name: "cart-storage", // unique name for localStorage
            getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
        }
    )
);

export default useCartStore;
