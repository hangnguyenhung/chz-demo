// Sample bike models for the customer to choose from
export const bikes = [
    {
        id: "azure-velo-urban",
        name: "Azure Velo Urban Explorer",
        description:
            "A versatile city bike designed for comfortable daily commutes with a sleek modern frame.",
        price: 799.99,
        features: [
            "Aluminum alloy frame",
            "7-speed gearing",
            "Comfortable urban geometry",
            "700c wheels",
            "Hydraulic disc brakes",
        ],
        imageUrl: "/images/bikes/urban-explorer.png",
        category: "urban",
        customizable: true,
    },
    {
        id: "azure-velo-mountain",
        name: "Azure Velo Mountain Pro",
        description:
            "Tackle any terrain with this durable mountain bike featuring responsive suspension and rugged components.",
        price: 1299.99,
        features: [
            "Aluminum frame with reinforced joints",
            "Front suspension fork with 120mm travel",
            '27.5" wheels for optimal maneuverability',
            "Hydraulic disc brakes",
            "11-speed drivetrain",
        ],
        imageUrl: "/images/bikes/mountain-pro.png",
        category: "mountain",
        customizable: true,
    },
    {
        id: "azure-velo-road",
        name: "Azure Velo Road Racer",
        description:
            "Lightweight and aerodynamic road bike built for speed and long-distance comfort.",
        price: 1499.99,
        features: [
            "Carbon fiber frame",
            "Aerodynamic design",
            "700c lightweight wheels",
            "22-speed Shimano groupset",
            "Drop handlebars for multiple riding positions",
        ],
        imageUrl: "/images/bikes/road-racer.png",
        category: "road",
        customizable: true,
    },
    {
        id: "azure-velo-hybrid",
        name: "Azure Velo Hybrid Commuter",
        description:
            "The perfect balance between road speed and off-road capability, ideal for varied commutes.",
        price: 899.99,
        features: [
            "Lightweight aluminum frame",
            "Front suspension with lockout",
            "700c wheels with semi-slick tires",
            "Disc brakes for all-weather stopping power",
            "Upright riding position",
        ],
        imageUrl: "/images/bikes/hybrid-commuter.png",
        category: "hybrid",
        customizable: true,
    },
];

// Get a single bike by ID
export function getBikeById(id) {
    return bikes.find((bike) => bike.id === id) || null;
}
