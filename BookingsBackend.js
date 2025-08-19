import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

const JWT_KEY = process.env.JWT_KEY || "secretkey123"; // fallback key
const MONGO_URI = process.env.MONGO_URI_BOOKINGS || "mongodb://127.0.0.1:27017/bookings";
const PORT = process.env.PORTBOOKINGS || 5000;

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
// Booking Schema & Model
// ------------------------
const BookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    IdCustomer: { type: String, required: true },
    IdWorker: { type: String, required: true },
    TempPhoneCustomer: { type: String, required: true },
    TempPhoneWorker: { type: String, required: true },
    location: { lat: Number, lng: Number },
    WorkName: String,
    MonthlyOrOneTime: String,
    NoOfRooms: { type: Number, default: 0 },
    NoOfKitchen: { type: Number, default: 0 },
    HallSize: { type: Number, default: 0 },
    NoOfToilets: { type: Number, default: 0 },
    AmountOfBartan: { type: Number, default: 0 },
    TimeSlot: String,
    Date: Date,
    WhichPlan: { type: String, default: "Standard" },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);

// ------------------------
// JWT Verification Middleware
// ------------------------
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, JWT_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
}

// ------------------------
// Routes
// ------------------------

// Dev token generator
app.post("/api/dev/token", (req, res) => {
  const id = req.body?.id || "demoCustomerId123";
  const token = jwt.sign({ id, role: "user" }, JWT_KEY, { expiresIn: "7d" });
  res.json({ token });
});

// Get bookings for logged-in customer
app.get("/api/user/bookings", verifyToken, async (req, res) => {
  try {
    console.log("Fetching bookings for user:", req.user.id);
    const bookings = await Booking.find({ IdCustomer: req.user.id });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create booking (optional)
app.post("/api/user/book", verifyToken, async (req, res) => {
  try {
    const bookingData = { ...req.body, IdCustomer: req.user.id };
    const booking = new Booking(bookingData);
    await booking.save();
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (err) {
    console.error(err);
    if (err.code === 11000)
      return res.status(409).json({ message: "bookingId already exists" });
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------------
// Start server
// ------------------------
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
