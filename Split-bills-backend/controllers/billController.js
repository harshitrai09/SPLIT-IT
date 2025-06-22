import Bill from "../models/Bill.js";
import User from "../models/User.js";

// Create a new bill
export const createBill = async (req, res) => {
  const { amount, splitBetween, paidBy } = req.body;
  const user = req.user;

  if (!amount || !splitBetween || !Array.isArray(splitBetween) || splitBetween.length === 0) {
    return res.status(400).json({ message: "Invalid input." });
  }

  const splitAmount = amount / splitBetween.length;

  const participantData = splitBetween.map(userId => ({
    user: userId,
    owes: parseFloat(splitAmount.toFixed(2)),
  }));

  const bill = new Bill({
    description: "Bill Split",
    amount,
    paidBy: user._id,
    participants: participantData,
  });

  try {
    await bill.save();
    res.status(201).json({ message: "Bill created successfully", bill });
  } catch (err) {
    console.error("❌ Error saving bill:", err);
    res.status(500).json({ message: "Server error saving bill." });
  }
};

// Get all bills paid by the user
export const getBills = async (req, res) => {
  try {
    const bills = await Bill.find({ paidBy: req.user._id });
    res.status(200).json({ bills });
  } catch (err) {
    res.status(500).json({ message: "Server error fetching bills." });
  }
};

// Get friend balances
export const getFriendBalances = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate("friends", "name email");
    if (!user) return res.status(404).json({ message: "User not found" });

    const balances = [];

    for (const friend of user.friends) {
      const friendId = friend._id;

      // Bills where current user is the payer and friend is a participant
      const paidByUser = await Bill.find({
        paidBy: userId,
        "participants.user": friendId,
      });

      // Bills where friend is the payer and current user is a participant
      const paidByFriend = await Bill.find({
        paidBy: friendId,
        "participants.user": userId,
      });

      let balance = 0;

      for (const bill of paidByUser) {
        const share = bill.participants.find(p => p.user.toString() === friendId.toString())?.owes || 0;
        balance += share;
      }

      for (const bill of paidByFriend) {
        const share = bill.participants.find(p => p.user.toString() === userId.toString())?.owes || 0;
        balance -= share;
      }

      balances.push({
        name: friend.name || friend.email,
        amount: Math.round(balance * 100) / 100,
      });
    }

    res.json({ balances });
  } catch (err) {
    console.error("❌ Error getting balances:", err);
    res.status(500).json({ message: "Server error" });
  }
};
