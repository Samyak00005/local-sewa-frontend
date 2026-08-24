import { useCallback, useEffect, useState } from "react";

import { getStoredUser } from "../lib/api";

const LOCATION_KEY = "local_sewa_location";
const VERIFIED_LOCATION_KEY = "local_sewa_location_verified";
const LOCATION_EVENT = "local-sewa-location-change";
const LOCATION_STOP_WORDS = new Set([
  "india", "district", "division", "state", "taluka", "tehsil",
  "andhra", "pradesh", "arunachal", "assam", "bihar", "chhattisgarh",
  "goa", "gujarat", "haryana", "himachal", "jharkhand", "karnataka",
  "kerala", "madhya", "maharashtra", "manipur", "meghalaya", "mizoram",
  "nagaland", "odisha", "punjab", "rajasthan", "sikkim", "tamil", "nadu",
  "telangana", "tripura", "uttar", "uttarakhand", "west", "bengal",
  "jammu", "kashmir",
]);

export const DEFAULT_LOCATION =
  (import.meta.env.VITE_DEFAULT_LOCATION || "").trim() || "Chandrapur";

export function getPreferredLocation() {
  try {
    const savedLocation = localStorage.getItem(LOCATION_KEY)?.trim();
    const profileLocation = getStoredUser()?.location?.trim();
    const savedLocationVerified = localStorage.getItem(VERIFIED_LOCATION_KEY) === "1";
    const plausibleProfileLocation = /^[1-9]\d{5}$/.test(profileLocation || "")
      || /\p{L}{2,}/u.test(profileLocation || "");
    return (savedLocationVerified ? savedLocation : "")
      || (plausibleProfileLocation ? profileLocation : "")
      || DEFAULT_LOCATION;
  } catch {
    return DEFAULT_LOCATION;
  }
}

export function setPreferredLocation(location) {
  const nextLocation = String(location || "").trim();
  if (nextLocation.length < 2) return false;
  try {
    localStorage.setItem(LOCATION_KEY, nextLocation);
    localStorage.setItem(VERIFIED_LOCATION_KEY, "1");
  } catch {
    return false;
  }
  window.dispatchEvent(new CustomEvent(LOCATION_EVENT, { detail: nextLocation }));
  return true;
}

export function locationsMatch(providerLocation, preferredLocation) {
  const normalize = (value) => String(value || "")
    .toLocaleLowerCase("en-IN")
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");

  const provider = normalize(providerLocation);
  const preferred = normalize(preferredLocation);
  if (!provider || !preferred) return false;

  if (provider.includes(preferred) || preferred.includes(provider)) return true;

  const providerPins = provider.match(/\b[1-9]\d{5}\b/g) || [];
  const preferredPins = preferred.match(/\b[1-9]\d{5}\b/g) || [];
  if (providerPins.length && preferredPins.length) {
    return providerPins.some((pin) => preferredPins.includes(pin));
  }

  const localityTokens = (value) => new Set(value
    .split(" ")
    .filter((token) => token.length >= 4 && !/^\d+$/.test(token) && !LOCATION_STOP_WORDS.has(token)));
  const providerTokens = localityTokens(provider);
  const preferredTokens = localityTokens(preferred);

  return [...providerTokens].some((token) => preferredTokens.has(token));
}

export function usePreferredLocation() {
  const [location, setLocation] = useState(getPreferredLocation);

  useEffect(() => {
    const syncLocation = (event) => {
      setLocation(event.detail || getPreferredLocation());
    };
    window.addEventListener(LOCATION_EVENT, syncLocation);
    window.addEventListener("storage", syncLocation);
    return () => {
      window.removeEventListener(LOCATION_EVENT, syncLocation);
      window.removeEventListener("storage", syncLocation);
    };
  }, []);

  const updateLocation = useCallback((nextLocation) => {
    const normalizedLocation = String(nextLocation || "").trim();
    if (!setPreferredLocation(normalizedLocation)) return false;
    setLocation(normalizedLocation);
    return true;
  }, []);

  return [location, updateLocation];
}
