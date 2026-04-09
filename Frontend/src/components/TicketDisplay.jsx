import { QRCodeSVG } from "qrcode.react";
import { Download, Share2, X } from "lucide-react";
import API from "../api";

export default function TicketDisplay({ ticket, onClose }) {

  const downloadTicket = () => {
    const element = document.getElementById("ticket-to-download");
    const canvas = element.querySelector("canvas");
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `Ticket-${ticket.ticketId}.png`;
    link.click();
  };

  const shareTicket = async () => {
    const text = `I'm attending ${ticket.eventTitle} on ${ticket.eventDate}! 🎉\n\nTicket ID: ${ticket.ticketId}`;
    
    if (navigator.share) {
      navigator.share({
        title: ticket.eventTitle,
        text: text
      });
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(text);
      alert("Ticket details copied to clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-6 space-y-4">
        
        {/* Close button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Ticket</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <X size={24} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Ticket */}
        <div
          id="ticket-to-download"
          className="bg-linear-to-br from-mint-400 to-blue-500 rounded-2xl p-6 text-white space-y-4 relative overflow-hidden"
        >
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-white/10 rounded-full"></div>

          {/* Dashed separator */}
          <div className="flex items-center gap-3 relative">
            <div className="flex-1 border-t-2 border-dashed border-white/40"></div>
          </div>

          {/* Ticket info */}
          <div className="space-y-3 relative z-10">
            {/* Event title */}
            <div>
              <p className="text-sm font-semibold text-white/80">EVENT</p>
              <p className="text-xl font-bold">{ticket.eventTitle}</p>
            </div>

            {/* User name */}
            <div>
              <p className="text-sm font-semibold text-white/80">ATTENDEE</p>
              <p className="text-lg font-bold">{ticket.userName}</p>
            </div>

            {/* Date and location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-white/80">DATE</p>
                <p className="font-semibold">{ticket.eventDate}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-white/80">LOCATION</p>
                <p className="font-semibold text-sm">{ticket.eventLocation}</p>
              </div>
            </div>

            {/* Ticket ID */}
            <div>
              <p className="text-xs font-semibold text-white/80">TICKET ID</p>
              <p className="font-mono text-sm font-bold">{ticket.ticketId}</p>
            </div>
          </div>

          {/* Dashed separator */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t-2 border-dashed border-white/40"></div>
          </div>

          {/* QR Code */}
          <div className="flex justify-center bg-white rounded-lg p-3">
            <QRCodeSVG
              value={ticket.ticketId}
              level="H"
              size={120}
              includeMargin={false}
            />
          </div>

          {/* Status */}
          <div className="text-center">
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${
              ticket.status === "active" ? "bg-green-500" :
              ticket.status === "used" ? "bg-blue-600" :
              "bg-red-500"
            }`}>
              {ticket.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={downloadTicket}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-mint-100 dark:bg-mint-900/20 text-mint-700 dark:text-mint-400 font-bold rounded-lg hover:bg-mint-200 dark:hover:bg-mint-900/30 transition"
          >
            <Download size={18} />
            Download
          </button>
          <button
            onClick={shareTicket}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-bold rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition"
          >
            <Share2 size={18} />
            Share
          </button>
        </div>

        {/* Info */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Present this QR code at the event entrance for check-in
        </p>
      </div>
    </div>
  );
}
