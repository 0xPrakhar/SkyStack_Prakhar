import { Bell, UserCircle, Ticket, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowMenu(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 py-4 px-6 md:px-10 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            <span className="text-mint-500">EVENT</span> HUB
          </Link>
          <div className="hidden md:flex gap-5 font-medium text-slate-600 dark:text-slate-300 text-sm">
            <Link to="/" className="rounded-full px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Home</Link>
            <Link to="/about" className="rounded-full px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition">About</Link>
            <Link to="/" className="rounded-full px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition">Browse</Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* If logged out, show Login/Register */}
          {!user ? (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-mint-600 dark:hover:text-mint-400 transition">Login</Link>
              <Link to="/register" className="text-sm font-bold bg-gray-900 dark:bg-gray-700 text-white px-5 py-2 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-600 transition">Register</Link>
            </div>
          ) : (
            /* If logged in, show Profile Menu */
            <>
              <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
                <Bell size={20} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full"></span>
              </button>
              
              <div className="relative">
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-xl transition"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <UserCircle size={28} className="text-gray-600 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.name}</span>
                </div>
                
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 py-2">
                    {user.role === 'organizer' && (
                      <Link to="/organizer" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition" onClick={() => setShowMenu(false)}>
                        Dashboard
                      </Link>
                    )}
                    {user.role === 'user' && (
                      <Link to="/my-tickets" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition" onClick={() => setShowMenu(false)}>
                        <Ticket size={16} /> My Tickets
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}