import {
  ArrowLeft01Icon,
  CheckmarkCircle01Icon,
  Home01Icon,
  Location01Icon,
  Shield01Icon,
  StarIcon,
  Store01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Header from "../../components/common/Header";
import ProviderActions from "../../components/customer/ProviderActions";
import { getServicePresentation } from "../../config/serviceCatalog";
import { apiRequest } from "../../lib/api";

function formatPrice(value) {
  const price = Number(value);
  if (!Number.isFinite(price) || price <= 0) return "Ask for price";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function ProviderDetailsPage() {
  const { providerId } = useParams();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    apiRequest(`/api/providers/${encodeURIComponent(providerId)}`, { token: null })
      .then((data) => {
        if (!cancelled) setProvider(data.provider || null);
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
  }, [providerId]);

  const service = getServicePresentation(provider?.category || "service");

  return (
    <div className="min-h-screen bg-[#F7FAF8] pb-24 text-[#10231A] md:pb-0">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <Link to={provider?.category ? `/services/${provider.category}` : "/services"} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#64748B] transition hover:text-[#15803D]">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={17} strokeWidth={2} />
          Back to providers
        </Link>

        {loading && <div className="mt-5 h-96 animate-pulse rounded-[28px] bg-white" />}

        {!loading && error && (
          <div className="mt-5 rounded-[24px] border border-red-100 bg-white p-8 text-center">
            <h1 className="text-xl font-extrabold">Provider details unavailable</h1>
            <p className="mt-2 text-sm text-red-700">{error}</p>
            <Link to="/services" className="mt-5 inline-flex rounded-xl bg-[#16A34A] px-5 py-3 text-sm font-bold text-white">Browse services</Link>
          </div>
        )}

        {!loading && provider && (
          <div className="mt-5 overflow-hidden rounded-[28px] border border-[#DDE9E1] bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
            <section className="bg-gradient-to-br from-[#123528] via-[#174A34] to-[#087A3F] p-5 text-white sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-white/12 text-[#86EFAC] ring-1 ring-white/15">
                  <HugeiconsIcon icon={service.icon} size={31} strokeWidth={1.8} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#86EFAC]">{service.name}</p>
                    {provider.verified && <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-2.5 py-1 text-[10px] font-bold"><HugeiconsIcon icon={CheckmarkCircle01Icon} size={13} strokeWidth={2} />Verified</span>}
                  </div>
                  <h1 className="mt-2 break-words text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">{provider.name}</h1>
                  <p className="mt-3 flex items-start gap-2 text-sm text-white/75"><HugeiconsIcon icon={Location01Icon} size={18} strokeWidth={2} className="mt-0.5 shrink-0" />{provider.location || "Location not provided"}</p>
                </div>
                <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${provider.available ? "bg-[#DCFCE7] text-[#166534]" : "bg-white/10 text-white/70"}`}>
                  <span className={`h-2 w-2 rounded-full ${provider.available ? "bg-[#22C55E]" : "bg-white/40"}`} />
                  {provider.available ? "Available now" : "Currently unavailable"}
                </span>
              </div>
            </section>

            <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="p-5 sm:p-8">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <Stat icon={StarIcon} label="Rating" value={Number(provider.rating) > 0 ? `${Number(provider.rating).toFixed(1)} / 5` : "New"} />
                  <Stat icon={Shield01Icon} label="Reviews" value={`${Number(provider.reviews) || 0} reviews`} />
                  <Stat icon={CheckmarkCircle01Icon} label="Experience" value={`${Number(provider.experience) || 0} years`} />
                </div>

                <section className="mt-7">
                  <h2 className="text-lg font-extrabold">About this provider</h2>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#64748B]">{provider.description || `${provider.name} provides ${service.name.toLowerCase()} services in ${provider.location || "your area"}.`}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {provider.home_service && <Mode icon={Home01Icon}>Home service</Mode>}
                    {provider.shop_service && <Mode icon={Store01Icon}>At provider shop</Mode>}
                  </div>
                </section>

                <section className="mt-8">
                  <h2 className="text-lg font-extrabold">Services offered</h2>
                  {provider.services?.length ? (
                    <div className="mt-3 space-y-3">
                      {provider.services.map((item) => (
                        <article key={item.id} className="rounded-2xl border border-[#E3ECE6] bg-[#FAFCFB] p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0"><h3 className="font-extrabold text-[#22372C]">{item.name}</h3>{item.description && <p className="mt-1 text-xs leading-5 text-[#64748B]">{item.description}</p>}</div>
                            <span className="shrink-0 text-sm font-extrabold text-[#15803D]">{formatPrice(item.price)}</span>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : <p className="mt-2 rounded-2xl bg-[#F8FAF9] p-4 text-sm text-[#64748B]">Ask the provider about the exact service while booking.</p>}
                </section>
              </div>

              <aside className="border-t border-[#E5EDE8] bg-[#F8FAF9] p-5 lg:border-l lg:border-t-0 lg:p-6">
                <div className="sticky top-24">
                  <h2 className="font-extrabold">Ready to book?</h2>
                  <p className="mt-2 text-xs leading-5 text-[#64748B]">Send a booking request first. The provider&apos;s call and WhatsApp details are securely unlocked in My Bookings.</p>
                  <ProviderActions provider={provider} showDetails={false} />
                  <div className="mt-4 flex items-start gap-2 rounded-xl bg-white p-3 text-[11px] leading-5 text-[#64748B] ring-1 ring-[#E3ECE6]">
                    <HugeiconsIcon icon={Shield01Icon} size={17} strokeWidth={2} className="mt-0.5 shrink-0 text-[#16A34A]" />
                    Contact details stay private until a booking is created.
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return <div className="rounded-2xl bg-[#F8FAF9] p-3"><HugeiconsIcon icon={icon} size={18} strokeWidth={2} className="text-[#16A34A]" /><p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-[#94A3B8]">{label}</p><p className="mt-0.5 text-sm font-extrabold text-[#334155]">{value}</p></div>;
}

function Mode({ icon, children }) {
  return <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#ECFDF3] px-3 py-2 text-xs font-bold text-[#15803D]"><HugeiconsIcon icon={icon} size={16} strokeWidth={2} />{children}</span>;
}

export default ProviderDetailsPage;
