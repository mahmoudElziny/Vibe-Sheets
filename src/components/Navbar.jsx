import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="bg-primary text-white p-4 flex justify-between items-center">
      
      <div className="space-x-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <button
          onClick={handleLogout}
          className="bg-secondary px-3 py-1 rounded hover:bg-accent"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
