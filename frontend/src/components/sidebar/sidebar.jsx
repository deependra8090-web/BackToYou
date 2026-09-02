import { Link, useNavigate, useLocation } from "react-router";
import { LayoutDashboard, PlusCircle, Package,
         Compass, Sparkles, FileText, User, LogOut, MessageCircle, Shield } from "lucide-react";
import Cookies from "js-cookie";

const BackToYouLogo = () => (
  <svg width="32" height="32" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="13" fill="rgba(255,255,255,0.2)" />
    <path d="M9 14 C9 10.5 11.5 8 15 8 C18.5 8 21 10.5 21 14" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M6.5 11.5 L9 14 L11.5 11.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="14" cy="19" r="2.5" fill="white" />
  </svg>
);

const menuItems = [
  { name: "Dashboard",       path: "/dashboard",  icon: LayoutDashboard },
  { name: "Report Item",     path: "/lostitems",  icon: PlusCircle      },
  { name: "My Items",        path: "/founditems", icon: Package         },
  { name: "Browse Registry", path: "/browseitems",icon: Compass         },
  { name: "AI Matches",      path: "/mymatches",  icon: Sparkles        },
  { name: "My Claims",       path: "/myclaims",   icon: FileText        },
  { name: "Messages",        path: "/chat",       icon: MessageCircle   },
  { name: "My Profile",      path: "/profile",    icon: User            },
];

const Sidebar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();

  const cookieUser = JSON.parse(Cookies.get("user") || "{}");
  const isAdmin = cookieUser.role === "admin" || cookieUser.role === "superadmin";

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-gradient-to-b from-indigo-700 via-indigo-800 to-purple-800 text-white hidden md:flex flex-col shadow-xl shrink-0">

      {/* Logo */}
      <Link to="/dashboard" className="p-6 border-b border-white/15 flex items-center gap-3 hover:opacity-90 transition">
        <BackToYouLogo />
        <div>
          <span className="font-black text-xl text-white tracking-tight block leading-tight">BackToYou</span>
          <span className="text-indigo-200 text-xs font-medium">Campus Lost &amp; Found</span>
        </div>
      </Link>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon   = item.icon;
          const active = isActive(item.path);

          return (
            <Link to={item.path} key={item.path}>
              <div
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition text-sm font-semibold ${
                  active
                    ? "bg-white text-indigo-700 shadow-md"
                    : "hover:bg-white/10 text-white/80 hover:text-white"
                }`}
              >
                <Icon size={18} className={active ? "text-indigo-600" : "text-indigo-200"} />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}

        {isAdmin && (
          <Link to="/admin">
            <div
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition text-sm font-semibold mt-4 border border-indigo-400/30 ${
                location.pathname.startsWith("/admin")
                  ? "bg-amber-400 text-gray-900 shadow-md"
                  : "bg-indigo-900/60 text-amber-300 hover:bg-indigo-900"
              }`}
            >
              <Shield size={18} />
              <span>Admin Portal</span>
            </div>
          </Link>
        )}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/15">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-red-500/20 text-white/80 hover:text-red-200 transition text-sm font-semibold"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;