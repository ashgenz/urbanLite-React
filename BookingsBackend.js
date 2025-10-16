// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";

import axios from "axios";





const app = express();
app.use(cors({ origin: "*", methods: "GET,POST,PUT,DELETE", allowedHeaders: "Content-Type,Authorization" }));
app.use(express.json({ limit: "200kb" }));

const JWT_KEY = process.env.JWT_KEY;
const MONGO_URI = process.env.MONGO_URI_BOOKINGS;
const PORT = process.env.PORTBOOKINGS;
const PORTWORKER = process.env.PORTWORKER;

// ------------------------
// MongoDB Connection
// ------------------------
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ------------------------
// Booking Schema
// ------------------------
const BookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    IdCustomer: { type: String, required: true, index: true },
    IdWorker: { type: String, default: "" },
    WorkerName: { type: String, default: "" },  // 🔹 Add this

    TempPhoneCustomer: { type: String, default: "unknown" },
    TempPhoneWorker: { type: String, default: "unknown" },

    address: { type: String, default: "" },
    WorkName: { type: String, required: true },

    services: [ /* … same as before … */ ],

    MonthlyOrOneTime: { type: String, default: "Monthly" },
    WhichPlan: { type: String, default: "Standard" },
    Date: { type: Date, default: Date.now },

    status: {
      type: String,
      enum: ["open", "accepted", "rejected", "completed"],
      default: "open",
    },

    acceptedBy: { type: String, default: "" },
    rejectedBy: [{ type: String }],
    EstimatedPrice: { type: Number, required: true },

payment: {
  status: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  mode: {
    type: String,
    enum: ["online", "cash"],
    default: "cash",
  },
  paidBy: {
    type: String,
    enum: ["customer_to_us", "customer_to_worker"],
    default: "customer_to_us",
  },
  transactionId: { type: String, default: "" },
  paidAt: { type: Date },

  // 🔹 Commission sub-document
  commission: {
    amount: { type: Number, default: 0 },
    isSettled: { type: Boolean, default: false },
    settledAt: { type: Date },
  },
},

  },
  { timestamps: true }
);
BookingSchema.pre("save", function (next) {
  if (!this.payment) this.payment = {};
  if (!this.payment.commission) {
    this.payment.commission = { amount: 0, isSettled: false };
  }
  next();
});




BookingSchema.index({ status: 1, createdAt: -1 });
const Booking = mongoose.model("Booking", BookingSchema);


// ------------------------
// Pricing logic
// ------------------------
const UNIT_PRICES = {
  Monthly: {
    room: 8,
    kitchen: 10,
    hall: 12,
    toilet: 15,
    meal: 25,
    naashta: 15,
    bartan: 1,
  },
  "One Time": {
    room: 10,
    kitchen: 13,
    hall: 15,
    toilet: 18,
    meal: 40,
    naashta: 20,
    bartan: 2,
  },
};

// server.js

// ... (previous code before calculatePrice)

function calculatePrice(booking) {
  const unit = UNIT_PRICES[booking.MonthlyOrOneTime] || UNIT_PRICES["Monthly"];
  const days =
    booking.MonthlyOrOneTime === "Monthly"
      ? 30 * (booking.Months || 1)
      : 1;

  let total = 0;

  for (const srv of booking.services || []) {
    switch (srv.WorkName) {
      case "Jhadu Pocha": {
        const jhaduFactor =
          srv.JhaduFrequency === "Alternate day" ? 0.5 : 1;
        total +=
          ((srv.NoOfRooms || 0) * unit.room +
            (srv.NoOfKitchen || 0) * unit.kitchen +
            (srv.HallSize || 0) * unit.hall) *
          jhaduFactor *
          days;
        break;
      }

      case "Toilet Cleaning": {
        let toiletFactor = 0;
        if (srv.FrequencyPerWeek === "Twice a week") toiletFactor = 2 / 7;
        if (srv.FrequencyPerWeek === "Thrice a week") toiletFactor = 3 / 7;
        total += (srv.NoOfToilets || 0) * unit.toilet * toiletFactor * days;
        break;
      }

      case "Bartan Service": {
        // ✅ FIX: Must check for "Twice a day" to match the frontend payload
        const bartanFactor = srv.FrequencyPerDay === "Twice a day" ? 2 : 1; 
        total +=
          (srv.AmountOfBartan || 0) * unit.bartan * bartanFactor * days;
        break;
      }

      case "Cook Service": {
        // Assuming Cook Service still uses "Twice" for its own internal meal calculation
        const mealsPerDay = srv.FrequencyPerDay === "Twice" ? 2 : 1;
        total +=
          (srv.NoOfPeople || 0) * mealsPerDay * unit.meal * days;
        if (srv.IncludeNaashta) {
          total += (srv.NoOfPeople || 0) * unit.naashta * days;
        }
        if (srv.IncludeBartan) {
          const cookBartanFactor = srv.FrequencyPerDay === "Twice" ? 2 : 1;
          total += (srv.AmountOfBartan || 0) * unit.bartan * cookBartanFactor * days;
        }
        break;
      }

      default:
        break;
    }
  }

  return Math.round(total);
}

// ... (rest of server.js)



// ------------------------
// JWT Middleware
// ------------------------
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token" });

  jwt.verify(token, JWT_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
}

// ------------------------
// Routes
// ------------------------

// Dev token (testing)
app.post("/api/dev/token", (req, res) => {
  const id = req.body?.id || "demoWorker123";
  const role = req.body?.role || "worker"; // default to worker
  const token = jwt.sign({ id, role }, JWT_KEY, { expiresIn: "7d" });
  res.json({ token });
});

// Customer bookings
app.get("/api/user/bookings", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ IdCustomer: req.user.id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin → all bookings
app.get("/api/admin/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Worker → only open bookings (exclude ones they already rejected)
app.get("/api/worker/bookings/open", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({
      status: "open",
      rejectedBy: { $ne: req.user.id },
    }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Worker accept booking
// Worker accepts a booking — fetch worker info from Worker service via axios
app.post("/api/worker/bookings/:id/accept", verifyToken, async (req, res) => {
  try {
    // call Worker service to get worker details (name)
    // worker service runs on port 8000 in your setup
    const workerServiceUrl = `http://localhost:${PORTWORKER}/workers/${req.user.id}`;
    console.log(PORTWORKER)
    let workerResp;
    try {
      workerResp = await axios.get(workerServiceUrl);
    } catch (err) {
      // If worker service returns 404 or is down, surface a clear error
      console.error("Worker service error:", err?.response?.data || err.message);
      return res.status(500).json({ message: "Failed to fetch worker info" });
    }

    const worker = workerResp.data;
    if (!worker) {
      return res.status(404).json({ message: "Worker not found in worker service" });
    }

    // Update booking with worker ID + name. Only accept if booking is still open.
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, status: "open" },
      {
        status: "accepted",
        IdWorker: req.user.id,
        acceptedBy: req.user.id,
        WorkerName: worker.name || "",
      },
      { new: true }
    );

    if (!booking) return res.status(400).json({ message: "Booking not available" });

    // Ensure payment + commission shape exists before sending response
    if (!booking.payment) booking.payment = {};
    if (!booking.payment.commission) booking.payment.commission = { amount: 0, isSettled: false };

    res.json({
      success: true,
      booking: {
        ...booking.toObject(),
        payment: { ...booking.payment, method: booking.payment.mode }, // frontend compat
      },
    });
  } catch (err) {
    console.error("Accept booking error:", err.message);
    res.status(500).json({ message: err.message });
  }
});


// Worker → accepted bookings (only for this worker)
app.get("/api/worker/bookings/accepted", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({
      status: "accepted",
      IdWorker: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Worker reject booking
// app.post("/api/worker/bookings/:id/reject", verifyToken, async (req, res) => {
//   try {
//     const booking = await Booking.findOneAndUpdate(
//       { _id: req.params.id, status: "open" },
//       { $addToSet: { rejectedBy: req.user.id } }, // worker added to rejected list
//       { new: true }
//     );
//     if (!booking) return res.status(400).json({ message: "Booking not available" });
//     res.json(booking);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// User creates booking 
app.post("/api/user/book", verifyToken, async (req, res) => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];

const bookings = await Booking.insertMany(
  data.map((item) => {
    const EstimatedPrice = calculatePrice(item); // ✅ calculate on backend
    return {
      ...item,
      bookingId: `bk_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      IdCustomer: req.user.id,
      EstimatedPrice,
    };
  })
);


    res.status(201).json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




app.post("/api/user/bookings/:id/pay", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // ensure payment object exists
    if (!booking.payment) booking.payment = {};
    if (!booking.payment.commission) booking.payment.commission = { amount: 0, isSettled: false };

    // prevent double payment
    if (booking.payment.status === "paid") {
      return res.status(400).json({ message: "Booking already paid" });
    }

    const { method } = req.body; // "to_platform" or "to_worker"
    booking.payment.status = "paid";
    booking.payment.mode = method === "to_platform" ? "online" : "cash";
    booking.payment.paidBy = method === "to_platform" ? "customer_to_us" : "customer_to_worker";
    booking.payment.paidAt = new Date();

    await booking.save();

    // If payment goes through platform and worker exists, update worker wallet
    if (method === "to_platform" && booking.IdWorker) {
      try {
        const payout = Math.round(booking.EstimatedPrice * 0.8);
        const commission = Math.round(booking.EstimatedPrice * 0.2);

        await axios.post("http://localhost:8000/api/internal/worker/update-wallet", {
          workerId: booking.IdWorker,
          payout,
          commission,
          bookingId: booking.bookingId,
        });

        return res.json({
          success: true,
          message: `Payment recorded, ₹${payout} credited to worker, commission ₹${commission} kept by platform`,
          booking: { ...booking.toObject(), payment: { ...booking.payment, method: booking.payment.mode } },
        });
      } catch (err) {
        console.error("❌ Worker service update failed:", err.message);
        return res.status(500).json({
          message: "Booking saved but failed to update worker balance",
          booking: { ...booking.toObject(), payment: { ...booking.payment, method: booking.payment.mode } },
        });
      }
    }

    // if method === "to_worker" (cash to worker)
    res.json({
      success: true,
      message: "Payment recorded successfully",
      booking: { ...booking.toObject(), payment: { ...booking.payment, method: booking.payment.mode } },
    });
  } catch (err) {
    console.error("Pay route error:", err.message);
    res.status(500).json({ message: err.message });
  }
});




// BookingsBackend.js
app.post("/api/worker/bookings/:id/pay-commission", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Ensure payment and commission exist
    if (!booking.payment) booking.payment = {};
    if (!booking.payment.commission) booking.payment.commission = { amount: 0, isSettled: false };

    if (booking.payment.commission.isSettled) {
      return res.status(400).json({ message: "Commission already settled" });
    }

    if (!booking.IdWorker) {
      return res.status(400).json({ message: "Booking has no assigned worker" });
    }

    // commission = 20% of EstimatedPrice
    const commission = Math.round(booking.EstimatedPrice * 0.2);

    // call Worker backend to deduct from wallet
    try {
      await axios.post(`http://localhost:${PORTWORKER}/api/internal/worker/pay-commission`, {
        workerId: booking.IdWorker,
        amount: commission,
        bookingId: booking.bookingId,
      });
    } catch (err) {
      console.error("Worker pay-commission call failed:", err?.response?.data || err.message);
      // bubble upstream error to frontend
      return res.status(500).json({ message: "Failed to deduct commission from worker wallet" });
    }

    // update booking
    booking.payment.commission = {
      amount: commission,
      isSettled: true,
      settledAt: new Date(),
    };
    await booking.save();

    res.json({
      success: true,
      message: "Commission settled successfully",
      booking: { ...booking.toObject(), payment: { ...booking.payment, method: booking.payment.mode } },
    });
  } catch (err) {
    console.error("❌ Commission settlement failed:", err.message);
    res.status(500).json({ message: "Failed to settle commission" });
  }
});



// ------------------------
// Start server
// ------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT} BookingsBackend`);
});
