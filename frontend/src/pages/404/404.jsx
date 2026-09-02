import { Link } from "react-router";
import { ArrowLeft, Home, Compass } from "lucide-react";

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/60">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-5 text-3xl font-black shadow-inner">
          404
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight mb-2">
          Page Lost in Transit
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          The page you are looking for might have been moved, removed, or doesn't exist on campus.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-sm font-semibold hover:opacity-95 transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
          >
            <Home size={16} />
            <span>Go to Dashboard</span>
          </Link>
          <Link
            to="/browseitems"
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl text-sm font-semibold transition flex items-center justify-center gap-2"
          >
            <Compass size={16} />
            <span>Browse Items</span>
          </Link>
        </div>
      </div>
    </div>
  );
}