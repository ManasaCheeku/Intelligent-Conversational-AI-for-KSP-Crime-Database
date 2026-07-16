import {
  LayoutDashboard,
  FileText,
  Search,
  Map,
  Bot,
  BarChart3,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menus = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Crimes",
    icon: FileText,
    path: "/crimes",
  },
  {
    name: "Search",
    icon: Search,
    path: "/crimes/search",
  },
  {
    name: "Crime Map",
    icon: Map,
    path: "/crime-map",
  },
  {
    name: "AI Assistant",
    icon: Bot,
    path: "/ai",
  },
  {
    name: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

const Sidebar = () => {
  return (
    <aside className="w-72 min-h-screen bg-slate-950 border-r border-slate-800">
      <div className="h-16 flex items-center justify-center border-b border-slate-800">
        <h2 className="text-xl font-bold text-blue-500">
          KSP IntelliCrime
        </h2>
      </div>

      <nav className="p-4 space-y-2">
        {menus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            <menu.icon size={20} />
            {menu.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;