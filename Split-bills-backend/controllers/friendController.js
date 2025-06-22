// controllers/friendController.js
import User from "../models/User.js";
import Bill from "../models/Bill.js";


export const addFriend = async (req, res) => {
  try {
    const { friendEmail } = req.body;
    const currentUser = req.user;

    const friend = await User.findOne({ email: friendEmail });
    console.log(req.body)
    if (!friendEmail) {
      return res.status(400).json({ message: "Friend email is required" });
    }
    
    if (!friend) {
      return res.status(404).json({ message: "User not found" });
    }

    if (currentUser.friends.includes(friend._id)) {
      return res.status(400).json({ message: "Already friends" });
    }
    if (friend._id.equals(currentUser._id)) {
        return res.status(400).json({ message: "You cannot add yourself." });
      }
    

    currentUser.friends.push(friend._id);
    friend.friends.push(currentUser._id);

    await currentUser.save();
    await friend.save();

    res.json({ message: "Friend added successfully!" });
  } catch (err) {
    console.error("❌ Error adding friend:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("friends", "name email");

    res.json({ friends: user.friends });
  } catch (err) {
    console.error("❌ Error getting friends:", err);
    res.status(500).json({ message: "Server error" });
  }
};

