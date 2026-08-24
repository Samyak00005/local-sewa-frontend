import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Call02Icon,
  CancelCircleIcon,
  PencilEdit02Icon,
  Location01Icon,
  Mail01Icon,
  SaveIcon,
  UserCircle02Icon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";

import { apiRequest, saveSession } from "../../../lib/api";
import { DEFAULT_LOCATION, getPreferredLocation, setPreferredLocation } from "../../../hooks/usePreferredLocation";

function samePhoneNumber(first, second) {
  const normalize = (value) => String(value || "").replace(/\D/g, "").slice(-10);
  const firstNumber = normalize(first);
  return Boolean(firstNumber && firstNumber === normalize(second));
}

function ProfileInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [whatsappSameAsPhone, setWhatsappSameAsPhone] = useState(false);

  const [profile, setProfile] = useState({
    name: "Username",
    phone: "",
    whatsapp: "",
    email: "",
    location: DEFAULT_LOCATION,
  });

  const [originalProfile, setOriginalProfile] = useState(profile);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    apiRequest("/api/profile")
      .then((data) => {
        if (cancelled) return;
        const user = data.profile;
        const nextProfile = {
          name: user.full_name || "",
          phone: user.phone || "",
          whatsapp: user.whatsapp || "",
          email: user.email || "",
          location: getPreferredLocation() || user.location || DEFAULT_LOCATION,
        };
        setProfile(nextProfile);
        setOriginalProfile(nextProfile);
        setWhatsappSameAsPhone(samePhoneNumber(nextProfile.phone, nextProfile.whatsapp));
      })
      .catch((error) => {
        if (!cancelled) setMessage(error.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleEdit = () => {
    setOriginalProfile(profile);
    setWhatsappSameAsPhone(samePhoneNumber(profile.phone, profile.whatsapp));
    setIsEditing(true);
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setWhatsappSameAsPhone(samePhoneNumber(originalProfile.phone, originalProfile.whatsapp));
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setMessage("");
    try {
      const data = await apiRequest("/api/profile", {
        method: "PUT",
        body: {
          full_name: profile.name,
          email: profile.email,
          whatsapp: whatsappSameAsPhone ? profile.phone : profile.whatsapp,
          location: profile.location,
        },
      });
      const updated = data.profile;
      const nextProfile = {
        name: updated.full_name || "",
        phone: updated.phone || "",
        whatsapp: updated.whatsapp || "",
        email: updated.email || "",
        location: updated.location || DEFAULT_LOCATION,
      };
      setProfile(nextProfile);
      setOriginalProfile(nextProfile);
      setWhatsappSameAsPhone(samePhoneNumber(nextProfile.phone, nextProfile.whatsapp));
      saveSession(null, updated, localStorage.getItem("local_sewa_active_role") || "CUSTOMER");
      setPreferredLocation(nextProfile.location);
      setIsEditing(false);
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const setWhatsAppPreference = (useSameNumber) => {
    setWhatsappSameAsPhone(useSameNumber);
    if (useSameNumber) {
      setProfile((current) => ({ ...current, whatsapp: current.phone }));
    }
    setMessage("");
  };

  return (
    <section>
      {/* Section Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-[#111827]">
            Profile Information
          </h2>

          <p className="mt-1 text-xs text-[#6B7280]">Your basic information</p>
        </div>

        {/* Edit Button */}
        {!isEditing && (
          <button
            type="button"
            onClick={handleEdit}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-[#6B7280] transition hover:border-[#BBF7D0] hover:bg-[#F0FDF4] hover:text-[#15803D]"
            aria-label="Edit profile"
          >
            <HugeiconsIcon icon={PencilEdit02Icon} size={18} strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Profile Details */}
      <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
        {/* Name */}
        <ProfileField
          icon={UserCircle02Icon}
          label="Name"
          value={profile.name}
          isEditing={isEditing}
          placeholder="Enter your name"
          onChange={(value) => handleChange("name", value)}
        />

        {/* Phone */}
        <ProfileField
          icon={Call02Icon}
          label="Phone"
          value={profile.phone}
          isEditing={isEditing}
          placeholder="Enter phone number"
          type="tel"
          readOnly
          isLast={false}
          onChange={(value) => handleChange("phone", value)}
        />

        {/* WhatsApp */}
        <ProfileField
          icon={WhatsappIcon}
          label="WhatsApp"
          value={whatsappSameAsPhone ? profile.phone : profile.whatsapp}
          isEditing={isEditing}
          placeholder="Enter WhatsApp number"
          type="tel"
          readOnly={whatsappSameAsPhone}
          isLast={false}
          onChange={(value) => {
            setWhatsappSameAsPhone(false);
            handleChange("whatsapp", value);
          }}
        />

        {isEditing && (
          <div className="border-b border-[#F1F5F9] bg-[#FAFCFB] px-4 py-3 pl-[4.25rem]">
            <label className="flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={whatsappSameAsPhone}
                onChange={(event) => setWhatsAppPreference(event.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#16A34A]"
              />
              <span>
                <span className="block text-xs font-bold text-[#166534]">WhatsApp number is same as phone</span>
                <span className="mt-0.5 block text-[11px] leading-4 text-[#6B7280]">Turn this off to use a different WhatsApp number.</span>
              </span>
            </label>
          </div>
        )}

        {/* Email */}
        <ProfileField
          icon={Mail01Icon}
          label="Email"
          value={profile.email}
          isEditing={isEditing}
          placeholder="Enter email address"
          type="email"
          isLast={false}
          onChange={(value) => handleChange("email", value)}
        />

        {/* Location */}
        <ProfileField
          icon={Location01Icon}
          label="Location"
          value={profile.location}
          isEditing={isEditing}
          placeholder="Enter your location"
          isLast
          onChange={(value) => handleChange("location", value)}
        />

        {/* Edit Actions */}
        {isEditing && (
          <div className="flex gap-2 border-t border-[#F1F5F9] bg-[#FAFAFA] p-3">
            {/* Cancel */}
            <button
              type="button"
              onClick={handleCancel}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white text-sm font-semibold text-[#374151] transition hover:bg-[#F1F5F9] active:scale-[0.98]"
            >
              <HugeiconsIcon
                icon={CancelCircleIcon}
                size={17}
                strokeWidth={2}
              />
              Cancel
            </button>

            {/* Save */}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#16A34A] text-sm font-semibold text-white transition hover:bg-[#15803D] active:scale-[0.98]"
            >
              <HugeiconsIcon icon={SaveIcon} size={17} strokeWidth={2} />
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>

      {message && (
        <p className="mt-3 rounded-xl bg-[#F0FDF4] px-3 py-2 text-xs font-semibold text-[#15803D]">
          {message}
        </p>
      )}
    </section>
  );
}

/* ----- Profile Field Component -------- */

function ProfileField({
  icon,
  label,
  value,
  isEditing,
  placeholder,
  type = "text",
  isLast = false,
  onChange,
  readOnly = false,
}) {
  return (
    <div
      className={`flex items-center gap-3 p-4 ${
        !isLast ? "border-b border-[#F1F5F9]" : ""
      }`}
    >
      {/* Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1F5F9] text-[#6B7280]">
        <HugeiconsIcon icon={icon} size={20} strokeWidth={1.8} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-xs text-[#9CA3AF]">{label}</p>

        {isEditing && !readOnly ? (
          <input
            type={type}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="mt-1 w-full border-0 bg-transparent p-0 text-sm font-semibold text-[#111827] outline-none placeholder:text-[#9CA3AF]"
          />
        ) : (
          <p
            className={`mt-0.5 text-sm font-semibold ${
              value ? "text-[#111827]" : "text-[#9CA3AF]"
            }`}
          >
            {value || "Not added"}
          </p>
        )}
      </div>
    </div>
  );
}

export default ProfileInfo;
