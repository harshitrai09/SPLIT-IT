import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  participants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      owes: {
        type: Number,
        required: true,
      },
    },
  ],
}, { timestamps: true });

export default mongoose.model("Bill", billSchema);
