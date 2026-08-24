import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProviderSidebar from "../../components/serviceprovider/ProviderSidebar";
import ProviderTopBar from "../../components/serviceprovider/ProviderTopBar";
import ProviderStats from "../../components/serviceprovider/ProviderStats";
import ProviderProfileCard from "../../components/serviceprovider/ProviderProfileCard";
import ProviderRequests from "../../components/serviceprovider/ProviderRequests";
import ProviderBottomNav from "../../components/serviceprovider/ProviderBottomNav";

import { apiRequest } from "../../lib/api";

const emptyDashboard = {
  id: null,
  ownerName: "Provider",
  businessName: "",
  category: "",
  location: "",
  phone: "",
  whatsapp: "",
  email: "",
  rating: 0,
  reviews: 0,
  verified: false,
  available: false,
  profileCompletion: 0,
  description: "",
  stats: { todayRequests: 0, pendingRequests: 0, completedJobs: 0, totalReviews: 0 },
  services: [],
  requests: [],
};

function ProviderDashboardPage() {
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    apiRequest("/api/provider/dashboard")
      .then((data) => {
        if (cancelled || !data.provider) return;
        setDashboard({
          ...data.provider,
          requests: (data.provider.requests || []).map((request) => ({
            ...request,
            status: request.status.replace(/(^|_)([a-z])/g, (_, space, letter) => `${space ? " " : ""}${letter.toUpperCase()}`),
          })),
        });
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#DCE9E1]">
      <div className="flex">

        {/* Desktop Sidebar */}

        <ProviderSidebar />

        {/* Main */}

        <div className="min-w-0 flex-1">
          <ProviderTopBar />

          <main
            className="
              mx-auto
              max-w-[1500px]
              space-y-6
              px-4
              pb-28
              pt-5
              sm:px-6
              lg:pb-10
              lg:pt-7
            "
          >
            {/* Welcome */}

            <section>
              <p className="text-sm font-medium text-[#64748B]">
                Welcome back,
              </p>

              <h2
                className="
                  mt-1
                  text-2xl
                  font-extrabold
                  tracking-[-0.035em]
                  text-[#10231A]
                  sm:text-3xl
                "
              >
                {dashboard.ownerName} 👋
              </h2>

              <p className="mt-1 text-sm text-[#94A3B8]">
                Here's what's happening with your business today.
              </p>
            </section>

            {/* Stats */}

            {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

            {loading && (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-28 animate-pulse rounded-[20px] bg-white" />)}
              </div>
            )}

            {!loading && <ProviderStats stats={dashboard.stats} />}

            {/* Desktop grid */}

            <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">

              {/* LEFT */}

              <div className="space-y-6">
                <ProviderProfileCard
                  key={`${dashboard.id}-${dashboard.available}`}
                  provider={dashboard}
                />

                <ProviderRequests
                  requests={dashboard.requests.slice(0, 3)}
                />
              </div>

              {/* RIGHT */}

              <div className="mt-4 space-y-6 border-t border-[#BFD1C5] pt-8 xl:mt-0 xl:border-t-0 xl:pt-0">
                {/* Profile Completion */}

                <section
                  className="
                    rounded-[22px]
                    border
                    border-[#E5EDE8]
                    bg-white
                    p-5
                  "
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-[#10231A]">
                        Profile Completion
                      </h3>

                      <p className="mt-1 text-xs text-[#64748B]">
                        Complete your profile to get more customers.
                      </p>
                    </div>

                    <span className="text-xl font-extrabold text-[#16A34A]">
                      {dashboard.profileCompletion}%
                    </span>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E5EDE8]">
                    <div
                      className="h-full rounded-full bg-[#16A34A]"
                      style={{
                        width: `${dashboard.profileCompletion}%`,
                      }}
                    />
                  </div>

                  <Link
                    to="/provider/profile"
                    className="
                      mt-4
                      flex
                      h-11
                      w-full
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#ECFDF3]
                      py-2.5
                      text-sm
                      font-bold
                      text-[#15803D]
                      transition
                      hover:bg-[#DCFCE7]
                    "
                  >
                    Complete Profile
                  </Link>
                </section>

                {/* Tips */}

                <section
                  className="
                    rounded-[22px]
                    border
                    border-[#FDE68A]
                    bg-[#FFFBEB]
                    p-5
                  "
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-[#B45309]">
                    Provider Tip
                  </p>

                  <h3 className="mt-2 font-extrabold text-[#78350F]">
                    Add business photos
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[#92400E]">
                    Providers with good business and work photos can build
                    stronger trust with customers.
                  </p>
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>

      <ProviderBottomNav />
    </div>
  );
}

export default ProviderDashboardPage;
