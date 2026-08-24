import {
  Alert02Icon,
  Bookmark01Icon,
  Calendar03Icon,
  File02Icon,
  HelpCircleIcon,
  Home01Icon,
  GridViewIcon,
  Shield01Icon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons";

import SidebarMenuItem from "./SidebarMenuItem";
import SidebarSection from "./SidebarSection";
import { getStoredUser, getToken } from "../../../lib/api";

/* ----- QUICK ACCESS ----- */

const quickAccessItems = [
  {
    name: "Home",
    path: "/",
    icon: Home01Icon,
  },
  {
    name: "All Services",
    path: "/services",
    icon: GridViewIcon,
  },
  {
    name: "My Bookings",
    path: "/bookings",
    icon: Calendar03Icon,
  },
  {
    name: "Saved Providers",
    path: "/saved",
    icon: Bookmark01Icon,
  },
];

/* ----- SUPPORT ----- */

const supportItems = [
  {
    name: "Help & Support",
    path: "/support",
    icon: HelpCircleIcon,
  },
  {
    name: "Terms & Conditions",
    path: "/terms",
    icon: File02Icon,
  },
  {
    name: "Privacy Policy",
    path: "/privacy",
    icon: Shield01Icon,
  },
];

/* =========================================================
   COMPONENT
========================================================= */

function SidebarNavigation({ onClose }) {
  const user = getStoredUser();
  const userRoles = Array.isArray(user?.roles)
    ? user.roles.map((role) => String(role).toUpperCase())
    : [];
  const showBecomeProvider = Boolean(getToken())
    && userRoles.includes("CUSTOMER")
    && !userRoles.includes("PROVIDER");

  return (
    <nav className="px-3 pt-4">
      {/* ----- QUICK ACCESS ----- */}

      <SidebarSection label="Quick Access">
        {quickAccessItems.map((item) => (
          <SidebarMenuItem
            key={item.name}
            name={item.name}
            path={item.path}
            icon={item.icon}
            onClick={onClose}
          />
        ))}
      </SidebarSection>

      {/* ----- EMERGENCY SERVICES ----- */}

      <SidebarSection label="Emergency">
        <SidebarMenuItem
          name="Emergency Services"
          path="/emergency"
          icon={Alert02Icon}
          onClick={onClose}
          highlight
        />
      </SidebarSection>

      {/* ----- FOR HELPERS ----- */}

      {showBecomeProvider && (
        <SidebarSection label="For Helpers">
          <SidebarMenuItem
            name="Become a Service Provider"
            path="/auth/provider/register"
            icon={UserAdd01Icon}
            onClick={onClose}
          />
        </SidebarSection>
      )}

      {/* ----- SUPPORT ----- */}

      <SidebarSection label="Support">
        {supportItems.map((item) => (
          <SidebarMenuItem
            key={item.name}
            name={item.name}
            path={item.path}
            icon={item.icon}
            onClick={onClose}
          />
        ))}
      </SidebarSection>
    </nav>
  );
}

export default SidebarNavigation;
