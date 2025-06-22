import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [bills, setBills] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBills = async () => {
      const token = localStorage.getItem("token");
  
      if (!token) {
        setError("Token missing. Please log in again.");
        return;
      }
  
      try {
        const res = await axios.get("http://localhost:8000/api/bills", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Make sure we only set bills if the response is an array
        if (Array.isArray(res.data.bills)) {
          setBills(res.data.bills);
        } else {
          setBills([]);
          console.error("Unexpected bills format:", res.data);
        }
        
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch bills.");
        console.error(err);
      }
    };
  
    fetchBills();
  }, []);

  const total = Array.isArray(bills)
    ? bills.reduce((sum, bill) => sum + bill.amount, 0)
    : 0;

 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Dashboard
        </h2>

        <div className="text-xl text-center mb-4">
          {bills.length > 0 ? (
            <p className="text-gray-700">
              🧾 Total Expenses: <span className="font-bold">₹{total}</span>
            </p>
          ) : (
            <p className="text-gray-400 italic">No bills added yet.</p>
          )}
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="space-y-4 mt-6">
          {bills.map((bill, idx) => (
            <div
              key={idx}
              className="bg-indigo-50 p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">Amount: ₹{bill.amount}</p>
                <p className="text-sm text-gray-600">
                  Participants: {bill.participants.length}
                </p>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(bill.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
