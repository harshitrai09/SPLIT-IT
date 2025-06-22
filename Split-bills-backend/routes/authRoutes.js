// routes/authRoutes.js
import express from "express";
import { signup, login } from "../controllers/authController.js";
import { requireAuth } from "../middleware/requireAuth.js"; 

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get('/me', requireAuth, (req, res) => {
    res.json({ user: req.user });
  });

export default router;