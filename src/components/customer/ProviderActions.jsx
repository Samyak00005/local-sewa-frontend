import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Bookmark01Icon,
  Calendar03Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";

import { apiRequest, getToken } from "../../lib/api";

function ProviderActions({ provider, showDetails = true }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  const saveProvider = async () => {
    if (!getToken()) {
      navigate("/auth/customer/login");
      return;
    }

    setSaving(true);
    setFeedback("");
    try {
      await apiRequest("/api/saved", {
        method: "POST",
        body: { provider_id: provider.id },
      });
      setSaved(true);
      setFeedback("Provider saved.");
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`mt-4 grid gap-2 ${showDetails ? "grid-cols-3" : "grid-cols-2"}`}>
      {showDetails && (
        <Link to={`/providers/${encodeURIComponent(provider.id)}`} className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#DDE9E1] bg-white text-xs font-bold text-[#334155] transition hover:bg-[#F8FAFC] sm:text-sm">
          <HugeiconsIcon icon={ViewIcon} size={17} strokeWidth={2} />
          Details
        </Link>
      )}

      <button type="button" onClick={saveProvider} disabled={saving || saved} className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white text-xs font-bold text-[#475569] transition hover:bg-[#F8FAFC] disabled:text-[#15803D] sm:text-sm">
        <HugeiconsIcon icon={Bookmark01Icon} size={17} strokeWidth={2} />
        {saved ? "Saved" : saving ? "Saving..." : "Save"}
      </button>

      <Link to={`/book/${encodeURIComponent(provider.id)}`} className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#10231A] text-xs font-bold text-white transition hover:bg-[#1D3A2C] sm:text-sm">
        <HugeiconsIcon icon={Calendar03Icon} size={17} strokeWidth={2} />
        Book
      </Link>

      {feedback && <p className={`col-span-full rounded-xl px-3 py-2 text-center text-xs font-semibold ${saved ? "bg-[#ECFDF3] text-[#15803D]" : "bg-red-50 text-red-700"}`}>{feedback}</p>}
    </div>
  );
}

export default ProviderActions;
