import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { HugeiconsIcon } from "@hugeicons/react";

import {
  ArrowLeft01Icon,
  ArrowRight02Icon,
  Briefcase01Icon,
  CallIcon,
  Mail01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { apiRequest, getToken, saveSession } from "../../lib/api";

/* =========================================================
   PAGE
========================================================= */

function ProviderRegisterPage() {
  const navigate = useNavigate();

  /* =======================================================
     STATE
  ======================================================= */

  const [user, setUser] = useState(null);

  const [categories, setCategories] = useState([]);

  const [pageLoading, setPageLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [needsLogin, setNeedsLogin] = useState(false);

  const [alreadyProvider, setAlreadyProvider] = useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [whatsappSameAsPhone, setWhatsappSameAsPhone] = useState(false);

  const [form, setForm] = useState({
    business_name: "",
    business_description: "",
    category: "",
    custom_category: "",
    experience_years: "",
    whatsapp: "",
    alternate_phone: "",
    business_email: "",
    home_service: true,
    shop_service: false,
  });

  /* =======================================================
     NORMALIZE PHONE
  ======================================================= */

  const normalizePhone = (value) => {
    return String(value || "")
      .replace(/\D/g, "")
      .slice(0, 15);
  };

  /* =======================================================
     LOAD ACCOUNT + CATEGORIES
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadPage = async () => {
      try {
        setPageLoading(true);
        setError("");

        const token = getToken();

        /* ===============================================
             CUSTOMER MUST LOGIN FIRST
          =============================================== */

        if (!token) {
          if (!cancelled) {
            setNeedsLogin(true);
            setPageLoading(false);
          }

          return;
        }

        /* ===============================================
             GET CURRENT USER
          =============================================== */

        const meData = await apiRequest("/api/auth/me");

        const currentUser = meData.user;

        const roles = Array.isArray(currentUser.roles) ? currentUser.roles : [];

        /* ===============================================
             ALREADY PROVIDER
          =============================================== */

        if (roles.includes("PROVIDER")) {
          if (!cancelled) {
            setUser(currentUser);

            setAlreadyProvider(true);

            setPageLoading(false);
          }

          return;
        }

        /* ===============================================
             CUSTOMER ROLE REQUIRED
          =============================================== */

        if (!roles.includes("CUSTOMER")) {
          if (!cancelled) {
            setError(
              "A customer account is required before becoming a provider.",
            );

            setNeedsLogin(true);

            setPageLoading(false);
          }

          return;
        }

        if (!cancelled) {
          setUser(currentUser);

          setWhatsappSameAsPhone(Boolean(currentUser.phone));

          setForm((previous) => ({
            ...previous,

            whatsapp: currentUser.phone || "",

            business_email: currentUser.email || "",
          }));
        }

        /* ===============================================
             LOAD CATEGORIES
          =============================================== */

        const categoryData = await apiRequest("/api/categories", { token: null });

        if (!cancelled) {
          setCategories(
            Array.isArray(categoryData.categories)
              ? categoryData.categories
              : [],
          );
        }
      } catch (loadError) {
        console.error("BECOME PROVIDER PAGE ERROR:", loadError);

        if (!cancelled) {
          if (loadError?.status === 401) {
            setNeedsLogin(true);
          } else {
            setError(loadError?.message || "Unable to load provider registration.");
          }
        }
      } finally {
        if (!cancelled) {
          setPageLoading(false);
        }
      }
    };

    loadPage();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =======================================================
     NORMAL INPUT CHANGE
  ======================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,

      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setError("");
    setSuccessMessage("");

    const token = getToken();

    if (!token) {
      setNeedsLogin(true);

      setError("Please login to your customer account first.");

      return;
    }

    const businessName = form.business_name.trim();

    const description = form.business_description.trim();

    const category = form.category.trim();
    const customCategory = form.custom_category.trim().replace(/\s+/g, " ");

    const whatsapp = normalizePhone(form.whatsapp);

    const alternatePhone = normalizePhone(form.alternate_phone);

    const businessEmail = form.business_email.trim().toLowerCase();

    /* ===================================================
         VALIDATION
      =================================================== */

    if (businessName.length < 2) {
      setError("Please enter your business or service name.");

      return;
    }

    if (!category) {
      setError("Please select your service category.");

      return;
    }

    if (category === "__custom__" && customCategory.length < 3) {
      setError("Please enter a custom category with at least 3 characters.");

      return;
    }

    if (category === "__custom__" && !/^[\p{L}\p{N}][\p{L}\p{N}\s&\-/,().+]*$/u.test(customCategory)) {
      setError("Please enter a valid custom service category.");

      return;
    }

    const experience =
      form.experience_years === "" ? 0 : Number(form.experience_years);

    if (!Number.isInteger(experience) || experience < 0 || experience > 80) {
      setError("Experience must be between 0 and 80 years.");

      return;
    }

    if (whatsapp.length < 10 || whatsapp.length > 15) {
      setError("Please enter a valid WhatsApp number.");

      return;
    }

    if (
      alternatePhone &&
      (alternatePhone.length < 10 || alternatePhone.length > 15)
    ) {
      setError("Please enter a valid alternate number.");

      return;
    }

    if (businessEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessEmail)) {
      setError("Please enter a valid business email.");

      return;
    }

    if (!form.home_service && !form.shop_service) {
      setError("Please select at least Home Service or Shop Service.");

      return;
    }

    setSubmitting(true);

    try {
      /* =================================================
           CREATE PROVIDER PROFILE
        ================================================= */

      const data = await apiRequest("/api/auth/provider/register", {
        method: "POST",
        body: {
          business_name: businessName,
          business_description: description || null,
          category: category === "__custom__" ? "" : category,
          custom_category: category === "__custom__" ? customCategory : null,
          experience_years: experience,
          whatsapp,
          alternate_phone: alternatePhone || null,
          business_email: businessEmail || null,
          home_service: form.home_service,
          shop_service: form.shop_service,
        },
      });

      /* =================================================
           BACKEND RETURNS NEW TOKEN
           WITH PROVIDER ROLE
        ================================================= */

      const newToken = data.token || token;

      /* =================================================
           VERIFY PROVIDER ROLE
        ================================================= */

      const roles = Array.isArray(data.user?.roles) ? data.user.roles : [];

      if (!roles.includes("PROVIDER")) {
        throw new Error("Provider role could not be activated.");
      }

      /* =================================================
           SAVE UPDATED USER
        ================================================= */

      saveSession(newToken, data.user, "PROVIDER");

      setSuccessMessage("Provider account activated successfully!");

      /* =================================================
           DASHBOARD
        ================================================= */

      setTimeout(() => {
        navigate("/provider/dashboard", {
          replace: true,
        });
      }, 700);
    } catch (submitError) {
      console.error("BECOME PROVIDER ERROR:", submitError);

      setError(submitError?.message || "Unable to become a provider.");
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================================================
     PAGE LOADING
  ======================================================= */

  if (pageLoading) {
    return (
      <main
        className="
          flex
          min-h-dvh
          items-center
          justify-center
          bg-[#F0FDF4]
          px-4
        "
      >
        <div className="text-center">
          <div
            className="
              mx-auto
              h-8
              w-8
              animate-spin
              rounded-full
              border-4
              border-[#BBF7D0]
              border-t-[#16A34A]
            "
          />

          <p
            className="
              mt-3
              text-sm
              font-semibold
              text-[#527060]
            "
          >
            Loading...
          </p>
        </div>
      </main>
    );
  }

  /* =======================================================
     NOT LOGGED IN
  ======================================================= */

  if (needsLogin) {
    return (
      <main
        className="
          flex
          min-h-dvh
          items-center
          justify-center
          bg-gradient-to-br
          from-[#F0FDF4]
          via-[#E8F9ED]
          to-[#D7F5E1]
          px-4
        "
      >
        <div
          className="
            w-full
            max-w-md
            rounded-[28px]
            border
            border-[#CDEFD8]
            bg-white
            p-7
            text-center
            shadow-[0_15px_45px_rgba(21,128,61,0.12)]
          "
        >
          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-[#ECFDF3]
              text-[#16A34A]
            "
          >
            <HugeiconsIcon icon={Briefcase01Icon} size={27} strokeWidth={1.8} />
          </div>

          <h2
            className="
              mt-4
              text-xl
              font-extrabold
              text-[#10231A]
            "
          >
            Become a Provider
          </h2>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-[#64748B]
            "
          >
            First login to your Local Sewa customer account. Then you can
            activate your service provider profile.
          </p>

          {error && (
            <div
              className="
                mt-4
                rounded-xl
                bg-red-50
                px-3
                py-2.5
                text-xs
                font-semibold
                text-red-700
              "
            >
              {error}
            </div>
          )}

          <Link
            to="/auth/customer/login"
            className="
              mt-6
              flex
              h-12
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#16A34A]
              text-sm
              font-bold
              text-white
              hover:bg-[#15803D]
            "
          >
            Login to Continue
            <HugeiconsIcon icon={ArrowRight02Icon} size={17} strokeWidth={2} />
          </Link>

          <p
            className="
              mt-4
              text-xs
              text-[#64748B]
            "
          >
            New to Local Sewa?{" "}
            <Link
              to="/auth/customer/register"
              className="
                font-bold
                text-[#16A34A]
              "
            >
              Create an account
            </Link>
          </p>
        </div>
      </main>
    );
  }

  /* =======================================================
     ALREADY PROVIDER
  ======================================================= */

  if (alreadyProvider) {
    return (
      <main
        className="
          flex
          min-h-dvh
          items-center
          justify-center
          bg-gradient-to-br
          from-[#F0FDF4]
          via-[#E8F9ED]
          to-[#D7F5E1]
          px-4
        "
      >
        <div
          className="
            w-full
            max-w-md
            rounded-[28px]
            border
            border-[#CDEFD8]
            bg-white
            p-7
            text-center
            shadow-[0_15px_45px_rgba(21,128,61,0.12)]
          "
        >
          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-[#ECFDF3]
              text-[#16A34A]
            "
          >
            <HugeiconsIcon icon={Briefcase01Icon} size={27} strokeWidth={1.8} />
          </div>

          <h2
            className="
              mt-4
              text-xl
              font-extrabold
              text-[#10231A]
            "
          >
            You're already a provider
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-[#64748B]
            "
          >
            {user?.full_name
              ? `${user.full_name}, your provider profile is already active.`
              : "Your provider profile is already active."}
          </p>

          <button
            type="button"
            onClick={() => {
              localStorage.setItem("local_sewa_active_role", "PROVIDER");

              navigate("/provider/dashboard", { replace: true });
            }}
            className="
              mt-6
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
              hover:bg-[#15803D]
            "
          >
            Go to Provider Dashboard
            <HugeiconsIcon icon={ArrowRight02Icon} size={17} strokeWidth={2} />
          </button>
        </div>
      </main>
    );
  }

  /* =======================================================
     BECOME PROVIDER FORM
  ======================================================= */

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

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-md
        "
      >
        <Link
          to="/"
          className="
            mb-4
            inline-flex
            items-center
            gap-1.5
            text-xs
            font-semibold
            text-[#527060]
            hover:text-[#15803D]
          "
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={1.8} />
          Back
        </Link>

        {/* BRAND */}

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

        {/* CARD */}

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
          {/* HEADER */}

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
              Provider Onboarding
            </p>

            <h2
              className="
                mt-1
                text-2xl
                font-extrabold
                text-[#10231A]
              "
            >
              Become a provider
            </h2>

            <p
              className="
                mt-1.5
                text-sm
                text-[#64748B]
              "
            >
              Add your business details and start offering services.
            </p>
          </div>

          {/* CURRENT CUSTOMER */}

          <div
            className="
              mx-5
              mb-5
              rounded-xl
              border
              border-[#DDF3E5]
              bg-[#F6FFF9]
              p-3.5
              sm:mx-7
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#DCFCE7]
                  text-[#15803D]
                "
              >
                <HugeiconsIcon icon={UserIcon} size={18} />
              </div>

              <div>
                <p
                  className="
                    text-sm
                    font-bold
                    text-[#10231A]
                  "
                >
                  {user?.full_name}
                </p>

                <p
                  className="
                    text-[11px]
                    text-[#64748B]
                  "
                >
                  {user?.phone}
                </p>
              </div>
            </div>
          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="
              space-y-4
              px-5
              pb-6
              sm:px-7
            "
          >
            {error && (
              <div
                className="
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-3.5
                  py-3
                  text-xs
                  font-semibold
                  text-red-700
                "
              >
                {error}
              </div>
            )}

            {successMessage && (
              <div
                className="
                  rounded-xl
                  border
                  border-green-200
                  bg-green-50
                  px-3.5
                  py-3
                  text-xs
                  font-semibold
                  text-green-700
                "
              >
                {successMessage}
              </div>
            )}

            {/* BUSINESS NAME */}

            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-[11px]
                  font-bold
                  text-[#334155]
                "
              >
                Business / Service Name
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
                  focus-within:ring-4
                  focus-within:ring-[#DCFCE7]
                "
              >
                <HugeiconsIcon
                  icon={Briefcase01Icon}
                  size={18}
                  className="text-[#94A3B8]"
                />

                <input
                  name="business_name"
                  value={form.business_name}
                  onChange={handleChange}
                  placeholder="Example: Dadu Electrical Services"
                  className="
                    min-w-0
                    flex-1
                    bg-transparent
                    text-sm
                    outline-none
                  "
                />
              </div>
            </div>

            {/* CATEGORY */}

            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-[11px]
                  font-bold
                  text-[#334155]
                "
              >
                Category
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-[#DDE9E1]
                  bg-[#FAFCFB]
                  px-3
                  text-sm
                  outline-none
                  focus:border-[#86EFAC]
                  focus:ring-4
                  focus:ring-[#DCFCE7]
                "
              >
                <option value="">Select category</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
                <option value="__custom__">Other — Add a new category</option>
              </select>

              {form.category === "__custom__" && (
                <div className="mt-3 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-3">
                  <label htmlFor="custom-provider-category" className="mb-1.5 block text-[11px] font-bold text-[#166534]">
                    New service category
                  </label>
                  <input
                    id="custom-provider-category"
                    name="custom_category"
                    value={form.custom_category}
                    onChange={handleChange}
                    maxLength={100}
                    placeholder="Example: Drone Photography"
                    className="h-11 w-full rounded-xl border border-[#86EFAC] bg-white px-3 text-sm outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-[#DCFCE7]"
                  />
                  <p className="mt-2 text-[10px] font-medium leading-4 text-[#527060]">
                    This category will be added to All Services and will be visible to customers.
                  </p>
                </div>
              )}
            </div>

            {/* DESCRIPTION */}

            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-[11px]
                  font-bold
                  text-[#334155]
                "
              >
                Business Description
              </label>

              <textarea
                name="business_description"
                value={form.business_description}
                onChange={handleChange}
                rows={4}
                placeholder="Tell customers about your work..."
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-[#DDE9E1]
                  bg-[#FAFCFB]
                  p-3
                  text-sm
                  outline-none
                  focus:border-[#86EFAC]
                  focus:ring-4
                  focus:ring-[#DCFCE7]
                "
              />
            </div>

            {/* EXPERIENCE */}

            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-[11px]
                  font-bold
                  text-[#334155]
                "
              >
                Experience (Years)
              </label>

              <input
                name="experience_years"
                type="number"
                min="0"
                max="80"
                value={form.experience_years}
                onChange={handleChange}
                placeholder="Example: 3"
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-[#DDE9E1]
                  bg-[#FAFCFB]
                  px-3
                  text-sm
                  outline-none
                  focus:border-[#86EFAC]
                  focus:ring-4
                  focus:ring-[#DCFCE7]
                "
              />
            </div>

            {/* WHATSAPP */}

            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-[11px]
                  font-bold
                  text-[#334155]
                "
              >
                WhatsApp Number
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
                "
              >
                <HugeiconsIcon
                  icon={CallIcon}
                  size={18}
                  className="text-[#94A3B8]"
                />

                <input
                  name="whatsapp"
                  type="tel"
                  value={form.whatsapp}
                  disabled={whatsappSameAsPhone}
                  onChange={(event) => {
                    setWhatsappSameAsPhone(false);
                    setForm((previous) => ({
                      ...previous,

                      whatsapp: normalizePhone(event.target.value),
                    }));
                  }}
                  className="
                    min-w-0
                    flex-1
                    bg-transparent
                    text-sm
                    outline-none
                    disabled:text-[#64748B]
                  "
                />
              </div>

              <label className="mt-2.5 flex cursor-pointer items-start gap-2.5 rounded-xl bg-[#F0FDF4] px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={whatsappSameAsPhone}
                  onChange={(event) => {
                    const useSameNumber = event.target.checked;
                    setWhatsappSameAsPhone(useSameNumber);
                    if (useSameNumber) {
                      setForm((previous) => ({ ...previous, whatsapp: normalizePhone(user?.phone) }));
                    }
                  }}
                  className="mt-0.5 h-4 w-4 accent-[#16A34A]"
                />
                <span>
                  <span className="block text-xs font-bold text-[#166534]">Same as my account phone number</span>
                  <span className="mt-0.5 block text-[11px] leading-4 text-[#64748B]">Turn this off if your WhatsApp number is different.</span>
                </span>
              </label>
            </div>

            {/* BUSINESS EMAIL */}

            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-[11px]
                  font-bold
                  text-[#334155]
                "
              >
                Business Email
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
                "
              >
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={18}
                  className="text-[#94A3B8]"
                />

                <input
                  name="business_email"
                  type="email"
                  value={form.business_email}
                  onChange={handleChange}
                  className="
                    min-w-0
                    flex-1
                    bg-transparent
                    text-sm
                    outline-none
                  "
                />
              </div>
            </div>

            {/* SERVICE TYPES */}

            <div>
              <p
                className="
                  mb-2
                  text-[11px]
                  font-bold
                  text-[#334155]
                "
              >
                Service Available At
              </p>

              <div
                className="
                  grid
                  grid-cols-2
                  gap-3
                "
              >
                <label
                  className="
                    flex
                    cursor-pointer
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-[#DDE9E1]
                    bg-[#FAFCFB]
                    p-3
                    text-xs
                    font-semibold
                  "
                >
                  <input
                    type="checkbox"
                    checked={form.home_service}
                    onChange={(event) => {
                      setForm((previous) => ({
                        ...previous,

                        home_service: event.target.checked,
                      }));
                    }}
                    className="
                      h-4
                      w-4
                      accent-[#16A34A]
                    "
                  />
                  Home Service
                </label>

                <label
                  className="
                    flex
                    cursor-pointer
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-[#DDE9E1]
                    bg-[#FAFCFB]
                    p-3
                    text-xs
                    font-semibold
                  "
                >
                  <input
                    type="checkbox"
                    checked={form.shop_service}
                    onChange={(event) => {
                      setForm((previous) => ({
                        ...previous,

                        shop_service: event.target.checked,
                      }));
                    }}
                    className="
                      h-4
                      w-4
                      accent-[#16A34A]
                    "
                  />
                  Shop Service
                </label>
              </div>
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={submitting}
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
                transition
                hover:bg-[#15803D]
                disabled:cursor-not-allowed
                disabled:bg-[#86CFA0]
              "
            >
              {submitting ? (
                <>
                  <span
                    className="
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-white/40
                      border-t-white
                    "
                  />
                  Creating Provider Profile...
                </>
              ) : (
                <>
                  Become a Provider
                  <HugeiconsIcon
                    icon={ArrowRight02Icon}
                    size={17}
                    strokeWidth={2}
                  />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default ProviderRegisterPage;
