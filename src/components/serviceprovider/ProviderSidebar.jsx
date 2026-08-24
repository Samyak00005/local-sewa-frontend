import { NavLink, Link, useNavigate } from "react-router-dom";

import { HugeiconsIcon } from "@hugeicons/react";

import { ArrowLeft01Icon, Logout01Icon } from "@hugeicons/core-free-icons";

import { providerNavigation } from "../../config/providerNavigation";
import { apiRequest, clearSession } from "../../lib/api";

function ProviderSidebar() {
  const navigate = useNavigate();

  const switchToCustomer = () => {
    localStorage.setItem("local_sewa_active_role", "CUSTOMER");
    navigate("/", { replace: true });
  };

  const logout = async () => {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
    } catch {
      // Local logout still completes if the API session has expired.
    } finally {
      clearSession();
      navigate("/auth", { replace: true });
    }
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-[320px] shrink-0 border-r border-white/10 bg-[#123528] text-white lg:flex lg:flex-col">
      {/* Logo */}

      <div className="flex h-[82px] items-center border-b border-white/10 px-5">
        <Link to="/provider/dashboard" className="flex items-center gap-3" aria-label="Provider dashboard">
          <img src="/app-icon.svg" alt="" className="h-12 w-12 rounded-2xl shadow-sm ring-1 ring-white/15" />
          <span><span className="block text-sm font-extrabold text-white">Provider</span><span className="block text-[10px] font-semibold text-[#86EFAC]">Business panel</span></span>
        </Link>
      </div>

      {/* Provider label */}

      <div className="px-5 pb-3 pt-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
          Provider Panel
        </p>
      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-1 px-3">
        {providerNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `
                flex
                items-center
                gap-3
                rounded-[14px]
                px-4
                py-3
                text-sm
                font-semibold
                transition

                ${
                  isActive
                    ? "bg-white text-[#166534]"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }
              `
            }
          >
            {({ isActive }) => (
              <>
                <HugeiconsIcon
                  icon={item.icon}
                  size={20}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />

                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Back to customer */}

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          data-navigation
          onClick={switchToCustomer}
          className="
            flex
            w-full
            items-center
            gap-2
            rounded-xl
            bg-white/10
            px-4
            py-3
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-white/15
          "
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            size={18}
            strokeWidth={2}
          />

          Switch to Customer
        </button>
        <button type="button" onClick={logout} className="mt-2 flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-[#FCA5A5] transition hover:bg-white/10">
          <HugeiconsIcon icon={Logout01Icon} size={18} strokeWidth={2} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default ProviderSidebar;
