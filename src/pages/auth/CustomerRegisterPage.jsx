import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { HugeiconsIcon } from "@hugeicons/react";

import {
  ArrowLeft01Icon,
  ArrowRight02Icon,
  CallIcon,
  EyeIcon,
  EyeOffIcon,
  LockPasswordIcon,
  Mail01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";

import { apiRequest, saveSession } from "../../lib/api";

function CustomerRegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    const phone = form.phone.replace(/\D/g, "").slice(0, 15);
    if (form.full_name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (phone.length < 10) {
      setError("Please enter a valid mobile number.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const data = await apiRequest("/api/auth/customer/register", {
        method: "POST",
        token: null,
        body: {
          full_name: form.full_name.trim(),
          phone,
          email: form.email.trim().toLowerCase() || null,
          password: form.password,
        },
      });
      saveSession(data.token, data.user, "CUSTOMER");
      setSuccessMessage("Account created successfully!");
      const requestedPath = location.state?.from;
      const nextPath = typeof requestedPath === "string" && !requestedPath.startsWith("/provider")
        ? requestedPath
        : "/";
      setTimeout(() => navigate(nextPath, { replace: true }), 600);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

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

      {/* ----- PAGE CONTENT ----- */}

      <div className="relative mx-auto w-full max-w-md">
        {/* ----- BACK ----- */}

        <Link
          to="/auth/customer/login"
          state={{ from: location.state?.from }}
          className="
            mb-4
            inline-flex
            items-center
            gap-1.5
            text-xs
            font-semibold
            text-[#527060]
            transition
            hover:text-[#15803D]
          "
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={1.8} />
          Back to Login
        </Link>

        {/* ----- BRAND ----- */}

        <div className="mb-6 text-center">
          <h1
            className="
              text-2xl
              font-extrabold
              tracking-[-0.04em]
              text-[#14532D]
            "
          >
            Local Sewa
          </h1>

          <p className="mt-1 text-xs text-[#527060]">
            Find trusted help around you.
          </p>
        </div>

        {/* ----- REGISTER CARD ----- */}

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
          {/* ----- REGISTER HEADER ----- */}

          <div className="flex items-start gap-3 px-5 py-5 sm:px-7 sm:pt-7">
            {/* ----- ICON ----- */}

            <div
              className="
      flex
      h-12
      w-12
      shrink-0
      items-center
      justify-center
      rounded-xl
      bg-[#ECFDF3]
      text-[#16A34A]
    "
            >
              <HugeiconsIcon icon={UserIcon} size={22} strokeWidth={1.8} />
            </div>

            {/* ----- TEXT ----- */}

            <div className="min-w-0 flex-1">
              <p
                className="
        text-[9px]
        font-bold
        uppercase
        tracking-[0.14em]
        text-[#15803D]
      "
              >
                Customer
              </p>

              <h1
                className="
        mt-0.5
        text-xl
        font-extrabold
        tracking-[-0.03em]
        text-[#10231A]
      "
              >
                Create your account
              </h1>

              <p
                className="
        mt-0.5
        text-xs
        leading-5
        text-[#527060]
      "
              >
                Join Local Sewa and find trusted local services.
              </p>
            </div>
          </div>

          {/* ----- FORM ----- */}

          <form
            onSubmit={handleSubmit}
            className="space-y-4 px-5 pb-4 sm:px-7"
          >
            {/* ----- FULL NAME ----- */}

            <div>
              <label
                htmlFor="customer-name"
                className="mb-1.5 block text-[11px] font-bold text-[#334155]"
              >
                Full Name
              </label>

              <div
                className="
                  flex
                  h-12
                  items-center
                  gap-2.5
                  rounded-xl
                  border
                  border-[#DDE9E1]
                  bg-[#FAFCFB]
                  px-3
                  focus-within:border-[#86EFAC]
                  focus-within:bg-white
                  focus-within:ring-4
                  focus-within:ring-[#DCFCE7]
                "
              >
                <HugeiconsIcon
                  icon={UserIcon}
                  size={18}
                  strokeWidth={1.7}
                  className="text-[#94A3B8]"
                />

                <input
                  id="customer-name"
                  name="full_name"
                  type="text"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#A0AAA5]"
                  required
                />
              </div>
            </div>

            {/* ----- MOBILE ----- */}

            <div>
              <label
                htmlFor="customer-mobile"
                className="mb-1.5 block text-[11px] font-bold text-[#334155]"
              >
                Mobile Number
              </label>

              <div
                className="
                  flex
                  h-12
                  items-center
                  gap-2.5
                  rounded-xl
                  border
                  border-[#DDE9E1]
                  bg-[#FAFCFB]
                  px-3
                  focus-within:border-[#86EFAC]
                  focus-within:bg-white
                  focus-within:ring-4
                  focus-within:ring-[#DCFCE7]
                "
              >
                <HugeiconsIcon
                  icon={CallIcon}
                  size={18}
                  strokeWidth={1.7}
                  className="text-[#94A3B8]"
                />

                <input
                  id="customer-mobile"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#A0AAA5]"
                  required
                />
              </div>
            </div>

            {/* ----- EMAIL ----- */}

            <div>
              <label
                htmlFor="customer-email"
                className="mb-1.5 block text-[11px] font-bold text-[#334155]"
              >
                Email Address
              </label>

              <div
                className="
                  flex
                  h-12
                  items-center
                  gap-2.5
                  rounded-xl
                  border
                  border-[#DDE9E1]
                  bg-[#FAFCFB]
                  px-3
                  focus-within:border-[#86EFAC]
                  focus-within:bg-white
                  focus-within:ring-4
                  focus-within:ring-[#DCFCE7]
                "
              >
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={18}
                  strokeWidth={1.7}
                  className="text-[#94A3B8]"
                />

                <input
                  id="customer-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#A0AAA5]"
                />
              </div>
            </div>

            {/* ----- PASSWORD ----- */}

            <div>
              <label
                htmlFor="customer-password"
                className="mb-1.5 block text-[11px] font-bold text-[#334155]"
              >
                Password
              </label>

              <div
                className="
                  flex
                  h-12
                  items-center
                  gap-2.5
                  rounded-xl
                  border
                  border-[#DDE9E1]
                  bg-[#FAFCFB]
                  px-3
                  focus-within:border-[#86EFAC]
                  focus-within:bg-white
                  focus-within:ring-4
                  focus-within:ring-[#DCFCE7]
                "
              >
                <HugeiconsIcon
                  icon={LockPasswordIcon}
                  size={18}
                  strokeWidth={1.7}
                  className="text-[#94A3B8]"
                />

                <input
                  id="customer-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#A0AAA5]"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  className="text-[#94A3B8] hover:text-[#16A34A]"
                >
                  <HugeiconsIcon
                    icon={showPassword ? EyeOffIcon : EyeIcon}
                    size={18}
                    strokeWidth={1.7}
                  />
                </button>
              </div>
            </div>

            {/* ----- CONFIRM PASSWORD ----- */}

            <div>
              <label
                htmlFor="customer-confirm-password"
                className="mb-1.5 block text-[11px] font-bold text-[#334155]"
              >
                Confirm Password
              </label>

              <div
                className="
                  flex
                  h-12
                  items-center
                  gap-2.5
                  rounded-xl
                  border
                  border-[#DDE9E1]
                  bg-[#FAFCFB]
                  px-3
                  focus-within:border-[#86EFAC]
                  focus-within:bg-white
                  focus-within:ring-4
                  focus-within:ring-[#DCFCE7]
                "
              >
                <HugeiconsIcon
                  icon={LockPasswordIcon}
                  size={18}
                  strokeWidth={1.7}
                  className="text-[#94A3B8]"
                />

                <input
                  id="customer-confirm-password"
                  name="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirm_password}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#A0AAA5]"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((previous) => !previous)
                  }
                  className="text-[#94A3B8] hover:text-[#16A34A]"
                >
                  <HugeiconsIcon
                    icon={showConfirmPassword ? EyeOffIcon : EyeIcon}
                    size={18}
                    strokeWidth={1.7}
                  />
                </button>
              </div>
            </div>

            {/* ----- TERMS ----- */}

            <label className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 accent-[#16A34A]"
                required
              />

              <span className="text-[10px] leading-4 text-[#64748B]">
                I agree to the{" "}
                <Link to="/terms" className="font-bold text-[#15803D]">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="font-bold text-[#15803D]">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {error && (
              <div className="rounded-xl bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-700">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="rounded-xl bg-green-50 px-3 py-2.5 text-xs font-semibold text-green-700">
                {successMessage}
              </div>
            )}

            {/* ----- CREATE ACCOUNT ----- */}

            <button
              type="submit"
              disabled={loading}
              className="
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#16A34A]
                text-sm
                font-bold
                text-white
                shadow-[0_8px_20px_rgba(22,163,74,0.18)]
                transition
                hover:bg-[#15803D]
                active:scale-[0.99]
              "
            >
              {loading ? "Creating account..." : "Create Customer Account"}
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                size={17}
                strokeWidth={2}
              />
            </button>
          </form>

          {/* ----- LOGIN ----- */}

          <div
            className="
              border-t
              border-[#EEF3F0]
              bg-[#FAFCFB]
              px-5
              py-2
              text-center
            "
          >
            <p className="text-xs text-[#64748B]">
              Already have an account?{" "}
              <Link
                to="/auth/customer/login"
                className="font-bold text-[#16A34A]"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CustomerRegisterPage;
