import { Calendar, MapPin, Ticket, Users } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/useToastHook";
import { useEffect, useState } from "react";
import API from "../../api";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [event, setEvent] = useState(null);

  // 🔥 FETCH EVENT FROM BACKEND
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API}/events/${id}`);
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.log("Error fetching event:", err);
      }
    };

    fetchEvent();
  }, [id]);

  // 🔄 LOADING STATE
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading event details...</p>
        </div>
      </div>
    );
  }

  // 🎟️ BOOK FUNCTION
  const handleBook = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role === "organizer") {
      addToast("Organizers cannot book tickets.", "warning");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      addToast("Please login first", "error");
      return;
    }

    try {
      const res = await fetch(`${API}/bookings/${id}`, {
        method: "POST",
        headers: {
          "Authorization": token,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        addToast(data.msg || "Booking failed", "error");
        return;
      }

      addToast("Ticket booked successfully!", "success");
      navigate("/my-tickets");
    } catch (err) {
      console.error(err);
      addToast("Network error. Please try again.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow overflow-hidden border border-gray-100 dark:border-gray-700">

          {/* IMAGE + TITLE */}
          <div className="h-64 sm:h-96 w-full relative">
            <img
              src={event.image || "https://via.placeholder.com/800"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <h1 className="absolute bottom-6 left-6 text-3xl font-bold text-white">
              {event.title}
            </h1>
          </div>

          <div className="p-6 flex flex-col md:flex-row gap-6">

            {/* LEFT SIDE */}
            <div className="flex-1 space-y-6">
              <div className="flex gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Calendar size={18} /> {event.date}
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <MapPin size={18} /> {event.location}
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300">
                {event.description || "No description available"}
              </p>
            </div>

            {/* RIGHT BOX */}
            <div className="w-full md:w-72 bg-gray-50 dark:bg-gray-700 p-5 rounded-2xl space-y-4">

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{event.price || "Free"}
              </h2>

              {event.attendees && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Users size={18} /> {event.attendees} Registered
                </div>
              )}

              <button
                onClick={handleBook}
                className="w-full py-3 bg-black dark:bg-gray-900 text-white rounded-xl hover:bg-gray-800 dark:hover:bg-gray-700 transition"
              >
                <Ticket size={18} className="inline mr-2" />
                Book Now
              </button>

              {!user && (
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                  Login required to book
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}