import {
  ArrowDown01Icon,
  Bookmark01Icon,
  Briefcase01Icon,
  Calendar03Icon,
  GridViewIcon,
  Home01Icon,
  Logout01Icon,
  Menu01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { apiRequest, clearSession, getStoredUser, getToken } from "../../lib/api";
import Sidebar from "../customer/sidebar/Sidebar";
import LocationPicker from "./LocationPicker";

const navItems = [
  { name: "Home", path: "/", icon: Home01Icon },
  { name: "Services", path: "/services", icon: GridViewIcon },
  { name: "Bookings", path: "/bookings", icon: Calendar03Icon },
  { name: "Saved", path: "/saved", icon: Bookmark01Icon },
];

function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const navigate = useNavigate();
  const user = getStoredUser();
  const isLoggedIn = Boolean(getToken() && user);
  const roles = Array.isArray(user?.roles) ? user.roles : [];
  const hasProviderRole = roles.includes("PROVIDER");

  useEffect(() => {
    const closeMenu = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setIsAccountMenuOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsAccountMenuOpen(false);
    };
    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const openProviderMode = () => {
    setIsAccountMenuOpen(false);
    if (hasProviderRole) {
      localStorage.setItem("local_sewa_active_role", "PROVIDER");
      navigate("/provider/dashboard", { replace: true });
      return;
    }
    navigate("/auth/provider/register");
  };

  const logout = async () => {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
    } catch {
      // Complete local logout even if the server session has expired.
    } finally {
      clearSession();
      setIsAccountMenuOpen(false);
      navigate("/auth", { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-[70] border-b border-white/10 bg-[#087A3F]/95 text-white shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center" aria-label="Local Sewa home">
          <img src="/app-icon.svg" alt="" className="h-11 w-11 rounded-[14px] shadow-sm ring-1 ring-white/15" />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-white text-[#087A3F] shadow-sm"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <HugeiconsIcon icon={item.icon} size={17} strokeWidth={2} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <LocationPicker variant="header" />
          {isLoggedIn ? (
            <div ref={accountMenuRef} className="relative">
              <button
                type="button"
                data-navigation
                onClick={() => setIsAccountMenuOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={isAccountMenuOpen}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-[#087A3F] shadow-sm transition hover:bg-[#F0FDF4]"
              >
                <HugeiconsIcon icon={UserIcon} size={18} strokeWidth={2} />
                {user.full_name?.split(" ")[0] || "Account"}
                <HugeiconsIcon icon={ArrowDown01Icon} size={14} strokeWidth={2} className={`transition ${isAccountMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {isAccountMenuOpen && (
                <div role="menu" className="absolute right-0 top-full z-[90] mt-2 w-64 overflow-hidden rounded-2xl border border-[#DDE9E1] bg-white p-2 text-[#10231A] shadow-[0_22px_60px_rgba(15,23,42,0.24)]">
                  <div className="border-b border-[#EEF3F0] px-3 py-2.5">
                    <p className="truncate text-sm font-extrabold">{user.full_name}</p>
                    <p className="mt-0.5 truncate text-xs text-[#64748B]">{user.email || user.phone || "Local Sewa account"}</p>
                  </div>
                  <Link to="/profile" onClick={() => setIsAccountMenuOpen(false)} role="menuitem" className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-[#475569] hover:bg-[#F0FDF4] hover:text-[#15803D]">
                    <HugeiconsIcon icon={UserIcon} size={18} strokeWidth={2} />Customer profile
                  </Link>
                  <button type="button" data-navigation onClick={openProviderMode} role="menuitem" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-[#475569] hover:bg-[#F0FDF4] hover:text-[#15803D]">
                    <HugeiconsIcon icon={Briefcase01Icon} size={18} strokeWidth={2} />
                    {hasProviderRole ? "Switch to Service Provider" : "Become a Provider"}
                  </button>
                  <Link to="/support" onClick={() => setIsAccountMenuOpen(false)} role="menuitem" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-[#475569] hover:bg-[#F0FDF4] hover:text-[#15803D]">
                    <HugeiconsIcon icon={GridViewIcon} size={18} strokeWidth={2} />Help & support
                  </Link>
                  <button type="button" onClick={logout} role="menuitem" className="mt-1 flex w-full items-center gap-3 border-t border-[#EEF3F0] px-3 py-3 text-left text-sm font-bold text-[#DC2626] hover:bg-[#FEF2F2]">
                    <HugeiconsIcon icon={Logout01Icon} size={18} strokeWidth={2} />Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-[#087A3F] shadow-sm transition hover:bg-[#F0FDF4]">
              <HugeiconsIcon icon={UserIcon} size={18} strokeWidth={2} />Sign in
            </Link>
          )}
        </div>

        <button
          type="button"
          data-navigation
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open menu"
          aria-expanded={isSidebarOpen}
          className="ml-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95 md:hidden"
        >
          <HugeiconsIcon icon={Menu01Icon} size={23} strokeWidth={2} />
        </button>
      </div>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </header>
  );
}

export default Header;
