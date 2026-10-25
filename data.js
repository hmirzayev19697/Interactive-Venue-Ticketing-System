const venue = {
    name: "Royal Blue",
    currency: "AZN",

    categories: {
        vip: { name: "VIP Balcony", price: 450 },
        gold: { name: "Gold Zone", price: 250 },
        standard: { name: "Standard", price: 100 },
        economy: { name: "Economy", price: 50 },
        balcony: { name: "Balcony", price: 30 }
    },

    sections: [
        { id: "GZ", name: "Gold Zone", category: "gold", rows: 5, seats: 24 },
        { id: "SD", name: "Standard", category: "standard", rows: 8, seats: 30 },
        { id: "EC", name: "Economy", category: "economy", rows: 10, seats: 32 },
        { id: "VL", name: "Left VIP Balcony", category: "vip", rows: 4, seats: 12, side: "left" },
        { id: "VR", name: "Right VIP Balcony", category: "vip", rows: 4, seats: 12, side: "right" },
        { id: "BL", name: "Left Balcony", category: "balcony", rows: 4, seats: 8, side: "left" },
        { id: "BR", name: "Right Balcony", category: "balcony", rows: 4, seats: 8, side: "right" }
    ]
};
