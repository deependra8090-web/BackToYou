import { useState } from "react";
import { Link } from "react-router";
import FloatingLines from "../../components/floatingLines/FloatingLines.jsx";

const BackToYouLogo = () => (
  <svg width="32" height="32" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="13" fill="rgba(255,255,255,0.15)" />
    <path d="M9 14 C9 10.5 11.5 8 15 8 C18.5 8 21 10.5 21 14" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
    <path d="M6.5 11.5 L9 14 L11.5 11.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="14" cy="19" r="2.5" fill="white" />
  </svg>
);

const MobileMenu = ({ open, onClose }) => (
  <div
    className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
      open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    }`}
  >
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
    <div
      className={`absolute top-0 right-0 h-full w-64 bg-indigo-900/95 border-l border-white/10 p-8 flex flex-col gap-5 transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <button onClick={onClose} className="self-end text-white/50 hover:text-white text-xl">✕</button>
      {["Home", "About", "Contact"].map((item) => (
        <Link
          key={item}
          to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
          onClick={onClose}
          className="text-white/70 hover:text-white text-base font-medium transition"
        >
          {item}
        </Link>
      ))}
      <div className="mt-auto flex flex-col gap-3">
        <Link to="/login" onClick={onClose}>
          <button className="w-full py-2.5 border border-white/30 rounded-xl text-white text-sm hover:bg-white/10 transition">
            Login
          </button>
        </Link>
        <Link to="/signup" onClick={onClose}>
          <button className="w-full py-2.5 bg-white text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-100 transition">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  </div>
);

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="h-screen w-screen overflow-hidden flex flex-col relative"
      style={{
        background: "linear-gradient(135deg, #312e81 0%, #4f46e5 40%, #7c3aed 100%)",
      }}
    >
      {/* FloatingLines */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <FloatingLines
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={8}
          lineDistance={8}
          bendRadius={8}
          bendStrength={-2}
          interactive
          parallax={true}
          animationSpeed={1}
          gradientStart="#a78bfa"
          gradientMid="#818cf8"
          gradientEnd="#c4b5fd"
        />
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 60% 40%, rgba(99,102,241,0.25) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">

        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 md:px-10 py-4 shrink-0">
          <div className="flex items-center gap-2">
            <BackToYouLogo />
            <span className="font-black text-xl text-white tracking-tight">BackToYou</span>
          </div>

          <div className="hidden md:flex items-center gap-7">
            {["Home", "About", "Contact"].map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="text-white/70 hover:text-white text-sm font-medium transition"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <button className="px-5 py-2 text-sm font-medium text-white border border-white/30 rounded-xl hover:bg-white/10 transition">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-5 py-2 text-sm font-bold bg-white text-indigo-700 rounded-xl hover:bg-indigo-100 transition shadow-lg shadow-indigo-900/30">
                Sign Up
              </button>
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden flex flex-col gap-1.5 p-2"
          >
            <span className="w-6 h-0.5 bg-white rounded" />
            <span className="w-4 h-0.5 bg-white rounded" />
            <span className="w-6 h-0.5 bg-white rounded" />
          </button>
        </nav>

        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

        {/* Hero */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-8">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/25 bg-white/10 text-white/80 text-xs font-semibold tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
            AI-Powered Lost &amp; Found
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight text-white mb-4 max-w-3xl">
            Lost Something?
            <br />
            <span className="text-indigo-200">We'll Get It Back.</span>
          </h1>

          <p className="text-white/60 text-sm md:text-base max-w-lg leading-relaxed mb-8">
            BackToYou uses AI matching, real-time chat, email alerts, and location maps
            to reconnect you with your lost items — fast.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <Link to="/login">
              <button className="px-7 py-3 bg-white text-indigo-700 rounded-2xl font-bold text-sm hover:bg-indigo-100 transition shadow-xl shadow-indigo-900/30 hover:-translate-y-0.5 duration-200">
                Report Lost Item
              </button>
            </Link>
            <Link to="/login">
              <button className="px-7 py-3 border border-white/30 rounded-2xl font-bold text-sm text-white hover:bg-white/10 hover:-translate-y-0.5 transition duration-200">
                I Found Something
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl">
            {[
              { emoji: "🤖", title: "AI Matching",     desc: "Smart description & image match" },
              { emoji: "💬", title: "Real-time Chat",  desc: "Talk to finder instantly"        },
              { emoji: "📧", title: "Email Alerts",    desc: "Get notified immediately"        },
              { emoji: "🗺️", title: "Location Maps",   desc: "Find where items were found"     },
            ].map(({ emoji, title, desc }) => (
              <div
                key={title}
                className="bg-white/10 border border-white/15 backdrop-blur-sm rounded-2xl px-4 py-3 text-left hover:bg-white/15 transition"
              >
                <span className="text-xl">{emoji}</span>
                <p className="text-white font-bold text-sm mt-1">{title}</p>
                <p className="text-white/50 text-xs mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-3 text-white/30 text-xs shrink-0">
          © 2026 BackToYou — Lost &amp; Found, Smarter.
        </footer>

      </div>
    </div>
  );
};

export default Home;