import { useState } from "react";

import { HugeiconsIcon } from "@hugeicons/react";

import {
  CheckmarkCircle01Icon,
  Location01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";

import { apiRequest } from "../../lib/api";

function ProviderProfileCard({ provider }) {
  const [available, setAvailable] = useState(provider.available);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const toggleAvailability = async () => {
    if (updating) return;
    const nextValue = !available;
    setError("");
    setAvailable(nextValue);
    setUpdating(true);
    try {
      await apiRequest("/api/provider/availability", {
        method: "PATCH",
        body: { available: nextValue },
      });
    } catch (error) {
      setAvailable(!nextValue);
      setError(error.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <section
      className="
        overflow-hidden
        rounded-[24px]
        bg-gradient-to-br
        from-[#087A3F]
        via-[#0A8F4B]
        to-[#12A85A]
        p-5
        text-white
        shadow-[0_12px_35px_rgba(8,122,63,0.18)]
        sm:p-6
      "
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}

        <div
          className="
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-white/30
            bg-white/15
            text-xl
            font-extrabold
            backdrop-blur-md
          "
        >
          {provider.ownerName.charAt(0)}
        </div>

        {/* Details */}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-lg font-extrabold">
              {provider.businessName}
            </h2>

            {provider.verified && (
              <HugeiconsIcon
                icon={CheckmarkCircle01Icon}
                size={18}
                strokeWidth={2}
              />
            )}
          </div>

          <p className="mt-1 text-sm text-white/75">
            {provider.category}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/75">
            <div className="flex items-center gap-1">
              <HugeiconsIcon
                icon={StarIcon}
                size={14}
                strokeWidth={2}
              />

              {provider.rating} ({provider.reviews})
            </div>

            <div className="flex items-center gap-1">
              <HugeiconsIcon
                icon={Location01Icon}
                size={14}
                strokeWidth={2}
              />

              {provider.location}
            </div>
          </div>
        </div>
      </div>

      {/* Availability */}

      <div
        className="
          mt-5
          flex
          items-center
          justify-between
          rounded-[18px]
          border
          border-white/15
          bg-white/10
          p-4
          backdrop-blur-md
        "
      >
        <div>
          <p className="text-sm font-bold">
            Available for work
          </p>

          <p className="mt-0.5 text-xs text-white/65">
            Customers can see your availability
          </p>
        </div>

        <button
          type="button"
          onClick={toggleAvailability}
          disabled={updating}
          className={`
            relative
            h-7
            w-13
            rounded-full
            transition
            ${
              available
                ? "bg-[#86EFAC]"
                : "bg-white/25"
            }
          `}
          style={{ width: 52 }}
        >
          <span
            className={`
              absolute
              top-1
              h-5
              w-5
              rounded-full
              bg-white
              shadow-md
              transition-all

              ${
                available
                  ? "left-[28px]"
                  : "left-1"
              }
            `}
          />
        </button>
      </div>

      <div className="mt-3 text-xs font-semibold text-white/80">
        {available ? "🟢 Currently Available" : "⚪ Currently Offline"}
      </div>
      {error && <p role="alert" className="mt-3 rounded-xl bg-white/15 px-3 py-2 text-xs font-semibold text-white">{error}</p>}
    </section>
  );
}

export default ProviderProfileCard;
