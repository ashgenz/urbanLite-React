import dotenv from "dotenv"
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_KEY=process.env.JWT_KEY;
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
  Phone: { type: String, unique: true },
  location: {
    lat: Number,
    lng: Number,
  },
  Password:String
});


const User = mongoose.model("User", UserSchema);

// API route
app.post("/api/user/signin", async (req, res) => {
  const { Name, Phone, location,Password } = req.body;

  try {
    //  Check if user with this phone already exists
    const existingUser = await User.findOne({ Phone });

    if (existingUser) {
      return res.status(409).send("false");
    }
    const hashedPassword=await bcrypt.hash(Password,10);
    // If not found, create new user
    const user = new User({ name: Name, Phone, location,Password:hashedPassword });
    await user.save();

    res.status(200).send("User saved");
  } catch (err) {
    console.error(err);
    res.status(500).send("DB error");
  }
});
app.post('/api/user/login',async(req,res)=>{ 
    const {Phone,Password}=req.body;

    const user1 =await User.findOne({Phone});

    if (!user1) return res.status(401).json({ message: 'User not found' });

    const match = await bcrypt.compare(Password, user1.Password);
    if (!match) return res.status(403).json({ message: 'Invalid credentials' });


    const token = jwt.sign({ id: user1._id }, JWT_KEY, { expiresIn: '1h' });
    res.json({ token });
 });
 

app.get('/verify', verifyToken, (req, res) => {
  res.json({ success: true, message: 'Token is valid', user: req.user });
});
 
function verifyToken(req,res,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
    
}

// Start server
app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
