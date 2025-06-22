import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header is present and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID from token payload
      req.user = await User.findById(decoded.id).select("-password");

      // Continue to next middleware or route
      next();
    } catch (error) {
      console.error("❌ Invalid token error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // If no token provided
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export default protect;
