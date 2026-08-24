import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Calendar03Icon,
  Call02Icon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  Location01Icon,
  StarIcon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";

import Header from "../../components/common/Header";
import { apiRequest } from "../../lib/api";
import { buildWhatsAppUrl } from "../../lib/contact";

const statusDetails = {
  pending: { label: "Waiting for provider", className: "bg-[#FEF3C7] text-[#B45309]" },
  accepted: { label: "Accepted", className: "bg-[#DBEAFE] text-[#1D4ED8]" },
  in_progress: { label: "In progress", className: "bg-[#EDE9FE] text-[#6D28D9]" },
  completed: { label: "Completed", className: "bg-[#DCFCE7] text-[#15803D]" },
  rejected: { label: "Rejected", className: "bg-[#FEE2E2] text-[#B91C1C]" },
  cancelled: { label: "Cancelled", className: "bg-[#F1F5F9] text-[#475569]" },
  not_completed: { label: "Not completed", className: "bg-[#FFEDD5] text-[#C2410C]" },
};

function formatDate(value) {
  if (!value) return "Date not set";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(date);
}

function formatTime(value) {
  if (!value) return "Time not set";
  const [hour, minute] = value.split(":");
  return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(new Date(2000, 0, 1, Number(hour), Number(minute)));
}

function BookingsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelBooking, setCancelBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    apiRequest("/api/bookings")
      .then((data) => {
        if (!cancelled) setBookings(data.bookings || []);
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
  }, []);

  const upcomingBookings = useMemo(
    () => bookings.filter((booking) => ["pending", "accepted", "in_progress"].includes(booking.status)),
    [bookings],
  );
  const pastBookings = useMemo(
    () => bookings.filter((booking) => !["pending", "accepted", "in_progress"].includes(booking.status)),
    [bookings],
  );

  const confirmCancellation = async () => {
    if (!cancelBooking || updatingId) return;
    setUpdatingId(cancelBooking.id);
    setError("");
    try {
      await apiRequest(`/api/bookings/${cancelBooking.id}/status`, {
        method: "PATCH",
        body: { status: "CANCELLED", reason: cancelReason.trim() || "Cancelled by customer" },
      });
      setBookings((current) => current.map((booking) => (
        booking.id === cancelBooking.id
          ? { ...booking, status: "cancelled", reason: cancelReason.trim() || "Cancelled by customer", canCancel: false, canRebook: true }
          : booking
      )));
      setCancelBooking(null);
      setCancelReason("");
    } catch (requestError) {
      setCancelError(requestError.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const markReviewed = (bookingId, rating, comment) => {
    setBookings((current) => current.map((booking) => (
      booking.id === bookingId
        ? { ...booking, rating, reviewComment: comment, canRate: false }
        : booking
    )));
  };

  const visibleBookings = activeTab === "upcoming" ? upcomingBookings : pastBookings;

  return (
    <div className="min-h-screen bg-[#F7FAF8] pb-24 text-[#111827] md:pb-0">
      <Header />

      <header className="border-b border-[#E5EDE8] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6B7280] transition hover:text-[#15803D]">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={17} strokeWidth={2} /> Home
          </Link>
          <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-extrabold tracking-[-0.035em] text-[#10231A]">My Bookings</h1>
              <p className="mt-1 text-sm text-[#6B7280]">Track every request from booking to completion.</p>
            </div>
            <div className="flex gap-2 text-xs font-bold">
              <span className="rounded-xl bg-[#FEF3C7] px-3 py-2 text-[#B45309]">{upcomingBookings.length} active</span>
              <span className="rounded-xl bg-[#ECFDF3] px-3 py-2 text-[#15803D]">{pastBookings.length} past</span>
            </div>
          </div>
        </div>
      </header>

      <section className="sticky top-[72px] z-30 border-b border-[#E5EDE8] bg-white/95 px-4 py-3 shadow-sm backdrop-blur-lg sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 rounded-2xl bg-[#F1F5F3] p-1">
          {[{ id: "upcoming", label: "Upcoming" }, { id: "past", label: "Past" }].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                activeTab === tab.id ? "bg-white text-[#15803D] shadow-sm" : "text-[#6B7280] hover:text-[#15803D]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <main className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {error && (
            <div role="alert" className="mb-4 flex items-start justify-between gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              <span>{error}</span>
              <button type="button" onClick={() => setError("")} aria-label="Dismiss error"><HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={2} /></button>
            </div>
          )}

          <div className="mb-4">
            <h2 className="text-lg font-extrabold text-[#10231A]">{activeTab === "upcoming" ? "Upcoming bookings" : "Past bookings"}</h2>
            <p className="mt-1 text-xs text-[#6B7280]">{activeTab === "upcoming" ? "Current requests and scheduled work" : "Completed, cancelled and rejected requests"}</p>
          </div>

          {loading && <div className="grid gap-4 lg:grid-cols-2">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-72 animate-pulse rounded-[24px] bg-white" />)}</div>}

          {!loading && visibleBookings.length > 0 && (
            <div className="grid items-start gap-4 lg:grid-cols-2">
              {visibleBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={() => {
                    setError("");
                    setCancelError("");
                    setCancelReason("");
                    setCancelBooking(booking);
                  }}
                  onReviewed={markReviewed}
                />
              ))}
            </div>
          )}

          {!loading && visibleBookings.length === 0 && (
            <EmptyBookingsState
              title={activeTab === "upcoming" ? "No upcoming bookings" : "No past bookings"}
              description={activeTab === "upcoming" ? "Your scheduled services will appear here." : "Completed and cancelled bookings will appear here."}
            />
          )}
        </div>
      </main>

      {cancelBooking && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-[#0F172A]/45 p-4 backdrop-blur-[2px] sm:items-center" role="dialog" aria-modal="true" aria-labelledby="cancel-booking-title">
          <div data-keyboard-scroll className="w-full max-w-md overflow-y-auto rounded-[24px] bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.3)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-red-600">Cancel request</p>
                <h3 id="cancel-booking-title" className="mt-1 text-xl font-extrabold text-[#10231A]">Cancel {cancelBooking.service}?</h3>
                <p className="mt-1 text-sm text-[#64748B]">The provider will be notified through the booking status.</p>
              </div>
              <button type="button" onClick={() => setCancelBooking(null)} aria-label="Close" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F1F5F3] text-[#64748B]"><HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={2} /></button>
            </div>
            <label className="mt-5 block text-sm font-bold text-[#334155]">
              Reason (optional)
              <textarea value={cancelReason} onChange={(event) => setCancelReason(event.target.value)} maxLength={500} rows={3} placeholder="Tell the provider why you are cancelling" className="mt-2 w-full resize-none rounded-2xl border border-[#DDE9E1] px-4 py-3 text-sm font-medium outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-100" />
            </label>
            {cancelError && <p role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">{cancelError}</p>}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setCancelBooking(null)} className="h-11 rounded-xl border border-[#DDE9E1] text-sm font-bold text-[#64748B]">Keep booking</button>
              <button type="button" onClick={confirmCancellation} disabled={Boolean(updatingId)} className="h-11 rounded-xl bg-[#DC2626] text-sm font-bold text-white disabled:cursor-wait disabled:opacity-60">{updatingId ? "Cancelling..." : "Yes, cancel"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BookingCard({ booking, onCancel, onReviewed }) {
  const status = statusDetails[booking.status] || { label: booking.status, className: "bg-[#F1F5F9] text-[#475569]" };
  const whatsapp = String(booking.providerWhatsapp || "").replace(/\D/g, "");
  const whatsappUrl = buildWhatsAppUrl(whatsapp);
  const phone = booking.providerPhone;
  const contactAllowed = !["cancelled", "rejected"].includes(booking.status);

  return (
    <article className="rounded-[24px] border border-[#E3ECE6] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#ECFDF3] text-[#16A34A]">
            <HugeiconsIcon icon={Calendar03Icon} size={22} strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#94A3B8]">{booking.booking_code}</p>
            <h3 className="truncate text-base font-extrabold text-[#10231A]">{booking.helper}</h3>
            <p className="truncate text-xs font-medium text-[#6B7280]">{booking.service}</p>
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${status.className}`}>{status.label}</span>
      </div>

      <dl className="mt-4 grid gap-3 rounded-2xl bg-[#F8FAF9] p-4 sm:grid-cols-2">
        <div className="flex items-start gap-2.5"><HugeiconsIcon icon={Calendar03Icon} size={17} strokeWidth={1.8} className="mt-0.5 shrink-0 text-[#16A34A]" /><div><dt className="text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Date</dt><dd className="mt-0.5 text-xs font-bold text-[#334155]">{formatDate(booking.date)}</dd></div></div>
        <div className="flex items-start gap-2.5"><HugeiconsIcon icon={Clock01Icon} size={17} strokeWidth={1.8} className="mt-0.5 shrink-0 text-[#16A34A]" /><div><dt className="text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Time</dt><dd className="mt-0.5 text-xs font-bold text-[#334155]">{formatTime(booking.time)}</dd></div></div>
        <div className="flex items-start gap-2.5 sm:col-span-2"><HugeiconsIcon icon={Location01Icon} size={17} strokeWidth={1.8} className="mt-0.5 shrink-0 text-[#16A34A]" /><div className="min-w-0"><dt className="text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">Location</dt><dd className="mt-0.5 break-words text-xs font-bold text-[#334155]">{booking.location}</dd></div></div>
      </dl>

      {booking.note && <p className="mt-3 rounded-xl border border-[#E5EDE8] px-3 py-2 text-xs leading-5 text-[#64748B]"><span className="font-bold text-[#334155]">Your note: </span>{booking.note}</p>}
      {booking.reason && <p className="mt-3 rounded-xl bg-[#FFF7ED] px-3 py-2 text-xs leading-5 text-[#9A3412]"><span className="font-bold">Status reason: </span>{booking.reason}</p>}

      {booking.status === "completed" && booking.rating !== null && (
        <div className="mt-3 rounded-xl bg-[#FFFBEB] px-3 py-2">
          <div className="flex items-center justify-between"><p className="text-xs font-bold text-[#92400E]">Your review</p><span className="flex items-center gap-1 text-xs font-extrabold text-[#B45309]"><HugeiconsIcon icon={StarIcon} size={15} strokeWidth={2} />{Number(booking.rating).toFixed(1)}</span></div>
          {booking.reviewComment && <p className="mt-1 text-xs leading-5 text-[#92400E]">{booking.reviewComment}</p>}
        </div>
      )}

      {booking.status === "completed" && booking.canRate && <RatingSection booking={booking} onReviewed={onReviewed} />}

      {(booking.canCancel || booking.canRebook || (contactAllowed && (phone || whatsappUrl))) && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-[#F1F5F9] pt-4">
          {booking.canCancel && <button type="button" onClick={onCancel} className="inline-flex h-10 items-center justify-center rounded-xl border border-red-200 px-4 text-sm font-bold text-red-600 transition hover:bg-red-50">Cancel booking</button>}
          {booking.canRebook && <Link to={`/book/${encodeURIComponent(booking.provider_id)}`} className="inline-flex h-10 items-center justify-center rounded-xl bg-[#16A34A] px-4 text-sm font-bold text-white transition hover:bg-[#15803D]">Book again</Link>}
          {contactAllowed && phone && <a href={`tel:${phone}`} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#DDE9E1] px-4 text-sm font-bold text-[#334155] hover:bg-[#F7FAF8]"><HugeiconsIcon icon={Call02Icon} size={16} strokeWidth={2} />Call</a>}
          {contactAllowed && whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#BBF7D0] px-4 text-sm font-bold text-[#15803D] hover:bg-[#F0FDF4]"><HugeiconsIcon icon={WhatsappIcon} size={16} strokeWidth={2} />WhatsApp</a>}
        </div>
      )}
    </article>
  );
}

function RatingSection({ booking, onReviewed }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const submitRating = async () => {
    if (!rating || submitting) return;
    setSubmitting(true);
    setMessage("");
    try {
      await apiRequest(`/api/bookings/${booking.id}/review`, { method: "POST", body: { rating, comment: comment.trim() || null } });
      onReviewed(booking.id, rating, comment.trim());
    } catch (requestError) {
      setMessage(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-3 rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-4">
      <p className="text-center text-sm font-bold text-[#15803D]">How was your service?</p>
      <p className="mt-1 text-center text-xs text-[#6B7280]">Your honest review helps other customers.</p>
      <div className="mt-3 flex justify-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button" onClick={() => setRating(star)} aria-label={`Rate ${star} out of 5`} className="flex h-10 w-10 items-center justify-center rounded-lg transition hover:bg-[#DCFCE7] active:scale-90">
            <HugeiconsIcon icon={StarIcon} size={25} strokeWidth={1.8} className={star <= rating ? "text-[#F59E0B]" : "text-[#CBD5E1]"} />
          </button>
        ))}
      </div>
      <textarea value={comment} onChange={(event) => setComment(event.target.value)} rows={2} maxLength={800} placeholder="Share a short review (optional)" className="mt-3 w-full resize-none rounded-xl border border-[#BBF7D0] bg-white px-3 py-2 text-xs font-medium outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10" />
      <button type="button" onClick={submitRating} disabled={!rating || submitting} className="mt-3 flex h-10 w-full items-center justify-center rounded-xl bg-[#16A34A] text-xs font-bold text-white transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-50">{submitting ? "Submitting..." : rating ? "Submit review" : "Select a rating"}</button>
      {message && <p className="mt-2 text-center text-xs font-semibold text-red-600">{message}</p>}
    </div>
  );
}

function EmptyBookingsState({ title, description }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#CDE2D3] bg-white px-5 py-14 text-center shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ECFDF3] text-[#16A34A]"><HugeiconsIcon icon={CheckmarkCircle01Icon} size={26} strokeWidth={1.8} /></div>
      <h3 className="mt-4 text-base font-extrabold text-[#10231A]">{title}</h3>
      <p className="mx-auto mt-1 max-w-xs text-sm leading-5 text-[#6B7280]">{description}</p>
      <Link to="/services" className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-[#16A34A] px-5 text-sm font-bold text-white transition hover:bg-[#15803D]">Browse services</Link>
    </div>
  );
}

export default BookingsPage;
