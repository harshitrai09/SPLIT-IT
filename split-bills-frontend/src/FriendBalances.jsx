import { useState, useEffect } from "react";
import axios from "axios";

const FriendBalances = () => {
  const [balances, setBalances] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBalances = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("❌ Please log in to view balances.");
        return;
      }

      try {
        const res = await axios.get("http://localhost:8000/api/bills/balances", {

          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBalances(res.data.balances);
      } catch (err) {
        console.error("❌ Error fetching balances:", err);
        setMessage("Something went wrong fetching balances.");
      }
    };

    fetchBalances();
  }, []);

  const youOwe = balances.filter(b => b.amount < 0);
  const theyOwe = balances.filter(b => b.amount > 0);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg space-y-4">
        <h2 className="text-2xl font-bold text-center text-indigo-600">Friend Balances</h2>

        {message && (
          <p className="text-center text-red-600">{message}</p>
        )}

        {!message && (
          <>
            {theyOwe.length > 0 && (
              <div>
                <h3 className="font-semibold text-green-600 mb-1">💸 People Who Owe You:</h3>
                <ul className="list-disc pl-5">
                  {theyOwe.map((b, idx) => (
                    <li key={idx}>
                      <strong>{b.name}</strong> owes you ₹{Math.abs(b.amount).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {youOwe.length > 0 && (
              <div>
                <h3 className="font-semibold text-red-600 mt-4 mb-1">😓 You Owe:</h3>
                <ul className="list-disc pl-5">
                  {youOwe.map((b, idx) => (
                    <li key={idx}>
                      You owe <strong>{b.name}</strong> ₹{Math.abs(b.amount).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {theyOwe.length === 0 && youOwe.length === 0 && (
              <p className="text-center text-gray-600">🎉 All settled up!</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FriendBalances;
