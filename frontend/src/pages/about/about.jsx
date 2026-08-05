import { Link } from "react-router";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 text-white px-6 py-12">

      {/* Back link */}
      <div className="max-w-5xl mx-auto mb-6">
        <Link to="/" className="text-white/60 hover:text-white text-sm transition">← Back to Home</Link>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/25 bg-white/10 text-white/80 text-xs font-semibold tracking-widest uppercase mb-4">
          🔄 About BackToYou
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
          About <span className="text-indigo-200">BackToYou</span>
        </h1>
        <p className="text-white/80 text-lg">
          An AI-powered lost &amp; found platform designed to reconnect people with their
          belongings — quickly, securely, and intelligently.
        </p>
      </div>

      {/* Mission */}
      <div className="mt-16 max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">🎯 Our Mission</h2>
          <p className="text-white/80 leading-relaxed">
            Our mission is to make losing something as stress-free as possible. Using AI-powered
            description and image matching, real-time chat, email notifications, and interactive
            location maps, BackToYou brings the entire recovery process into one seamless platform.
          </p>
        </div>
        <div className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold mb-3">Why BackToYou?</h3>
          <ul className="space-y-2 text-white/80">
            <li>🤖 AI-powered description &amp; image matching</li>
            <li>💬 Real-time chat between finder and owner</li>
            <li>📧 Instant email notifications on matches</li>
            <li>🗺️ Interactive map to find item locations</li>
            <li>✅ Admin-verified claims for safety</li>
          </ul>
        </div>
      </div>

      {/* Features */}
      <div className="mt-20 max-w-6xl mx-auto grid md:grid-cols-4 gap-6">
        {[
          { emoji: "🤖", title: "AI Matching",      desc: "TF-IDF text similarity and Cloudinary image tag analysis match items intelligently." },
          { emoji: "💬", title: "Real-Time Chat",   desc: "Socket.io powered messaging — talk to the finder the moment a match is accepted." },
          { emoji: "📧", title: "Email Alerts",     desc: "Beautiful HTML email notifications when matches are found or claims are updated." },
          { emoji: "🗺️", title: "Location Maps",    desc: "Leaflet-powered interactive maps show where each item was lost or found." },
        ].map(({ emoji, title, desc }) => (
          <div key={title} className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-lg text-center hover:scale-105 transition">
            <div className="text-4xl mb-3">{emoji}</div>
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-white/80 text-sm">{desc}</p>
          </div>
        ))}
      </div>

      {/* Vision */}
      <div className="mt-20 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">🚀 Our Vision</h2>
        <p className="text-white/80 leading-relaxed">
          We envision a world where losing something is no longer stressful. With the power of
          AI and a caring community, BackToYou aims to make item recovery effortless — because
          everything deserves to find its way back.
        </p>
      </div>

      {/* Footer */}
      <div className="mt-20 text-center text-white/50 text-sm">
        © 2026 BackToYou — Lost &amp; Found, Smarter.
      </div>

    </div>
  );
};

export default About;