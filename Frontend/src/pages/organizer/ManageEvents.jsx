import { Edit, Trash2, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "../../context/useToastHook";
import API from "../../api";

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API}/events`);
        const data = await res.json();
        // Filter events created by current user (assuming token has user id, but for now show all)
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      addToast("Please login first", "error");
      return;
    }

    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`${API}/events/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": token,
        },
      });

      if (!res.ok) {
        addToast("Failed to delete event", "error");
        return;
      }

      setEvents(events.filter(event => event._id !== id));
      addToast("Event deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting event:", error);
      addToast("Failed to delete event. Please try again.", "error");
    }
  };

  if (loading) {
    return <h2 className="text-center mt-10 text-gray-900 dark:text-white">Loading events...</h2>;
  }

  return (
    <div className="p-8 w-full max-w-6xl space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Events</h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-100 dark:border-gray-600">
              <th className="p-4 font-medium">Event Name</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Location</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr
                key={event._id}
                className="border-b border-gray-50 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
              >
                <td className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400 text-xs">IMG</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">{event.title}</span>
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-300">{event.date}</td>
                <td className="p-4 text-gray-600 dark:text-gray-300">{event.location}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition">
                      <ExternalLink size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-mint-600 dark:hover:text-mint-400 hover:bg-mint-50 dark:hover:bg-mint-900/20 rounded-lg transition">
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
