import { Users, Ticket, Calendar, TrendingUp, Plus, BarChart3, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../context/useToastHook";
import API from "../../api";
import LoadingSpinner from "../../components/LoadingSpinner";
import QRScanner from "../../components/QRScanner";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalBookings: 0,
    totalCheckIns: 0,
    upcomingEvents: 0,
    revenueGenerated: 0
  });
  const [selectedEventForScan, setSelectedEventForScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          addToast("Please login first", "error");
          return;
        }

        // Fetch all events (we'll filter client-side for demo)
        const eventsRes = await fetch(`${API}/events`, {
          headers: {
            "Authorization": token,
          },
        });

        if (!eventsRes.ok) {
          throw new Error("Failed to fetch events");
        }

        const eventsData = await eventsRes.json();
        setEvents(eventsData);

        // Calculate stats
        const now = new Date();
        const activeEvents = eventsData.filter(event => new Date(event.date) >= now).length;
        const upcomingEvents = eventsData.filter(event => {
          const eventDate = new Date(event.date);
          const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          return eventDate >= now && eventDate <= nextWeek;
        }).length;

        // For demo purposes, simulate bookings
        const simulatedBookings = eventsData.length * Math.floor(Math.random() * 50) + 10;
        const simulatedCheckIns = Math.floor(simulatedBookings * 0.75);
        const simulatedRevenue = simulatedBookings * (Math.random() * 500 + 100);

        setStats({
          totalEvents: eventsData.length,
          activeEvents,
          totalBookings: simulatedBookings,
          totalCheckIns: simulatedCheckIns,
          upcomingEvents,
          revenueGenerated: simulatedRevenue
        });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        addToast("Failed to load dashboard data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [addToast]);

  const statCards = [
    {
      title: "Total Events",
      value: stats.totalEvents,
      icon: Calendar,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/20",
      darkText: "dark:text-blue-400"
    },
    {
      title: "Active Events",
      value: stats.activeEvents,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/20",
      darkText: "dark:text-green-400"
    },
    {
      title: "Total Registrations",
      value: stats.totalBookings,
      icon: Ticket,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/20",
      darkText: "dark:text-purple-400"
    },
    {
      title: "Check-ins",
      value: stats.totalCheckIns,
      icon: Users,
      color: "text-mint-600",
      bg: "bg-mint-100 dark:bg-mint-900/20",
      darkText: "dark:text-mint-400"
    },
    {
      title: "Revenue Generated",
      value: `₹${Math.round(stats.revenueGenerated).toLocaleString()}`,
      icon: BarChart3,
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/20",
      darkText: "dark:text-orange-400"
    },
    {
      title: "Attendance Rate",
      value: stats.totalBookings > 0 ? `${Math.round((stats.totalCheckIns / stats.totalBookings) * 100)}%` : "N/A",
      icon: TrendingUp,
      color: "text-pink-600",
      bg: "bg-pink-100 dark:bg-pink-900/20",
      darkText: "dark:text-pink-400"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="text-center space-y-4">
            <LoadingSpinner size={48} />
            <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className="flex-1 p-8 w-full">
        <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Monitor your events and attendees
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setSelectedEventForScan(true)}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition"
          >
            <QrCode size={20} />
            QR Scanner
          </button>
          <Link
            to="/organizer/create"
            className="bg-mint-600 hover:bg-mint-700 dark:bg-mint-700 dark:hover:bg-mint-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition"
          >
            <Plus size={20} />
            Create Event
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${stat.bg} shrink-0`}>
                <stat.icon size={24} className={stat.color} />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-4">{stat.title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
      {/* Recent Events */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Events</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Your latest events and their status</p>
          </div>
          <Link
            to="/organizer/manage"
            className="text-mint-600 hover:text-mint-700 dark:text-mint-400 dark:hover:text-mint-300 font-medium"
          >
            View all →
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">No events created yet</p>
            <Link
              to="/organizer/create"
              className="bg-mint-600 hover:bg-mint-700 dark:bg-mint-700 dark:hover:bg-mint-600 text-white px-6 py-2 rounded-lg font-semibold inline-flex items-center gap-2 transition"
            >
              <Plus size={16} />
              Create your first event
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {events.slice(0, 5).map((event) => {
              const isActive = new Date(event.date) >= new Date();
              return (
                <div
                  key={event._id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition group"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-mint-600 dark:group-hover:text-mint-400 transition">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {event.date} • {event.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="block text-xs text-gray-500 dark:text-gray-400 font-medium">Status</span>
                      <span className={`text-sm font-bold ${isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                        {isActive ? '● Active' : '● Past'}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedEventForScan(event._id)}
                      className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition text-blue-600 dark:text-blue-400"
                      title="Check-in attendees"
                    >
                      <QrCode size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-2">💡 Tip: Use QR Scanner</h3>
          <p className="text-sm text-blue-100">
            Use the QR Scanner to check in attendees in real-time. Faster than manual lists!
          </p>
        </div>
        <div className="bg-linear-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-2">📊 Boost Attendance</h3>
          <p className="text-sm text-green-100">
            Create engaging event descriptions and use categories to attract more attendees.
          </p>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {selectedEventForScan && (
        <QRScanner
          eventId={selectedEventForScan === true ? null : selectedEventForScan}
          onClose={() => setSelectedEventForScan(null)}
        />
      )}
        </div>
      </div>
    </div>
  );
}
