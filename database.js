import dotenv from "dotenv"
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ Connected to MongoDB Atlas");
})
.catch((err) => {
  console.error("❌ MongoDB connection failed:", err.message);
  process.exit(1); // Optional: exit the process if DB connection fails
});


// Schema & Model
const UserSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, unique: true },
  location: {
    lat: Number,
    lng: Number,
  },
});


const User = mongoose.model("User", UserSchema);

// API route
app.post("/api/user", async (req, res) => {
  const { Name, phone, location } = req.body;

  try {
    //  Check if user with this phone already exists
    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res.status(409).send("false");
    }

    // If not found, create new user
    const user = new User({ name: Name, phone, location });
    await user.save();

    res.status(200).send("User saved");
  } catch (err) {
    console.error(err);
    res.status(500).send("DB error");
  }
});


// Start server
app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
