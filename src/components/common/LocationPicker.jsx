import {
  ArrowDown01Icon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  Location01Icon,
  Search02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";

import { usePreferredLocation } from "../../hooks/usePreferredLocation";
import { useServiceDirectory } from "../../hooks/useServiceDirectory";
import { apiRequest, getToken, saveSession } from "../../lib/api";

const SUGGESTED_LOCATIONS = [
  "Chandrapur, Maharashtra", "Tukum, Chandrapur", "Nagpur, Maharashtra",
  "Pune, Maharashtra", "Mumbai, Maharashtra", "Nashik, Maharashtra",
  "Amravati, Maharashtra", "Chhatrapati Sambhajinagar, Maharashtra",
  "Kolhapur, Maharashtra", "Solapur, Maharashtra", "Thane, Maharashtra",
  "Navi Mumbai, Maharashtra", "Nanded, Maharashtra", "Akola, Maharashtra",
  "Wardha, Maharashtra", "Yavatmal, Maharashtra", "Gondia, Maharashtra",
  "Bhandara, Maharashtra", "Gadchiroli, Maharashtra", "Delhi",
  "Bengaluru, Karnataka", "Hyderabad, Telangana", "Chennai, Tamil Nadu",
  "Kolkata, West Bengal", "Ahmedabad, Gujarat", "Surat, Gujarat",
  "Jaipur, Rajasthan", "Lucknow, Uttar Pradesh", "Kanpur, Uttar Pradesh",
  "Indore, Madhya Pradesh", "Bhopal, Madhya Pradesh", "Patna, Bihar",
  "Ranchi, Jharkhand", "Bhubaneswar, Odisha", "Raipur, Chhattisgarh",
  "Chandigarh", "Dehradun, Uttarakhand", "Kochi, Kerala",
  "Thiruvananthapuram, Kerala", "Coimbatore, Tamil Nadu", "Visakhapatnam, Andhra Pradesh",
  "Vijayawada, Andhra Pradesh", "Guwahati, Assam", "Srinagar, Jammu and Kashmir",
  "Shimla, Himachal Pradesh", "Panaji, Goa", "Vadodara, Gujarat",
  "Rajkot, Gujarat", "Jodhpur, Rajasthan", "Udaipur, Rajasthan",
  "Agra, Uttar Pradesh", "Varanasi, Uttar Pradesh", "Prayagraj, Uttar Pradesh",
  "Meerut, Uttar Pradesh", "Noida, Uttar Pradesh", "Gurugram, Haryana",
  "Faridabad, Haryana", "Ludhiana, Punjab", "Amritsar, Punjab",
  "Jalandhar, Punjab", "Mysuru, Karnataka", "Mangaluru, Karnataka",
  "Madurai, Tamil Nadu", "Tiruchirappalli, Tamil Nadu", "Salem, Tamil Nadu",
  "Kozhikode, Kerala", "Thrissur, Kerala", "Jamshedpur, Jharkhand",
  "Dhanbad, Jharkhand", "Cuttack, Odisha", "Siliguri, West Bengal",
];

const variantClasses = {
  hero: "border-white/25 bg-white/12 px-2.5 py-1.5 text-white shadow-[0_8px_24px_rgba(0,0,0,0.10)] hover:bg-white/20",
  header: "h-10 max-w-52 border-white/15 bg-white/10 px-3 text-white/90 hover:bg-white/15 hover:text-white",
  page: "h-11 border-[#BBF7D0] bg-[#F0FDF4] px-4 text-[#15803D] hover:bg-[#DCFCE7]",
  sidebar: "w-full border-[#DDE9E1] bg-[#F7FAF8] px-3 py-2.5 text-[#10231A] hover:border-[#BBF7D0] hover:bg-[#F0FDF4]",
};

function LocationPicker({ variant = "page", className = "", onChange }) {
  const [location, updateLocation] = usePreferredLocation();
  const { providers } = useServiceDirectory();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef(null);

  const locations = useMemo(() => {
    const values = [
      location,
      ...providers.map((provider) => provider.location),
      ...SUGGESTED_LOCATIONS,
    ];
    const unique = new Map();
    values.filter(Boolean).forEach((value) => {
      const cleaned = String(value).trim();
      if (cleaned) unique.set(cleaned.toLocaleLowerCase("en-IN"), cleaned);
    });
    return [...unique.values()];
  }, [location, providers]);

  const filteredLocations = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("en-IN");
    if (!query) return locations;
    return locations.filter((item) => item.toLocaleLowerCase("en-IN").includes(query));
  }, [locations, search]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const commitVerifiedLocation = (value) => {
    const nextLocation = String(value || "").trim().replace(/\s+/g, " ");
    if (!updateLocation(nextLocation)) {
      setError("Location could not be saved. Please try again.");
      return false;
    }
    setSearch("");
    setError("");
    setIsOpen(false);
    onChange?.(nextLocation);

    if (getToken()) {
      apiRequest("/api/profile/location", {
        method: "PUT",
        body: { location: nextLocation },
      }).then((data) => {
        if (data.user) {
          saveSession(
            null,
            data.user,
            localStorage.getItem("local_sewa_active_role") || "CUSTOMER",
          );
        }
      }).catch(() => {
        // The device preference is already saved; account sync can retry later.
      });
    }
    return true;
  };

  const validateAndSaveLocation = async (value) => {
    const query = String(value || "").trim().replace(/\s+/g, " ");
    if (/^\d+$/.test(query) && !/^[1-9]\d{5}$/.test(query)) {
      setError("Please enter a valid 6-digit Indian PIN code.");
      return;
    }
    if (!/^\d+$/.test(query) && !/\p{L}{2,}/u.test(query)) {
      setError("Please enter a real Indian city or area name.");
      return;
    }

    setIsVerifying(true);
    setError("");
    try {
      const data = await apiRequest(
        `/api/location/validate?q=${encodeURIComponent(query)}`,
        { token: null },
      );
      if (!data.verified || !data.location) {
        throw new Error("This location could not be verified in India.");
      }
      commitVerifiedLocation(data.location);
    } catch (validationError) {
      setError(validationError?.message || "This location could not be verified. Try a city or 6-digit PIN code.");
    } finally {
      setIsVerifying(false);
    }
  };

  const openPicker = () => {
    setSearch("");
    setError("");
    setIsOpen(true);
  };

  const useCurrentLocation = async () => {
    setError("");

    if (!window.isSecureContext) {
      setError("Current location works only on a secure HTTPS website.");
      return;
    }
    if (!("geolocation" in navigator)) {
      setError("Current location is not supported by this browser. Enter your area manually.");
      return;
    }

    setIsLocating(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000,
        });
      });
      const latitude = position.coords.latitude.toFixed(6);
      const longitude = position.coords.longitude.toFixed(6);
      const data = await apiRequest(
        `/api/location/reverse?lat=${encodeURIComponent(latitude)}&lng=${encodeURIComponent(longitude)}`,
        { token: null },
      );

      if (!data.location) {
        throw new Error("The location name could not be found. Enter your area manually.");
      }
      commitVerifiedLocation(data.location);
    } catch (locationError) {
      if (locationError?.code === 1) {
        setError("Location permission was denied. Allow location access in browser settings and try again.");
      } else if (locationError?.code === 2) {
        setError("Your device could not determine its location. Turn on GPS and try again.");
      } else if (locationError?.code === 3) {
        setError("Location detection timed out. Move near a window or enter your area manually.");
      } else {
        setError(locationError?.message || "Unable to detect your location. Please try again.");
      }
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openPicker}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`inline-flex items-center gap-2 border text-sm font-semibold shadow-sm transition ${variant === "hero" ? "rounded-full" : "rounded-xl"} ${variantClasses[variant] || variantClasses.page} ${className}`}
      >
        <span className={`${variant === "sidebar" ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF3] text-[#16A34A]" : variant === "hero" ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10" : "shrink-0"}`}>
          <HugeiconsIcon icon={Location01Icon} size={variant === "sidebar" ? 19 : 17} strokeWidth={2} />
        </span>
        {variant === "sidebar" ? (
          <span className="min-w-0 flex-1 text-left">
            <span className="block text-[9px] font-bold uppercase tracking-[0.12em] text-[#9CA3AF]">Your location</span>
            <span className="mt-0.5 block truncate text-xs font-bold text-[#10231A]">{location}</span>
          </span>
        ) : (
          <span className="truncate">{location}</span>
        )}
        <HugeiconsIcon icon={ArrowDown01Icon} size={14} strokeWidth={2} className="ml-auto shrink-0" />
      </button>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[12000] flex items-end justify-center bg-[#0F172A]/55 p-3 backdrop-blur-sm sm:items-center" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsOpen(false); }}>
          <section data-keyboard-scroll role="dialog" aria-modal="true" aria-labelledby="location-picker-title" className="w-full max-w-lg overflow-y-auto overscroll-contain rounded-[26px] bg-white shadow-[0_28px_90px_rgba(15,23,42,0.35)]">
            <div className="flex items-start justify-between gap-4 border-b border-[#E5EDE8] px-5 py-5 sm:px-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#16A34A]">Service area</p>
                <h2 id="location-picker-title" className="mt-1 text-xl font-extrabold text-[#10231A]">Set your location</h2>
                <p className="mt-1 text-xs leading-5 text-[#64748B]">Only verified Indian cities, areas and 6-digit PIN codes can be saved.</p>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close location picker" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1F5F9] text-[#64748B] transition hover:bg-[#E2E8F0]">
                <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={2} />
              </button>
            </div>

            <div className="p-5 pb-0 sm:px-6 sm:pt-6">
              <button type="button" onClick={useCurrentLocation} disabled={isLocating} className="flex min-h-14 w-full items-center gap-3 rounded-2xl border border-[#86EFAC] bg-[#F0FDF4] px-4 py-3 text-left text-[#15803D] transition hover:bg-[#DCFCE7] disabled:cursor-wait disabled:opacity-70">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  {isLocating ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#BBF7D0] border-t-[#15803D]" aria-hidden="true" /> : <HugeiconsIcon icon={Location01Icon} size={21} strokeWidth={2.2} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-extrabold">{isLocating ? "Finding your location..." : "Use current location"}</span>
                  <span className="mt-0.5 block text-[11px] font-medium leading-4 text-[#527060]">GPS से area, city, state और PIN code पता करें</span>
                </span>
              </button>
              <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="mt-1.5 block text-right text-[9px] font-semibold text-[#94A3B8] hover:text-[#15803D]">Location data © OpenStreetMap contributors</a>
              <div className="my-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#94A3B8]"><span className="h-px flex-1 bg-[#E2E8F0]" />or enter manually<span className="h-px flex-1 bg-[#E2E8F0]" /></div>
            </div>

            <form onSubmit={(event) => { event.preventDefault(); validateAndSaveLocation(search); }} className="px-5 pb-5 sm:px-6 sm:pb-6">
              <label htmlFor="location-search" className="mb-2 block text-xs font-bold text-[#334155]">City, area or PIN code</label>
              <div className="flex h-12 items-center gap-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] px-3 focus-within:border-[#16A34A] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#DCFCE7]">
                <HugeiconsIcon icon={Search02Icon} size={19} strokeWidth={2} className="shrink-0 text-[#94A3B8]" />
                <input id="location-search" ref={inputRef} value={search} onChange={(event) => { setSearch(event.target.value); setError(""); }} autoComplete="address-level2" inputMode={/^\d*$/.test(search) ? "numeric" : "text"} maxLength={120} placeholder="Example: Chandrapur or 442401" className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#10231A] outline-none placeholder:text-[#94A3B8]" />
                {search && <button type="button" onClick={() => setSearch("")} aria-label="Clear location"><HugeiconsIcon icon={Cancel01Icon} size={17} strokeWidth={2} className="text-[#94A3B8]" /></button>}
              </div>
              {error && <p role="alert" className="mt-2 rounded-xl bg-red-50 px-3 py-2.5 text-xs font-semibold leading-5 text-red-700">{error}</p>}
              {search.trim() && (
                <button type="submit" disabled={isVerifying} className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#15803D] px-4 text-sm font-bold text-white transition hover:bg-[#166534] disabled:cursor-wait disabled:opacity-70">
                  {isVerifying ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" /> : <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} strokeWidth={2} />}
                  {isVerifying ? "Verifying location..." : `Verify & use “${search.trim()}”`}
                </button>
              )}
            </form>

            <div className="max-h-[42vh] overflow-y-auto border-t border-[#EEF3F0] px-3 pb-5 pt-3 sm:px-4">
              <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#94A3B8]">Suggested locations</p>
              {filteredLocations.length ? filteredLocations.slice(0, 12).map((item) => (
                <button key={item} type="button" disabled={isVerifying} onClick={() => validateAndSaveLocation(item)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition hover:bg-[#F0FDF4] hover:text-[#15803D] disabled:cursor-wait disabled:opacity-60 ${item.toLocaleLowerCase("en-IN") === location.toLocaleLowerCase("en-IN") ? "bg-[#F0FDF4] text-[#15803D]" : "text-[#334155]"}`}>
                  <HugeiconsIcon icon={Location01Icon} size={18} strokeWidth={2} className="shrink-0 text-[#16A34A]" />
                  <span className="min-w-0 flex-1 truncate">{item}</span>
                  {item.toLocaleLowerCase("en-IN") === location.toLocaleLowerCase("en-IN") && <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} strokeWidth={2} />}
                </button>
              )) : <p className="px-3 py-5 text-center text-sm text-[#64748B]">No suggestion matches. Verify the city or 6-digit PIN entered above.</p>}
            </div>
          </section>
        </div>,
        document.body,
      )}
    </>
  );
}

export default LocationPicker;
