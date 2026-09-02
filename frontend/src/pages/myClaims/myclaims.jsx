
import { useNavigate, Link } from "react-router";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import Navbar from "../../components/navbar/navbar.jsx";
import { useGetMyClaims } from "../../hooks/claimsHook/useGetMyClaims.hook.js";
import { useRejectClaim } from "../../hooks/claimsHook/useRejectClaim.hook.js";
import { toast, Toaster } from "sonner";
import { BaggageClaim, ArrowRight, XCircle, Clock, CheckCircle2, Ban } from "lucide-react";

// ─── STATUS CONFIG ─────────────────────────────
const STATUS_CONFIG = {
  pending:      { label: "Pending Review",  color: "text-amber-700 bg-amber-50 border-amber-200",   icon: Clock },
  under_review: { label: "Under Review",    color: "text-indigo-700 bg-indigo-50 border-indigo-200", icon: Clock },
  approved:     { label: "Approved Claim",  color: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
  rejected:     { label: "Rejected",        color: "text-red-700 bg-red-50 border-red-200",       icon: Ban },
  completed:    { label: "Completed",       color: "text-blue-700 bg-blue-50 border-blue-200",     icon: CheckCircle2 },
};

const CATEGORY_EMOJI = {
  wallet: "👛", phone: "📱", bag: "🎒",
  id: "💳", electronics: "💻", others: "📦",
};

function StatusBadge({ status }) {
  const conf = STATUS_CONFIG[status] ?? {
    label: status?.replace("_", " ") ?? "—",
    color: "text-gray-600 bg-gray-50 border-gray-200",
    icon: Clock,
  };
  const Icon = conf.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${conf.color}`}>
      <Icon size={13} />
      <span>{conf.label}</span>
    </span>
  );
}

// ─── SKELETON ─────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white/60 animate-pulse space-y-3">
    <div className="h-5 bg-gray-200 w-1/2 rounded-lg"></div>
    <div className="h-4 bg-gray-200 w-1/3 rounded-lg"></div>
    <div className="h-14 bg-gray-100 rounded-xl"></div>
    <div className="h-9 bg-gray-200 rounded-xl w-1/3"></div>
  </div>
);

const MyClaims = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetMyClaims();
  const { mutate: cancelClaim, isPending: isCancelling } = useRejectClaim();

  const claims = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

  const handleCancelClaim = (claimId) => {
    if (!window.confirm("Are you sure you want to cancel this claim?")) return;

    cancelClaim(
      { id: claimId, reviewNote: "Cancelled by user" },
      {
        onSuccess: () => {
          toast.success("Claim cancelled successfully");
        },
        onError: (err) => {
          toast.error(err?.message || "Failed to cancel claim");
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Navbar />
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 mt-14 md:mt-0">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2.5">
                <BaggageClaim className="text-indigo-600" size={28} />
                <span>My Claims</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Track status and verification progress for items you have claimed.
              </p>
            </div>
            <Link
              to="/browseitems"
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-sm font-semibold hover:opacity-95 transition shadow-md shadow-indigo-200 text-center shrink-0"
            >
              Browse Lost &amp; Found
            </Link>
          </div>

          {/* ERROR ALERT */}
          {isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm flex items-center gap-2">
              <XCircle size={18} />
              <span>Failed to load claims. Please refresh the page.</span>
            </div>
          )}

          {/* LOADING STATE */}
          {isLoading && (
            <div className="grid md:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {!isLoading && claims.length === 0 && (
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-12 text-center border border-white/60 shadow-sm">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <BaggageClaim size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">No Claims Submitted Yet</h3>
              <p className="text-gray-400 text-sm mt-1 max-w-md mx-auto">
                If someone has found your lost item on campus, you can submit an ownership claim to recover it.
              </p>
              <Link to="/browseitems">
                <button className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
                  Browse Found Items
                </button>
              </Link>
            </div>
          )}

          {/* CLAIM LIST */}
          {!isLoading && claims.length > 0 && (
            <div className="grid md:grid-cols-2 gap-5">
              {claims.map((claim) => {
                const item = claim.itemId;
                const emoji = CATEGORY_EMOJI[item?.category] ?? "📦";
                const dateClaimed = claim.createdAt
                  ? new Date(claim.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : null;

                return (
                  <div
                    key={claim._id}
                    className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm hover:shadow-md transition border border-white/60 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top status row */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl shadow-xs shrink-0">
                            {emoji}
                          </div>
                          <div>
                            <h2 className="text-lg font-bold text-gray-800 truncate leading-snug">
                              {item?.title ?? "Reported Item"}
                            </h2>
                            {item?.location && (
                              <p className="text-xs text-gray-400 mt-0.5">
                                📍 {item.location}
                              </p>
                            )}
                          </div>
                        </div>

                        <StatusBadge status={claim.status} />
                      </div>

                      {/* Claim message box */}
                      <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-gray-100 text-xs text-gray-600 my-3">
                        <p className="font-semibold text-gray-700 mb-1">Your Ownership Details:</p>
                        <p className="leading-relaxed line-clamp-3 italic">
                          "{claim.message || "No explanation provided"}"
                        </p>
                        {claim.contactInfo && (
                          <p className="mt-2 text-[11px] text-gray-400">
                            Contact: <span className="text-gray-600 font-medium">{claim.contactInfo}</span>
                          </p>
                        )}
                      </div>

                      {dateClaimed && (
                        <p className="text-[11px] text-gray-400">
                          Submitted on: {dateClaimed}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                      {item?._id ? (
                        <button
                          onClick={() => navigate(`/items/${item._id}`)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition"
                        >
                          <span>View Item Report</span>
                          <ArrowRight size={14} />
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">Item Details</span>
                      )}

                      {claim.status === "pending" && (
                        <button
                          disabled={isCancelling}
                          onClick={() => handleCancelClaim(claim._id)}
                          className="px-3.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-semibold transition disabled:opacity-50"
                        >
                          Cancel Claim
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default MyClaims;