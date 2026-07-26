import {
  Bell,
  ChevronDown,
  LogOut,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="hidden max-w-md flex-1 md:block">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              placeholder="Search interviews..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
          >
            <Bell size={18} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <div className="hidden h-8 w-px bg-slate-200 sm:block" />

          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-900">
              {user?.name || "User"}
            </p>

            <p className="text-xs text-slate-500">
              {user?.email || ""}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 md:flex"
          >
            <LogOut size={16} />
            Logout
          </button>

          <button
            type="button"
            className="text-slate-500 md:hidden"
          >
            <ChevronDown size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;