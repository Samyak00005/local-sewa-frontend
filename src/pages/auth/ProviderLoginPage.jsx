import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { HugeiconsIcon } from "@hugeicons/react";

import {
    ArrowLeft01Icon,
    ArrowRight02Icon,
    Briefcase01Icon,
    EyeIcon,
    EyeOffIcon,
    LockPasswordIcon,
    Mail01Icon,
} from "@hugeicons/core-free-icons";

import { apiRequest, saveSession } from "../../lib/api";

function ProviderLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    if (loading) return;

    if (!identifier.trim() || !password) {
      setError("Please enter your email/mobile and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/api/auth/login", {
        method: "POST",
        token: null,
        body: { identifier: identifier.trim(), password },
      });
      const roles = Array.isArray(data.user?.roles) ? data.user.roles : [];
      if (!roles.includes("PROVIDER")) {
        if (roles.includes("CUSTOMER")) {
          saveSession(data.token, data.user, "CUSTOMER");
          navigate("/auth/provider/register", { replace: true });
          return;
        }
        throw new Error("This account cannot access the provider panel.");
      }
      saveSession(data.token, data.user, "PROVIDER");
      const requestedPath = location.state?.from;
      navigate(
        typeof requestedPath === "string" && requestedPath.startsWith("/provider")
          ? requestedPath
          : "/provider/dashboard",
        { replace: true },
      );
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
          {/* ----- BACK ----- */}

          <Link
            to="/auth"
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
            Choose account type
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
              Grow your local service.
            </p>
          </div>

          {/* ----- LOGIN CARD ----- */}

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
              <div
                className="
                  mb-4
                  flex
                  h-12
                  w-12
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

              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-[#16A34A]
                "
              >
                Service Provider
              </p>

              <h2
                className="
                  mt-1
                  text-2xl
                  font-extrabold
                  tracking-[-0.035em]
                  text-[#10231A]
                "
              >
                Welcome back
              </h2>

              <p className="mt-1.5 text-sm text-[#64748B]">
                Login to manage your services and bookings.
              </p>
            </div>

            {/* ----- FORM ----- */}

            <form
              onSubmit={handleLogin}
              className="space-y-4 px-5 pb-6 sm:px-7"
            >
              {/* ----- EMAIL / MOBILE ----- */}

              <div>
                <label
                  htmlFor="provider-login-email"
                  className="mb-1.5 block text-[11px] font-bold text-[#334155]"
                >
                  Email or Mobile Number
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
                    id="provider-login-email"
                    name="username"
                    type="text"
                    inputMode="email"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck="false"
                    value={identifier}
                    onChange={(event) => {
                      setIdentifier(event.target.value);
                      setError("");
                    }}
                    placeholder="Enter email or mobile number"
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#A0AAA5]"
                  />
                </div>
              </div>

              {/* ----- PASSWORD ----- */}

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="provider-login-password"
                    className="text-[11px] font-bold text-[#334155]"
                  >
                    Password
                  </label>

                  <span className="text-[10px] font-medium text-[#94A3B8]">
                    Use your registered password
                  </span>
                </div>

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
                    id="provider-login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    placeholder="Enter your password"
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#A0AAA5]"
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

              {error && (
                <div className="rounded-xl bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-700">
                  {error}
                </div>
              )}

              {/* ----- LOGIN ----- */}

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
                {loading ? "Logging in..." : "Login as Service Provider"}
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  size={17}
                  strokeWidth={2}
                />
              </button>
            </form>

            {/* ----- REGISTER ----- */}

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
              <p className="text-xs text-[#64748B]">
                Don't have a provider account?{" "}
                <Link
                  to="/auth/provider/register"
                  className="font-bold text-[#16A34A]"
                >
                  Become a provider
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProviderLoginPage;
