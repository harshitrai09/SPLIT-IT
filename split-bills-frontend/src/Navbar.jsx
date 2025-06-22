import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:8000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => console.log("User fetch error:", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <Link to="/dashboard" className="text-2xl font-bold tracking-wide">
        🧾 SplitIt
      </Link>
      <div className="flex items-center space-x-6">
        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link to="/friends" className="text-white hover:underline">
          Friends
        </Link>
        <Link to="/balances" className="text-whitw-600 hover:underline">
        View Balances
        </Link>
        <Link to="/split" className="hover:underline">
          Split Bill
        </Link>
        <Link to="/history" className="hover:underline">
          History
        </Link>
       {/* {user && <span className="text-sm font-medium">👤 {user.email}</span>} */}
        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
