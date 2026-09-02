import { useState } from "react";
import { toast } from "sonner";
import { useCreateClaim } from "../../hooks/claimsHook/useCreateClaim.hook";
import { X, PackageCheck, AlertCircle } from "lucide-react";

const CreateClaimModal = ({ match, item, onClose }) => {
  const { mutate, isPending } = useCreateClaim();

  const [message, setMessage] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const targetItem = item || match?.foundItemId || match?.lostItemId;
  const targetItemId = item?._id || match?.foundItemId?._id || match?.lostItemId?._id;
  const matchId = match?._id || undefined;

  if (!targetItem && !match) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (message.trim().length < 10) {
      setErrorMsg("Please provide at least 10 characters explaining your ownership.");
      return;
    }

    if (!contactInfo.trim()) {
      setErrorMsg("Please provide your contact information (phone, student ID, or email).");
      return;
    }

    mutate(
      {
        itemId: targetItemId,
        matchId: matchId,
        message: message.trim(),
        contactInfo: contactInfo.trim(),
        proofImages: [],
      },
      {
        onSuccess: () => {
          toast.success("Claim submitted successfully!", {
            description: "The item reporter and campus admin will review your claim.",
          });
          onClose();
        },
        onError: (err) => {
          const errText = err?.message || "Failed to submit claim. Please try again.";
          setErrorMsg(errText);
          toast.error(errText);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 relative shadow-2xl border border-gray-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <PackageCheck size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Submit Ownership Claim</h2>
            <p className="text-xs text-gray-400">Prove ownership to recover your lost item</p>
          </div>
        </div>

        {/* Item Summary Box */}
        <div className="mb-5 p-3.5 bg-slate-50 rounded-2xl border border-gray-100 flex items-center justify-between text-sm">
          <div>
            <span className="text-xs text-gray-400 block uppercase font-medium">Claiming Item</span>
            <span className="font-bold text-gray-800">{targetItem?.title || "Item"}</span>
          </div>
          {targetItem?.location && (
            <span className="text-xs text-gray-500 bg-white px-2.5 py-1 rounded-lg border border-gray-200">
              📍 {targetItem.location}
            </span>
          )}
        </div>

        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Proof of Ownership &amp; Distinguishing Marks <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Describe distinguishing marks, serial number, lock-screen wallpaper, unique contents, or exact circumstances..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[100px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <p className="text-[11px] text-gray-400 mt-1">Minimum 10 characters</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Contact Information <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Phone number, Student ID, or Email"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:opacity-95 disabled:opacity-50 transition shadow-md shadow-indigo-200"
            >
              {isPending ? "Submitting Claim…" : "Submit Claim"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClaimModal;