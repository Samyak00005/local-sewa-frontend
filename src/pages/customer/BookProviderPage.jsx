import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Calendar03Icon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";

import Header from "../../components/common/Header";
import { apiRequest, getStoredUser } from "../../lib/api";
import { getPreferredLocation } from "../../hooks/usePreferredLocation";

function BookProviderPage() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [form, setForm] = useState({
    service_name: "",
    address: storedUser?.location || getPreferredLocation(),
    booking_date: "",
    booking_time: "",
    note: "",
  });

  const minimumDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useEffect(() => {
    let cancelled = false;

    apiRequest(`/api/providers/${encodeURIComponent(providerId)}`, { token: null })
      .then((data) => {
        if (cancelled) return;
        setProvider(data.provider);
        setForm((current) => ({
          ...current,
          service_name: data.provider?.services?.[0]?.name || data.provider?.category || "",
        }));
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const data = await apiRequest("/api/bookings", {
        method: "POST",
        body: { provider_id: providerId, ...form },
      });
      setSuccessMessage(`Booking request ${data.booking.booking_code} sent successfully.`);
      setTimeout(() => navigate("/bookings", { replace: true }), 900);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAF8] text-[#10231A]">
      <Header />
      <main className="px-4 py-7 sm:px-6">
        <div className="mx-auto max-w-2xl">
        <Link to={provider?.category ? `/services/${provider.category}` : "/services"} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#64748B] hover:text-[#15803D]">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={17} strokeWidth={2} />
          Back to providers
        </Link>

        <section className="mt-5 overflow-hidden rounded-[28px] border border-[#DDE9E1] bg-white shadow-[0_16px_45px_rgba(15,23,42,0.07)]">
          <header className="bg-gradient-to-br from-[#087A3F] to-[#12A85A] p-6 text-white sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">Book local service</p>
            <h1 className="mt-2 text-2xl font-extrabold">{loading ? "Loading provider..." : provider?.name || "Provider"}</h1>
            {provider && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-white/80">
                <HugeiconsIcon icon={Location01Icon} size={16} strokeWidth={2} />
                {provider.location}
              </p>
            )}
          </header>

          <form onSubmit={handleSubmit} className="space-y-4 p-5 sm:p-7">
            <Field label="Service needed">
              <input name="service_name" value={form.service_name} onChange={handleChange} required placeholder="e.g. Fan repair" className="form-input" />
            </Field>

            <Field label="Service address" icon={Location01Icon}>
              <input name="address" value={form.address} onChange={handleChange} required placeholder="House, area and city" className="form-input" />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Preferred date" icon={Calendar03Icon}>
                <input type="date" min={minimumDate} name="booking_date" value={form.booking_date} onChange={handleChange} required className="form-input" />
              </Field>
              <Field label="Preferred time" icon={Clock01Icon}>
                <input type="time" name="booking_time" value={form.booking_time} onChange={handleChange} required className="form-input" />
              </Field>
            </div>

            <Field label="Additional details (optional)">
              <textarea name="note" value={form.note} onChange={handleChange} rows={4} placeholder="Describe the problem or special instructions" className="form-input min-h-24 py-3" />
            </Field>

            {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
            {successMessage && (
              <p className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} strokeWidth={2} />
                {successMessage}
              </p>
            )}

            <button type="submit" disabled={loading || submitting || !provider} className="h-12 w-full rounded-xl bg-[#16A34A] text-sm font-bold text-white transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? "Sending request..." : "Confirm Booking Request"}
            </button>
          </form>
        </section>
        </div>
      </main>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-[#475569]">{label}</span>
      {children}
    </label>
  );
}

export default BookProviderPage;
