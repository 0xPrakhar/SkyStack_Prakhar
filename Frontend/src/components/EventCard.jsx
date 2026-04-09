import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function EventCard({ event }) {
  return (
    <Link to={`/event/${event._id}`} className="block group">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:shadow-[0_20px_60px_rgba(15,23,42,0.25)] border border-slate-200 dark:border-slate-800 overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition duration-300">
        <div className="relative h-44 overflow-hidden bg-slate-200 dark:bg-slate-800">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-500 dark:text-slate-400">
              Event Image
            </div>
          )}

          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
            <span className="rounded-full bg-white/90 dark:bg-slate-900/90 text-xs font-semibold text-slate-700 dark:text-slate-100 px-3 py-1">
              {event.price ? `₹${event.price}` : "Free"}
            </span>
            <span className="rounded-full bg-mint-500 text-white text-xs font-semibold px-3 py-1">
              Book now
            </span>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-mint-600 transition">
            {event.title}
          </h3>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300 line-clamp-2">
            {event.description}
          </p>
          <div className="grid grid-cols-2 gap-2 pt-2 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
