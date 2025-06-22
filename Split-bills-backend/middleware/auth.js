// middleware/auth.js
import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1]; // Format: "Bearer <token>"

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultSecret");
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default auth;