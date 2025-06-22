// routes/protectedRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import protect from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/dashboard", auth, (req, res) => {
  res.json({ message: `Welcome, user with ID ${req.user.id}` });
});
router.get("/users/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); // exclude password
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("❌ Error in /users/me:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
