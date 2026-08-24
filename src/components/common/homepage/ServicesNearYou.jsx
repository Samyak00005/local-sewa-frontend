import { ArrowRight02Icon, Location01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

import { locationsMatch, usePreferredLocation } from "../../../hooks/usePreferredLocation";
import { useServiceDirectory } from "../../../hooks/useServiceDirectory";
import ProviderCard from "../../customer/ProviderCard";

function ServicesNearYou() {
  const [location] = usePreferredLocation();
  const { providers, loading, error, refresh } = useServiceDirectory();
  const nearbyProviders = useMemo(() => {
    return providers
      .filter((provider) => locationsMatch(provider.location, location))
      .slice(0, 3);
  }, [location, providers]);

  return (
    <section className="bg-[#F7FAF8] px-4 pb-12 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#16A34A] sm:text-xs">
              <HugeiconsIcon icon={Location01Icon} size={14} strokeWidth={2} />
              {location}
            </p>
            <h2 className="text-xl font-extrabold tracking-[-0.035em] text-[#10231A] sm:text-2xl">Services near you</h2>
            <p className="mt-1 text-xs text-[#6B7280] sm:text-sm">Live providers you can contact or book directly</p>
          </div>
          <Link to="/nearby" className="flex shrink-0 items-center gap-1 text-sm font-bold text-[#15803D] transition hover:text-[#16A34A]">
            See all
            <HugeiconsIcon icon={ArrowRight02Icon} size={17} strokeWidth={2} />
          </Link>
        </div>

        {error && !providers.length ? (
          <div className="rounded-2xl border border-red-100 bg-white p-5 text-sm text-red-700">
            <p>{error}</p>
            <button type="button" onClick={() => refresh(true)} className="mt-2 font-bold underline">Try again</button>
          </div>
        ) : loading && !providers.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => <ProviderSkeleton key={index} />)}
          </div>
        ) : nearbyProviders.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {nearbyProviders.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}
          </div>
        ) : (
          <div className="rounded-[22px] border border-dashed border-[#CBD5E1] bg-white px-5 py-12 text-center">
            <h3 className="font-bold text-[#10231A]">No providers in {location} yet</h3>
            <p className="mt-1 text-sm text-[#64748B]">Choose another location or check again when local professionals join.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function ProviderSkeleton() {
  return (
    <div className="h-56 animate-pulse rounded-[22px] border border-[#E5EDE8] bg-white p-5">
      <div className="flex gap-3">
        <div className="h-13 w-13 rounded-2xl bg-[#E8EEEA]" />
        <div className="flex-1 space-y-3 pt-1">
          <div className="h-4 w-2/3 rounded bg-[#E8EEEA]" />
          <div className="h-3 w-1/2 rounded bg-[#EEF3F0]" />
        </div>
      </div>
      <div className="mt-6 h-3 w-full rounded bg-[#EEF3F0]" />
      <div className="mt-8 grid grid-cols-2 gap-2"><div className="h-10 rounded-xl bg-[#E8EEEA]" /><div className="h-10 rounded-xl bg-[#E8EEEA]" /></div>
    </div>
  );
}

export default ServicesNearYou;
