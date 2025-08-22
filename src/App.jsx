import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import TablePage from "./pages/TablePage";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Toaster position="top-right" />
      <main className="max-w-6xl mx-auto p-4"> 
        
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/table/:name"
          element={
            <ProtectedRoute>
              <TablePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </main>
    </Router>
  );
}
