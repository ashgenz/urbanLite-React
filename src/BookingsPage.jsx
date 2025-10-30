import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Loader2, Calendar, MapPin, DollarSign, User, Phone, CheckCircle, XCircle } from "lucide-react";
import { Info } from "lucide-react";
// import { LoggedIn } from "./Nav";


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
        const workerStatusBg = isAccepted ? "bg-green-600" : "bg-red-500";
        const workerStatusText = isAccepted ? "Accepted" : "Pending/Rejected";
        const paymentStatus = booking.payment?.status || "pending";
        const isPaymentPending = paymentStatus === "pending";

        return (
            <Card
                key={booking._id}
                className={`shadow-lg rounded-xl border-t-4 ${isCompleted ? "border-t-gray-400 bg-gray-50" : "border-t-blue-500 bg-white"} transition hover:shadow-xl`}
            >
                <CardContent className="p-6 space-y-4">
                    
                    {/* Header with Title and Status */}
                    <div className="flex justify-between items-start border-b pb-3 mb-3">
  <h2 className="text-2xl font-bold text-gray-800 flex-1">{booking.WorkName}</h2>

  <div className="flex items-center space-x-2">
    {/* Cancel icon only visible for ongoing bookings */}
    {!isCompleted && (
      <Info
        className="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-700 transition"
        onClick={() => handleCancelBooking(booking._id)}
        title="Cancel this booking"
      />
    )}

    <div
      className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${workerStatusBg}`}
    >
      {workerStatusText}
    </div>
  </div>
</div>


                    {/* Main Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700">
                        <p className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                            <strong>Date:</strong> {new Date(booking.Date).toLocaleDateString()}
                        </p>
                        <p className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                            <strong>Price:</strong> <span className="font-semibold text-lg text-green-700 ml-1">₹{booking.EstimatedPrice}</span>
                        </p>
                        <p className="flex items-center col-span-2">
                            <MapPin className="w-4 h-4 mr-2 text-red-500" />
                            <strong>Address:</strong> {booking.address}
                        </p>
                        
                        <p className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-gray-500" />
                            <strong>Worker Name:</strong> {booking.WorkerName || "Searching..."}
                        </p>
                        <p className="flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-gray-500" />
                            <strong>Worker Phone:</strong> {booking.TempPhoneWorker || "N/A"}
                        </p>
                        <p className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2 text-yellow-500" />
                            <strong>Plan:</strong> {booking.WhichPlan} ({booking.MonthlyOrOneTime})
                        </p>
                        <p className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                            <strong>Payment Method:</strong> {booking.payment?.mode || "N/A"}
                        </p>
                    </div>

                    {/* Services Section */}
                    {booking.services && booking.services.length > 0 && (
                        <div className="mt-4 border-t pt-4">
                            <p className="font-semibold text-md text-gray-700 mb-2">Services Details:</p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                                {booking.services.map((srv) => (
                                   <li key={srv._id} className="p-2 bg-blue-50/50 rounded-lg border border-blue-100">
  <span className="font-medium text-blue-700 block">{srv.WorkName}</span>

  {srv.FrequencyPerDay && <span>• {srv.FrequencyPerDay}</span>}
  {srv.NoOfPeople > 0 && <span> • People: {srv.NoOfPeople}</span>}
  {srv.JhaduTimeSlot && <span> • Slot: {srv.JhaduTimeSlot}</span>}
  {srv.FrequencyPerWeek && <span> • {srv.FrequencyPerWeek}</span>}
  {srv.NoOfRooms > 0 && <span> • Rooms: {srv.NoOfRooms}</span>}
  {srv.NoOfKitchen > 0 && <span> • Kitchens: {srv.NoOfKitchen}</span>}
  {srv.HallSize > 0 && <span> • Hall Size: {srv.HallSize}</span>}
  {srv.NoOfToilets > 0 && <span> • Toilets: {srv.NoOfToilets}</span>}
  {srv.AmountOfBartan > 0 && <span> • Utensils: {srv.AmountOfBartan}</span>}
</li>

                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Payment/Action Footer */}
                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                        <p className="text-base font-semibold">
                            Status: 
                            <span className={`ml-2 px-2 py-1 rounded-md text-sm font-bold ${paymentStatus === "paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                {paymentStatus.toUpperCase()}
                            </span>
                        </p>

                        {!isCompleted && isPaymentPending && (
                            <Button
  onClick={() => handlePayment(booking._id, booking.status)}
>
  <DollarSign className="w-4 h-4 mr-2" />
  Pay Now
</Button>

                        )}
                        {isCompleted && (
                             <span className="text-green-600 font-medium flex items-center">
                                <CheckCircle className="w-4 h-4 mr-1"/> Payment Complete
                             </span>
                        )}
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