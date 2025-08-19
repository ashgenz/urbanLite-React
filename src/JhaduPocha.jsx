import React, { useState } from "react";
import axios from "axios";
import TimeSlotDropdown from "./TimeSlotDropdown";
import { useNavigate } from "react-router-dom";

// Use Vite env if present, otherwise fallback to localhost:6000
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function JhaduPocha({ heading }) {
  const navigate = useNavigate();

const [formData, setFormData] = useState({
  bookingId: Date.now().toString(),
  IdWorker: "demoWorker",   // keep worker
  TempPhoneCustomer: "9999999999",
  TempPhoneWorker: "8888888888",
  location: { lat: 0, lng: 0 },
  WorkName: "Jhadu Pocha",
  MonthlyOrOneTime: "Monthly",
  NoOfRooms: 0,
  NoOfKitchen: 0,
  HallSize: 0,
  NoOfToilets: 0,
  AmountOfBartan: 0,
  TimeSlot: "",
  Date: new Date(),
  WhichPlan: "Standard",
  address: "",
});


  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert("Please log in first!");
    return;
  }

  if (!formData.TimeSlot) {
    alert("Please select a time slot!");
    return;
  }

  const payload = {
    ...formData,
    Date: new Date(formData.Date).toISOString(),
    location: {
      lat: Number(formData.location.lat) || 0,
      lng: Number(formData.location.lng) || 0,
    },
  };

  console.log("Submitting payload:", payload); // 👈 debug

  try {
    setSubmitting(true);
    const res = await axios.post(`${API_BASE}/api/user/book`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 201) {
      alert("Booking created successfully!");
      navigate("/bookings");
    }
  } catch (err) {
    console.error("Booking error:", err.response?.data || err.message);
    alert("Failed to create booking");
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <img
          src="/JhaduPocha.jpg"
          alt="JhaduPocha"
          className="w-full md:w-1/3 rounded-lg border-2 border-black"
        />
        <div>
          <h1 className="text-2xl font-bold">{heading}</h1>
          <p className="text-lg text-gray-700">Description</p>
          <p className="italic text-gray-500">
            Professional brooming and mopping service
          </p>
        </div>
      </div>

      {/* Monthly / One Time */}
      <div className="flex gap-2 bg-gray-100 p-2 rounded-3xl w-fit mb-6">
        <button
          type="button"
          className={`px-4 py-1 rounded-3xl ${
            formData.MonthlyOrOneTime === "Monthly"
              ? "bg-white"
              : "hover:bg-gray-200"
          }`}
          onClick={() => handleChange("MonthlyOrOneTime", "Monthly")}
        >
          Monthly
        </button>
        <button
          type="button"
          className={`px-4 py-1 rounded-3xl ${
            formData.MonthlyOrOneTime === "One Time"
              ? "bg-white"
              : "hover:bg-gray-200"
          }`}
          onClick={() => handleChange("MonthlyOrOneTime", "One Time")}
        >
          One Time
        </button>
      </div>

      {/* Room, Kitchen, Hall */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div>
          <p>Number of Rooms</p>
          <input
            type="number"
            value={formData.NoOfRooms}
            onChange={(e) => handleChange("NoOfRooms", +e.target.value)}
            className="bg-gray-100 w-full p-2 rounded-md"
          />
        </div>
        <div>
          <p>Number of Kitchens</p>
          <input
            type="number"
            value={formData.NoOfKitchen}
            onChange={(e) => handleChange("NoOfKitchen", +e.target.value)}
            className="bg-gray-100 w-full p-2 rounded-md"
          />
        </div>
        <div>
          <p>Hall Size</p>
          <input
            type="number"
            value={formData.HallSize}
            onChange={(e) => handleChange("HallSize", +e.target.value)}
            className="bg-gray-100 w-full p-2 rounded-md"
          />
          <p className="text-xs italic text-gray-500">
            (If more than one hall, give combined size)
          </p>
        </div>
      </div>

      {/* Add-ons */}
      <div className="mb-6">
        <p className="font-semibold">Add-ons:</p>
        <div className="flex flex-col gap-4 mt-2">
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={formData.NoOfToilets > 0}
                onChange={(e) =>
                  handleChange("NoOfToilets", e.target.checked ? 1 : 0)
                }
              />
              Toilet Cleaning
            </label>
            <p className="mt-1">Number of Toilets</p>
            <input
              type="number"
              value={formData.NoOfToilets}
              onChange={(e) => handleChange("NoOfToilets", +e.target.value)}
              className="bg-gray-100 p-2 rounded-md w-32"
            />
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={formData.AmountOfBartan > 0}
                onChange={(e) =>
                  handleChange("AmountOfBartan", e.target.checked ? 1 : 0)
                }
              />
              Bartan Cleaning
            </label>
            <p className="mt-1">Amount of Bartan</p>
            <input
              type="number"
              value={formData.AmountOfBartan}
              onChange={(e) => handleChange("AmountOfBartan", +e.target.value)}
              className="bg-gray-100 p-2 rounded-md w-32"
            />
          </div>
        </div>
      </div>

      {/* Time Slot */}
      <TimeSlotDropdown
        value={formData.TimeSlot}
        onChange={(slot) => handleChange("TimeSlot", slot)}
      />

      {/* Prebook */}
      <div className="mt-6">
        <p className="font-semibold">Prebook Selection</p>
        <label className="block mt-2">Select Date:</label>
        <input
          type="date"
          value={new Date(formData.Date).toISOString().split("T")[0]}
          onChange={(e) => handleChange("Date", new Date(e.target.value))}
          className="bg-gray-100 p-2 rounded-md"
        />
      </div>

      {/* Location */}
      <div className="mt-6">
        <p className="font-semibold">Confirm Location of Work (address)</p>
        <input
          type="text"
          placeholder="Enter address (optional)"
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
          className="bg-gray-100 p-2 rounded-md w-full"
        />
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        {[
          {
            name: "Standard",
            details: [
              "Jhadu pocha: Alternate day",
              "Toilet: Twice a week",
              "Bartan: Daily once",
            ],
          },
          {
            name: "Premium",
            details: [
              "Jhadu pocha: Daily",
              "Toilet: Twice a week",
              "Bartan: Daily twice",
            ],
          },
          {
            name: "Custom",
            details: [
              "Jhadu pocha: Flexible",
              "Toilet: Flexible",
              "Bartan: Flexible",
            ],
          },
        ].map((plan) => (
          <button
            key={plan.name}
            type="button"
            className={`p-4 rounded-lg text-left ${
              formData.WhichPlan === plan.name
                ? "bg-purple-200"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => handleChange("WhichPlan", plan.name)}
          >
            <h1 className="font-bold mb-2">{plan.name} Plan</h1>
            <ul className="list-disc list-inside">
              {plan.details.map((d, idx) => (
                <li key={idx}>{d}</li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`px-4 py-2 rounded-lg text-white ${
            submitting
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-purple-700 hover:bg-purple-600"
          }`}
        >
          {submitting ? "Booking..." : "Book"}
        </button>
        <button
          type="button"
          className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
        >
          Pay
        </button>
      </div>
    </div>
  );
}
