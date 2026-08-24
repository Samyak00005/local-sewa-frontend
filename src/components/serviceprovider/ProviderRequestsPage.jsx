import { useEffect, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  Call02Icon,
  Cancel01Icon,
  Clock01Icon,
  Location01Icon,
  Mail01Icon,
  StarIcon,
  UserIcon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";

import ProviderSidebar from "./ProviderSidebar";
import ProviderTopBar from "./ProviderTopBar";
import ProviderBottomNav from "./ProviderBottomNav";
import { PROVIDER_REQUESTS_CHANGED_EVENT } from "../../hooks/useProviderRequestCount";
import { apiRequest } from "../../lib/api";
import { buildWhatsAppUrl } from "../../lib/contact";

const statusDetails = {
  pending: { label: "New request", className: "border border-[#FDE68A] bg-[#FFFBEB] text-[#A16207]" },
  accepted: { label: "Accepted", className: "border border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8]" },
  in_progress: { label: "In progress", className: "border border-[#DDD6FE] bg-[#F5F3FF] text-[#6D28D9]" },
  completed: { label: "Completed", className: "border border-[#86EFAC] bg-[#DCFCE7] text-[#166534]" },
  rejected: { label: "Rejected", className: "border border-[#FECDD3] bg-[#FFF1F2] text-[#BE123C]" },
  cancelled: { label: "Cancelled", className: "border border-[#CBD5E1] bg-[#F1F5F9] text-[#475569]" },
  not_completed: { label: "Not completed", className: "border border-[#FED7AA] bg-[#FFF7ED] text-[#C2410C]" },
};

const filters = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "active", label: "Active" },
  { id: "closed", label: "Closed" },
];

function formatDate(value) {
  if (!value) return "Date not set";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function formatTime(value) {
  if (!value) return "Time not set";
  const [hour, minute] = value.split(":");
  const date = new Date(2000, 0, 1, Number(hour), Number(minute));
  return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(date);
}

function actionsFor(status) {
  if (status === "pending") {
    return [
      { status: "accepted", label: "Accept request", primary: true },
      { status: "rejected", label: "Reject", reasonRequired: true },
    ];
  }
  if (status === "accepted") {
    return [
      { status: "in_progress", label: "Start job", primary: true },
      { status: "rejected", label: "Reject", reasonRequired: true },
    ];
  }
  if (status === "in_progress") {
    return [
      { status: "completed", label: "Mark completed", primary: true },
      { status: "not_completed", label: "Could not complete", reasonRequired: true },
    ];
  }
  return [];
}

function ProviderRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionDialog, setActionDialog] = useState(null);
  const [reason, setReason] = useState("");
  const [dialogError, setDialogError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    apiRequest("/api/bookings?scope=provider")
      .then((data) => {
        if (!cancelled) setRequests(data.bookings || []);
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

  const counts = useMemo(() => ({
    all: requests.length,
    new: requests.filter((item) => item.status === "pending").length,
    active: requests.filter((item) => ["accepted", "in_progress"].includes(item.status)).length,
    closed: requests.filter((item) => ["completed", "rejected", "cancelled", "not_completed"].includes(item.status)).length,
  }), [requests]);

  const filteredRequests = useMemo(() => requests.filter((request) => {
    if (filter === "new") return request.status === "pending";
    if (filter === "active") return ["accepted", "in_progress"].includes(request.status);
    if (filter === "closed") return ["completed", "rejected", "cancelled", "not_completed"].includes(request.status);
    return true;
  }), [filter, requests]);

  const openAction = (request, action) => {
    setReason("");
    setDialogError("");
    setError("");
    setActionDialog({ request, ...action });
  };

  const updateStatus = async () => {
    if (!actionDialog || updatingId) return;
    if (actionDialog.reasonRequired && reason.trim().length < 3) {
      setDialogError("Please enter a clear reason before continuing.");
      return;
    }

    const { request, status } = actionDialog;
    setUpdatingId(request.id);
    setError("");
    try {
      const data = await apiRequest(`/api/bookings/${request.id}/status`, {
        method: "PATCH",
        body: { status: status.toUpperCase(), reason: reason.trim() || null },
      });
      setRequests((current) => current.map((item) => (
        item.id === request.id
          ? { ...item, status: data.status || status, reason: reason.trim() || null }
          : item
      )));
      setActionDialog(null);
      setReason("");
      window.dispatchEvent(new Event(PROVIDER_REQUESTS_CHANGED_EVENT));
    } catch (requestError) {
      setDialogError(requestError.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#DCE9E1]">
      <div className="flex">
        <ProviderSidebar />

        <div className="min-w-0 flex-1">
          <ProviderTopBar title="Service Requests" />

          <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:pb-10 lg:pt-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#16A34A]">Booking management</p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#10231A] sm:text-3xl">Customer requests</h2>
                <p className="mt-1 text-sm text-[#64748B]">Accept new work and update each job until completion.</p>
              </div>
              <div className="rounded-2xl border border-[#C8D9CF] bg-white px-4 py-3 text-sm text-[#40584C]">
                <span className="font-extrabold text-[#15803D]">{counts.active}</span> active job{counts.active === 1 ? "" : "s"}
              </div>
            </div>

            {error && (
              <div role="alert" className="mt-5 flex items-start justify-between gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                <span>{error}</span>
                <button type="button" aria-label="Dismiss error" onClick={() => setError("")} className="shrink-0">
                  <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={2} />
                </button>
              </div>
            )}

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1" aria-label="Request filters">
              {filters.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition sm:text-sm ${
                    filter === item.id ? "bg-[#15803D] text-white shadow-sm" : "border border-[#DDE9E1] bg-white text-[#64748B] hover:border-[#86EFAC]"
                  }`}
                >
                  {item.label} <span className="ml-1 opacity-75">{counts[item.id]}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] font-medium text-[#5B7165]">
              New = waiting for your response · Active = accepted or in progress · Closed = finished requests
            </p>

            {loading && (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-60 animate-pulse rounded-[22px] bg-white" />)}
              </div>
            )}

            {!loading && filteredRequests.length > 0 && (
              <div className="mt-6 grid items-start gap-4 md:grid-cols-2">
                {filteredRequests.map((request) => {
                  const status = statusDetails[request.status] || { label: request.status, className: "bg-[#F1F5F9] text-[#475569]" };
                  const actions = actionsFor(request.status);
                  const customerWhatsappUrl = buildWhatsAppUrl(request.customerWhatsapp || request.customerPhone);
                  return (
                    <article key={request.id} className="rounded-[22px] border border-[#D8E5DC] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#94A3B8]">{request.booking_code}</p>
                          <h3 className="mt-1 truncate text-base font-extrabold text-[#10231A]">{request.service}</h3>
                        </div>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${status.className}`}>{status.label}</span>
                      </div>

                      <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-[#F4F8F5] p-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#15803D] shadow-sm">
                          <HugeiconsIcon icon={UserIcon} size={18} strokeWidth={2} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-[#94A3B8]">Customer</p>
                          <p className="truncate text-sm font-extrabold text-[#334155]">{request.customerName || "Customer"}</p>
                        </div>
                      </div>

                      <div className="mt-2.5 rounded-xl border border-[#DDE9E1] bg-[#FAFCFB] p-2.5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#15803D]">Customer contact details</p>
                        <div className="mt-2 grid grid-cols-2 gap-1.5">
                          {request.customerPhone && <a href={`tel:${request.customerPhone}`} className="flex min-w-0 items-center gap-1.5 rounded-lg bg-white px-2.5 py-2 text-[11px] font-bold text-[#334155] ring-1 ring-[#E3ECE6] hover:text-[#15803D]"><HugeiconsIcon icon={Call02Icon} size={15} strokeWidth={2} className="shrink-0 text-[#16A34A]" /><span className="truncate">{request.customerPhone}</span></a>}
                          {customerWhatsappUrl && <a href={customerWhatsappUrl} target="_blank" rel="noreferrer" className="flex min-w-0 items-center gap-1.5 rounded-lg bg-white px-2.5 py-2 text-[11px] font-bold text-[#15803D] ring-1 ring-[#BBF7D0] hover:bg-[#F0FDF4]"><HugeiconsIcon icon={WhatsappIcon} size={15} strokeWidth={2} className="shrink-0" /><span className="truncate">WhatsApp</span></a>}
                          {request.customerEmail && <a href={`mailto:${request.customerEmail}`} className="col-span-2 flex min-w-0 items-center gap-1.5 rounded-lg bg-white px-2.5 py-2 text-[11px] font-bold text-[#334155] ring-1 ring-[#E3ECE6] hover:text-[#15803D]"><HugeiconsIcon icon={Mail01Icon} size={15} strokeWidth={2} className="shrink-0 text-[#16A34A]" /><span className="truncate">{request.customerEmail}</span></a>}
                        </div>
                      </div>

                      <dl className="mt-3 grid grid-cols-2 gap-2.5 text-sm">
                        <div className="flex items-start gap-2 text-[#475569]">
                          <HugeiconsIcon icon={Calendar03Icon} size={17} strokeWidth={2} className="mt-0.5 shrink-0 text-[#16A34A]" />
                          <div><dt className="text-[10px] font-bold uppercase text-[#94A3B8]">Date</dt><dd className="font-semibold">{formatDate(request.date)}</dd></div>
                        </div>
                        <div className="flex items-start gap-2 text-[#475569]">
                          <HugeiconsIcon icon={Clock01Icon} size={17} strokeWidth={2} className="mt-0.5 shrink-0 text-[#16A34A]" />
                          <div><dt className="text-[10px] font-bold uppercase text-[#94A3B8]">Time</dt><dd className="font-semibold">{formatTime(request.time)}</dd></div>
                        </div>
                        <div className="col-span-2 flex items-start gap-2 text-[#475569]">
                          <HugeiconsIcon icon={Location01Icon} size={17} strokeWidth={2} className="mt-0.5 shrink-0 text-[#16A34A]" />
                          <div className="min-w-0"><dt className="text-[10px] font-bold uppercase text-[#94A3B8]">Service address</dt><dd className="break-words font-semibold">{request.location}</dd></div>
                        </div>
                      </dl>

                      {request.note && <p className="mt-3 rounded-xl border border-[#E5EDE8] px-3 py-2 text-xs leading-5 text-[#64748B]"><span className="font-bold text-[#334155]">Customer note: </span>{request.note}</p>}
                      {request.reason && <p className="mt-3 rounded-xl bg-[#FFF7ED] px-3 py-2 text-xs leading-5 text-[#9A3412]"><span className="font-bold">Reason: </span>{request.reason}</p>}

                      {request.status === "completed" && request.rating !== null && (
                        <div className="mt-3 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#A16207]">Customer review</p>
                            <span className="flex items-center gap-1 text-xs font-extrabold text-[#B45309]">
                              <HugeiconsIcon icon={StarIcon} size={15} strokeWidth={2} />
                              {Number(request.rating).toFixed(1)}
                            </span>
                          </div>
                          <div className="mt-2 flex gap-1 text-[#F59E0B]" aria-label={`${request.rating} out of 5 stars`}>
                            {Array.from({ length: 5 }, (_, index) => (
                              <HugeiconsIcon key={index} icon={StarIcon} size={16} strokeWidth={2} className={index < Number(request.rating) ? "opacity-100" : "opacity-25"} />
                            ))}
                          </div>
                          {request.reviewComment && <p className="mt-2 text-xs leading-5 text-[#92400E]">{request.reviewComment}</p>}
                        </div>
                      )}

                      {actions.length > 0 && (
                        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#F1F5F9] pt-3">
                          {actions.slice().reverse().map((action) => (
                            <button
                              key={action.status}
                              type="button"
                              disabled={updatingId === request.id}
                              onClick={() => openAction(request, action)}
                              className={`h-10 rounded-xl text-xs font-bold transition disabled:cursor-wait disabled:opacity-60 sm:text-sm ${
                                action.primary ? "bg-[#16A34A] text-white hover:bg-[#15803D]" : "border border-[#DDE9E1] text-[#64748B] hover:bg-[#F8FAFC]"
                              }`}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}

            {!loading && filteredRequests.length === 0 && (
              <div className="mt-6 rounded-[24px] border border-dashed border-[#CDE2D3] bg-white px-6 py-14 text-center">
                <h3 className="text-base font-extrabold text-[#10231A]">No requests in this section</h3>
                <p className="mt-1 text-sm text-[#64748B]">New customer bookings will appear here automatically.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <ProviderBottomNav />

      {actionDialog && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-[#0F172A]/45 px-4 py-4 backdrop-blur-[2px] sm:items-center" role="dialog" aria-modal="true" aria-labelledby="request-action-title">
          <div data-keyboard-scroll className="w-full max-w-md overflow-y-auto rounded-[24px] bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.3)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#16A34A]">{actionDialog.request.booking_code}</p>
                <h3 id="request-action-title" className="mt-1 text-xl font-extrabold text-[#10231A]">{actionDialog.label}?</h3>
                <p className="mt-1 text-sm text-[#64748B]">{actionDialog.request.service} for {actionDialog.request.customerName || "customer"}</p>
              </div>
              <button type="button" onClick={() => setActionDialog(null)} aria-label="Close" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F1F5F3] text-[#64748B]">
                <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={2} />
              </button>
            </div>

            {actionDialog.reasonRequired && (
              <label className="mt-5 block text-sm font-bold text-[#334155]">
                Reason <span className="text-red-600">*</span>
                <textarea
                  value={reason}
                  onChange={(event) => {
                    setReason(event.target.value);
                    setDialogError("");
                  }}
                  maxLength={500}
                  rows={3}
                  autoFocus
                  placeholder="Write a clear reason for the customer"
                  className="mt-2 w-full resize-none rounded-2xl border border-[#DDE9E1] px-4 py-3 text-sm font-medium outline-none transition focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
                />
              </label>
            )}

            {dialogError && <p role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">{dialogError}</p>}

            <p className="mt-4 rounded-xl bg-[#F7FAF8] px-3 py-2 text-xs leading-5 text-[#64748B]">The customer will see the updated status in My Bookings.</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setActionDialog(null)} className="h-11 rounded-xl border border-[#DDE9E1] text-sm font-bold text-[#64748B]">Go back</button>
              <button type="button" onClick={updateStatus} disabled={Boolean(updatingId) || (actionDialog.reasonRequired && reason.trim().length < 3)} className="h-11 rounded-xl bg-[#16A34A] text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">
                {updatingId ? "Updating..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProviderRequestsPage;
