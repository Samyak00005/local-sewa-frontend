import { Search02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState } from "react";

import Header from "../../components/common/Header";
import LocationPicker from "../../components/common/LocationPicker";
import SearchBar from "../../components/common/SearchBar";
import ProviderCard from "../../components/customer/ProviderCard";
import { getServicePresentation } from "../../config/serviceCatalog";
import { locationsMatch, usePreferredLocation } from "../../hooks/usePreferredLocation";
import { useServiceDirectory } from "../../hooks/useServiceDirectory";

function NearbyServicesPage() {
  const [location] = usePreferredLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { providers, loading, error, refresh } = useServiceDirectory();

  const localProviders = useMemo(() => {
    return providers.filter((provider) => locationsMatch(provider.location, location));
  }, [location, providers]);

  const filteredProviders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return localProviders;
    return localProviders.filter((provider) => {
      const service = getServicePresentation(provider.category);
      return `${provider.name} ${provider.location} ${service.name}`.toLowerCase().includes(query);
    });
  }, [localProviders, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F7FAF8] pb-24 text-[#10231A] md:pb-0">
      <Header />

      <section className="border-b border-[#E5EDE8] bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div>
            <div>
              <LocationPicker variant="page" />
              <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Nearby professionals</h1>
              <p className="mt-3 text-sm leading-6 text-[#64748B] sm:text-base">Compare availability, experience and ratings, then book the right local professional.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-[72px] z-40 border-b border-[#DDE9E1] bg-white/95 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><SearchBar tone="surface" placeholder="Search provider or service..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} /></div></section>

      <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold">Available helpers</h2>
              <p className="mt-1 text-sm text-[#64748B]">{filteredProviders.length} {filteredProviders.length === 1 ? "provider" : "providers"} found</p>
            </div>
            {searchQuery && <button type="button" onClick={() => setSearchQuery("")} className="text-sm font-bold text-[#15803D]">Clear</button>}
          </div>

          {error && !providers.length ? (
            <div className="rounded-2xl border border-red-100 bg-white p-6 text-center text-sm text-red-700"><p>{error}</p><button type="button" onClick={() => refresh(true)} className="mt-3 font-bold underline">Try again</button></div>
          ) : loading && !providers.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <ProviderSkeleton key={index} />)}</div>
          ) : filteredProviders.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredProviders.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}
            </div>
          ) : (
            <div className="rounded-[22px] border border-dashed border-[#CBD5E1] bg-white px-5 py-14 text-center">
              <HugeiconsIcon icon={Search02Icon} size={28} strokeWidth={1.8} className="mx-auto text-[#16A34A]" />
              <h3 className="mt-4 font-extrabold">No providers found</h3>
              <p className="mt-1 text-sm text-[#64748B]">No providers are listed in {location} yet. Change the location or check again soon.</p>
              <div className="mt-5"><LocationPicker variant="page" /></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ProviderSkeleton() {
  return <div className="h-60 animate-pulse rounded-[22px] border border-[#E5EDE8] bg-white p-5"><div className="flex gap-3"><div className="h-13 w-13 rounded-2xl bg-[#E8EEEA]" /><div className="flex-1 space-y-3"><div className="h-4 w-2/3 rounded bg-[#E8EEEA]" /><div className="h-3 w-1/2 rounded bg-[#EEF3F0]" /></div></div><div className="mt-8 h-3 rounded bg-[#EEF3F0]" /><div className="mt-8 grid grid-cols-2 gap-2"><div className="h-10 rounded-xl bg-[#E8EEEA]" /><div className="h-10 rounded-xl bg-[#E8EEEA]" /></div></div>;
}

export default NearbyServicesPage;
