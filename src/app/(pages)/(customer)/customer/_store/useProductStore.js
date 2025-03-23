import {create} from "zustand";

const useProductStore = create((set, get) => ({
    // State
    products: [],
    categories: [],
    filters: {
        category: null,
        priceRange: {min: 0, max: 1000},
        sortBy: "newest", // 'newest', 'price-low-high', 'price-high-low', 'popularity'
        searchQuery: "",
    },
    isLoading: false,
    error: null,

    // Actions
    fetchProducts: async () => {
        set({isLoading: true, error: null});

        try {
            // This would be replaced with your actual API call
            // const response = await fetch('/api/products');
            // const data = await response.json();

            // For now, we'll use a mock response
            const mockProducts = [
                {
                    id: 1,
                    name: "Product 1",
                    price: 99.99,
                    category: "Electronics",
                    image: "/images/product1.jpg",
                    description: "This is product 1",
                },
                {
                    id: 2,
                    name: "Product 2",
                    price: 149.99,
                    category: "Clothing",
                    image: "/images/product2.jpg",
                    description: "This is product 2",
                },
                {
                    id: 3,
                    name: "Product 3",
                    price: 199.99,
                    category: "Home & Kitchen",
                    image: "/images/product3.jpg",
                    description: "This is product 3",
                },
                {
                    id: 4,
                    name: "Product 4",
                    price: 49.99,
                    category: "Beauty",
                    image: "/images/product4.jpg",
                    description: "This is product 4",
                },
            ];

            set({products: mockProducts, isLoading: false});
        } catch (error) {
            set({error: error.message, isLoading: false});
        }
    },

    fetchCategories: async () => {
        set({isLoading: true, error: null});

        try {
            // This would be replaced with your actual API call
            // const response = await fetch('/api/categories');
            // const data = await response.json();

            // For now, we'll use a mock response
            const mockCategories = ["Electronics", "Clothing", "Home & Kitchen", "Beauty"];

            set({categories: mockCategories, isLoading: false});
        } catch (error) {
            set({error: error.message, isLoading: false});
        }
    },

    setFilter: (filterName, value) => {
        set((state) => ({
            filters: {
                ...state.filters,
                [filterName]: value,
            },
        }));
    },

    resetFilters: () => {
        set({
            filters: {
                category: null,
                priceRange: {min: 0, max: 1000},
                sortBy: "newest",
                searchQuery: "",
            },
        });
    },

    getFilteredProducts: () => {
        const {products, filters} = get();

        return products
            .filter((product) => {
                // Filter by category
                if (filters.category && product.category !== filters.category) {
                    return false;
                }

                // Filter by price range
                if (
                    product.price < filters.priceRange.min ||
                    product.price > filters.priceRange.max
                ) {
                    return false;
                }

                // Filter by search query
                if (
                    filters.searchQuery &&
                    !product.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
                ) {
                    return false;
                }

                return true;
            })
            .sort((a, b) => {
                // Sort products
                switch (filters.sortBy) {
                    case "price-low-high":
                        return a.price - b.price;
                    case "price-high-low":
                        return b.price - a.price;
                    case "popularity":
                        // This would need actual popularity data
                        return 0;
                    case "newest":
                    default:
                        // This would need actual date data
                        return 0;
                }
            });
    },
}));

export default useProductStore;
