import { Link } from "react-router-dom";

import { HugeiconsIcon } from "@hugeicons/react";

import {
  ArrowRight02Icon,
  Briefcase01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";

function AuthPage() {
  return (
    <main
      className="
        relative
        min-h-dvh
        overflow-x-hidden
        bg-gradient-to-br
        from-[#F0FDF4]
        via-[#E8F9ED]
        to-[#D7F5E1]
        px-4
        py-8
        sm:px-6
      "
    >
      {/* ----- DECORATIVE BACKGROUND ----- */}

      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-64
          w-64
          rounded-full
          bg-[#22C55E]/10
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-24
          -left-20
          h-72
          w-72
          rounded-full
          bg-[#16A34A]/10
        "
      />

      {/* ----- CONTENT ----- */}

      <div
        className="
          relative
          mx-auto
          flex
          min-h-[calc(100dvh-4rem)]
          w-full
          max-w-md
          items-center
          justify-center
        "
      >
        <div className="w-full">
          {/* ----- BRAND ----- */}

          <div className="mb-7 text-center">
            <h1
              className="
                text-3xl
                font-extrabold
                tracking-[-0.04em]
                text-[#14532D]
              "
            >
              Local Sewa
            </h1>

            <p className="mt-2 text-sm text-[#527060]">
              Local help. Trusted people.
            </p>
          </div>

          {/* ----- CARD ----- */}

          <div
            className="
              overflow-hidden
              rounded-[28px]
              border
              border-[#CDEFD8]
              bg-white
              shadow-[0_15px_45px_rgba(21,128,61,0.12)]
            "
          >
            {/* ----- HEADER ----- */}

            <div className="px-5 pb-5 pt-6 sm:px-7">
              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-[#16A34A]
                "
              >
                Welcome
              </p>

              <h2
                className="
                  mt-1.5
                  text-2xl
                  font-extrabold
                  tracking-[-0.035em]
                  text-[#10231A]
                "
              >
                How do you want to continue?
              </h2>

              <p className="mt-1.5 text-sm text-[#64748B]">
                Choose how you want to use Local Sewa.
              </p>
            </div>

            {/* ----- OPTIONS ----- */}

            <div className="space-y-3 px-5 pb-6 sm:px-7">
              {/* ----- CUSTOMER ----- */}

              <Link
                to="/auth/customer/login"
                className="
                  group
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-[#E5EDE8]
                  bg-white
                  p-4
                  transition
                  hover:border-[#BBF7D0]
                  hover:bg-[#F7FAF8]
                  active:scale-[0.99]
                "
              >
                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#ECFDF3]
                    text-[#16A34A]
                  "
                >
                  <HugeiconsIcon icon={UserIcon} size={24} strokeWidth={1.8} />
                </div>

                <div className="min-w-0 flex-1 text-left">
                  <p className="text-sm font-extrabold text-[#10231A]">
                    Customer
                  </p>

                  <p className="mt-1 text-xs leading-4 text-[#64748B]">
                    Find and book trusted local helpers.
                  </p>
                </div>

                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  size={18}
                  strokeWidth={1.8}
                  className="
                    shrink-0
                    text-[#CBD5E1]
                    transition
                    group-hover:translate-x-0.5
                    group-hover:text-[#16A34A]
                  "
                />
              </Link>

              {/* ----- SERVICE PROVIDER ----- */}

              <Link
                to="/auth/provider/login"
                className="
                  group
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-[#E5EDE8]
                  bg-white
                  p-4
                  transition
                  hover:border-[#BBF7D0]
                  hover:bg-[#F7FAF8]
                  active:scale-[0.99]
                "
              >
                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#ECFDF3]
                    text-[#16A34A]
                  "
                >
                  <HugeiconsIcon
                    icon={Briefcase01Icon}
                    size={24}
                    strokeWidth={1.8}
                  />
                </div>

                <div className="min-w-0 flex-1 text-left">
                  <p className="text-sm font-extrabold text-[#10231A]">
                    Service Provider
                  </p>

                  <p className="mt-1 text-xs leading-4 text-[#64748B]">
                    Offer your services and manage bookings.
                  </p>
                </div>

                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  size={18}
                  strokeWidth={1.8}
                  className="
                    shrink-0
                    text-[#CBD5E1]
                    transition
                    group-hover:translate-x-0.5
                    group-hover:text-[#16A34A]
                  "
                />
              </Link>
            </div>

            {/* ----- FOOTER ----- */}

            <div
              className="
                border-t
                border-[#EEF3F0]
                bg-[#FAFCFB]
                px-5
                py-4
                text-center
              "
            >
              <p className="text-[10px] leading-4 text-[#64748B]">
                If you are both a customer and a service provider, you can
                switch modes after signing in.
              </p>
            </div>
          </div>

          {/* ----- TERMS ----- */}

          <p className="mt-5 text-center text-[10px] text-[#527060]">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="font-semibold text-[#15803D]">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="font-semibold text-[#15803D]">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

export default AuthPage;
