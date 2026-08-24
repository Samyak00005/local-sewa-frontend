import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search02Icon } from "@hugeicons/core-free-icons";

import Header from "../../components/common/Header";
import LocationPicker from "../../components/common/LocationPicker";
import SearchBar from "../../components/common/SearchBar";
import ProviderCard from "../../components/customer/ProviderCard";
import { getServicePresentation } from "../../config/serviceCatalog";
import { locationsMatch, usePreferredLocation } from "../../hooks/usePreferredLocation";
import { useServiceDirectory } from "../../hooks/useServiceDirectory";

function EmergencyServicesPage() {
  const [query, setQuery] = useState("");
  const [location] = usePreferredLocation();
  const { providers, loading, error, refresh } = useServiceDirectory();

  const availableProviders = useMemo(() => {
    const search = query.trim().toLowerCase();
    return providers
      .filter((provider) => provider.available)
      .filter((provider) => locationsMatch(provider.location, location))
      .filter((provider) => {
        if (!search) return true;
        const service = getServicePresentation(provider.category);
        return `${provider.name} ${provider.location} ${service.name}`.toLowerCase().includes(search);
      })
      .sort((first, second) => Number(second.rating) - Number(first.rating));
  }, [location, providers, query]);

  return (
    <div className="min-h-screen bg-[#F7FAF8] pb-24 text-[#10231A] md:pb-0">
      <Header />
      <section className="border-b border-[#CDEFD8] bg-gradient-to-br from-[#ECFDF3] via-white to-[#DCFCE7] px-4 py-9 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-7xl">
          <div>
            <LocationPicker variant="page" />
            <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">Need service help right now?</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#527060] sm:text-base">Find providers who have marked themselves available and send a booking request. Contact options unlock securely after booking.</p>
            <p className="mt-3 text-xs font-semibold text-[#64748B]">For medical, fire or police emergencies, contact the official emergency services in your area.</p>
          </div>
        </div>
      </section>

      <section className="sticky top-[72px] z-40 border-b border-[#CDEFD8] bg-white/95 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><SearchBar tone="surface" placeholder="Search available plumber, electrician..." value={query} onChange={(event) => setQuery(event.target.value)} /></div></section>

      <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div><h2 className="text-xl font-extrabold">Available providers</h2><p className="mt-1 text-sm text-[#64748B]">{availableProviders.length} ready to receive requests</p></div>
            {query && <button type="button" onClick={() => setQuery("")} className="text-sm font-bold text-[#15803D]">Clear</button>}
          </div>

          {error && !providers.length ? (
            <div className="rounded-2xl border border-red-100 bg-white p-8 text-center text-sm text-red-700"><p>{error}</p><button type="button" onClick={() => refresh(true)} className="mt-3 font-bold underline">Try again</button></div>
          ) : loading && !providers.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-64 animate-pulse rounded-[22px] bg-white" />)}</div>
          ) : availableProviders.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{availableProviders.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}</div>
          ) : (
            <div className="rounded-[22px] border border-dashed border-[#CBD5E1] bg-white px-5 py-14 text-center">
              <HugeiconsIcon icon={Search02Icon} size={28} strokeWidth={1.8} className="mx-auto text-[#16A34A]" />
              <h3 className="mt-4 font-extrabold">No available provider found</h3>
              <p className="mt-1 text-sm text-[#64748B]">No provider is available now in {location}. Try another location or check again soon.</p>
              <div className="mt-5"><LocationPicker variant="page" /></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default EmergencyServicesPage;
