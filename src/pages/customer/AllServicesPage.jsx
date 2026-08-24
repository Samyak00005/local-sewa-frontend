import { ArrowRight02Icon, Search02Icon, SortingAZ01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Header from "../../components/common/Header";
import SearchBar from "../../components/common/SearchBar";
import { getServicePresentation } from "../../config/serviceCatalog";
import { useServiceDirectory } from "../../hooks/useServiceDirectory";

const SERVICES_PER_PAGE = 12;

function AllServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sortOrder, setSortOrder] = useState("recommended");
  const [visibleCount, setVisibleCount] = useState(SERVICES_PER_PAGE);
  const { categories, loading, error, refresh } = useServiceDirectory();

  const services = useMemo(
    () => categories.map((category) => ({ ...category, ...getServicePresentation(category) })),
    [categories],
  );
  const filteredServices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const matches = !query ? services : services.filter((service) =>
      `${service.name} ${service.description}`.toLowerCase().includes(query),
    );
    if (sortOrder === "recommended") return matches;
    return [...matches].sort((first, second) => {
      const comparison = first.name.localeCompare(second.name, "en", { sensitivity: "base", numeric: true });
      return sortOrder === "desc" ? -comparison : comparison;
    });
  }, [searchQuery, services, sortOrder]);
  const visibleServices = useMemo(
    () => filteredServices.slice(0, visibleCount),
    [filteredServices, visibleCount],
  );
  const hasMoreServices = visibleCount < filteredServices.length;

  const submitSearch = (query) => {
    setSearchParams(query ? { q: query } : {}, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F7FAF8] pb-24 text-[#10231A] md:pb-0">
      <Header />

      <section className="border-b border-[#E5EDE8] bg-white px-4 py-8 sm:px-6 sm:py-11 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#16A34A]">Service directory</p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">What can we help you with?</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#64748B] sm:text-base">Browse live service categories and choose a trusted local professional.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-[72px] z-40 border-b border-[#DDE9E1] bg-white/95 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SearchBar
            tone="surface"
            placeholder="Search a service..."
            value={searchQuery}
            onChange={(event) => { setSearchQuery(event.target.value); setVisibleCount(SERVICES_PER_PAGE); }}
            onSubmit={submitSearch}
          />
        </div>
      </section>

      <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 grid grid-cols-[minmax(0,1fr)_minmax(145px,190px)] items-end gap-3 sm:gap-4">
            <div className="min-w-0">
              <h2 className="text-xl font-extrabold sm:text-2xl">All services</h2>
              <p className="mt-1 text-sm text-[#64748B]">
                Showing {Math.min(visibleCount, filteredServices.length)} of {filteredServices.length} categories
              </p>
            </div>
            <div className="flex min-w-0 items-center justify-end gap-2">
              {searchQuery && (
                <button type="button" onClick={() => { setSearchQuery(""); setVisibleCount(SERVICES_PER_PAGE); setSearchParams({}, { replace: true }); }} className="hidden text-sm font-bold text-[#15803D] sm:inline-flex">Clear search</button>
              )}
              <label className="flex h-11 w-full min-w-0 items-center gap-2 rounded-xl border border-[#DDE9E1] bg-white px-3 shadow-sm">
                <HugeiconsIcon icon={SortingAZ01Icon} size={19} strokeWidth={2} className="shrink-0 text-[#16A34A]" />
                <span className="sr-only">Sort services by name</span>
                <select value={sortOrder} onChange={(event) => { setSortOrder(event.target.value); setVisibleCount(SERVICES_PER_PAGE); }} className="min-w-0 flex-1 bg-transparent text-xs font-bold text-[#334155] outline-none sm:text-sm">
                  <option value="recommended">Recommended</option>
                  <option value="asc">Name: A to Z</option>
                  <option value="desc">Name: Z to A</option>
                </select>
              </label>
            </div>
          </div>

          {error && !categories.length ? (
            <div className="rounded-2xl border border-red-100 bg-white p-6 text-center text-sm text-red-700">
              <p>{error}</p>
              <button type="button" onClick={() => refresh(true)} className="mt-3 font-bold underline">Try again</button>
            </div>
          ) : loading && !categories.length ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {Array.from({ length: 6 }, (_, index) => <ServiceSkeleton key={index} />)}
            </div>
          ) : filteredServices.length ? (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {visibleServices.map((service) => (
                  <Link key={service.slug} to={`/services/${service.slug}`} className="group flex min-h-52 flex-col rounded-[22px] border border-[#E3ECE6] bg-white p-4 shadow-[0_4px_18px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#86EFAC] hover:shadow-[0_14px_35px_rgba(22,163,74,0.10)] sm:p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DCFCE7] text-[#15803D]">
                      <HugeiconsIcon icon={service.icon} size={24} strokeWidth={1.8} />
                    </div>
                    <h3 className="mt-5 text-base font-extrabold">{service.name}</h3>
                    <p className="mt-2 line-clamp-3 text-xs leading-5 text-[#64748B]">{service.description}</p>
                    <div className="mt-auto flex items-center justify-between border-t border-[#EEF3F0] pt-4 text-xs">
                      <span className="font-semibold text-[#64748B]">{service.providerCount} providers</span>
                      <HugeiconsIcon icon={ArrowRight02Icon} size={17} strokeWidth={2} className="text-[#16A34A] transition group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>

              {hasMoreServices && (
                <div className="mt-8 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((count) => count + SERVICES_PER_PAGE)}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#86EFAC] bg-white px-6 text-sm font-extrabold text-[#15803D] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#F0FDF4]"
                  >
                    Show more services
                    <HugeiconsIcon icon={ArrowRight02Icon} size={17} strokeWidth={2} className="rotate-90" />
                  </button>
                  <p className="mt-2 text-xs font-medium text-[#94A3B8]">
                    {filteredServices.length - visibleServices.length} more categories available
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-[22px] border border-dashed border-[#CBD5E1] bg-white px-5 py-14 text-center">
              <HugeiconsIcon icon={Search02Icon} size={28} strokeWidth={1.8} className="mx-auto text-[#16A34A]" />
              <h3 className="mt-4 font-extrabold">No matching service found</h3>
              <p className="mt-1 text-sm text-[#64748B]">Try another keyword or clear the search.</p>
            </div>
          )}
        </div>
      </main>

      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[26px] bg-[#10231A] px-6 py-8 text-white sm:px-9 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#86EFAC]">Grow with Local Sewa</p>
            <h2 className="mt-2 text-2xl font-extrabold">Offer a service that is not listed?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">Create a provider profile and manage your services from the live dashboard.</p>
          </div>
          <Link to="/auth/provider/register" className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-[#10231A] transition hover:bg-[#F0FDF4] lg:mt-0">
            Become a provider
            <HugeiconsIcon icon={ArrowRight02Icon} size={17} strokeWidth={2} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function ServiceSkeleton() {
  return <div className="min-h-52 animate-pulse rounded-[22px] border border-[#E5EDE8] bg-white p-5"><div className="h-12 w-12 rounded-2xl bg-[#E8EEEA]" /><div className="mt-5 h-4 w-2/3 rounded bg-[#E8EEEA]" /><div className="mt-3 h-3 w-full rounded bg-[#EEF3F0]" /><div className="mt-2 h-3 w-4/5 rounded bg-[#EEF3F0]" /></div>;
}

export default AllServicesPage;
