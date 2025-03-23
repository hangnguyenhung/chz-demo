import {create} from "zustand";
import {persist} from "zustand/middleware";

const useUserStore = create(
    persist(
        (set, get) => ({
            // State
            user: null,
            isAuthenticated: false,
            favorites: [],

            // Actions
            setUser: (userData) => {
                set({
                    user: userData,
                    isAuthenticated: !!userData,
                });
            },

            logout: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                });
            },

            addToFavorites: (productId) => {
                set((state) => ({
                    favorites: [...state.favorites, productId],
                }));
            },

            removeFromFavorites: (productId) => {
                set((state) => ({
                    favorites: state.favorites.filter((id) => id !== productId),
                }));
            },

            toggleFavorite: (productId) => {
                set((state) => {
                    if (state.favorites.includes(productId)) {
                        return {
                            favorites: state.favorites.filter((id) => id !== productId),
                        };
                    } else {
                        return {
                            favorites: [...state.favorites, productId],
                        };
                    }
                });
            },

            isFavorite: (productId) => {
                const state = get();
                return state.favorites.includes(productId);
            },
        }),
        {
            name: "user-storage", // unique name for localStorage
            getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
        }
    )
);

export default useUserStore;
