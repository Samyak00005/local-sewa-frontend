import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

import {
  ArrowRight02Icon,
  Bookmark01Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import { usePreferredLocation } from "../../../hooks/usePreferredLocation";

function ProfileActions() {
  const [location] = usePreferredLocation();
  return (
    <section className="mt-6 lg:mt-0">
      <div className="mb-3">
        <h2 className="text-lg font-bold tracking-tight text-[#111827]">
          Quick Actions
        </h2>
      </div>

      <div className="space-y-3">
        {/* Saved Providers */}
        <Link
          to="/saved"
          className="group flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-4 transition hover:border-[#BBF7D0] hover:shadow-sm"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DCFCE7] text-[#15803D]">
            <HugeiconsIcon icon={Bookmark01Icon} size={21} strokeWidth={1.8} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-[#111827]">
              Saved Providers
            </h3>

            <p className="mt-0.5 text-xs text-[#6B7280]">
              View your saved local providers
            </p>
          </div>

          <HugeiconsIcon
            icon={ArrowRight02Icon}
            size={18}
            strokeWidth={2}
            className="text-[#9CA3AF] transition group-hover:translate-x-0.5 group-hover:text-[#15803D]"
          />
        </Link>

        {/* Location */}
        <Link
          to="/nearby"
          className="group flex w-full items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-4 text-left transition hover:border-[#BBF7D0] hover:shadow-sm"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F1F5F9] text-[#6B7280]">
            <HugeiconsIcon icon={Location01Icon} size={21} strokeWidth={1.8} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-[#111827]">Location</h3>

            <p className="mt-0.5 text-xs text-[#6B7280]">
              Currently showing services in {location}
            </p>
          </div>

          <HugeiconsIcon
            icon={ArrowRight02Icon}
            size={18}
            strokeWidth={2}
            className="text-[#9CA3AF]"
          />
        </Link>
      </div>
    </section>
  );
}

export default ProfileActions;
