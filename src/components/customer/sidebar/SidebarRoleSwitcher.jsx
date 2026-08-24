import { useNavigate } from "react-router-dom";

import { HugeiconsIcon } from "@hugeicons/react";

import {
  Briefcase01Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import { getStoredUser } from "../../../lib/api";

/* =========================================================
   COMPONENT
========================================================= */

function SidebarRoleSwitcher() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const userRoles = Array.isArray(user?.roles)
    ? user.roles.map((role) => String(role).toUpperCase())
    : [];
  const hasProviderRole = userRoles.includes("PROVIDER");

  if (!user) return null;

  /* =======================================================
     ROLE SWITCH
  ======================================================= */

  const handleRoleSwitch = () => {
    if (hasProviderRole) {
      localStorage.setItem("local_sewa_active_role", "PROVIDER");
      navigate("/provider/dashboard", { replace: true });
      return;
    }
    navigate("/auth/provider/register");
  };

  return (
    <div className="px-4 py-3">
      {/* ----- LABEL ----- */}

      <p
        className="
          mb-1.5
          px-1
          text-[9px]
          font-bold
          uppercase
          tracking-[0.16em]
          text-[#9CA3AF]
        "
      >
        Switch Mode
      </p>

      {/* ----- SWITCH ----- */}

      <button
        type="button"
        data-navigation
        onClick={handleRoleSwitch}
        className="flex w-full items-center gap-3 rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-left text-sm font-extrabold text-[#15803D] shadow-sm transition hover:border-[#86EFAC] hover:bg-[#DCFCE7] active:scale-[0.99]"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#15803D] shadow-sm">
          <HugeiconsIcon icon={Briefcase01Icon} size={18} strokeWidth={2} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block leading-4">
            {hasProviderRole ? <>Switch to<br />Service Provider</> : "Become a Provider"}
          </span>
          <span className="mt-0.5 block text-[10px] font-semibold text-[#4B7C5E]">
            {hasProviderRole ? "Open your business workspace" : "Create your business profile"}
          </span>
        </span>
        <HugeiconsIcon icon={ArrowRight02Icon} size={18} strokeWidth={2} />
      </button>
    </div>
  );
}

export default SidebarRoleSwitcher;
