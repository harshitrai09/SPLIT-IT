// Importing required packages
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import friendRoutes from "./routes/friendRoutes.js";
import protectedRoutes from "./routes/protectedroutes.js";
import billRoutes from "./routes/billRoutes.js";
// Importing our routes
import authRoutes from "./routes/authRoutes.js";

// Load environment variables
dotenv.config();

// Create an Express app
const app = express();

// Middleware
app.use(cors({
    origin: "*", // allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));              // Allow frontend to connect

app.use(express.json());      // Parse JSON bodies

app.use("/api", protectedRoutes); // All routes in protectedRoutes.js will be under /api
// Middleware to protect routes

// Route middleware
app.use("/api/auth", authRoutes); // All routes in authRoutes.js will be under /api/auth

app.use("/api/bills", billRoutes); // All routes in billRoutes.js will be under /api/bills
app.use("/api/friends", friendRoutes);
// Port and DB Connection
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("✅ Backend is working!");
  });


// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch((err) => console.error("❌ MongoDB connection failed:", err));
