import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, HelpCircleIcon, Shield01Icon, UserIcon } from "@hugeicons/core-free-icons";

import Header from "../../components/common/Header";

const helpTopics = [
  {
    title: "Booking help",
    description: "Track status, contact the provider, cancel an eligible request or book the service again.",
    path: "/bookings",
    action: "Open My Bookings",
    icon: Calendar03Icon,
  },
  {
    title: "Account and profile",
    description: "Update your name, email, WhatsApp number and preferred service location.",
    path: "/profile",
    action: "Open Profile",
    icon: UserIcon,
  },
  {
    title: "Safety and privacy",
    description: "Review how account, booking and provider information is handled on Local Sewa.",
    path: "/privacy",
    action: "Read Privacy Policy",
    icon: Shield01Icon,
  },
];

function SupportPage() {
  return (
    <div className="min-h-screen bg-[#F7FAF8] pb-24 md:pb-0">
      <Header />
      <section className="border-b border-[#E5EDE8] bg-white px-4 py-9 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#16A34A]">Help centre</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#10231A] sm:text-4xl">How can we help?</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#64748B]">Use these shortcuts to resolve common customer and provider account questions.</p>
        </div>
      </section>
      <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {helpTopics.map((topic) => (
            <article key={topic.title} className="flex flex-col rounded-[24px] border border-[#E3ECE6] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.04)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECFDF3] text-[#15803D]"><HugeiconsIcon icon={topic.icon} size={23} strokeWidth={1.8} /></div>
              <h2 className="mt-4 text-lg font-extrabold text-[#10231A]">{topic.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-[#64748B]">{topic.description}</p>
              <Link to={topic.path} className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-[#16A34A] px-4 text-sm font-bold text-white hover:bg-[#15803D]">{topic.action}</Link>
            </article>
          ))}
        </div>
        <section className="mx-auto mt-6 max-w-6xl rounded-[24px] border border-[#CDEFD8] bg-[#ECFDF3] p-6 sm:p-8">
          <div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#15803D]"><HugeiconsIcon icon={HelpCircleIcon} size={22} strokeWidth={2} /></div><div><h2 className="font-extrabold text-[#14532D]">Before a service starts</h2><p className="mt-1 text-sm leading-6 text-[#527060]">Confirm the work, expected price, visit time and payment method directly with the provider. Do not share passwords or OTPs.</p></div></div>
        </section>
      </main>
    </div>
  );
}

export default SupportPage;
