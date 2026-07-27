import {
  BarChart3,
  Bookmark,
  BrainCircuit,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Settings,
  Sparkles,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { useAuth } from "../../context/AuthContext";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Interviews",
    path: "/interviews",
    icon: MessageSquareText,
  },
  {
    label: "Resume Interview",
    path: "/resume-interview",
    icon: FileText,
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Practice",
    path: "/practice",
    icon: BrainCircuit,
  },
  {
    label: "Bookmarks",
    path: "/bookmarks",
    icon: Bookmark,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.aside
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-white/10 bg-slate-950 text-white lg:flex"
    >
      <div className="flex items-center gap-3 px-5 py-6">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-600/30">
          <Sparkles size={22} />
        </span>

        <div>
          <h1 className="text-xl font-black tracking-tight">
            PrexInter
          </h1>

          <p className="text-xs text-slate-400">
            AI Interview Coach
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-3">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                      isActive
                        ? "bg-white/15"
                        : "bg-white/5 group-hover:bg-white/10"
                    }`}
                  >
                    <Icon size={18} />
                  </span>

                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="mx-4 mb-4 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 p-4">
        <p className="text-sm font-bold">
          Upgrade your practice
        </p>

        <p className="mt-2 text-xs leading-5 text-indigo-100">
          Unlock advanced analytics and unlimited resume interviews.
        </p>

        <button
          type="button"
          className="mt-4 w-full rounded-xl bg-white px-3 py-2 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
        >
          View plans
        </button>
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-2xl bg-white/5 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {user?.name || "User"}
              </p>

              <p className="truncate text-xs text-slate-400">
                {user?.email || ""}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </motion.aside>
  );
}

export default Sidebar;