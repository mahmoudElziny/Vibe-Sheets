import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Navbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUsername(user.user_metadata?.username || user.email);
      } else {
        setUsername("");
      }
      setLoading(false);
    };

    fetchUser();

    // listener لتغير الحالة
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setLoading(true); // نمسح البيانات القديمة على طول
        setUsername("");

        if (session?.user) {
          setUsername(session.user.user_metadata?.username || session.user.email);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUsername("");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-lg font-bold hover:text-gray-300">
            MyApp
          </Link>
          <Link to="/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {loading ? (
            <span className="text-sm text-gray-400">Loading...</span>
          ) : (
            username && (
              <span className="text-sm font-medium text-green-400">
                👋 Welcome, {username}
              </span>
            )
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
