// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors({ origin: "*", methods: "GET,POST,PUT,DELETE", allowedHeaders: "Content-Type,Authorization" }));
app.use(express.json({ limit: "200kb" }));

const JWT_KEY = process.env.JWT_KEY;
const MONGO_URI = process.env.MONGO_URI_BOOKINGS;
const PORT = process.env.PORTBOOKINGS;

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

    // 🔹 New payment fields
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
      transactionId: { type: String, default: "" }, // e.g. UPI/Stripe ID
      paidAt: { type: Date },
    },
  },
  { timestamps: true }
);




BookingSchema.index({ status: 1, createdAt: -1 });
const Booking = mongoose.model("Booking", BookingSchema);


// ------------------------
// Pricing logic
// ------------------------
const UNIT_PRICES = {
  Monthly: {
    room: 20,
    kitchen: 30,
    hall: 40,
    toilet: 15,
    meal: 25,
    naashta: 15,
    bartan: 2,
  },
  "One Time": {
    room: 40,
    kitchen: 50,
    hall: 60,
    toilet: 25,
    meal: 40,
    naashta: 20,
    bartan: 5,
  },
};

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
        const bartanFactor = srv.FrequencyPerDay === "Twice" ? 2 : 1;
        total +=
          (srv.AmountOfBartan || 0) * unit.bartan * bartanFactor * days;
        break;
      }

      case "Cook Service": {
        const mealsPerDay = srv.FrequencyPerDay === "Twice" ? 2 : 1;
        total +=
          (srv.NoOfPeople || 0) * mealsPerDay * unit.meal * days;
        if (srv.IncludeNaashta) {
          total += (srv.NoOfPeople || 0) * unit.naashta * days;
        }
        if (srv.IncludeBartan) {
          total += (srv.AmountOfBartan || 0) * unit.bartan * days;
        }
        break;
      }

      default:
        break;
    }
  }

  return Math.round(total);
}



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
app.post("/api/worker/bookings/:id/accept", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, status: "open" },
      { status: "accepted", IdWorker: req.user.id, acceptedBy: req.user.id },
      { new: true }
    );
    if (!booking) return res.status(400).json({ message: "Booking not available" });
    res.json(booking);
  } catch (err) {
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



// ------------------------
// Start server
// ------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
