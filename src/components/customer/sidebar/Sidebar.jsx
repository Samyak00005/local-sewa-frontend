import { createPortal } from "react-dom";
import { useEffect } from "react";

import SidebarLocation from "./SidebarLocation";
import SidebarLogout from "./SidebarLogout";
import SidebarNavigation from "./SidebarNavigation";
import SidebarProfile from "./SidebarProfile";
import SidebarRoleSwitcher from "./SidebarRoleSwitcher";

function Sidebar({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return createPortal(
    <>
      {/* ----- BACKDROP ----- */}

      <div
        onClick={onClose}
        className={`
          fixed
          inset-0
          z-[9998]
          bg-black/35
          backdrop-blur-[2px]
          transition-opacity
          duration-300
          md:hidden
          ${
            isOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* ----- SIDEBAR ----- */}

      <aside
        aria-hidden={!isOpen}
        aria-label="Customer navigation"
        className={`
          fixed
          right-0
          top-0
          z-[9999]
          flex
          h-full
          w-[78%]
          max-w-[320px]
          flex-col
          bg-white
          shadow-[-12px_0_40px_rgba(15,23,42,0.15)]
          transition-transform
          duration-300
          ease-out
          md:hidden
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* ------ SCROLLABLE SIDEBAR CONTENT -----*/}

        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* ----- PROFILE ----- */}

          <SidebarProfile onClose={onClose} />

          {/* ----- LOCATION ----- */}

          <SidebarLocation />

          {/* ----- NAVIGATION ----- */}

          <SidebarNavigation onClose={onClose} />
        </div>

        {/* ----- BOTTOM ACTIONS----- */}

        <div className="shrink-0 bg-[#FAFCFB]">
          {/* ----- ROLE SWITCHER ----- */}

          <SidebarRoleSwitcher />

          {/* ----- LOGOUT ----- */}

          <div
            className="
              border-t
              border-[#E5EDE8]
              pb-3
              pt-1
            "
          >
            <SidebarLogout onClose={onClose} />
          </div>
        </div>
      </aside>
    </>,
    document.body,
  );
}

export default Sidebar;
