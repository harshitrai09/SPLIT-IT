import { useEffect, useState } from "react";
import axios from "axios";

const BillHistory = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/bills", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("📦 Bills response:", res.data);

        // If API returns { bills: [...] }, extract it
        const data = res.data;
        const billArray = Array.isArray(data) ? data : data.bills;

        if (!Array.isArray(billArray)) {
          throw new Error("Bills data is not an array");
        }

        setBills(billArray);
      } catch (err) {
        console.error("❌ Error fetching bills:", err);
        setBills([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Bill History</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : bills.length === 0 ? (
        <p className="text-center text-gray-500">No bills found.</p>
      ) : (
        <ul className="space-y-4">
          {bills.map((bill) => (
            <li key={bill._id} className="bg-white p-4 shadow rounded">
              <p><strong>Description:</strong> {bill.description}</p>
              <p><strong>Amount:</strong> ₹{bill.amount}</p>
              <p><strong>Participants:</strong> {bill.participants.length}</p>
              <p><strong>Date:</strong> {new Date(bill.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BillHistory;
