import {
  Briefcase01Icon,
  Call02Icon,
  Cancel01Icon,
  Location01Icon,
  Mail01Icon,
  PencilEdit02Icon,
  SaveIcon,
  UserIcon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";

import ProviderSidebar from "./ProviderSidebar";
import ProviderTopBar from "./ProviderTopBar";
import ProviderBottomNav from "./ProviderBottomNav";
import { DEFAULT_LOCATION } from "../../hooks/usePreferredLocation";
import { apiRequest } from "../../lib/api";

const initialProfile = {
  businessName: "",
  ownerName: "",
  category: "",
  phone: "",
  whatsapp: "",
  email: "",
  location: DEFAULT_LOCATION,
  description: "",
};

function samePhoneNumber(first, second) {
  const normalize = (value) => String(value || "").replace(/\D/g, "").slice(-10);
  const firstNumber = normalize(first);
  return Boolean(firstNumber && firstNumber === normalize(second));
}

function ProviderProfilePage() {
  const [form, setForm] = useState(initialProfile);
  const [originalForm, setOriginalForm] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [whatsappSameAsPhone, setWhatsappSameAsPhone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    apiRequest("/api/provider/dashboard")
      .then((data) => {
        if (cancelled || !data.provider) return;
        const profile = data.provider;
        const nextForm = {
          businessName: profile.businessName || "",
          ownerName: profile.ownerName || "",
          category: profile.category || "",
          phone: profile.phone || "",
          whatsapp: profile.whatsapp || "",
          email: profile.email || "",
          location: profile.location || DEFAULT_LOCATION,
          description: profile.description || "",
        };
        setForm(nextForm);
        setOriginalForm(nextForm);
        setWhatsappSameAsPhone(samePhoneNumber(nextForm.phone, nextForm.whatsapp));
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

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setMessage("");
    setError("");
  };

  const beginEditing = () => {
    setOriginalForm(form);
    setWhatsappSameAsPhone(samePhoneNumber(form.phone, form.whatsapp));
    setMessage("");
    setError("");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setForm(originalForm);
    setWhatsappSameAsPhone(samePhoneNumber(originalForm.phone, originalForm.whatsapp));
    setMessage("");
    setError("");
    setIsEditing(false);
  };

  const setWhatsAppPreference = (useSameNumber) => {
    setWhatsappSameAsPhone(useSameNumber);
    if (useSameNumber) {
      setForm((current) => ({ ...current, whatsapp: current.phone }));
    }
    setMessage("");
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!isEditing || saving) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const data = await apiRequest("/api/provider/profile", {
        method: "PUT",
        body: {
          business_name: form.businessName,
          business_description: form.description,
          location: form.location,
          whatsapp: whatsappSameAsPhone ? form.phone : form.whatsapp,
        },
      });
      const savedForm = {
        ...form,
        whatsapp: whatsappSameAsPhone ? form.phone : form.whatsapp,
      };
      setForm(savedForm);
      setOriginalForm(savedForm);
      setIsEditing(false);
      setMessage(data.message || "Business profile updated successfully.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#DCE9E1] text-[#10231A]">
      <div className="flex">
        <ProviderSidebar />

        <div className="min-w-0 flex-1">
          <ProviderTopBar title="Business Profile" />

          <section className="border-b border-[#C7D8CF] bg-[#E6F0E9] px-4 py-5 sm:px-6">
            <div className="mx-auto flex max-w-6xl items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#CFE4D6] text-xl font-extrabold text-[#14532D]">
                {(form.businessName || "B").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#2E6B49]">Provider account</p>
                <h1 className="mt-1 truncate text-2xl font-extrabold tracking-[-0.035em] sm:text-3xl">{form.businessName || "Business Profile"}</h1>
                <p className="mt-1 truncate text-xs font-semibold text-[#5B7165]">Managed by {form.ownerName || "Provider"}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BFD1C5] bg-white/70 px-2.5 py-1 text-[11px] font-bold text-[#315844]">
                    <HugeiconsIcon icon={Briefcase01Icon} size={14} strokeWidth={2} />
                    {form.category || "Category not added"}
                  </span>
                  <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full border border-[#BFD1C5] bg-white/70 px-2.5 py-1 text-[11px] font-bold text-[#315844]">
                    <HugeiconsIcon icon={Location01Icon} size={14} strokeWidth={2} className="shrink-0" />
                    <span className="truncate">{form.location || "Location not added"}</span>
                  </span>
                </div>
              </div>
            </div>
          </section>

          <main className="mx-auto grid max-w-6xl gap-6 px-4 pb-28 pt-6 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-start lg:pb-10">
            <form onSubmit={handleSave} className="min-w-0">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold">Profile Information</h2>
                  <p className="mt-1 text-xs text-[#5B7165]">Manage the details customers use to understand your business.</p>
                </div>
                {!isEditing ? (
                  <button type="button" onClick={beginEditing} disabled={loading} aria-label="Edit business profile" className="flex h-9 items-center justify-center gap-1.5 rounded-xl border border-[#C7D8CF] bg-white px-3 text-xs font-bold text-[#315844] transition hover:bg-[#EDF4EF] disabled:opacity-50">
                    <HugeiconsIcon icon={PencilEdit02Icon} size={17} strokeWidth={2} />
                    Edit
                  </button>
                ) : (
                  <span className="rounded-full bg-[#CFE4D6] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#14532D]">Editing</span>
                )}
              </div>

              <section className="overflow-hidden rounded-2xl border border-[#C7D8CF] bg-white">
                <ProfileField icon={Briefcase01Icon} label="Business Name" value={form.businessName} onChange={(value) => handleChange("businessName", value)} readOnly={!isEditing} required />
                <ProfileField icon={UserIcon} label="Owner Name" value={form.ownerName} readOnly />
                <ProfileField icon={Briefcase01Icon} label="Category" value={form.category} readOnly />
                <ProfileField icon={Call02Icon} label="Phone Number" value={form.phone} readOnly type="tel" />
                <ProfileField
                  icon={WhatsappIcon}
                  label="WhatsApp Number"
                  value={whatsappSameAsPhone ? form.phone : form.whatsapp}
                  onChange={(value) => {
                    setWhatsappSameAsPhone(false);
                    handleChange("whatsapp", value);
                  }}
                  readOnly={!isEditing || whatsappSameAsPhone}
                  type="tel"
                  required
                />
                {isEditing && <WhatsAppPreference checked={whatsappSameAsPhone} onChange={setWhatsAppPreference} />}
                <ProfileField icon={Mail01Icon} label="Business Email" value={form.email} readOnly type="email" />
                <ProfileField icon={Location01Icon} label="Business Location" value={form.location} onChange={(value) => handleChange("location", value)} readOnly={!isEditing} isLast required />
              </section>

              <section className="mt-5 rounded-2xl border border-[#C7D8CF] bg-white p-4 sm:p-5">
                <label htmlFor="provider-description" className="text-sm font-extrabold">About your business</label>
                <p className="mt-1 text-xs text-[#64748B]">Tell customers what makes your service dependable.</p>
                <textarea
                  id="provider-description"
                  value={form.description}
                  onChange={(event) => handleChange("description", event.target.value)}
                  readOnly={!isEditing}
                  rows={5}
                  maxLength={2000}
                  placeholder="Describe your services, experience and working area"
                  className={`mt-3 w-full resize-none rounded-2xl border border-[#D4E1D8] p-4 text-sm font-medium outline-none transition ${isEditing ? "bg-[#FAFCFB] focus:border-[#2E7D4F] focus:bg-white focus:ring-4 focus:ring-[#B7D8C3]/45" : "cursor-default bg-[#F7FAF8] text-[#52685C]"}`}
                />
              </section>

              {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
              {message && <p className="mt-4 rounded-xl border border-[#A7D6B7] bg-[#EDF8F0] px-4 py-3 text-sm font-semibold text-[#166534]">{message}</p>}

              {isEditing && (
                <div className="mt-5 grid grid-cols-2 gap-3 sm:flex sm:justify-end">
                  <button type="button" onClick={cancelEditing} disabled={saving} className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#BFD1C5] bg-white px-5 text-sm font-extrabold text-[#40584C] disabled:opacity-60">
                    <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={2} />
                    Cancel
                  </button>
                  <button type="submit" disabled={loading || saving} className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#174A34] px-6 text-sm font-extrabold text-white transition hover:bg-[#123B2A] disabled:cursor-wait disabled:opacity-60">
                    <HugeiconsIcon icon={SaveIcon} size={18} strokeWidth={2} />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </form>

            <aside>
              <section className="rounded-2xl border border-[#C7D8CF] bg-white p-5">
                <h2 className="text-sm font-extrabold">Contact privacy</h2>
                <p className="mt-2 text-xs leading-5 text-[#64748B]">Your phone and WhatsApp details are not shown on public provider cards. Customers receive them only after creating a booking.</p>
              </section>
            </aside>
          </main>
        </div>
      </div>

      <ProviderBottomNav />
    </div>
  );
}

function WhatsAppPreference({ checked, onChange }) {
  return (
    <div className="border-b border-[#EDF2EE] bg-[#F7FAF8] px-4 py-3 pl-[4.25rem]">
      <label className="flex cursor-pointer items-start gap-2.5">
        <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#166534]" />
        <span>
          <span className="block text-xs font-extrabold text-[#315844]">WhatsApp number is same as phone</span>
          <span className="mt-0.5 block text-[11px] leading-4 text-[#64748B]">Turn this off to enter a different WhatsApp number.</span>
        </span>
      </label>
    </div>
  );
}

function ProfileField({ icon, label, value, onChange, readOnly = false, isLast = false, type = "text", required = false }) {
  return (
    <label className={`flex items-center gap-3 p-4 ${isLast ? "" : "border-b border-[#EDF2EE]"}`}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EDF4EF] text-[#315844]">
        <HugeiconsIcon icon={icon} size={19} strokeWidth={1.9} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-[#7B8D83]">{label}</span>
        {readOnly ? (
          <span className={`mt-0.5 block truncate text-sm font-semibold ${value ? "text-[#10231A]" : "text-[#94A3B8]"}`}>{value || "Not added"}</span>
        ) : (
          <input type={type} value={value} required={required} onChange={(event) => onChange(event.target.value)} className="mt-0.5 w-full border-0 bg-transparent p-0 text-sm font-semibold text-[#10231A] outline-none placeholder:text-[#94A3B8]" placeholder={`Enter ${label.toLowerCase()}`} />
        )}
      </span>
    </label>
  );
}

export default ProviderProfilePage;
