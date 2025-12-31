import React, { useState,useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UNIT_PRICES } from "./priceConfig";
const API_BASE = "https://urbanlite-backends.onrender.com";

// const UNIT_PRICES = {
//   Monthly: {
//     meal: 25,     // per meal per person
//     naashta: 15,  // per breakfast per person
//     bartan: 2,    // per utensil
//     room: 10,     // per room cleaning
//     kitchen: 15,  // per kitchen
//     hall: 20,     // per hall unit
//     toilet: 30,   // per toilet per cleaning
//   },
//   "One Time": {
//     meal: 40,
//     naashta: 20,
//     bartan: 5,
//     room: 20,
//     kitchen: 30,
//     hall: 40,
//     toilet: 50,
//   },
// };
  // 2. Cook Pricing Helper
  const calculateCookPrice = (peopleInput, hasNaashta, hasBartan, frequency, extraBartanInput) => {
    const people = Math.max(1, Number(peopleInput) || 1);
    let total = 0;

    // Food Cost (Tiered from Config)
    const foodTiers = UNIT_PRICES.Cook_Monthly || {};
    if (people === 1) total += foodTiers.p1 || 2400;
    else if (people === 2) total += foodTiers.p2 || 3600;
    else if (people === 3) total += foodTiers.p3 || 4600;
    else total += people * (foodTiers.per_head_bulk || 1400);

    // Naashta
    if (hasNaashta) {
      const bfTiers = UNIT_PRICES.Cook_Breakfast || {};
      if (people === 1) total += bfTiers.p1 || 800;
      else if (people === 2) total += bfTiers.p2 || 1050;
      else if (people === 3) total += bfTiers.p3 || 1300;
      else total += people * (bfTiers.per_head_bulk || 425);
    }

    // Bartan (Meal Utensils)
    if (hasBartan) {
      const bTiers = UNIT_PRICES.Cook_Bartan || {};
      if (people === 1) total += bTiers.p1 || 270;
      else if (people === 2) total += bTiers.p2 || 400;
      else if (people === 3) total += bTiers.p3 || 540;
      else total += people * (bTiers.per_head_bulk || 170);
    }

    // Frequency & Extra Bartan
    if (frequency === "Once") total = total * 0.6;
    if (hasBartan) {
        total += (Number(extraBartanInput) || 0) * (UNIT_PRICES.Monthly?.bartan || 1.5) * 30;
    }

    return Math.round(total);
  };

  
export default function AllRounder({LoggedIn, heading }) {

  const toggleService1 = (key) => {
  setServices((prev) => {
    const updated = { ...prev, [key]: !prev[key] };

    // keep extra flags in sync
    if (key === "jhaduPocha") setJP(updated.jhaduPocha);
    if (key === "toilet") setT(updated.toilet);
    if (key === "bartan") setB(updated.bartan);

    return updated;
  });
};

  
  const [JhaduPochaActive,setJP]=useState(false);
  const [bartanActive,setB]=useState(false);
  const [ToiletActive,setT]=useState(false);

  const navigate = useNavigate();

  // which services are selected
  const [services, setServices] = useState({
    cook: false,
    bartan: false,
    jhaduPocha: false,
    toilet: false,
  });

  // common/shared fields
  const [common, setCommon] = useState({
    WorkName:"AllRounder",
    bookingIdBase: Date.now().toString(),
    IdWorker: "demoWorker",
    TempPhoneCustomer: "9999999999",
    TempPhoneWorker: "8888888888",
    location: { lat: 0, lng: 0 },
    MonthlyOrOneTime: "Monthly", // toggles Plans visibility
    Months: 1,
    Date: new Date(),
    address: "",
    WhichPlan: "Standard", // Standard | Premium | Custom
  });

  // Cook
  const [cook, setCook] = useState({
    FrequencyPerDay: "Once",
    IncludeNaashta: false,
    PeopleCount: 1,
    TimeSlot1: "",
    TimeSlot2: "",
  });

  // Bartan - minimal + extra option
 const [bartan, setBartan] = useState({
  FrequencyPerDay: "Once",
  enabled: true,
  mode: "MealsOnly", // "MealsOnly" | "IncludeExtra"
  AmountOfBartan: 0,
  TimeSlot1: "",
  TimeSlot2: "",
});


  // Jhadu Pocha (no toilet/bartan inputs here)
  const [jhadu, setJhadu] = useState({
    FlatType: "Custom",
    NoOfRooms: 0,
    NoOfKitchen: 0,
    HallSize: 0,
    JhaduTimeSlot: "",
    JhaduFrequency: "Alternate", // used only when Custom plan selected
  });

  // Toilet (no time slot, but has freq now) — frequency should be relevant only for Monthly
  const [toilet, setToilet] = useState({
    NoOfToilets: 1,
    FrequencyPerWeek: "Twice", // Twice | Thrice
  });
// const estimatedPrice = useMemo(() => {
//   const unit = UNIT_PRICES[common.MonthlyOrOneTime];
//   const days =
//     common.MonthlyOrOneTime === "Monthly" ? 30 * (common.Months || 1) : 1;

//   let total = 0;

//   // --- Cook ---
//   if (services.cook) {
//     const mealsPerDay = cook.FrequencyPerDay === "Twice" ? 2 : 1;
//     total += cook.PeopleCount * mealsPerDay * unit.meal;

//     if (cook.IncludeNaashta) {
//       total += cook.PeopleCount * unit.naashta;
//     }
//   }

//   // --- Bartan ---
//   if (services.bartan && bartan.enabled) {
//     let mealUtensils = 0;
//     if (services.cook) {
//       // Bartan tied to cook meals
//       const mealsPerDay = cook.FrequencyPerDay === "Twice" ? 2 : 1;
//       mealUtensils = cook.PeopleCount * mealsPerDay;
//     } else {
//       // If cook not selected, fallback to bartan frequency
//       const freq = bartan.FrequencyPerDay === "Twice" ? 2 : 1;
//       mealUtensils = freq; // assume 1 utensil baseline
//     }

//     let extraUtensils = 0;
//     if (bartan.mode === "IncludeExtra") {
//       extraUtensils = bartan.AmountOfBartan || 0;
//     }

//     total += (mealUtensils + extraUtensils) * unit.bartan;
//   }

//   // --- Jhadu Pocha ---
//   if (services.jhaduPocha) {
//     let factor = 1;
//     if (common.WhichPlan === "Standard") factor = 0.5; // alternate days
//     if (common.WhichPlan === "Custom") {
//       factor = jhadu.JhaduFrequency === "Alternate" ? 0.5 : 1;
//     }
//     total +=
//       (jhadu.NoOfRooms * unit.room +
//         jhadu.NoOfKitchen * unit.kitchen +
//         jhadu.HallSize * unit.hall) * factor;
//   }

//   // --- Toilet ---
//   if (services.toilet) {
//     let perWeek = 3 / 10; // default Twice a week
//     if (common.WhichPlan === "Premium") perWeek = 13 / 30;
//     if (common.WhichPlan === "Custom") {
//       if (toilet.FrequencyPerWeek === "Thrice") perWeek = 13 / 30;
//       if (toilet.FrequencyPerWeek === "Twice") perWeek = 3 / 10;
//     }
//     total += toilet.NoOfToilets * unit.toilet * perWeek;
//   }

//   return Math.round(total * days);
// }, [services, cook, bartan, jhadu, toilet, common]);

const allRounder = services.allRounderData || {};
const estimatedPrice = useMemo(() => {
  const isMonthly = common.MonthlyOrOneTime === "Monthly";
  const months = Number(common.Months) || 1;
  const unit = { room: 13, kitchen: 15, hall: 15, toilet: 35, bartan: 1.5, meal: 25, naashta: 15 };
  const packageRates = { bhk1: 1300, bhk2: 1700, bhk3: 2100, bhk4: 2300 };
  
  let total = 0;
  const hasMainService = services.cook || services.jhaduPocha;

  // --- 1. JHADU POCHA ---
  if (services.jhaduPocha) {
    let jf = jhadu.JhaduFrequency;
    if (isMonthly && !jf) {
      jf = common.WhichPlan === "Premium" ? "Daily" : "Alternate day";
    }
    const factor = (jf === "Alternate day" || jf === "Alternate") ? 0.75 : 1.0;
    
    let base = 0;
    if (jhadu.FlatType && jhadu.FlatType !== "Custom") {
      base = packageRates["bhk" + jhadu.FlatType.charAt(0)] || 0;
    } 
    // Infer Package if counts match standard (Backend Rule B)
    if (base === 0 && isMonthly && Number(jhadu.NoOfKitchen) === 1 && Number(jhadu.HallSize) === 1) {
      const r = Number(jhadu.NoOfRooms);
      if (r >= 1 && r <= 4) base = packageRates[`bhk${r}`];
    }
    // Fallback to custom
    if (base === 0) {
      base = ((Number(jhadu.NoOfRooms) * unit.room) + 
              (Number(jhadu.NoOfKitchen) * unit.kitchen) + 
              (Number(jhadu.HallSize) * unit.hall)) * 30;
    }
    total += base * factor * months;
  }

  // --- 2. COOK SERVICE ---
// --- 2. COOK SERVICE ---
  if (services.cook) {
    // FIX: Allow 0 people. If 0, cost is 0.
    const people = Number(cook.PeopleCount); 
    
    if (people > 0) { // Only calculate if people exist
        let monthlyCook = 0;
        
        // Food Tiers (Backend foodTiers)
        if (people === 1) monthlyCook += 2400;
        else if (people === 2) monthlyCook += 3600;
        else if (people === 3) monthlyCook += 4600;
        else monthlyCook += people * 1400;

        // Naashta (Backend bfTiers)
        if (cook.IncludeNaashta) {
          if (people === 1) monthlyCook += 800;
          else if (people === 2) monthlyCook += 1050;
          else if (people === 3) monthlyCook += 1300;
          else monthlyCook += people * 425;
        }

        // Bartan within Cook (Backend bTiers)
        if (services.bartan) {
          if (people === 1) monthlyCook += 270;
          else if (people === 2) monthlyCook += 400;
          else if (people === 3) monthlyCook += 540;
          else monthlyCook += people * 170;
          
          monthlyCook += (Number(bartan.AmountOfBartan || 0) * unit.bartan * 30);
        }

        // Frequency reduction: Backend multiplies TOTAL by 0.6 if "Once"
        if (cook.FrequencyPerDay === "Once") monthlyCook *= 0.6;
        total += Math.round(monthlyCook * months);
    }
  }

  // --- 3. STANDALONE BARTAN (Additive Logic) ---
  if (services.bartan && !services.cook) {
    const freq = bartan.FrequencyPerDay || "Once";
    const visits = isMonthly ? (freq === "Twice" ? 60 : 30) : 1;
    let bTotal = (Number(bartan.AmountOfBartan) || 0) * unit.bartan * visits * months;

    if (isMonthly && !hasMainService) {
      const min = freq === "Twice" ? 1400 : 800;
      bTotal = Math.max(bTotal, min * months);
    }
    total += bTotal;
  }

  // --- 4. TOILET CLEANING ---
  if (services.toilet) {
    const freq = toilet.FrequencyPerWeek || "Twice";
    // Backend visits: Twice = 8, Thrice = 12
    const visits = isMonthly ? (freq === "Thrice" ? 12 : 8) : 1;
    total += (Number(toilet.NoOfToilets) * unit.toilet * visits * months);
  }

  return Math.round(total);
}, [services, cook, bartan, jhadu, toilet, common]);
// Added allRounder to dependency array
  const [submitting, setSubmitting] = useState(false);
// 1. Handle Flat Buttons (1BHK, 2BHK...)
  const handleFlatSelection = (type) => {
    setJhadu((prev) => ({ ...prev, FlatType: type }));
    if (type === "Custom") {
      setJhadu((prev) => ({ ...prev, FlatType: "Custom", NoOfRooms: 0, NoOfKitchen: 0, HallSize: 0 }));
    } else {
      let rooms = type === "1BHK" ? 1 : type === "2BHK" ? 2 : type === "3BHK" ? 3 : 4;
      setJhadu((prev) => ({ ...prev, FlatType: type, NoOfRooms: rooms, NoOfKitchen: 1, HallSize: 1 }));
    }
  };


  const toggleService = (key) =>
    setServices((prev) => ({ ...prev, [key]: !prev[key] }));

  // Apply plan defaults for Standard / Premium. Custom keeps user choice
  const applyPlanDefaults = (plan) => {
    // only allow applying plans when Monthly
    if (common.MonthlyOrOneTime !== "Monthly") return;

    setCommon((c) => ({ ...c, WhichPlan: plan }));
    if (plan === "Standard") {
      setCook((s) => ({ ...s, FrequencyPerDay: "Once" }));
      setBartan((s) => ({ ...s, enabled: true, mode: "MealsOnly", AmountOfBartan: 0 }));
      setJhadu((s) => ({ ...s, FrequencyPerDay: "Alternate" }));
      setToilet((s) => ({ ...s, FrequencyPerWeek: "Twice" }));
    } else if (plan === "Premium") {
      setCook((s) => ({ ...s, FrequencyPerDay: "Twice" }));
      setBartan((s) => ({ ...s, enabled: true, mode: "MealsOnly", AmountOfBartan: 0 }));
      setJhadu((s) => ({ ...s, JhaduFrequency: "Daily" }));
      setToilet((s) => ({ ...s, FrequencyPerWeek: "Thrice" }));
    } else if (plan === "Custom") {
      setCommon((c) => ({ ...c, WhichPlan: "Custom" }));
    }
  };

  // When monthly/one-time toggled, ensure WhichPlan reset when not monthly
  const setMonthlyOrOneTime = (val) => {
    if (val === "One Time") {
      // hide plans / custom when one-time selected
      setCommon((c) => ({ ...c, MonthlyOrOneTime: val, WhichPlan: "Standard" }));
    } else {
      setCommon((c) => ({ ...c, MonthlyOrOneTime: val }));
    }
  };

  const validate = () => {
    if (!services.cook && !services.bartan && !services.jhaduPocha && !services.toilet) {
      alert("Please select at least one service.");
      return false;
    }
    if (!common.address || common.address.trim() === "") {
      alert("Please enter address.");
      return false;
    }

    if (services.cook) {
      if (cook.FrequencyPerDay === "Once" && !cook.TimeSlot1) {
        alert("Select cook time slot (first meal).");
        return false;
      }
      if (cook.FrequencyPerDay === "Twice" && (!cook.TimeSlot1 || !cook.TimeSlot2)) {
        alert("Select both cook time slots.");
        return false;
      }
    }

    if (services.bartan && bartan.mode === "IncludeExtra") {
      if (!Number.isFinite(Number(bartan.AmountOfBartan)) || Number(bartan.AmountOfBartan) <= 0) {
        alert("Enter extra bartan count (must be > 0).");
        return false;
      }
    }

    if (services.jhaduPocha && !jhadu.JhaduTimeSlot) {
      alert("Select Jhadu Pocha time slot.");
      return false;
    }

    // Toilet: no time slot required
    return true;
  };

const handleSubmit = async () => {
  const token = localStorage.getItem("token");
  if (!token || !LoggedIn) {
    alert("Please log in first!");
    return;
  }
  if (!validate()) return;
  if (estimatedPrice <= 0) {
    alert("Total amount is ₹0. Please select a room, toilet, or utensil count to proceed.");
    return;
  }
const jFreq = common.WhichPlan === "Custom" 
    ? (jhadu.JhaduFrequency === "Alternate" ? "Alternate day" : "Daily") 
    : (common.WhichPlan === "Standard" ? "Alternate day" : "Daily");

  const base = {
    IdWorker: common.IdWorker,
    TempPhoneCustomer: common.TempPhoneCustomer,
    TempPhoneWorker: common.TempPhoneWorker,
    location: {
      lat: Number(common.location.lat) || 0,
      lng: Number(common.location.lng) || 0,
    },
    MonthlyOrOneTime: common.MonthlyOrOneTime,
    Months: common.MonthlyOrOneTime === "Monthly" ? Number(common.Months) || 1 : undefined,
    Date: new Date(common.Date).toISOString(),
    WhichPlan: common.WhichPlan,
    address: common.address,
  };

  const genId = (label) =>
    `${common.bookingIdBase}-${label}-${Math.random().toString(36).slice(2, 6)}`;

  const singlePayloads = [];

if (services.cook) {
  singlePayloads.push({
    bookingId: genId("cook"),
    WorkName: "Cook Service",
    NoOfPeople: Number(cook.PeopleCount) || 1,
    FrequencyPerDay: cook.FrequencyPerDay,
    IncludeNaashta: !!cook.IncludeNaashta,
    IncludeBartan: services.bartan ? true : false,
    AmountOfBartan: services.bartan ? bartan.AmountOfBartan || 0 : 0,
    ...base,
  });
}


if (services.bartan) {
  singlePayloads.push({
    bookingId: genId("bartan"),
    WorkName: "Bartan Service",
    AmountOfBartan:
      bartan.mode === "IncludeExtra"
        ? Number(bartan.AmountOfBartan) + (services.cook ? cook.PeopleCount : 0)
        : services.cook
        ? cook.PeopleCount * (cook.FrequencyPerDay === "Twice" ? 2 : 1)
        : 1,
    FrequencyPerDay: services.cook ? cook.FrequencyPerDay : bartan.FrequencyPerDay,
    ...base,
  });
}


  if (services.jhaduPocha) {
singlePayloads.push({
  bookingId: genId("jhadu"),
  WorkName: "Jhadu Pocha",
  NoOfRooms: Number(jhadu.NoOfRooms) || 0,
  NoOfKitchen: Number(jhadu.NoOfKitchen) || 0,
  HallSize: Number(jhadu.HallSize) || 0,
  JhaduTimeSlot: jhadu.JhaduTimeSlot || "",            // ❌ backend expects JhaduTimeSlot
  JhaduFrequency: common.WhichPlan === "Custom" 
    ? (jhadu.JhaduFrequency === "Alternate" ? "Alternate day" : "Daily") 
    : (common.WhichPlan === "Standard" ? "Alternate day" : "Daily"), // ❌ backend expects JhaduFrequency
  ...base,
});

  }

  if (services.toilet) {
singlePayloads.push({
  bookingId: genId("toilet"),
  WorkName: "Toilet Cleaning",
  NoOfToilets: Number(toilet.NoOfToilets) || 1,
  // Inside Jhadu Pocha payload
JhaduFrequency: common.WhichPlan === "Custom" 
  ? (jhadu.JhaduFrequency === "Alternate" ? "Alternate day" : "Daily") 
  : "Alternate day", // Standard default

// Inside Toilet Cleaning payload
FrequencyPerWeek: common.MonthlyOrOneTime === "Monthly" 
  ? (toilet.FrequencyPerWeek === "Thrice" ? "Thrice a week" : "Twice a week") 
  : undefined,
  ...base,
});

  }

  let bodyToSend;

  if (singlePayloads.length === 1) {
    // Single service → save as-is
    bodyToSend = singlePayloads[0];
  } else {
    // Multiple services (All-Rounder) → merge into one document
    bodyToSend = {
      bookingId: genId("allrounder"),
      WorkName: "All Rounder Service",
      services: singlePayloads, // 👈 embed all services here
      ...base,
    };
  }

  try {
    setSubmitting(true);
    const res = await axios.post(`${API_BASE}/api/user/book`, bodyToSend, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 201 || res.status === 200) {
      alert("Booking created successfully!");
      navigate("/bookings");
    } else {
      console.warn("Booking response:", res.data);
      alert("Booking completed (check console).");
    }
    
  } catch (err) {
    console.error("Booking error:", err.response?.data || err.message);
    alert("Failed to create bookings");
  } finally {
    setSubmitting(false);
  }
  console.log("Submitted booking:", bodyToSend);
};



  const pretty = (k) => (k === "jhaduPocha" ? "Jhadu Pocha" : k.charAt(0).toUpperCase() + k.slice(1));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <img src="/allRounder.jpg" alt="All Rounder" className="w-full md:w-1/3 rounded-lg border-2 border-black" />
        <div>
          <h1 className="text-2xl font-bold">{heading || "All Rounder Services"}</h1>
          <p className="text-lg text-gray-700">Select multiple services in one booking</p>
        </div>
      </div>

      {/* Monthly / One Time */}
      <div className="flex gap-2 bg-gray-100 p-2 rounded-3xl w-fit mb-6">
        {["Monthly"].map((t) => (
          <button
            key={t}
            type="button"
            className={`px-4 py-1 rounded-3xl ${common.MonthlyOrOneTime === t ? "bg-white" : "hover:bg-gray-200"}`}
            onClick={() => setMonthlyOrOneTime(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Months (only if Monthly) */}
      {common.MonthlyOrOneTime === "Monthly" && (
        <div className="mb-6">
          <p className="font-semibold">Duration</p>
          <select value={common.Months} onChange={(e) => setCommon((c) => ({ ...c, Months: +e.target.value }))} className="bg-gray-100 p-2 rounded-md">
            <option value={1}>1 Month</option>
            <option value={3}>3 Months</option>
          </select>
        </div>
      )}

      {/* Service selection */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
  {Object.keys(services).map((k) => (
    <label
      key={k}
      className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 border"
    >
      <input
        type="checkbox"
        checked={services[k]}
        onChange={() => toggleService1(k)} // ✅ only one onChange
      />
      <span>{pretty(k)}</span>
    </label>
  ))}
</div>


      {/* COOK */}
      {services.cook && (
        <div className="border rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Cook Options</h2>

          <div className="mb-4">
            <p className="font-semibold">Frequency per Day</p>
            <div className="flex gap-3 mt-2">
              {["Once", "Twice"].map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`px-4 py-1 rounded-lg ${cook.FrequencyPerDay === f ? "bg-purple-200" : "bg-gray-100 hover:bg-gray-200"}`}
// inside Cook options button
onClick={() => {
  setCook((s) => ({ ...s, FrequencyPerDay: f, TimeSlot2: f === "Once" ? "" : s.TimeSlot2 }));
  setBartan((b) => ({ ...b, FrequencyPerDay: f })); // keep bartan in sync
}}

                >
                  {f} a day
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1">How many people’s meals?</label>
            <input type="number" min={1} value={cook.PeopleCount} onChange={(e) => setCook((s) => ({ ...s, PeopleCount: +e.target.value }))} className="bg-gray-100 p-2 rounded-md w-32" />
          </div>

          <div className="mb-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={cook.IncludeNaashta} onChange={(e) => setCook((s) => ({ ...s, IncludeNaashta: e.target.checked }))} />
              <span>Include Naashta (Breakfast)</span>
            </label>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Select Time Slot for first meal</label>
            <select value={cook.TimeSlot1} onChange={(e) => setCook((s) => ({ ...s, TimeSlot1: e.target.value }))} className="bg-gray-100 p-2 rounded-md w-full">
              <option value="">-- Select --</option>
              <option value="09:00-11:00">Morning (9–11 AM)</option>
              <option value="11:00-13:00">Afternoon (11–1 PM)</option>
              <option value="13:00-15:00">Afternoon (1–3 PM)</option>
              <option value="18:00-20:00">Evening (6–8 PM)</option>
              <option value="20:00-22:00">Night (8–10 PM)</option>
            </select>
          </div>

          {cook.FrequencyPerDay === "Twice" && (
            <div className="mb-4">
              <label className="block mb-1">Select Time Slot for second meal</label>
              <select value={cook.TimeSlot2} onChange={(e) => setCook((s) => ({ ...s, TimeSlot2: e.target.value }))} className="bg-gray-100 p-2 rounded-md w-full">
                <option value="">-- Select --</option>
                <option value="13:00-15:00">Afternoon (1–3 PM)</option>
                <option value="20:00-22:00">Night (8–10 PM)</option>
              </select>
            </div>
          )}
        </div>
      )}

{/* BARTAN (minimal + extra option) */}
      {services.bartan && (
        <div className="border rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Bartan</h2>

          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={bartan.enabled} 
                onChange={(e) => setBartan((b) => ({ ...b, enabled: e.target.checked }))} 
              />
              <span>Enable Bartan Service</span>
            </label>
          </div>

          {/* LOGIC FIX: Only show "Meals vs Extra" mode if Cook is selected. 
              If Cook is NOT selected, we default to showing just the count input. */}
          {services.cook ? (
            <div className="mb-4">
              <p className="font-semibold">Bartan mode</p>
              <div className="flex gap-4 mt-2 items-center">
                <label className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    name="bartanMode" 
                    checked={bartan.mode === "MealsOnly"} 
                    onChange={() => setBartan((b) => ({ ...b, mode: "MealsOnly", AmountOfBartan: 0 }))} 
                  />
                  <span>Only meal utensils (from cook)</span>
                </label>

                <label className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    name="bartanMode" 
                    checked={bartan.mode === "IncludeExtra"} 
                    onChange={() => setBartan((b) => ({ ...b, mode: "IncludeExtra" }))} 
                  />
                  <span>Include extra bartan</span>
                </label>
              </div>
            </div>
          ) : (
            // If No Cook, we effectively force "Manual Count" mode visually
            <div className="mb-4">
               <p className="text-sm text-gray-600 mb-2">
                 Since you haven't selected a cook, please enter the total number of utensils to clean.
               </p>
            </div>
          )}

          {/* TIME & FREQUENCY SECTION */}
          <div className="mb-5 mt-[2vw] block">
            {services.cook ? (
              <div className="mb-4">
                <p className="font-semibold">Frequency per Day</p>
                <p className="italic text-gray-600">
                  Same as Cook frequency ({cook.FrequencyPerDay} a day)
                </p>

                <div className="mt-3">
                  <p className="font-semibold">Time Slot</p>
                  <p className="italic text-gray-600">
                    After the cooking is done
                  </p>
                </div>
              </div>
            ) : (
              <div className="mb-5 mt-[2vw] block">
                <p className="font-semibold">Frequency per Day</p>
                <div className="flex gap-3 mt-2">
                  {["Once", "Twice"].map((f) => (
                    <button
                      key={f}
                      type="button"
                      className={`px-4 py-1 rounded-lg ${
                        bartan.FrequencyPerDay === f
                          ? "bg-purple-200"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      onClick={() =>
                        setBartan((s) => ({
                          ...s,
                          FrequencyPerDay: f,
                          TimeSlot2: f === "Once" ? "" : s.TimeSlot2,
                        }))
                      }
                    >
                      {f} a day
                    </button>
                  ))}
                </div>

                <div className="mb-4 mt-6">
                  <label className="block mb-1">Select First Slot</label>
                  <select
                    value={bartan.TimeSlot1}
                    onChange={(e) =>
                      setBartan((s) => ({ ...s, TimeSlot1: e.target.value }))
                    }
                    className="bg-gray-100 p-2 rounded-md w-full"
                  >
                    <option value="">-- Select --</option>
                    <option value="09:00-11:00">Morning (9–11 AM)</option>
                    <option value="11:00-13:00">Late Morning (11–1 PM)</option>
                    <option value="18:00-20:00">Evening (6–8 PM)</option>
                  </select>
                </div>

                {bartan.FrequencyPerDay === "Twice" && (
                  <div className="mb-4">
                    <label className="block mb-1">Select Second Slot</label>
                    <select
                      value={bartan.TimeSlot2}
                      onChange={(e) =>
                        setBartan((s) => ({ ...s, TimeSlot2: e.target.value }))
                      }
                      className="bg-gray-100 p-2 rounded-md w-full"
                    >
                      <option value="">-- Select --</option>
                      <option value="13:00-15:00">Afternoon (1–3 PM)</option>
                      <option value="20:00-22:00">Night (8–10 PM)</option>
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* INPUT FIELD: Show if (Cook + Extra Mode) OR (No Cook) */}
          {(bartan.mode === "IncludeExtra" || !services.cook) && (
            <div className="mb-4">
              <label className="block mb-1">
                 {!services.cook ? "How many utensils?" : "How many extra utensils?"}
              </label>
              <input 
                type="number" 
                min={1} 
                value={bartan.AmountOfBartan} 
                onChange={(e) => setBartan((b) => ({ ...b, AmountOfBartan: +e.target.value }))} 
                className="bg-gray-100 p-2 rounded-md w-32" 
              />
            </div>
          )}
        </div>
      )}

      {/* JHADU POCHA */}
      {services.jhaduPocha && (
        <div className="border rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Jhadu Pocha</h2>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block mb-1">Number of Rooms</label>
              <input type="number" min={0} value={jhadu.NoOfRooms} onChange={(e) => setJhadu((s) => ({ ...s, NoOfRooms: +e.target.value }))} className="bg-gray-100 p-2 rounded-md w-full" />
            </div>
            <div>
              <label className="block mb-1">Number of Kitchens</label>
              <input type="number" min={0} value={jhadu.NoOfKitchen} onChange={(e) => setJhadu((s) => ({ ...s, NoOfKitchen: +e.target.value }))} className="bg-gray-100 p-2 rounded-md w-full" />
            </div>
            <div>
              <label className="block mb-1">Hall Size</label>
              <input type="number" min={0} value={jhadu.HallSize} onChange={(e) => setJhadu((s) => ({ ...s, HallSize: +e.target.value }))} className="bg-gray-100 p-2 rounded-md w-full" />
              <p className="text-xs italic text-gray-500">(If more than one hall, give combined size)</p>
            </div>
          </div>

          {/* Custom-only: Jhadu frequency (only visible when Monthly + Custom) */}
          {common.MonthlyOrOneTime === "Monthly" && common.WhichPlan === "Custom" && (
            <div className="mb-4">
              <p className="font-semibold">Jhadu Frequency (Custom)</p>
              <select value={jhadu.JhaduFrequency} onChange={(e) => setJhadu((s) => ({ ...s, JhaduFrequency: e.target.value }))} className="bg-gray-100 p-2 rounded-md">
                <option value="Daily">Daily</option>
                <option value="Alternate">Alternate Day</option>
              </select>
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-1">Time Slot</label>
            <select value={jhadu.JhaduTimeSlot} onChange={(e) => setJhadu((s) => ({ ...s, JhaduTimeSlot: e.target.value }))} className="bg-gray-100 p-2 rounded-md w-full">
              <option value="">-- Select --</option>
              <option value="09:00-11:00">Morning (9–11 AM)</option>
              <option value="12:00-14:00">Afternoon (12–2 PM)</option>
              <option value="18:00-20:00">Evening (6–8 PM)</option>
            </select>
          </div>
        </div>
      )}

      {/* TOILET (no time slot) */}
      {services.toilet && (
        <div className="border rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Toilet Cleaning</h2>

          <div className="mb-4">
            <label className="block mb-1">Number of Toilets</label>
            <input type="number" min={1} value={toilet.NoOfToilets} onChange={(e) => setToilet((s) => ({ ...s, NoOfToilets: +e.target.value }))} className="bg-gray-100 p-2 rounded-md w-32" />
          </div>

          {/* Frequency only visible when Monthly is selected */}
          {common.MonthlyOrOneTime === "Monthly" && (
            <div className="mb-4">
              <p className="font-semibold">Frequency (per week)</p>
              <select value={toilet.FrequencyPerWeek} onChange={(e) => 
                setToilet((s) => ({ ...s, FrequencyPerWeek: e.target.value }))
                
                } className="bg-gray-100 p-2 rounded-md">
                <option value="Twice">Twice a Week</option>
                <option value="Thrice">Thrice a Week</option>
              </select>
            </div>
          )}

          <p className="text-sm text-gray-500">No time-slot required for Toilet Cleaning.</p>
        </div>
      )}

      {/* PLANS (only show when Monthly selected) */}
      {common.MonthlyOrOneTime === "Monthly" && (
        <div className="mb-6">
          <p className="font-semibold mb-2">Choose Plan</p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                name: "Standard",
                details: ["Jhadu pocha: Alternate day", "Toilet: Twice a week", "Bartan: Basic (meals-only)"],
              },
              {
                name: "Premium",
                details: ["Jhadu pocha: Daily", "Toilet: Thrice a week", "Bartan: Basic (meals-only)"],
              },
            ].map((plan) => (
              <button key={plan.name} type="button" className={`p-4 rounded-lg text-left ${common.WhichPlan === plan.name ? "bg-purple-200" : "bg-gray-100 hover:bg-gray-200"}`} onClick={() => applyPlanDefaults(plan.name)}>
                <h1 className="font-bold mb-2">{plan.name} Plan</h1>
                <ul className="list-disc list-inside">
                  {plan.details.map((d, idx) => <li key={idx}>{d}</li>)}
                </ul>
              </button>
            ))}
          </div>

          <div className="flex gap-4 mt-4">
            <button type="button" className={`px-4 py-2 rounded-lg ${common.WhichPlan === "Custom" ? "bg-purple-300" : "bg-gray-100 hover:bg-gray-200"}`} onClick={() => applyPlanDefaults("Custom")}>
              Custom
            </button>
          </div>
        </div>
      )}

      {/* Custom quick controls: shown only when Monthly + Custom */}
      {common.MonthlyOrOneTime === "Monthly" && common.WhichPlan === "Custom" && (
        <div className="border rounded-lg p-4 mb-6 bg-gray-50">
          <p className="font-semibold mb-3">Customize Frequencies</p>

          {/* Jhadu quick row */}
          {JhaduPochaActive && (<div className="flex items-center justify-between gap-3 py-2">
            <div className="font-medium">Jhadu Pocha</div>
            <div className="flex gap-2">
              {[
                { label: "Daily", value: "Daily" },
                { label: "Alternate Day", value: "Alternate" },
              ].map(({ label, value }) => (
                <button key={value} type="button" className={`px-3 py-1 rounded-lg ${jhadu.JhaduFrequency === value ? "bg-purple-300" : "bg-gray-100 hover:bg-gray-200"}`} onClick={() => setJhadu((s) => ({ ...s,JhaduFrequency: value }))}>
                  {label}
                </button>
              ))}
            </div>
          </div>)}

          {/* Toilet quick row */}
          {ToiletActive && (<div className="flex items-center justify-between gap-3 py-2 border-t">
            <div className="font-medium">Toilet Cleaning</div>
            <div className="flex gap-2">
              {[
                { label: "Thrice a Week", value: "Thrice" },
                { label: "Twice a Week", value: "Twice" },
              ].map(({ label, value }) => (
                <button key={value} type="button" className={`px-3 py-1 rounded-lg ${toilet.FrequencyPerWeek === value ? "bg-purple-300" : "bg-gray-100 hover:bg-gray-200"}`} onClick={() => setToilet((s) => ({ ...s, FrequencyPerWeek: value }))}>
                  {label}
                </button>
              ))}
            </div>
          </div>)}
          
          {/* bartan quick row */}
{bartanActive && (
  <div className="flex items-center justify-between gap-3 py-2 border-t">
    <div className="font-medium">Khana/ Bartan Cleaning</div>
    <div className="flex gap-2">
      {[
        { label: "Once a day", value: "Once" },
        { label: "Twice a day", value: "Twice" },
      ].map(({ label, value }) => (
        <button
          key={value}
          type="button"
          className={`px-3 py-1 rounded-lg ${
            bartan.FrequencyPerDay === value
              ? "bg-purple-300"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => {
  setBartan((s) => ({ ...s, FrequencyPerDay: value, TimeSlot2: value === "Once" ? "" : s.TimeSlot2 }));
  if (services.cook) {
    setCook((s) => ({ ...s, FrequencyPerDay: value, TimeSlot2: value === "Once" ? "" : s.TimeSlot2 }));
  }
}}

        >
          {label}
        </button>
      ))}
    </div>
  </div>
)}


          <p className="text-xs text-gray-500 mt-3">Custom settings apply only when you've picked "Monthly" + "Custom".</p>
        </div>
      )}

      {/* Prebook & Address */}
      <div className="mt-6">
        <p className="font-semibold">Prebook Start Date</p>
        <input type="date" min={new Date().toISOString().split("T")[0]} value={new Date(common.Date).toISOString().split("T")[0]} onChange={(e) => setCommon((c) => ({ ...c, Date: new Date(e.target.value) }))} className="bg-gray-100 p-2 rounded-md" />
      </div>

      <div className="mt-6">
        <p className="font-semibold">Confirm Location</p>
        <input type="text" placeholder="Enter address" value={common.address} onChange={(e) => setCommon((c) => ({ ...c, address: e.target.value }))} className="bg-gray-100 p-2 rounded-md w-full" />
      </div>
<p className="mt-4 font-semibold text-purple-700">
  Estimated Price: ₹{estimatedPrice}
</p>

      {/* Actions */}
      <div className="flex gap-4 mt-6">
        <button onClick={handleSubmit} disabled={submitting} className={`px-4 py-2 rounded-lg text-white ${submitting ? "bg-purple-400 cursor-not-allowed" : "bg-purple-700 hover:bg-purple-600"}`}>
          {submitting ? "Booking..." : "Book"}
        </button>
        {/* <button type="button" className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-600">Pay</button> */}
      </div>
    </div>
  );
}
    