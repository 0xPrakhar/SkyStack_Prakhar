import { useEffect, useState } from "react";
import EventCard from "../../components/EventCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Filter, Search, Calendar, MapPin } from "lucide-react";
import API from "../../api";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API}/events`);
        const data = await res.json();
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

    // Text search
    if (search) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Location filter
    if (locationFilter) {
      filtered = filtered.filter(event =>
        event.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date).toISOString().split('T')[0];
        return eventDate === dateFilter;
      });
    }

    setFilteredEvents(filtered);
  }, [search, locationFilter, dateFilter, events]);

  const clearFilters = () => {
    setSearch("");
    setLocationFilter("");
    setDateFilter("");
  };

  const getUniqueLocations = () => {
    const locations = [...new Set(events.map(event => event.location))];
    return locations.sort();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <LoadingSpinner size={48} />
          <p className="text-gray-600 dark:text-gray-400">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-10 lg:py-12">
        <section className="mb-12 rounded-4xl border border-slate-200 bg-linear-to-br from-mint-500/10 via-white to-slate-100 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 p-8 shadow-[0_35px_80px_rgba(15,23,42,0.08)] overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-mint-500/10 text-mint-700 dark:bg-mint-400/10 dark:text-mint-300 px-4 py-2 text-sm font-semibold">
                <span className="h-2.5 w-2.5 rounded-full bg-mint-500 dark:bg-mint-300"></span>
                Discover top events in your city
              </span>
              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                Experience live events with ease.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                Browse curated events, book tickets instantly, and manage your bookings from one polished dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/register" className="inline-flex items-center justify-center rounded-full bg-mint-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-mint-500/20 hover:bg-mint-700 transition">
                  Get Started
                </a>
                <a href="/about" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
                  Learn More
                </a>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Trusted by</p>
                <p className="mt-4 text-4xl font-bold text-slate-950 dark:text-white">10k+</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Event-goers enjoy secure booking</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Organizers</p>
                <p className="mt-4 text-4xl font-bold text-slate-950 dark:text-white">250+</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Events created with confidence</p>
              </div>
            </div>
          </div>
        </section>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-950 dark:text-white mb-4">Discover Amazing Events</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
            Find and book tickets for the best events in your area.
          </p>

          {/* Search and Filter Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events by title or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-200 dark:focus:ring-mint-800 focus:border-mint-300 transition"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                <Filter size={20} />
                Filters
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                {/* Location Filter */}
                <div className="relative">
                  <MapPin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-200 dark:focus:ring-mint-800 focus:border-mint-300 transition"
                  >
                    <option value="">All Locations</option>
                    {getUniqueLocations().map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                {/* Date Filter */}
                <div className="relative">
                  <Calendar size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-200 dark:focus:ring-mint-800 focus:border-mint-300 transition"
                  />
                </div>

                {/* Clear Filters */}
                <div className="flex items-center">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredEvents.length} of {events.length} events
            {(search || locationFilter || dateFilter) && (
              <span className="ml-2 text-mint-600 dark:text-mint-400">
                (filtered)
              </span>
            )}
          </p>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {search || locationFilter || dateFilter ? "No events found" : "No events available"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {search || locationFilter || dateFilter
                  ? "Try adjusting your search terms or filters."
                  : "Check back later for upcoming events."
                }
              </p>
              {(search || locationFilter || dateFilter) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-mint-100 dark:bg-mint-900/20 text-mint-700 dark:text-mint-400 rounded-lg hover:bg-mint-200 dark:hover:bg-mint-900/30 transition"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;