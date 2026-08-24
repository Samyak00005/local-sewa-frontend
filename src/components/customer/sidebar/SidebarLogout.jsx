import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { HugeiconsIcon } from "@hugeicons/react";

import { Cancel01Icon, Logout01Icon } from "@hugeicons/core-free-icons";
import { apiRequest, clearSession, getToken } from "../../../lib/api";

/* =========================================================
   COMPONENT
========================================================= */

function SidebarLogout({ onClose }) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!getToken()) return null;

  /* ----- OPEN LOGOUT MODAL ----- */

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  /* ----- CANCEL LOGOUT ----- */

  const handleCancel = () => {
    setShowLogoutModal(false);
  };

  /* ----- CONFIRM LOGOUT ----- */

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    onClose();
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
    } catch {
      // Local logout must still complete if the server session already expired.
    } finally {
      clearSession();
      navigate("/auth", { replace: true });
    }
  };

  return (
    <>
      {/* ----- LOGOUT BUTTON ----- */}

      <div className="border-t border-[#E5EDE8] px-3 pt-3">
        <button
          type="button"
          onClick={handleLogoutClick}
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-3
            py-2.5
            text-[#DC2626]
            transition
            hover:bg-[#FEF2F2]
            active:scale-[0.98]
          "
        >
          {/* ----- LOGOUT ICON ----- */}

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-[#FEF2F2]
              text-[#DC2626]
            "
          >
            <HugeiconsIcon icon={Logout01Icon} size={19} strokeWidth={1.8} />
          </div>

          {/* ----- LABEL ----- */}

          <span className="text-sm font-bold">Logout</span>
        </button>
      </div>

      {/* ----- LOGOUT MODAL ----- */}

      {showLogoutModal && (
        <div
          className="
            fixed
            inset-0
            z-[10000]
            flex
            items-center
            justify-center
            bg-black/40
            px-5
            backdrop-blur-[2px]
          "
        >
          {/* ----- MODAL ----- */}

          <div
            className="
              w-full
              max-w-[320px]
              rounded-[22px]
              border
              border-[#E5EDE8]
              bg-white
              p-5
              shadow-[0_20px_60px_rgba(15,23,42,0.20)]
            "
          >
            {/* ----- MODAL ICON ----- */}

            <div
              className="
                mx-auto
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-[#FEF2F2]
                text-[#DC2626]
              "
            >
              <HugeiconsIcon icon={Logout01Icon} size={23} strokeWidth={1.8} />
            </div>

            {/* ----- MODAL TITLE ----- */}

            <h3
              className="
                mt-4
                text-center
                text-base
                font-extrabold
                text-[#10231A]
              "
            >
              Really logout?
            </h3>

            {/* ----- MODAL DESCRIPTION ----- */}

            <p
              className="
                mx-auto
                mt-1
                max-w-[240px]
                text-center
                text-xs
                leading-5
                text-[#6B7280]
              "
            >
              Are you sure you want to logout from your account?
            </p>

            {/* ----- MODAL ACTIONS ----- */}

            <div className="mt-5 grid grid-cols-2 gap-3">
              {/* ----- CANCEL ----- */}

              <button
                type="button"
                onClick={handleCancel}
                className="
                  flex
                  h-10
                  items-center
                  justify-center
                  gap-1.5
                  rounded-xl
                  border
                  border-[#DDE9E1]
                  bg-white
                  text-xs
                  font-bold
                  text-[#475569]
                  transition
                  hover:bg-[#F7FAF8]
                  active:scale-[0.98]
                "
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={15}
                  strokeWidth={1.8}
                />
                Cancel
              </button>

              {/* ----- CONFIRM LOGOUT ----- */}

              <button
                type="button"
                onClick={handleConfirmLogout}
                className="
                  flex
                  h-10
                  items-center
                  justify-center
                  gap-1.5
                  rounded-xl
                  bg-[#DC2626]
                  text-xs
                  font-bold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-[#B91C1C]
                  active:scale-[0.98]
                "
              >
                <HugeiconsIcon
                  icon={Logout01Icon}
                  size={15}
                  strokeWidth={1.8}
                />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SidebarLogout;
