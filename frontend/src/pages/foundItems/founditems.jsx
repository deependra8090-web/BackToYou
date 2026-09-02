import { useState, useMemo } from "react";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import { useGetMyItems } from "../../hooks/itemsHook/useGetMyItems.hook";
import { useNavigate, Link } from "react-router";
import Navbar from "../../components/navbar/navbar.jsx";
import { Package, PlusCircle, Search, Clock, CheckCircle, Ban, AlertCircle } from "lucide-react";

const CATEGORY_EMOJI = {
  wallet: "👛", phone: "📱", bag: "🎒",
  id: "💳", electronics: "💻", others: "📦",
};

const STATUS_STYLES = {
  pending:  { label: "Pending",  cls: "bg-amber-100 text-amber-700 border-amber-300" },
  approved: { label: "Approved", cls: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  rejected: { label: "Rejected", cls: "bg-red-100 text-red-700 border-red-300" },
  claimed:  { label: "Claimed",  cls: "bg-blue-100 text-blue-700 border-blue-300" },
  closed:   { label: "Closed",   cls: "bg-gray-100 text-gray-700 border-gray-300" },
};

// ─── Skeleton card ────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-sm border border-white/60 animate-pulse">
      <div className="w-full h-44 bg-gray-200" />
      <div className="p-5 space-y-2.5">
        <div className="h-5 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-10 bg-gray-200 rounded-xl mt-4" />
      </div>
    </div>
  );
}

// ─── Item card ────────────────────────────────────────────────────────
function ItemCard({ item, navigate }) {
  const [imgErr, setImgErr] = useState(false);
  const status  = STATUS_STYLES[item.status] ?? STATUS_STYLES.pending;
  const emoji   = CATEGORY_EMOJI[item.category] ?? "📦";
  const itemDate = item.date
    ? new Date(item.date).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      })
    : "—";

  const cleanImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `/${url.replace(/^\/+/, "").replace(/\\/g, "/")}`;
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-white/60 flex flex-col justify-between group">
      <div>
        <div className="relative overflow-hidden bg-gray-50 h-44">
          {item.imageURL && !imgErr ? (
            <img
              src={cleanImageUrl(item.imageURL)}
              alt={item.title}
              onError={() => setImgErr(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-6xl ${
              item.type === "lost"
                ? "bg-gradient-to-br from-red-50 to-rose-100"
                : "bg-gradient-to-br from-emerald-50 to-teal-100"
            }`}>
              {emoji}
            </div>
          )}

          {/* Type Badge */}
          <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full uppercase shadow-xs ${
            item.type === "lost"
              ? "bg-red-500 text-white"
              : "bg-emerald-600 text-white"
          }`}>
            {item.type}
          </span>

          {/* Status Badge */}
          <span className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full border shadow-xs ${status.cls}`}>
            {status.label}
          </span>
        </div>

        <div className="p-5 space-y-2">
          <div className="flex justify-between items-start gap-2">
            <h2 className="text-base font-bold text-gray-800 truncate">
              {item.title}
            </h2>
          </div>

          {item.description && (
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}

          <div className="pt-2 text-xs text-gray-400 space-y-1">
            <p className="flex items-center gap-1.5 truncate">
              <span>📍</span> <span className="text-gray-600 font-medium">{item.location || "Campus"}</span>
            </p>
            <p className="flex items-center gap-1.5">
              <span>🗓</span> <span>{itemDate}</span>
            </p>
          </div>

          {/* Keywords */}
          {Array.isArray(item.keywords) && item.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {item.keywords.slice(0, 3).map((kw) => (
                <span key={kw} className="text-[10px] font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  #{kw}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-5 pt-0">
        <button
          className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:opacity-95 text-xs font-semibold transition shadow-md shadow-indigo-100"
          onClick={() => navigate(`/items/${item._id}`)}
        >
          View Details &amp; Matches
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
const FoundItems = () => {
  const navigate = useNavigate();
  const [page, setPage]               = useState(1);
  const [typeTab, setTypeTab]         = useState("all"); // "all" | "lost" | "found"
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword]         = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter]     = useState("");

  const params = useMemo(() => ({
    page,
    limit:    9,
    order:    "desc",
    type:     typeTab === "all" ? undefined : typeTab,
    keyword:   keyword         || undefined,
    category:  categoryFilter  || undefined,
    status:    statusFilter    || undefined,
  }), [page, typeTab, keyword, categoryFilter, statusFilter]);

  const { data, isLoading, isError, isFetching, error } = useGetMyItems(params);

  const items      = Array.isArray(data?.data) ? data.data : [];
  const pagination = data?.pagination ?? {};

  const handleSearch = () => {
    setKeyword(searchInput.trim());
    setPage(1);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Navbar />
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 mt-14 md:mt-0">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Top Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2.5">
                <Package className="text-indigo-600" size={28} />
                <span>My Reported Items</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage all lost and found reports you've submitted to the campus registry.
              </p>
            </div>

            <Link
              to="/lostitems"
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-sm font-semibold hover:opacity-95 transition shadow-md shadow-indigo-200 flex items-center justify-center gap-2 shrink-0"
            >
              <PlusCircle size={18} />
              <span>Report New Item</span>
            </Link>
          </div>

          {/* ── Type Filter Tabs ── */}
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md p-1.5 rounded-2xl border border-white/60 w-fit">
            {[
              { id: "all",   label: "All My Reports" },
              { id: "lost",  label: "🔍 Lost Items"  },
              { id: "found", label: "📦 Found Items" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setTypeTab(tab.id); setPage(1); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  typeTab === tab.id
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Search + Filters ── */}
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-sm border border-white/60 flex flex-col md:flex-row gap-3 flex-wrap">
            <div className="flex flex-1 gap-2 min-w-[200px]">
              <input
                type="text"
                value={searchInput}
                placeholder="Search your reported items..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400 text-sm bg-white"
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-medium"
              >
                Search
              </button>
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
              className="px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400 text-sm bg-white"
            >
              <option value="">All Categories</option>
              <option value="wallet">Wallet</option>
              <option value="phone">Phone</option>
              <option value="bag">Bag</option>
              <option value="id">ID Card</option>
              <option value="electronics">Electronics</option>
              <option value="others">Others</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-400 text-sm bg-white"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="claimed">Claimed</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* ── Error ── */}
          {isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm flex items-center gap-2">
              <AlertCircle size={18} />
              <span>{error?.message || "Failed to load items. Please try again."}</span>
            </div>
          )}

          {/* ── Results count ── */}
          {!isLoading && !isError && (
            <p className="text-xs text-gray-500">
              {isFetching
                ? "Refreshing items…"
                : `Showing ${items.length} of ${pagination.total ?? 0} reported items`}
            </p>
          )}

          {/* ── Grid ── */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [1, 2, 3].map((n) => <SkeletonCard key={n} />)
            ) : items.length === 0 ? (
              <div className="col-span-full bg-white/80 backdrop-blur-md rounded-3xl p-12 text-center border border-white/60 shadow-sm">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Package size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">No Reports Found</h3>
                <p className="text-gray-400 text-sm mt-1 max-w-sm mx-auto">
                  {typeTab === "lost"
                    ? "You haven't reported any lost items yet."
                    : typeTab === "found"
                    ? "You haven't reported any found items yet."
                    : "You haven't submitted any reports yet."}
                </p>
                <Link to="/lostitems">
                  <button className="mt-6 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:opacity-95 transition shadow-md shadow-indigo-200">
                    + Report Item Now
                  </button>
                </Link>
              </div>
            ) : (
              items.map((item) => <ItemCard key={item._id} item={item} navigate={navigate} />)
            )}
          </div>

          {/* ── Pagination ── */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 bg-white rounded-xl shadow-xs text-xs font-semibold text-gray-700 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition border border-gray-200"
              >
                ← Prev
              </button>
              <span className="text-xs text-gray-500">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 bg-white rounded-xl shadow-xs text-xs font-semibold text-gray-700 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition border border-gray-200"
              >
                Next →
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default FoundItems;