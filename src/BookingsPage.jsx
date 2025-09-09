import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Loader2 } from "lucide-react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBookings = async () => {
      console.log("Fetching bookings with token:", token);
      if (!token) {
        setError("No auth token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/user/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Bookings response:", response.data);
        setBookings(response.data);
      } catch (err) {
        console.error("❌ Failed to fetch bookings:", err);

        if (err.response) {
          console.error("Response data:", err.response.data);
          console.error("Response status:", err.response.status);
        } else if (err.request) {
          console.error("No response received:", err.request);
        } else {
          console.error("Error message:", err.message);
        }

        setError("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-gray-500" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center mt-20 mb-20">{error}</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-gray-600">No bookings found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {bookings.map((booking) => (
<Card key={booking._id} className="shadow-lg rounded-2xl relative">
  {/* Status Flag */}
  <div
    className={`absolute top-2 right-2 px-3 py-1 text-sm font-semibold rounded-lg text-white ${
      !booking.IdWorker || booking.IdWorker === "demoWorker"
        ? "bg-red-500"
        : "bg-green-500"
    }`}
  >
    {(!booking.IdWorker || booking.IdWorker === "demoWorker")
      ? "Not Accepted"
      : "Accepted"}
  </div>

  <CardContent className="p-4 space-y-2">
    <h2 className="text-lg font-semibold">{booking.WorkName}</h2>
    <p><strong>Worker ID:</strong> {booking.IdWorker || "N/A"}</p>
    <p><strong>Worker Mobile:</strong> {booking.TempPhoneWorker}</p>
    <p><strong>Your Phone:</strong> {booking.TempPhoneCustomer}</p>
    <p><strong>Date:</strong> {new Date(booking.Date).toLocaleDateString()}</p>
    <p><strong>Plan:</strong> {booking.WhichPlan}</p>

    {/* Branch based on All-Rounder vs Single Service */}
    {booking.services && booking.services.length > 0 ? (
      <div className="mt-3">
        <p className="font-semibold">Services Included:</p>
        <ul className="list-disc list-inside text-sm">
          {booking.services.map((srv) => (
            <li key={srv._id}>
              <strong>{srv.WorkName}</strong>
              {srv.FrequencyPerDay && ` • ${srv.FrequencyPerDay}`}
              {srv.NoOfPeople && ` • ${srv.NoOfPeople}`}
              {srv.JhaduTimeSlot && ` • Slot: ${srv.JhaduTimeSlot}`}
              {srv.FrequencyPerWeek && ` • ${srv.FrequencyPerWeek}`}
              {srv.NoOfRooms ? ` • Rooms: ${srv.NoOfRooms}` : ""}
              {srv.NoOfKitchen ? ` • Kitchens: ${srv.NoOfKitchen}` : ""}
              {srv.NoOfToilets ? ` • Toilets: ${srv.NoOfToilets}` : ""}
              {srv.AmountOfBartan ? ` • Utensils: ${srv.AmountOfBartan}` : ""}
              {srv.AmountOfBartan ? ` • Utensils: ${srv.AmountOfBartan}` : ""}
            </li>
          ))}
        </ul>
        <p><strong>Estimated Price:</strong> ₹{booking.EstimatedPrice}</p>
      </div>
    ) : (
      <div className="mt-3">
        {/* Single service booking */}
        {booking.NoOfRooms !== undefined && (
          <p><strong>Rooms:</strong> {booking.NoOfRooms}</p>
        )}
        {booking.NoOfKitchen !== undefined && (
          <p><strong>Kitchens:</strong> {booking.NoOfKitchen}</p>
        )}
        {booking.NoOfToilets !== undefined && (
          <p><strong>Toilets:</strong> {booking.NoOfToilets}</p>
        )}
        {booking.JhaduTimeSlot && (
          <p><strong>Time Slot:</strong> {booking.JhaduTimeSlot}</p>
        )}
        {booking.FrequencyPerWeek && (
          <p><strong>Frequency:</strong> {booking.FrequencyPerWeek}</p>
        )}
      </div>
    )}
  </CardContent>
</Card>


          ))}
        </div>
      )}
      <div className="mt-6 flex justify-center">
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </div>
    </div>
  );
}
