const venue = {
    currency: "AZN",

    categories: {
        vip: { name: "VIP Balcony", price: 450 },
        gold: { name: "Gold Zone", price: 250 },
        standard: { name: "Standard", price: 100 },
        economy: { name: "Economy", price: 50 },
        balcony: { name: "Balcony", price: 120 }
    },

    // aisles: a gap is placed after these seat numbers
    sections: [
        { id: "GZ", name: "Gold Zone", category: "gold", rows: 5, seats: 24, aisles: [6, 18] },
        { id: "SD", name: "Standard", category: "standard", rows: 8, seats: 30, aisles: [7, 23] },
        { id: "EC", name: "Economy", category: "economy", rows: 10, seats: 32, aisles: [8, 24] },
        { id: "VL", name: "Left VIP Balcony", category: "vip", rows: 4, seats: 12, side: "left" },
        { id: "VR", name: "Right VIP Balcony", category: "vip", rows: 4, seats: 12, side: "right" },
        { id: "BL", name: "Left Balcony", category: "balcony", rows: 4, seats: 8, side: "left" },
        { id: "BR", name: "Right Balcony", category: "balcony", rows: 4, seats: 8, side: "right" }
    ],

    sold: [
        "GZ-A8", "GZ-A9", "GZ-A10", "GZ-A11", "GZ-A14", "GZ-A15", "GZ-A16",
        "GZ-A18", "GZ-A19", "GZ-B2", "GZ-B3", "GZ-B4", "GZ-B5", "GZ-B6",
        "GZ-E4", "GZ-E5", "GZ-E10", "GZ-E11", "GZ-E12", "GZ-E14", "GZ-E15",
        "GZ-E19", "GZ-E20", "SD-D13", "SD-D14", "SD-D15", "EC-B5", "EC-C26",
        "EC-C32", "EC-D12", "EC-D13", "EC-F32", "EC-G10", "EC-G15", "EC-G16",
        "EC-G23", "EC-H19", "EC-H30", "EC-H31", "EC-J14", "EC-J15", "VL-A1",
        "VL-A2", "VL-A6", "VL-A7", "VL-B11", "VL-C4", "VL-C5", "VL-D9",
        "VL-D10", "VR-A1", "VR-A3", "VR-B1", "VR-B2", "VR-C8", "VR-D11",
        "VR-D12", "BL-A3", "BL-A4", "BL-C1", "BL-C2", "BR-B5", "BR-B6",
        "BR-D7"
    ]
};
