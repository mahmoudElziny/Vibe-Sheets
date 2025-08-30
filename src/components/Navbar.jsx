import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import CurrentDate from "./CurrentDate";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");

  useEfuseEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUsername(user.user_metadata?.username || user.email);
      } else {
        setUsername("");
      }
    };

    getUser(); // اول مرة

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUsername(
            session.user.user_metadata?.username || session.user.email
          );
        } else {
          setUsername("");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    setUsername("");
    navigate("/login");
  };

  const hideLogout =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <nav className="bg-[#4caf50] text-white p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left side (Logo) */}
        <div className="flex items-center space-x-4">
          <div className="p-2 rounded-4xl">
            <Link to="/">
              <img
                src="/logo2.png"
                alt="Logo"
                className="h-14 w-14 rounded-lg cursor-pointer"
              />
            </Link>
          </div>
        </div>

        {/* Right side (Welcome + Date + Logout) */}
        <div className="flex items-center gap-6">
          {!hideLogout && (
            <div className="flex flex-col items-end text-right">
              {username && (
                <span className="font-semibold text-amber-50 drop-shadow-sm">
                  Welcome, {username}
                </span>
              )}
              <CurrentDate />
            </div>
          )}
          {!hideLogout && (
            <button
              onClick={handleLogout}
              className="bg-[#166534] hover:bg-white hover:text-[#166534] px-4 py-2 rounded"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
