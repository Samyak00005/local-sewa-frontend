import { Link } from "react-router-dom";

import { HugeiconsIcon } from "@hugeicons/react";

import { Cancel01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { getStoredUser, getToken } from "../../../lib/api";

/* ----- SIDEBAR PROFILE ----- */

function SidebarProfile({ onClose }) {
  const user = getStoredUser();
  const isLoggedIn = Boolean(getToken() && user);

  return (
    <div
      className="
        border-b
        border-[#E5EDE8]
        px-4
        py-3
      "
    >
      <div className="flex items-center gap-2">
        <Link
          to={isLoggedIn ? "/profile" : "/auth"}
          onClick={onClose}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-xl p-2 transition hover:bg-[#F7FAF8] active:scale-[0.99]"
        >
        {/* ----- PROFILE PHOTO ----- */}

        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-full
            bg-[#ECFDF3]
            text-[#16A34A]
          "
        >
          {/* Replace this icon with the user's profile image later */}

          <HugeiconsIcon icon={UserIcon} size={22} strokeWidth={1.8} />
        </div>

        {/* ----- PROFILE DETAILS ----- */}

        <div className="min-w-0 flex-1">
          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.12em]
              text-[#9CA3AF]
            "
          >
            {isLoggedIn ? "Welcome back" : "Local Sewa account"}
          </p>

          <p
            className="
              mt-0.5
              truncate
              text-sm
              font-extrabold
              text-[#10231A]
            "
          >
            {isLoggedIn ? user.full_name || "Customer" : "Sign in or register"}
          </p>

          <p
            className="
              mt-0.5
              text-[11px]
              font-medium
              text-[#16A34A]
            "
          >
            {isLoggedIn ? "View Profile" : "Continue"}
          </p>
        </div>
        </Link>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DDE9E1] bg-white text-[#475569] shadow-sm transition hover:bg-[#F0FDF4] hover:text-[#15803D]"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

export default SidebarProfile;
