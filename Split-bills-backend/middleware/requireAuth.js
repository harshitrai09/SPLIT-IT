import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("🚫 Missing or malformed auth header:", authHeader);
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id).select('-password');
    req.user = user;
    console.log("✅ Authenticated user:", user.name, user._id);
    next();
  } catch (err) {
    console.log("❌ Invalid token error:", err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};
