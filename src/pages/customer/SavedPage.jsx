import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

import {
  ArrowLeft01Icon,
  Bookmark01Icon,
  Calendar03Icon,
  StarIcon,
  CheckmarkCircle01Icon,
  Location01Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";

import Header from "../../components/common/Header";
import { apiRequest } from "../../lib/api";

function SavedPage() {
  const [savedProviders, setSavedProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    apiRequest("/api/saved")
      .then((data) => {
        if (!cancelled) setSavedProviders(data.providers || []);
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const removeSaved = async (providerId) => {
    try {
      await apiRequest(`/api/saved/${encodeURIComponent(providerId)}`, { method: "DELETE" });
      setSavedProviders((current) => current.filter((provider) => provider.id !== providerId));
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 text-[#111827]">
      <Header />

      {/* ----- PAGE HEADER ----- */}
      <header className="border-b border-[#E5EDE8] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          {/* ----- BACK ----- */}

          <Link
            to="/"
            className="
              inline-flex
              items-center
              gap-1.5
              text-sm
              font-semibold
              text-[#6B7280]
              transition
              hover:text-[#15803D]
            "
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={17} strokeWidth={2} />
            Home
          </Link>

          {/* ----- TITLE ----- */}

          <div className="mt-4">
            <h1
              className="
                text-3xl
                font-extrabold
                tracking-[-0.035em]
                text-[#10231A]
                sm:text-3xl
              "
            >
              Saved
            </h1>

            <p className="mt-1 text-sm text-[#6B7280]">
              Your saved local providers{" "}
            </p>
          </div>
        </div>
      </header>

      {/* Saved Providers */}
      <main className="px-4 py-4">
        <div className="mx-auto max-w-7xl">
          {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

          {loading ? (
            <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-12 text-center text-sm font-semibold text-[#6B7280]">
              Loading saved providers...
            </div>
          ) : savedProviders.length > 0 ? (
            <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
              {savedProviders.map((provider) => (
                <article
                  key={provider.id}
                  className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm"
                >
                  {/* Provider Information */}
                  <div className="flex gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#DCFCE7] text-[#15803D]">
                      <HugeiconsIcon
                        icon={Bookmark01Icon}
                        size={22}
                        strokeWidth={1.8}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="truncate text-sm font-bold text-[#111827]">
                          {provider.name}
                        </h2>

                        {provider.verified && (
                          <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#DCFCE7] px-2 py-1 text-[10px] font-semibold text-[#15803D]">
                            <HugeiconsIcon
                              icon={CheckmarkCircle01Icon}
                              size={12}
                              strokeWidth={2}
                            />
                            Verified
                          </span>
                        )}
                      </div>

                      {/* Category */}
                      <p className="mt-1 text-xs font-medium text-[#6B7280]">
                        {provider.category}
                      </p>

                      {/* Location */}
                      <p className="mt-1 flex items-center gap-1 text-xs text-[#6B7280]">
                        <HugeiconsIcon
                          icon={Location01Icon}
                          size={13}
                          strokeWidth={2}
                        />

                        {provider.location}
                      </p>

                      {/* Rating */}
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-1 font-semibold text-[#374151]">
                          <HugeiconsIcon
                            icon={StarIcon}
                            size={14}
                            strokeWidth={2}
                            className="text-[#F59E0B]"
                          />

                          {provider.rating}
                        </span>

                        <span className="text-[#9CA3AF]">
                          ({provider.reviews} reviews)
                        </span>

                        <span className="text-[#D1D5DB]">•</span>

                        <span className="text-[#6B7280]">
                          {provider.experience} years
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <Link to={`/providers/${encodeURIComponent(provider.id)}`} className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#DDE9E1] bg-white text-xs font-bold text-[#334155] hover:bg-[#F8FAFC]">
                      <HugeiconsIcon icon={ViewIcon} size={16} strokeWidth={2} />Details
                    </Link>
                    <Link
                      to={`/book/${encodeURIComponent(provider.id)}`}
                      className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#10231A] text-xs font-bold text-white"
                    >
                      <HugeiconsIcon icon={Calendar03Icon} size={16} strokeWidth={2} />Book
                    </Link>

                    <button
                      type="button"
                      onClick={() => removeSaved(provider.id)}
                      className="flex h-10 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-xs font-bold text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F1F5F9] text-[#6B7280]">
                <HugeiconsIcon
                  icon={Bookmark01Icon}
                  size={25}
                  strokeWidth={1.8}
                />
              </div>

              <h2 className="mt-4 text-base font-semibold text-[#111827]">
                No saved providers yet
              </h2>

              <p className="mx-auto mt-1 max-w-xs text-sm leading-5 text-[#6B7280]">
                Save a provider to quickly find them here later.
              </p>

              <Link
                to="/services"
                className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-[#16A34A] px-5 text-sm font-semibold text-white transition hover:bg-[#15803D]"
              >
                Browse Services
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default SavedPage;
