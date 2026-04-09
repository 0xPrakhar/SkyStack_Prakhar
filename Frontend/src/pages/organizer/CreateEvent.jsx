import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/useToastHook";
import API from "../../api";

export default function CreateEvent() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    price: "",
    capacity: "",
    description: "",
  });

  // 🔥 HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      addToast("Please login first", "error");
      return;
    }

    try {
      const res = await fetch(`${API}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        addToast(data.msg || "Failed to create event", "error");
        return;
      }

      addToast("Event created successfully!", "success");

      navigate("/");
      window.location.reload(); // quick hackathon refresh

    } catch (err) {
      console.log("Error:", err);
      addToast("Failed to create event. Please try again.", "error");
    }
  };

  return (
    <div className="p-8 w-full max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Event</h1>

      <form
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 space-y-6"
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">

          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Event Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-mint-200 dark:focus:ring-mint-800"
              placeholder="e.g. Summer Music Fest 2024"
              required
            />
          </div>

          {/* DATE + LOCATION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-mint-200 dark:focus:ring-mint-800"
            />

            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-mint-200 dark:focus:ring-mint-800"
              placeholder="Location"
            />
          </div>

          {/* PRICE + CAPACITY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-mint-200 dark:focus:ring-mint-800"
              placeholder="Price"
            />

            <input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-mint-200 dark:focus:ring-mint-800"
              placeholder="Capacity"
            />
          </div>

          {/* DESCRIPTION */}
          <textarea
            rows="4"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-mint-200 dark:focus:ring-mint-800"
            placeholder="Event Description"
          ></textarea>

        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-600 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-8 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-xl hover:bg-gray-800 dark:hover:bg-gray-600"
          >
            Publish Event
          </button>
        </div>
      </form>
    </div>
  );
}