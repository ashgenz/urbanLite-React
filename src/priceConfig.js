// // priceConfig.js
// export const UNIT_PRICES = {
//   Monthly: { room: 8, kitchen: 10, hall: 12, toilet: 15, meal: 28.31, naashta: 15, bartan: 2.5 },
//   OneTime: { room: 10, kitchen: 13, hall: 15, toilet: 18, meal: 40,naashta: 20, bartan: 3 },
// };
// src/priceConfig.js

export const UNIT_PRICES = {
  // Cleaning Prices (Standard)
  Monthly: { 
    room: 13, kitchen: 15, hall: 15, toilet: 35, bartan: 1.5,
  },

  // 1. BASE COOKING (Lunch + Dinner) - Kept same as decided
  Cook_Monthly: {
    p1: 2400,
    p2: 3600,
    p3: 4600,
    per_head_bulk: 1400, // 4+ people = ₹1400/head
  },
  
  
  // 2. BREAKFAST ADD-ON (Strict 20-25% Margin)
  Cook_Breakfast: {
    p1: 800,    // Profit 200
    p2: 1050,   // Profit 250
    p3: 1300,   // Profit 300
    p4: 1700,   // Profit 400
    per_head_bulk: 425, // For 5+ (Worker gets 320/head, Profit ~25%)
  },

  // 3. BARTAN ADD-ON (Strict 20-25% Margin)
  Cook_Bartan: {
    p1: 270,    // Profit 70
    p2: 400,    // Profit 100
    p3: 540,    // Profit 140
    p4: 670,    // Profit 170
    per_head_bulk: 170, // For 5+ (Worker gets 125/head, Profit ~26%)
  },
  // --- NEW: FLAT PACKAGES (Jhadu Pocha) ---
  Cleaning_Monthly: {
    bhk1: 1300,  // 1 BHK / 1 RK
    bhk2: 1700,  // 2 BHK
    bhk3: 2100,  // 3 BHK
    bhk4: 2300,  // 4 BHK
  },
  
};