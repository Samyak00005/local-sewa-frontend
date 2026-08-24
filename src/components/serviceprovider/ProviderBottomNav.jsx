import { NavLink } from "react-router-dom";

import { HugeiconsIcon } from "@hugeicons/react";

import { providerNavigation } from "../../config/providerNavigation";
import { useProviderRequestCount } from "../../hooks/useProviderRequestCount";

function ProviderBottomNav() {
  const pendingRequestCount = useProviderRequestCount();

  return (
    <nav
      data-bottom-navigation
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
        border-t
        border-[#B8CCC0]
        bg-[#F4F8F5]/95
        px-3
        pb-[env(safe-area-inset-bottom)]
        pt-2
        shadow-[0_-8px_25px_rgba(15,23,42,0.06)]
        backdrop-blur-xl
        lg:hidden
      "
    >
      <div className="mx-auto flex max-w-md items-center justify-around">
        {providerNavigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `
                flex
                min-w-0
                flex-1
                flex-col
                items-center
                gap-1
                rounded-xl
                px-2
                py-1.5
                text-[10px]
                font-semibold
                ${
                  isActive
                    ? "text-[#14532D]"
                    : "text-[#40584C] hover:text-[#1F5139]"
                }
              `
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`
                    relative
                    flex
                    h-8
                    w-10
                    items-center
                    justify-center
                    rounded-xl

                    ${
                      isActive
                        ? "bg-[#D8E9DF]"
                        : ""
                    }
                  `}
                >
                  <HugeiconsIcon
                    icon={item.icon}
                    size={20}
                    strokeWidth={isActive ? 2.2 : 1.7}
                  />
                  {item.path === "/provider/requests" && pendingRequestCount > 0 && (
                    <span
                      aria-label={`${pendingRequestCount} new booking ${pendingRequestCount === 1 ? "request" : "requests"}`}
                      className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#14532D] px-1 text-[9px] font-extrabold leading-none text-white ring-2 ring-[#F4F8F5]"
                    >
                      {pendingRequestCount > 99 ? "99+" : pendingRequestCount}
                    </span>
                  )}
                </div>

                {item.shortName}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default ProviderBottomNav;
