import {
  ArrowRight02Icon,
  Bookmark01Icon,
  Calendar03Icon,
  Shield01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useLocation } from "react-router-dom";

import Header from "./Header";

const pageDetails = [
  {
    match: (path) => path.startsWith("/bookings"),
    icon: Calendar03Icon,
    eyebrow: "Your bookings",
    title: "Login to see your bookings",
    description: "Sign in to track upcoming services, booking status and provider contact details.",
  },
  {
    match: (path) => path.startsWith("/saved"),
    icon: Bookmark01Icon,
    eyebrow: "Saved providers",
    title: "Login to see your saved providers",
    description: "Sign in to keep your trusted local professionals saved in one place.",
  },
  {
    match: (path) => path.startsWith("/profile"),
    icon: UserIcon,
    eyebrow: "Your profile",
    title: "Login to manage your profile",
    description: "Sign in to update your details, preferred location and account settings.",
  },
  {
    match: (path) => path.startsWith("/book/"),
    icon: Calendar03Icon,
    eyebrow: "Secure booking",
    title: "Login to book this provider",
    description: "Your account keeps the request secure and unlocks contact details after booking.",
  },
];

function LoginRequiredPage() {
  const location = useLocation();
  const details = pageDetails.find((item) => item.match(location.pathname)) || pageDetails[2];
  const returnTo = `${location.pathname}${location.search}`;

  return (
    <div className="min-h-screen bg-[#F7FAF8] pb-24 text-[#10231A] md:pb-0">
      <Header />
      <main className="mx-auto flex min-h-[calc(100vh-72px)] max-w-5xl items-center justify-center px-4 py-10 sm:px-6">
        <section className="w-full max-w-lg rounded-[28px] border border-[#DDE9E1] bg-white p-6 text-center shadow-[0_18px_55px_rgba(15,23,42,0.08)] sm:p-9">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#DCFCE7] text-[#15803D]">
            <HugeiconsIcon icon={details.icon} size={30} strokeWidth={1.9} />
          </div>
          <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#16A34A]">{details.eyebrow}</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.035em] sm:text-3xl">{details.title}</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#64748B]">{details.description}</p>

          <Link
            to="/auth/customer/login"
            state={{ from: returnTo }}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#16A34A] px-5 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#15803D] active:scale-[0.99]"
          >
            Login to continue
            <HugeiconsIcon icon={ArrowRight02Icon} size={18} strokeWidth={2} />
          </Link>
          <Link to="/auth/customer/register" state={{ from: returnTo }} className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] px-5 text-sm font-bold text-[#15803D] transition hover:bg-[#DCFCE7]">
            Create customer account
          </Link>

          <div className="mt-5 flex items-start gap-2 rounded-2xl bg-[#F8FAF9] p-3 text-left text-xs leading-5 text-[#64748B]">
            <HugeiconsIcon icon={Shield01Icon} size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-[#16A34A]" />
            Your booking, saved providers and contact details stay connected securely to your account.
          </div>
        </section>
      </main>
    </div>
  );
}

export default LoginRequiredPage;
