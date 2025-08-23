import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import logo from "../assets/logo2.png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // Hide logout button on login/register pages
  const hideLogout =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <nav className="bg-[#4caf50] text-white p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 rounded-4xl">
            <img src={logo} alt="Logo" className="h-14 w-14 rounded-lg" />
          </div>
        </div>

        {!hideLogout && (
          <button
            onClick={handleLogout}
            className="bg-[#166534] hover:bg-white hover:text-[#166534] px-4 py-2 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
