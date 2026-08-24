import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Cancel01Icon,
  Logout01Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";

import { providerNavigation } from "../../config/providerNavigation";
import { apiRequest, clearSession, getStoredUser } from "../../lib/api";

function ProviderTopBar({ title = "Dashboard" }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = getStoredUser();

  const switchToCustomer = () => {
    setIsMenuOpen(false);
    localStorage.setItem("local_sewa_active_role", "CUSTOMER");
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  const logout = async () => {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
    } catch {
      // A local logout is still valid when a server session has expired.
    } finally {
      clearSession();
      navigate("/auth", { replace: true });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex h-[72px] items-center justify-between border-b border-white/10 bg-[#173D2E]/95 px-4 text-white shadow-sm backdrop-blur-xl sm:px-6">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#86EFAC]">Local Sewa Provider</p>
          <h1 className="truncate text-lg font-extrabold text-white">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            data-navigation
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open provider menu"
            aria-expanded={isMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition hover:bg-white/20 lg:hidden"
          >
            <HugeiconsIcon icon={Menu01Icon} size={21} strokeWidth={2} />
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="Provider navigation">
          <button
            type="button"
            aria-label="Close provider menu"
            onClick={() => setIsMenuOpen(false)}
            className="absolute inset-0 bg-[#0F172A]/45 backdrop-blur-[2px]"
          />
          <aside className="absolute right-0 top-0 flex h-full w-[78%] max-w-[320px] flex-col bg-[#173D2E] text-white shadow-[-20px_0_60px_rgba(15,23,42,0.3)]">
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#16A34A]">Provider Panel</p>
                <p className="mt-1 truncate text-base font-extrabold text-white">{user?.full_name || "My business"}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={2} />
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
              {providerNavigation.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition ${
                    isActive ? "bg-white text-[#166534]" : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <HugeiconsIcon icon={item.icon} size={20} strokeWidth={2} />
                  {item.name}
                </NavLink>
              ))}
            </nav>

            <div className="space-y-2 border-t border-white/10 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button type="button" data-navigation onClick={switchToCustomer} className="flex w-full items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold text-white">
                <HugeiconsIcon icon={ArrowLeft01Icon} size={19} strokeWidth={2} />
                Switch to Customer
              </button>
              <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-[#FCA5A5] hover:bg-white/10">
                <HugeiconsIcon icon={Logout01Icon} size={19} strokeWidth={2} />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

export default ProviderTopBar;
