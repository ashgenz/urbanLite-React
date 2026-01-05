import React, { useEffect, useState } from "react";
import axios from "axios";
// Added View, Text, TouchableOpacity to the react-native imports
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";

import { Loader2, Calendar, MapPin, DollarSign, User, Phone, CheckCircle, Info } from "lucide-react";


/**
 * @typedef {object} Service
 * @property {string} _id
 * @property {string} WorkName
 * @property {string} [FrequencyPerDay]
 * @property {string} [TimeSlot1]
 * @property {string} [TimeSlot2]
 * @property {number} [NoOfPeople]
 * @property {boolean} [IncludeNaashta]
 * @property {boolean} [IsEnabled]
 * @property {string} [BartanMode]
 * @property {number} [AmountOfBartan]
 * @property {number} [NoOfRooms]
 * @property {number} [NoOfKitchen]
 * @property {number} [HallSize]
 * @property {string} [JhaduFrequency]
 * @property {string} [JhaduTimeSlot]
 * @property {number} [NoOfToilets]
 * @property {string} [FrequencyPerWeek]
 */

/**
 * @typedef {object} Booking
 * @property {string} _id
 * @property {string} WorkName
 * @property {string} address
 * @property {string} Date
 * @property {string} status
 * @property {string} IdCustomer
 * @property {string} TempPhoneCustomer
 * @property {string} TempPhoneWorker
 * @property {string} WhichPlan
 * @property {string} MonthlyOrOneTime
 * @property {Service[]} [services]
 * @property {number} EstimatedPrice
 * @property {string} [IdWorker]
 * @property {string} [WorkerName]
 * @property {object} [payment]
 * @property {('pending'|'paid'|'failed')} [payment.status]
 * @property {('online'|'cash')} [payment.mode]
 */


export default function BookingsPage({LoggedIn}) {

const handleCancelBooking = async (bookingId) => {
  const confirmCancel = window.confirm(
    "Are you sure you want to cancel this booking?"
  );
  if (!confirmCancel) return;

  const confirmText = window.prompt(
    "Type 'CONFIRM CANCEL' to finalize this cancellation:"
  );

  if (confirmText !== "CONFIRM CANCEL") {
    alert("❌ Cancellation aborted. You must type 'CONFIRM CANCEL' exactly.");
    return;
  }

  try {
    const res = await axios.patch(
      `https://urbanlite-backends.onrender.com/api/user/bookings/${bookingId}/cancel`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("✅ Booking cancelled successfully.");
    fetchBookings();
  } catch (err) {
    console.error("Cancel error:", err);
    alert(err.response?.data?.message || "Failed to cancel booking ❌");
  }
};




    // 🚨 Changed to standard JavaScript state initialization
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // NOTE: Access localStorage safely for client-side rendering
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

    const fetchBookings = async () => {
        if (!LoggedIn) {
            setError("Please log in first");
            setBookings([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.get("https://urbanlite-backends.onrender.com/api/user/bookings", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBookings(response.data);
        } catch (err) {
            console.error("❌ Failed to fetch bookings:", err);
            // 🚨 Removed explicit ': any' type cast
            setError(
                err.response?.data?.message || "Server error. Could not fetch bookings."
            );
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

useEffect(() => {
  if (!token) return; // don’t run if no token yet
  if (LoggedIn === undefined) return; // wait for Nav verification

  if (LoggedIn) {
    fetchBookings();
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  } else {
    setError("Please log in first");
    setBookings([]);
    setLoading(false);
  }
}, [token, LoggedIn]);


    if (!token) {
        return <p className="text-red-500 text-center mt-20">Please log in first.</p>;
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin w-10 h-10 text-gray-500" />
            </div>
        );
    }

    // Split bookings by payment status (using 'paid' as proxy for completed/settled status)
const ongoingBookings = bookings.filter(
  (b) => b.status !== "cancelled" && (!b.payment || b.payment.status !== "paid")
);
const completedBookings = bookings.filter(
  (b) => b.status !== "cancelled" && b.payment && b.payment.status === "paid"
);

const handlePayment = async (bookingId, bookingStatus) => {
  if (bookingStatus !== "accepted") {
    alert("Please wait until a worker accepts your booking before paying.");
    return;
  }

  try {
    await axios.post(
      `https://urbanlite-backends.onrender.com/api/user/bookings/${bookingId}/pay`,
      { method: "to_platform" },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Payment successful ✅");
    fetchBookings();
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Payment failed ❌");
  }
};



    // 🚨 Updated card component with professional styling
const renderBookingCard = (booking, isCompleted = false) => {
    const isAccepted = booking.IdWorker && booking.IdWorker !== "demoWorker";
    const paymentStatus = booking.payment?.status || "pending";
    const isPaymentPending = paymentStatus === "pending";

    return (
        <Card
            key={booking._id}
            className={`shadow-md rounded-2xl border-l-8 ${
                isCompleted ? "border-l-gray-400 bg-gray-50" : "border-l-purple-600 bg-white"
            } mb-6 overflow-hidden`}
        >
            <CardContent className="p-0">
                {/* Status Header */}
                <div className="flex justify-between items-center px-5 py-3 bg-gray-100/50 border-b">
                    <div className="flex items-center space-x-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${isAccepted ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            {isAccepted ? "Worker Assigned" : "Finding Best Worker"}
                        </span>
                    </div>
                    {!isCompleted && (
                        <button 
                            onClick={() => handleCancelBooking(booking._id)}
                            className="bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition text-red-600 text-[10px] font-bold"
                        >
                            CANCEL
                        </button>
                    )}
                </div>

                <div className="p-5">
                    {/* Title & Price Section */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex-1">
                            <h3 className="text-xl font-extrabold text-gray-900 leading-tight">
                                {booking.WorkName}
                            </h3>
                            <div className="flex items-center mt-1 text-gray-500 text-xs">
                                <Calendar size={12} className="mr-1" />
                                {new Date(booking.Date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-black text-purple-700">₹{booking.EstimatedPrice}</div>
                            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Total Amount</div>
                        </div>
                    </div>

                    {/* Main Information Grid */}
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 mb-4">
                        <div className="flex items-start mb-3">
                            <MapPin size={16} className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            <p className="text-gray-700 text-sm font-medium leading-5">
                                {booking.address}
                            </p>
                        </div>

                        <div className="flex justify-between border-t border-gray-200/50 pt-3">
                            <div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase">Worker Info</div>
                                <div className="text-gray-800 font-bold text-sm">
                                    {booking.WorkerName || "Searching..."}
                                </div>
                                {booking.TempPhoneWorker && (
                                    <div className="text-purple-600 text-xs font-semibold">{booking.TempPhoneWorker}</div>
                                )}
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-bold text-gray-400 uppercase">Plan Type</div>
                                <div className="text-gray-800 font-bold text-sm">{booking.WhichPlan}</div>
                                <div className="text-gray-500 text-[10px]">{booking.MonthlyOrOneTime}</div>
                            </div>
                        </div>
                    </div>

                    {/* --- SERVICES DETAILS SECTION --- */}
                    {booking.services && booking.services.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                            <p className="text-[11px] font-bold text-gray-400 uppercase mb-2 tracking-wider">Services Details:</p>
                            <ul className="space-y-2">
                                {booking.services.map((srv) => (
                                    <li key={srv._id} className="p-3 bg-purple-50/50 rounded-lg border border-purple-100">
                                        <div className="text-sm font-bold text-purple-900">{srv.WorkName}</div>
                                        <div className="text-xs text-purple-700 mt-1 flex flex-wrap gap-x-1">
                                            {srv.JhaduTimeSlot && <span>• Slot: {srv.JhaduTimeSlot}</span>}
                                            {srv.NoOfRooms > 0 && <span>• Rooms: {srv.NoOfRooms}</span>}
                                            {srv.NoOfKitchen > 0 && <span>• Kitchens: {srv.NoOfKitchen}</span>}
                                            {srv.HallSize > 0 && <span>• Hall Size: {srv.HallSize}</span>}
                                            {srv.NoOfToilets > 0 && <span>• Toilets: {srv.NoOfToilets}</span>}
                                            {srv.FrequencyPerDay && <span>• {srv.FrequencyPerDay}</span>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Action Footer */}
                    <div className="mt-5 flex items-center justify-between">
                        <div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase">Payment</div>
                            <div className={`mt-1 px-3 py-1 rounded-lg inline-block ${paymentStatus === 'paid' ? 'bg-green-100' : 'bg-red-50'}`}>
                                <span className={`font-black text-xs ${paymentStatus === 'paid' ? 'text-green-700' : 'text-red-700'}`}>
                                    {paymentStatus.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {!isCompleted && isPaymentPending && (
                            <button 
                                onClick={() => handlePayment(booking._id, booking.status)}
                                className="bg-purple-700 hover:bg-purple-800 px-6 py-2.5 rounded-xl flex items-center shadow-lg transition text-white font-bold text-sm"
                            >
                                <DollarSign size={16} className="mr-1" />
                                Pay Now
                            </button>
                        )}
                        {isCompleted && (
                            <div className="flex items-center text-green-600 font-bold text-sm">
                                <CheckCircle size={18} className="mr-1" />
                                Settled
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-extrabold mb-8 text-gray-800 border-b pb-3">My Service Bookings 📑</h1>

            {error && <p className="text-red-500 text-center mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">{error}</p>}
            
            {/* ONGOING BOOKINGS SECTION */}
            {ongoingBookings.length > 0 && (
                <div className="mb-10">
                    <h2 className="text-xl font-bold mb-4 text-blue-700">⏳ Ongoing/Pending Bookings ({ongoingBookings.length})</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {ongoingBookings.map((b) => renderBookingCard(b))}
                    </div>
                </div>
            )}

            {/* COMPLETED BOOKINGS SECTION */}
            {completedBookings.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-600">✅ Completed Bookings ({completedBookings.length})</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {completedBookings.map((b) => renderBookingCard(b, true))}
                    </div>
                </div>
            )}

            {/* NO BOOKINGS MESSAGE */}
            {bookings.length === 0 && (
                <p className="text-gray-500 text-center mt-20 p-6 border border-dashed rounded-lg">You haven't made any bookings yet.</p>
            )}
        </div>
    );
}