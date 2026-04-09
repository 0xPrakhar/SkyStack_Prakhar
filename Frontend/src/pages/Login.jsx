import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/useToastHook";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import { useState } from "react";
import API from "../api";

export default function Login() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDemoLogin = (role) => {
    const demoUser = {
      name: role === "organizer" ? "Demo Organizer" : "Demo User",
      role,
      email: `demo@${role}.com`
    };
    login(demoUser);
    navigate(role === "organizer" ? "/organizer" : "/");
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(""); // Clear error on input change
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Login failed. Please check your credentials.");
        return;
      }

      // Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Update context
      login(data.user);

      // Show success toast
      addToast("Welcome back! Login successful.", "success");

      // Redirect based on role
      navigate(data.user.role === "organizer" ? "/organizer" : "/");

    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-700 p-8 space-y-8 transition-all duration-500 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]">

        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            <span className="text-mint-400">EVENT</span> HUB
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back! Please sign in.</p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
              <Mail size={20} />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 outline-none focus:ring-2 focus:ring-mint-200 dark:focus:ring-mint-800 transition text-gray-900 dark:text-white"
              required
              disabled={loading}
            />
          </div>

          {/* PASSWORD */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
              <Lock size={20} />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 outline-none focus:ring-2 focus:ring-mint-200 dark:focus:ring-mint-800 transition text-gray-900 dark:text-white"
              required
              disabled={loading}
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              className="text-sm text-mint-600 dark:text-mint-400 hover:text-mint-700 dark:hover:text-mint-300 transition"
              onClick={() => addToast("Password reset feature coming soon!", "info")}
            >
              Forgot password?
            </button>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl flex justify-center items-center gap-2 hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                <LogIn size={18} /> Sign In
              </>
            )}
          </button>
        </form>

        {/* DEMO SECTION */}
        <div className="flex gap-4">
          <button
            onClick={() => handleDemoLogin("user")}
            className="flex-1 py-3 bg-mint-100 dark:bg-mint-900/20 text-mint-800 dark:text-mint-400 font-bold rounded-2xl hover:bg-mint-200 dark:hover:bg-mint-900/30 transition"
          >
            User Demo
          </button>

          <button
            onClick={() => handleDemoLogin("organizer")}
            className="flex-1 py-3 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 font-bold rounded-2xl hover:bg-blue-200 dark:hover:bg-blue-900/30 transition"
          >
            Org Demo
          </button>
        </div>

        {/* REGISTER */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-mint-600 dark:text-mint-400 font-bold hover:text-mint-700 dark:hover:text-mint-300 transition"
            >
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}