import { LayoutDashboard, PlusCircle, List, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OrgSidebar() {
  const { logout } = useAuth();

  const links = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/organizer" },
    { name: "Create Event", icon: PlusCircle, path: "/organizer/create" },
    { name: "Manage Events", icon: List, path: "/organizer/manage" },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 min-h-[calc(100vh-73px)] p-6 flex flex-col gap-2">
      <div className="mb-8 text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
        Organizer Menu
      </div>
      {links.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
          end={link.path === "/organizer"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
              isActive
                ? "bg-mint-100 dark:bg-mint-900/30 text-mint-800 dark:text-mint-300"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`
          }
        >
          <link.icon size={20} />
          {link.name}
        </NavLink>
      ))}
      <div className="mt-auto">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl w-full transition font-medium"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}
