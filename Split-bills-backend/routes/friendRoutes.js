// routes/friendRoutes.js
import express from "express";
import { addFriend, getFriends } from "../controllers/friendController.js";
import protect from "../middleware/authMiddleware.js"; //

const router = express.Router();

// Apply auth to all routes
router.use(protect);

router.post("/", addFriend);
router.use(protect);
router.get("/", getFriends);

export default router;
