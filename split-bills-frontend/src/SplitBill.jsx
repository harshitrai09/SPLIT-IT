import { useState, useEffect } from "react";
import axios from "axios";

const SplitBill = () => {
  const [amount, setAmount] = useState("");
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [paidBy, setPaidBy] = useState(""); // will set once we get user ID
  const [result, setResult] = useState([]);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setMessage("❌ You must be logged in to split a bill.");
      return;
    }

    const fetchUserAndFriends = async () => {
      try {
        const userRes = await axios.get("http://localhost:8000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = userRes.data;
        setUserId(user._id);
        setPaidBy(user._id); // Default: user paid

        const friendsRes = await axios.get(
          "http://localhost:8000/api/friends",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const all = [
          {
            _id: user._id,
            name: user.name || "You",
            email: user.email,
            isYou: true,
          },
          ...friendsRes.data.friends,
        ];

        setFriends(all);
      } catch (err) {
        console.error("❌ Error fetching user or friends:", err.message);
        setMessage("Could not load user/friends. Please refresh.");
      }
    };

    fetchUserAndFriends();
  }, []);

  const toggleFriend = (friendId) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleSplit = async () => {
    if (!token) return setMessage("❌ Please log in again.");
    if (!amount || selectedFriends.length === 0)
      return setMessage(
        "Please enter amount and select friends to split with."
      );

    // Always include the logged-in user in the split
    const splitBetween = Array.from(new Set([...selectedFriends, userId]));

    try {
      const res = await axios.post(
        "http://localhost:8000/api/bills",
        {
          amount,
          splitBetween,
          paidBy,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setResult(res.data.bill.participants);
      setMessage("✅ Bill successfully split and saved!");
      setAmount("");
      setSelectedFriends([]);
      setPaidBy(userId);
    } catch (err) {
      console.error("❌ Split error:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Server error saving bill.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center text-indigo-600">
          Split a Bill
        </h2>

        <input
          type="number"
          placeholder="Total Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />

        <div>
          <p className="font-semibold mb-2">Select friends to split with:</p>
          {friends
            .filter((f) => !f.isYou)
            .map((friend) => (
              <label key={friend._id} className="block">
                <input
                  type="checkbox"
                  checked={selectedFriends.includes(friend._id)}
                  onChange={() => toggleFriend(friend._id)}
                  className="mr-2"
                />
                {friend.name || friend.email}
              </label>
            ))}
        </div>

        <div>
          <label className="block font-semibold mb-1">Who paid the bill?</label>
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            {friends.map((friend) => (
              <option key={friend._id} value={friend._id}>
                {friend.isYou ? "You" : friend.name || friend.email}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSplit}
          className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
        >
          Split Bill
        </button>

        {message && (
          <p
            className={`text-center text-sm ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {result.length > 0 && (
          <div className="mt-4 space-y-1">
            <h3 className="font-semibold">Who owes what:</h3>
            {result
              .filter((p) => String(p.user) !== String(paidBy))
              .map((p, idx) => {
                const payer = friends.find((f) => f._id === paidBy);
                const debtor = friends.find((f) => f._id === p.user);

                return (
                  <p key={idx}>
                    <strong>
                      {debtor?.isYou ? "You" : debtor?.name || "Someone"}
                    </strong>{" "}
                    owes ₹{p.owes} to{" "}
                    <strong>
                      {payer?.isYou ? "You" : payer?.name || "someone"}
                    </strong>
                  </p>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SplitBill;
