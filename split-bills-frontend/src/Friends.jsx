import { useEffect, useState } from "react";
import axios from "axios";

const Friends = () => {
  const [friendEmail, setFriendEmail] = useState("");
  const [friends, setFriends] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Fetch current friends
  const fetchFriends = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/friends", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriends(res.data.friends || []);
    } catch (err) {
      setMessage("❌ Failed to fetch friends");
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleAddFriend = async () => {
    if (!friendEmail) {
      return setMessage("Please enter a valid email.");
    }
    console.log("Sending friendEmail:", friendEmail);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/friends",
        { friendEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("✅ Friend added successfully!");
      setFriendEmail("");
      fetchFriends(); // Refresh the list
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Error adding friend");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-md mx-auto bg-white shadow-md rounded p-6 space-y-4">
        <h2 className="text-xl font-bold text-center text-indigo-600">Manage Friends</h2>

        <input
          type="email"
          placeholder="Friend's Email"
          value={friendEmail}
          onChange={(e) => setFriendEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />

        <button
          onClick={handleAddFriend}
          className="w-full py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
        >
          Add Friend
        </button>

        {message && <p className="text-center text-sm text-gray-700">{message}</p>}

        <div>
          <h3 className="text-md font-semibold mb-2">Your Friends:</h3>
          {friends.length === 0 ? (
            <p>No friends yet.</p>
          ) : (
            <ul className="list-disc pl-5 space-y-1">
              {friends.map((f, i) => (
                <li key={i}>{f.name || f.email}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Friends;
