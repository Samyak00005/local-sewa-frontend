import {
  Bookmark01Icon,
  GridViewIcon,
  Home01Icon,
  StarIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";

export const providerNavigation = [
  {
    name: "Dashboard",
    shortName: "Home",
    path: "/provider/dashboard",
    icon: Home01Icon,
  },
  {
    name: "Service Requests",
    shortName: "Requests",
    path: "/provider/requests",
    icon: Bookmark01Icon,
  },
  {
    name: "My Services",
    shortName: "Services",
    path: "/provider/services",
    icon: GridViewIcon,
  },
  {
    name: "Reviews",
    shortName: "Reviews",
    path: "/provider/reviews",
    icon: StarIcon,
  },
  {
    name: "Business Profile",
    shortName: "Profile",
    path: "/provider/profile",
    icon: UserIcon,
  },
];
