import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Shield01Icon } from "@hugeicons/core-free-icons";

import Header from "../../components/common/Header";

const content = {
  terms: {
    title: "Terms of Service",
    intro: "These terms explain how customers and service providers may use Local Sewa.",
    sections: [
      ["Using Local Sewa", "Users must provide accurate account and booking information, use the platform lawfully, and keep their login details secure."],
      ["Bookings and service work", "Local Sewa helps customers discover and contact independent providers. Price, scope, timing and on-site work should be confirmed by both parties before service begins."],
      ["Provider responsibilities", "Providers must maintain accurate business information, respond honestly to requests, protect customer details and update booking status correctly."],
      ["Customer responsibilities", "Customers must provide a valid service address, communicate respectfully and cancel early when a booking is no longer needed."],
      ["Safety and disputes", "Do not use Local Sewa for illegal activity. Report suspicious behaviour and keep payment or work records needed to resolve a dispute."],
    ],
  },
  privacy: {
    title: "Privacy Policy",
    intro: "This policy describes the information Local Sewa uses to run customer and provider features.",
    sections: [
      ["Information collected", "We store account details, contact information, provider business profiles, saved providers, bookings and reviews that you submit."],
      ["How information is used", "Information is used for authentication, matching customers with providers, processing bookings, displaying reviews and improving service reliability."],
      ["Information sharing", "Booking contact and address details are shared only with the customer and assigned provider as required to fulfil a service request."],
      ["Data security", "Passwords are stored as secure hashes and authenticated API access uses expiring tokens. Users should still use a unique password and protect their device."],
      ["Your choices", "You can update profile details, remove saved providers and contact Local Sewa to request correction or deletion of your account information."],
    ],
  },
};

function LegalPage({ type }) {
  const page = content[type] || content.terms;
  return (
    <div className="min-h-screen bg-[#F7FAF8] pb-24 md:pb-0">
      <Header />
      <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <article className="mx-auto max-w-4xl rounded-[28px] border border-[#E3ECE6] bg-white p-6 shadow-[0_10px_35px_rgba(15,23,42,0.05)] sm:p-10">
          <Link to="/auth" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#64748B] hover:text-[#15803D]"><HugeiconsIcon icon={ArrowLeft01Icon} size={17} strokeWidth={2} />Back</Link>
          <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECFDF3] text-[#15803D]"><HugeiconsIcon icon={Shield01Icon} size={24} strokeWidth={1.8} /></div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-[#10231A] sm:text-4xl">{page.title}</h1>
          <p className="mt-3 text-sm leading-6 text-[#64748B]">{page.intro}</p>
          <p className="mt-2 text-xs font-semibold text-[#94A3B8]">Last updated: 18 August 2026</p>
          <div className="mt-8 space-y-7">
            {page.sections.map(([title, description]) => <section key={title}><h2 className="text-lg font-extrabold text-[#10231A]">{title}</h2><p className="mt-2 text-sm leading-7 text-[#64748B]">{description}</p></section>)}
          </div>
        </article>
      </main>
    </div>
  );
}

export default LegalPage;
