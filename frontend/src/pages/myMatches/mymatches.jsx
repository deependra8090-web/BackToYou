import React from "react";
import { Link } from "react-router";
import Sidebar from "../../components/sidebar/sidebar.jsx";
import Navbar from "../../components/navbar/navbar.jsx";
import { useGetMyMatches } from "../../hooks/matchesHook/useGetMyMatches.hook.js";
import { useAcceptMatch } from "../../hooks/matchesHook/useAcceptMatch.hook.js";
import { useRejectMatch } from "../../hooks/matchesHook/useRejectMatch.hook.js";
import CreateClaimModal from "../../components/claims/CreateClaimModal.jsx";
import MatchDetailsModal from "../../components/matches/MatchDetailsModal.jsx";
import { toast, Toaster } from "sonner";
import { Sparkles, MessageCircle, Check, X, Eye, FileText } from "lucide-react";

// ─── STATUS STYLES ─────────────────────────────────────────────
const STATUS_CONFIG = {
  suggested: { label: "Suggested Match", cls: "text-purple-700 bg-purple-50 border-purple-200" },
  accepted:  { label: "Match Accepted",  cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  rejected:  { label: "Rejected",        cls: "text-red-700 bg-red-50 border-red-200" },
};

const CATEGORY_EMOJI = {
  wallet: "👛", phone: "📱", bag: "🎒",
  id: "💳", electronics: "💻", others: "📦",
};

// ─── SKELETON ───────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white/60 animate-pulse space-y-3">
    <div className="h-5 bg-gray-200 w-1/2 rounded-lg"></div>
    <div className="h-4 bg-gray-200 w-1/3 rounded-lg"></div>
    <div className="h-12 bg-gray-100 rounded-xl"></div>
    <div className="h-9 bg-gray-200 rounded-xl w-1/3"></div>
  </div>
);

const MyMatches = () => {
  const { data, isLoading, isError } = useGetMyMatches();
  const { mutate: acceptMatch, isPending: isAccepting } = useAcceptMatch();
  const { mutate: rejectMatch, isPending: isRejecting } = useRejectMatch();

  const [claimMatch, setClaimMatch] = React.useState(null);
  const [selectedMatch, setSelectedMatch] = React.useState(null);

  const matches = data?.data ?? (Array.isArray(data) ? data : []);

  // lock scroll when modal is open
  React.useEffect(() => {
    document.body.style.overflow = selectedMatch || claimMatch ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedMatch, claimMatch]);

  const handleAccept = (matchId) => {
    acceptMatch(matchId, {
      onSuccess: () => {
        toast.success("Match accepted!", {
          description: "A chat channel has been opened between you and the other user.",
        });
      },
      onError: (err) => {
        toast.error(err?.message || "Failed to accept match");
      },
    });
  };

  const handleReject = (matchId) => {
    if (!window.confirm("Are you sure you want to reject this match suggestion?")) return;
    rejectMatch(matchId, {
      onSuccess: () => {
        toast.info("Match rejected");
      },
      onError: (err) => {
        toast.error(err?.message || "Failed to reject match");
      },
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Navbar />
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 mt-14 md:mt-0">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2.5">
                <Sparkles className="text-indigo-600" size={28} />
                <span>AI Matches</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Automated similarity detection pairing your lost items with found reports on campus.
              </p>
            </div>
            <Link
              to="/lostitems"
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-sm font-semibold hover:opacity-95 transition shadow-md shadow-indigo-200 text-center shrink-0"
            >
              + Report Item
            </Link>
          </div>

          {/* Error Alert */}
          {isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm">
              Failed to load matches. Please refresh the page.
            </div>
          )}

          {/* ───────────────── LOADING STATE ───────────────── */}
          {isLoading && (
            <div className="grid md:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* ───────────────── EMPTY STATE ───────────────── */}
          {!isLoading && matches.length === 0 && (
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-12 text-center border border-white/60 shadow-sm">
              <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Sparkles size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">No Potential Matches Yet</h3>
              <p className="text-gray-400 text-sm mt-1 max-w-md mx-auto">
                When an approved found item matches your lost item description or keywords, BackToYou will suggest a match here automatically.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link to="/browseitems">
                  <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
                    Browse All Items
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* ───────────────── MATCH GRID ───────────────── */}
          {!isLoading && matches.length > 0 && (
            <div className="grid md:grid-cols-2 gap-5">
              {matches.map((match) => {
                const lostItem = match.lostItemId;
                const foundItem = match.foundItemId;
                const emoji = CATEGORY_EMOJI[lostItem?.category || foundItem?.category] ?? "📦";
                const statusConf = STATUS_CONFIG[match.status] ?? STATUS_CONFIG.suggested;

                return (
                  <div
                    key={match._id}
                    className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm hover:shadow-md transition border border-white/60 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl shadow-xs shrink-0">
                            {emoji}
                          </div>
                          <div className="min-w-0">
                            <h2 className="text-lg font-bold text-gray-800 truncate leading-snug">
                              {lostItem?.title ?? "Lost Item"}
                            </h2>
                            <p className="text-xs text-gray-400 truncate mt-0.5">
                              📍 {lostItem?.location || "Location not specified"}
                            </p>
                          </div>
                        </div>

                        {/* Score pill */}
                        <div className="text-right shrink-0">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xs">
                            {match.matchScore ?? 0}% Match
                          </span>
                        </div>
                      </div>

                      {/* Match comparison box */}
                      <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-gray-100 text-xs text-gray-600 space-y-1.5 my-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Found Report:</span>
                          <span className="font-semibold text-gray-800 truncate max-w-[200px]">
                            {foundItem?.title ?? "—"}
                          </span>
                        </div>
                        {foundItem?.location && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Found At:</span>
                            <span className="font-medium text-gray-700 truncate max-w-[200px]">
                              {foundItem.location}
                            </span>
                          </div>
                        )}
                        {match.matchReason && (
                          <div className="pt-1 text-[11px] text-indigo-600 font-medium">
                            ✨ {match.matchReason}
                          </div>
                        )}
                      </div>

                      <div className="mt-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusConf.cls}`}>
                          {statusConf.label}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 mt-5 pt-3 border-t border-gray-100 flex-wrap">
                      {match.status === "suggested" && (
                        <>
                          <button
                            disabled={isAccepting}
                            onClick={() => handleAccept(match._id)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
                          >
                            <Check size={14} />
                            <span>Accept Match</span>
                          </button>

                          <button
                            disabled={isRejecting}
                            onClick={() => handleReject(match._id)}
                            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                          >
                            <X size={14} />
                            <span>Reject</span>
                          </button>
                        </>
                      )}

                      {match.status === "accepted" && (
                        <Link
                          to="/chat"
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
                        >
                          <MessageCircle size={14} />
                          <span>Chat with Finder</span>
                        </Link>
                      )}

                      {match.canClaim && (
                        <button
                          onClick={() => setClaimMatch(match)}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
                        >
                          <FileText size={14} />
                          <span>Create Claim</span>
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedMatch(match)}
                        className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition flex items-center gap-1 ml-auto"
                      >
                        <Eye size={14} />
                        <span>Compare</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ───────────────── MATCH DETAILS MODAL ───────────────── */}
          {selectedMatch && (
            <MatchDetailsModal
              match={selectedMatch}
              onClose={() => setSelectedMatch(null)}
            />
          )}

          {/* ───────────────── CREATE CLAIM MODAL ───────────────── */}
          {claimMatch && (
            <CreateClaimModal
              match={claimMatch}
              onClose={() => setClaimMatch(null)}
            />
          )}

        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default MyMatches;

