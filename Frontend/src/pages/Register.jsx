import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../context/useToastHook";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import API from "../api";

export default function Register() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Registration failed. Please try again.");
        return;
      }

      setSuccess("Account created successfully! Redirecting to login...");

      // Show success toast
      addToast("Account created successfully! Please log in.", "success");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      console.error("Registration error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-gray-700 p-8 space-y-8 transition-all duration-500 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]">

        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Create Account
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Join Event Hub today and get started.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleRegister}>
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400 text-sm">
              {success}
            </div>
          )}

          {/* Role Toggle */}
          <div className="bg-gray-100 dark:bg-gray-700 p-1.5 rounded-2xl flex relative overflow-hidden">
            <div
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white dark:bg-gray-600 rounded-xl shadow-sm transition-all duration-300 ${
                formData.role === "user" ? "left-1.5" : "left-[calc(50%+3px)]"
              }`}
            ></div>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "user" })}
              className={`flex-1 py-3 text-sm font-bold z-10 ${
                formData.role === "user" ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
              }`}
              disabled={loading}
            >
              Attend Events
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: "organizer" })}
              className={`flex-1 py-3 text-sm font-bold z-10 ${
                formData.role === "organizer" ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
              }`}
              disabled={loading}
            >
              Organize Events
            </button>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            {/* NAME */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                <User size={20} />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 outline-none focus:ring-2 focus:ring-mint-200 dark:focus:ring-mint-800 transition text-gray-900 dark:text-white"
                required
                disabled={loading}
              />
            </div>

            {/* EMAIL */}
            <div className="relative">
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
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                <Lock size={20} />
              </div>
              <input
                type="password"
                name="password"
                placeholder="Password (min 6 characters)"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 outline-none focus:ring-2 focus:ring-mint-200 dark:focus:ring-mint-800 transition text-gray-900 dark:text-white"
                required
                disabled={loading}
                minLength={6}
              />
            </div>
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
                Creating Account...
              </>
            ) : (
              `Create ${formData.role === "organizer" ? "Organizer" : "User"} Account`
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-mint-600 dark:text-mint-400 font-bold hover:text-mint-700 dark:hover:text-mint-300 transition">
              Log in here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}