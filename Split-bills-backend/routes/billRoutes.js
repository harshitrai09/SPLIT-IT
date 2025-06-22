import express from "express";
import { createBill, getBills, getFriendBalances } from "../controllers/billController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

router.post("/", authMiddleware, createBill);

router.get("/", authMiddleware, getBills);

router.get("/balances",authMiddleware, getFriendBalances); 

export default router;
