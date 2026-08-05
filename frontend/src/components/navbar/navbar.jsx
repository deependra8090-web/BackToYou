import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Menu, X, LayoutDashboard, Search, Package,
         Compass, Link as LinkIcon, FileText, User, LogOut, MessageCircle } from "lucide-react";
import Cookies from "js-cookie";

const BackToYouLogo = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="13" fill="url(#lg)" />
    <path d="M9 14 C9 10.5 11.5 8 15 8 C18.5 8 21 10.5 21 14" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M6.5 11.5 L9 14 L11.5 11.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="14" cy="19" r="2.5" fill="white" />
    <defs>
      <linearGradient id="lg" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#818cf8" />
        <stop offset="1" stopColor="#a78bfa" />
      </linearGradient>
    </defs>
  </svg>
);

const menuItems = [
  { name: "Dashboard",      path: "/dashboard",  icon: LayoutDashboard },
  { name: "Lost/Found",     path: "/lostitems",  icon: Search          },
  { name: "Found Items",    path: "/founditems", icon: Package         },
  { name: "Browse Items",   path: "/browseitems",icon: Compass         },
  { name: "My Matches",     path: "/mymatches",  icon: LinkIcon        },
  { name: "My Claims",      path: "/myclaims",   icon: FileText        },
  { name: "Chat",           path: "/chat",       icon: MessageCircle   },
  { name: "Profile",        path: "/profile",    icon: User            },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate        = useNavigate();
  const location        = useLocation();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ── Top bar — visible only on mobile (md:hidden) ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-indigo-700 to-purple-700 text-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2 text-lg font-bold">
            <BackToYouLogo />
            <span className="font-black text-white tracking-tight">BackToYou</span>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="p-2 rounded-lg hover:bg-white/20 transition"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* ── Dropdown menu ── */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="px-4 pb-4 space-y-1 border-t border-white/20 pt-3">
            {menuItems.map((item) => {
              const Icon    = item.icon;
              const active  = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium ${
                    active
                      ? "bg-white/25 text-white"
                      : "hover:bg-white/15 text-white/80"
                  }`}
                >
                  <Icon size={17} />
                  {item.name}
                </Link>
              );
            })}

            {/* Logout */}
            <button
              onClick={() => { setOpen(false); handleLogout(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/15 text-white/80 transition text-sm font-medium"
            >
              <LogOut size={17} />
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Spacer so page content doesn't hide under fixed navbar on mobile */}
      <div className="md:hidden h-[52px]" />
    </>
  );
};

export default Navbar;
