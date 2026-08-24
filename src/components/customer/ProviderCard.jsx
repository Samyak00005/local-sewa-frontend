import {
  CheckmarkCircle01Icon,
  Location01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

import { getServicePresentation } from "../../config/serviceCatalog";
import ProviderActions from "./ProviderActions";

function ProviderCard({ provider }) {
  const service = getServicePresentation(provider.category);
  const hasRating = Number(provider.rating) > 0;

  return (
    <article className="group flex h-full flex-col rounded-[22px] border border-[#E3ECE6] bg-white p-4 shadow-[0_4px_18px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-[#BBF7D0] hover:shadow-[0_14px_34px_rgba(22,163,74,0.09)] sm:p-5">
      <Link to={`/providers/${encodeURIComponent(provider.id)}`} className="block rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-[#BBF7D0]" aria-label={`View details for ${provider.name}`}>
      <div className="flex gap-3">
        <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#DCFCE7] text-[#15803D] transition group-hover:bg-[#BBF7D0]">
          <HugeiconsIcon icon={service.icon} size={24} strokeWidth={1.8} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-[15px] font-extrabold text-[#10231A] sm:text-base">{provider.name}</h3>
              <p className="mt-1 truncate text-xs font-semibold text-[#15803D]">{service.name}</p>
            </div>
            {provider.verified && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#ECFDF3] px-2 py-1 text-[10px] font-bold text-[#15803D]">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={12} strokeWidth={2} />
                Verified
              </span>
            )}
          </div>

          <p className="mt-2 flex min-w-0 items-center gap-1.5 text-xs text-[#64748B]">
            <HugeiconsIcon icon={Location01Icon} size={14} strokeWidth={2} className="shrink-0" />
            <span className="truncate">{provider.location || "Location not provided"}</span>
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[#F0F4F1] pt-3 text-xs">
        <span className="inline-flex items-center gap-1 font-bold text-[#334155]">
          <HugeiconsIcon icon={StarIcon} size={14} strokeWidth={2} className="text-[#F59E0B]" />
          {hasRating ? Number(provider.rating).toFixed(1) : "New"}
        </span>
        <span className="text-[#94A3B8]">{Number(provider.reviews) || 0} reviews</span>
        <span className="text-[#CBD5E1]">•</span>
        <span className="text-[#64748B]">{Number(provider.experience) || 0} yrs experience</span>
        <span className={`ml-auto inline-flex items-center gap-1.5 font-bold ${provider.available ? "text-[#15803D]" : "text-[#94A3B8]"}`}>
          <span className={`h-2 w-2 rounded-full ${provider.available ? "bg-[#22C55E]" : "bg-[#CBD5E1]"}`} />
          {provider.available ? "Available" : "Unavailable"}
        </span>
      </div>
      </Link>

      <div className="mt-auto">
        <ProviderActions provider={provider} />
      </div>
    </article>
  );
}

export default ProviderCard;
