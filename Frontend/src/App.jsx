import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import OrgSidebar from "./components/OrgSidebar";
import Footer from "./components/Footer";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/user/Home";
import EventDetails from "./pages/user/EventDetails";
import MyTickets from "./pages/user/MyTickets";
import Dashboard from "./pages/organizer/Dashboard";
import CreateEvent from "./pages/organizer/CreateEvent";
import ManageEvents from "./pages/organizer/ManageEvents";

// A simple About page placeholder
const About = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About Event Hub</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Connecting people through amazing experiences
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">For Event Attendees</h3>
          <ul className="space-y-3 text-gray-600 dark:text-gray-300">
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-mint-500 rounded-full"></div>
              Discover amazing events in your area
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-mint-500 rounded-full"></div>
              Book tickets securely and instantly
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-mint-500 rounded-full"></div>
              Manage your tickets in one place
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">For Event Organizers</h3>
          <ul className="space-y-3 text-gray-600 dark:text-gray-300">
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Create and manage events easily
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Reach a wider audience
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Track attendance and engagement
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Ready to get started? Join thousands of users discovering and creating events.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/register"
            className="px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-600 transition"
          >
            Get Started
          </a>
          <a
            href="/"
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Browse Events
          </a>
        </div>
      </div>
    </div>
  </div>
);

const OrgLayout = ({ children }) => (
  <div className="flex bg-gray-50 dark:bg-gray-900">
    <OrgSidebar />
    <main className="flex-1 bg-gray-50 dark:bg-gray-900">{children}</main>
  </div>
);

const AppRoutes = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-mint-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Show Navbar on all pages EXCEPT login/register */}
      <Routes>
        <Route path="/login" element={null} />
        <Route path="/register" element={null} />
        <Route path="*" element={<Navbar />} />
      </Routes>

      <div className="flex-1 bg-white dark:bg-gray-900">
        <Routes>
          {/* Public Routes (Anyone can see these) */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/event/:id" element={<EventDetails />} />

          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              !user ? (
                <Login />
              ) : (
                <Navigate to={user.role === "organizer" ? "/organizer" : "/"} />
              )
            }
          />
          <Route
            path="/register"
            element={
              !user ? (
                <Register />
              ) : (
                <Navigate to={user.role === "organizer" ? "/organizer" : "/"} />
              )
            }
          />

          {/* Protected User Route */}
          <Route
            path="/my-tickets"
            element={
              user?.role === "user" ? <MyTickets /> : <Navigate to="/login" />
            }
          />

          {/* Protected Organizer Routes */}
          <Route
            path="/organizer"
            element={
              user?.role === "organizer" ? (
                <OrgLayout>
                  <Dashboard />
                </OrgLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/organizer/create"
            element={
              user?.role === "organizer" ? (
                <OrgLayout>
                  <CreateEvent />
                </OrgLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/organizer/manage"
            element={
              user?.role === "organizer" ? (
                <OrgLayout>
                  <ManageEvents />
                </OrgLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>

      {/* Footer - show on all pages except login/register */}
      <Routes>
        <Route path="/login" element={null} />
        <Route path="/register" element={null} />
        <Route path="*" element={<Footer />} />
      </Routes>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <Router>
            <AppRoutes />
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
