import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

const JWT_KEY = process.env.JWT_KEY;
const MONGO_URI = process.env.MONGO_URI_WORKER;

// ------------------------
// MongoDB Connection
// ------------------------
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ------------------------
// Worker Schema & Model
// ------------------------
const WorkerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  Phone: { type: String, unique: true, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  Password: { type: String, required: true },
  GovId: { type: String },
  SkilledIn: { type: [String], default: [] }, // array of strings
});

const Worker = mongoose.model("Worker", WorkerSchema);

// ------------------------
// Routes
// ------------------------

// Signup
app.post("/api/worker/signin", async (req, res) => {
  try {
    const { Name, Phone, location, Password, GovId, SkilledIn } = req.body;

    if (!Name || !Phone || !location?.lat || !location?.lng || !Password) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const existingWorker = await Worker.findOne({ Phone });
    if (existingWorker) {
      return res.status(409).json({ message: "Phone already registered" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const worker = new Worker({
      name: Name,
      Phone,
      location,
      Password: hashedPassword,
      GovId,
      SkilledIn: SkilledIn || [],
    });

    await worker.save();
    res.status(201).json({ message: "Worker registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
app.post("/api/worker/login", async (req, res) => {
  try {
    const { Phone, Password } = req.body;

    if (!Phone || !Password) {
      return res.status(400).json({ message: "Phone and Password are required" });
    }

    const worker = await Worker.findOne({ Phone });
    if (!worker) return res.status(401).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(Password, worker.Password);
    if (!isMatch) return res.status(403).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: worker._id }, JWT_KEY, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify JWT
app.get("/api/worker/verify", verifyToken, (req, res) => {
  res.json({ success: true, message: "Token is valid", user: req.user });
});

// Middleware to verify JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access denied, no token provided" });

  jwt.verify(token, JWT_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
}

// ------------------------
// Start server
// ------------------------
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
