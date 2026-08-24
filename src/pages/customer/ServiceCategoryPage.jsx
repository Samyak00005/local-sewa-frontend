import { ArrowLeft01Icon, Search02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Header from "../../components/common/Header";
import LocationPicker from "../../components/common/LocationPicker";
import SearchBar from "../../components/common/SearchBar";
import ProviderCard from "../../components/customer/ProviderCard";
import { getServicePresentation } from "../../config/serviceCatalog";
import { locationsMatch, usePreferredLocation } from "../../hooks/usePreferredLocation";
import { useServiceDirectory } from "../../hooks/useServiceDirectory";

function ServiceCategoryPage() {
  const { category: categorySlug } = useParams();
  const [location] = usePreferredLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { categories, providers, loading, error, refresh } = useServiceDirectory();
  const category = categories.find((item) => item.slug === categorySlug);
  const service = getServicePresentation(category || categorySlug);

  const filteredProviders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return providers.filter((provider) => {
      if (provider.category !== categorySlug) return false;
      if (!locationsMatch(provider.location, location)) return false;
      if (!query) return true;
      return `${provider.name} ${provider.location}`.toLowerCase().includes(query);
    });
  }, [categorySlug, location, providers, searchQuery]);

  if (!loading && !category && !error) {
    return (
      <div className="min-h-screen bg-[#F7FAF8]">
        <Header />
        <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DCFCE7] text-[#15803D]">?</div>
          <h1 className="mt-5 text-2xl font-extrabold text-[#10231A]">Service not found</h1>
          <p className="mt-2 text-sm text-[#64748B]">This category is not available in the live directory.</p>
          <Link to="/services" className="mt-6 rounded-xl bg-[#16A34A] px-5 py-3 text-sm font-bold text-white">Browse all services</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAF8] pb-24 text-[#10231A] md:pb-0">
      <Header />

      <section className="border-b border-[#E5EDE8] bg-white px-4 py-7 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link to="/services" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#64748B] transition hover:text-[#15803D]">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={17} strokeWidth={2} />
            All services
          </Link>
          <div className="mt-5">
            <div className="flex items-start gap-4">
              <div className="flex h-15 w-15 shrink-0 items-center justify-center rounded-[20px] bg-[#DCFCE7] text-[#15803D]">
                <HugeiconsIcon icon={service.icon} size={29} strokeWidth={1.8} />
              </div>
              <div>
                <LocationPicker variant="page" />
                <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">{service.name}</h1>
                <p className="mt-2 text-sm leading-6 text-[#64748B]">{service.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-[72px] z-40 border-b border-[#DDE9E1] bg-white/95 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl"><SearchBar tone="surface" placeholder={`Search ${service.name.toLowerCase()} providers...`} value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} /></div>
      </section>

      <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5">
            <h2 className="text-xl font-extrabold">Available providers</h2>
            <p className="mt-1 text-sm text-[#64748B]">{filteredProviders.length} {filteredProviders.length === 1 ? "professional" : "professionals"} found</p>
          </div>

          {error && !providers.length ? (
            <div className="rounded-2xl border border-red-100 bg-white p-6 text-center text-sm text-red-700"><p>{error}</p><button type="button" onClick={() => refresh(true)} className="mt-3 font-bold underline">Try again</button></div>
          ) : loading && !providers.length ? (
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <ProviderSkeleton key={index} />)}</div>
          ) : filteredProviders.length ? (
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {filteredProviders.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}
            </div>
          ) : (
            <div className="rounded-[22px] border border-dashed border-[#CBD5E1] bg-white px-5 py-14 text-center">
              <HugeiconsIcon icon={Search02Icon} size={28} strokeWidth={1.8} className="mx-auto text-[#16A34A]" />
              <h3 className="mt-4 font-extrabold">No providers found</h3>
              <p className="mt-1 text-sm text-[#64748B]">No {service.name.toLowerCase()} provider is listed in {location} yet. Try another location.</p>
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

export default ServiceCategoryPage;
