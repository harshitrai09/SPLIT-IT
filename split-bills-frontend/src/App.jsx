import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import Dashboard from "./Dashboard";
import SplitBill from "./SplitBill";
import BillHistory from "./BillHistory";
import Navbar from "./Navbar";
import Friends from "./Friends"; // import
import FriendBalances from "./FriendBalances";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/split" element={<SplitBill />} /> {/* ✅ THIS */}
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/history" element={<BillHistory />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/balances" element={<FriendBalances />} />

      </Routes>
    </>
  );
}

export default App;
