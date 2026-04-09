import { QrCode, Calendar, MapPin, Ticket, Eye, Download } from "lucide-react";
import { useEffect, useState } from "react";
import API from "../../api";
import LoadingSpinner from "../../components/LoadingSpinner";
import TicketDisplay from "../../components/TicketDisplay";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API}/tickets/my-tickets`, {
          headers: {
            "Authorization": token,
          },
        });
        const data = await res.json();
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <LoadingSpinner size={48} />
          <p className="text-gray-600 dark:text-gray-400">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Ticket size={32} className="text-mint-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">My Tickets</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and view your event tickets with QR codes
          </p>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Ticket className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No tickets yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Book your first event to get a ticket with QR code
              </p>
              <a
                href="/"
                className="inline-block px-6 py-3 bg-mint-600 text-white font-bold rounded-lg hover:bg-mint-700 transition"
              >
                Browse Events
              </a>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {/* Active Tickets */}
            {tickets.filter(t => t.status === "active").length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-1 h-6 bg-green-500 rounded"></span>
                  Upcoming Events
                </h2>
                {tickets
                  .filter(t => t.status === "active")
                  .map((ticket) => (
                    <TicketCard
                      key={ticket._id}
                      ticket={ticket}
                      onView={() => setSelectedTicket(ticket)}
                    />
                  ))
                }
              </div>
            )}

            {/* Used Tickets */}
            {tickets.filter(t => t.status === "used").length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-500 rounded"></span>
                  Attended
                </h2>
                {tickets
                  .filter(t => t.status === "used")
                  .map((ticket) => (
                    <TicketCard
                      key={ticket._id}
                      ticket={ticket}
                      onView={() => setSelectedTicket(ticket)}
                    />
                  ))
                }
              </div>
            )}

            {/* Cancelled Tickets */}
            {tickets.filter(t => t.status === "cancelled").length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-1 h-6 bg-gray-500 rounded"></span>
                  Cancelled
                </h2>
                {tickets
                  .filter(t => t.status === "cancelled")
                  .map((ticket) => (
                    <TicketCard
                      key={ticket._id}
                      ticket={ticket}
                      onView={() => setSelectedTicket(ticket)}
                    />
                  ))
                }
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ticket Display Modal */}
      {selectedTicket && (
        <TicketDisplay
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}

// Ticket Card Component
function TicketCard({ ticket, onView }) {
  const statusColor = {
    active: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    used: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    cancelled: "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800"
  };

  const statusBadgeColor = {
    active: "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300",
    used: "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300",
    cancelled: "bg-gray-100 dark:bg-gray-900/40 text-gray-800 dark:text-gray-300"
  };

  return (
    <div className={`${statusColor[ticket.status]} rounded-2xl border p-6 transition hover:shadow-lg`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        {/* Event Info */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {ticket.eventTitle}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadgeColor[ticket.status]}`}>
              {ticket.status.toUpperCase()}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              {ticket.eventDate}
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              {ticket.eventLocation}
            </div>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-500 font-mono">
            Ticket ID: <span className="font-bold">{ticket.ticketId}</span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onView()}
            className="flex items-center gap-2 px-4 py-2 bg-mint-600 dark:bg-mint-700 text-white font-bold rounded-lg hover:bg-mint-700 dark:hover:bg-mint-600 transition"
          >
            <Eye size={18} />
            View Ticket
          </button>
          <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <QrCode size={32} className="text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      </div>

      {ticket.checkedIn && (
        <div className="mt-4 pt-4 border-t border-current border-opacity-20">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            ✓ Checked in at {new Date(ticket.checkInTime).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
