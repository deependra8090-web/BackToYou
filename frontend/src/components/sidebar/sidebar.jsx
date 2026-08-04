import React from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { LayoutDashboard, Search, Package,
         Compass, Link as LinkIcon, FileText, User, LogOut, MessageCircle } from "lucide-react";
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
  { name: "Lost/Found Items", path: "/lostitems",  icon: Search          },
  { name: "Found Items",      path: "/founditems", icon: Package         },
  { name: "Browse Items",     path: "/browseitems",icon: Compass         },
  { name: "My Matches",       path: "/mymatches",  icon: LinkIcon        },
  { name: "My Claims",        path: "/myclaims",   icon: FileText        },
  { name: "Chat",             path: "/chat",       icon: MessageCircle   },
  { name: "Profile",          path: "/profile",    icon: User            },
];

const Sidebar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-gradient-to-b from-indigo-700 to-purple-700 text-white hidden md:flex flex-col shadow-xl shrink-0">

      {/* Logo */}
      <div className="p-6 border-b border-white/20 flex items-center gap-3">
        <BackToYouLogo />
        <div>
          <span className="font-black text-xl text-white tracking-tight block leading-tight">BackToYou</span>
          <span className="text-white/50 text-xs">Lost &amp; Found</span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon   = item.icon;
          const active = isActive(item.path);

          return (
            <Link to={item.path} key={item.path}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition text-sm font-medium ${
                  active
                    ? "bg-white/25 text-white shadow-sm"
                    : "hover:bg-white/15 text-white/80"
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/15 text-white/80 transition text-sm font-medium"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;