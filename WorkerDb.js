// server.js
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());

import cors from "cors";


// Enable CORS for your frontend origin
app.use(cors({
  origin: "http://localhost:5173",   // allow only your frontend
  methods: ["GET", "POST", "PUT", "DELETE"], // allowed HTTP methods
  credentials: true
}));

app.use(express.json());



// ------------------ MongoDB Connection ------------------
mongoose.connect("mongodb+srv://ashishteckfile:Ashish%231%23ash@wokerusers.g9ygfsx.mongodb.net/user?retryWrites=true&w=majority&appName=wokerUsers", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("✅ MongoDB connected"));

// ------------------ Worker Schema ------------------
const workerSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  gender: { type: String, required: true },
  skills: { type: [String], required: true },

  // 🔹 Wallet
  wallet: {
    balance: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    minRequired: { type: Number, default: 100 }, // must maintain min
    lastUpdated: { type: Date, default: Date.now },
    transactions: [
      {
        type: { type: String, enum: ["credit", "debit"], required: true },
        amount: { type: Number, required: true },
        description: { type: String, default: "" },
        date: { type: Date, default: Date.now },
      },
    ],
  },
});


const Worker = mongoose.model("Worker", workerSchema);

// ------------------ Routes ------------------

// Worker Registration
app.post("/workers/register", async (req, res) => {
  try {
    const { phone, password, name, location, gender, skills } = req.body;

    // check if phone already exists
    const existingWorker = await Worker.findOne({ phone });
    if (existingWorker) {
      return res.status(400).json({ error: "Worker with this phone already exists" });
    }

    const worker = new Worker({
      phone,
      password,
      name,
      location,
      gender,
      skills,
    });

    await worker.save();
    res.status(201).json({ message: "Worker registered successfully", worker });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Worker Login
import jwt from "jsonwebtoken";
const JWT_KEY = process.env.JWT_KEY;
app.post("/workers/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    const worker = await Worker.findOne({ phone });
    if (!worker) {
      return res.status(400).json({ error: "Worker not found" });
    }

    if (worker.password !== password) {
      return res.status(400).json({ error: "Invalid password" });
    }
    console.log(worker)
    console.log(JWT_KEY)
    // Generate JWT
    const token = jwt.sign({ id: worker._id },JWT_KEY, { expiresIn: "1d" });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      worker: {
        id: worker._id,
        name: worker.name,
        phone: worker.phone,
        location: worker.location,
        gender: worker.gender,
        skills: worker.skills,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Middleware
function verifyToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  jwt.verify(token, JWT_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
}

// Get balance
app.get("/api/worker/balance", verifyToken, async (req, res) => {
  const worker = await Worker.findById(req.user.id);
  if (!worker) return res.status(404).json({ message: "Worker not found" });

  const { balance, currency, lastUpdated } = worker.wallet;
  res.json({ workerId: worker._id, balance, currency, lastUpdated });
});

// Top-up balance
app.post("/api/worker/wallet/topup", verifyToken, async (req, res) => {
  const { amount, description } = req.body;
  if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });

  const worker = await Worker.findById(req.user.id);
  worker.wallet.balance += amount;
  worker.wallet.transactions.push({ type: "credit", amount, description });
  worker.wallet.lastUpdated = new Date();

  await worker.save();
  res.json({ success: true, balance: worker.wallet.balance });
});

// Transaction history
app.get("/api/worker/wallet/transactions", verifyToken, async (req, res) => {
  const worker = await Worker.findById(req.user.id);
  if (!worker) return res.status(404).json({ message: "Worker not found" });

  res.json(worker.wallet.transactions);
});


// ------------------ Start Server ------------------
const PORT = 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
