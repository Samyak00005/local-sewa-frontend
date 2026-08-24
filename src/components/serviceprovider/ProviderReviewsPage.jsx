import { StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useState } from "react";

import { apiRequest } from "../../lib/api";
import ProviderBottomNav from "./ProviderBottomNav";
import ProviderSidebar from "./ProviderSidebar";
import ProviderTopBar from "./ProviderTopBar";

function ProviderReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReviews = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/api/provider/reviews");
      setReviews(data.reviews || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    apiRequest("/api/provider/reviews")
      .then((data) => {
        if (active) setReviews(data.reviews || []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((total, review) => total + Number(review.rating || 0), 0) / reviews.length;
  }, [reviews]);

  return (
    <div className="min-h-screen bg-[#DCE9E1]">
      <div className="flex">
        <ProviderSidebar />
        <div className="min-w-0 flex-1">
          <ProviderTopBar title="Customer Reviews" />
          <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:pb-10 lg:pt-8">
            <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
              <aside className="rounded-[24px] border border-[#E5EDE8] bg-white p-6 text-center lg:sticky lg:top-24">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#16A34A]">Overall rating</p>
                <p className="mt-3 text-5xl font-extrabold tracking-[-0.05em] text-[#10231A]">{averageRating ? averageRating.toFixed(1) : "—"}</p>
                <div className="mt-3 flex justify-center gap-1 text-[#F59E0B]">
                  {Array.from({ length: 5 }, (_, index) => (
                    <HugeiconsIcon key={index} icon={StarIcon} size={20} strokeWidth={2} className={index < Math.round(averageRating) ? "opacity-100" : "opacity-20"} />
                  ))}
                </div>
                <p className="mt-3 text-sm text-[#64748B]">Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}</p>
              </aside>

              <section>
                <h1 className="text-2xl font-extrabold text-[#10231A]">Customer feedback</h1>
                <p className="mt-1 text-sm text-[#64748B]">Reviews appear here after completed bookings.</p>

                {error && (
                  <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <p>{error}</p>
                    <button type="button" onClick={loadReviews} className="mt-2 font-bold underline">Try again</button>
                  </div>
                )}

                <div className="mt-6 grid gap-4 xl:grid-cols-2">
                  {loading
                    ? Array.from({ length: 4 }, (_, index) => <ReviewSkeleton key={index} />)
                    : reviews.map((review) => (
                        <article key={review.id} className="rounded-[22px] border border-[#E5EDE8] bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.04)]">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h2 className="font-extrabold text-[#10231A]">{review.customer}</h2>
                              <p className="mt-1 text-xs font-semibold text-[#15803D]">{review.service}</p>
                            </div>
                            <span className="shrink-0 text-xs text-[#94A3B8]">{formatDate(review.created_at)}</span>
                          </div>
                          <div className="mt-3 flex gap-1 text-[#F59E0B]" aria-label={`${review.rating} out of 5 stars`}>
                            {Array.from({ length: 5 }, (_, index) => (
                              <HugeiconsIcon key={index} icon={StarIcon} size={17} strokeWidth={2} className={index < Number(review.rating) ? "opacity-100" : "opacity-20"} />
                            ))}
                          </div>
                          <p className="mt-4 text-sm leading-6 text-[#64748B]">{review.comment || "Customer left a rating without a written comment."}</p>
                        </article>
                      ))}
                </div>

                {!loading && !error && !reviews.length && (
                  <div className="mt-6 rounded-[22px] border border-dashed border-[#CBD5E1] bg-white p-12 text-center">
                    <HugeiconsIcon icon={StarIcon} size={30} strokeWidth={1.8} className="mx-auto text-[#F59E0B]" />
                    <h2 className="mt-4 font-extrabold text-[#10231A]">No reviews yet</h2>
                    <p className="mt-1 text-sm text-[#64748B]">Your first completed and reviewed booking will appear here.</p>
                  </div>
                )}
              </section>
            </div>
          </main>
        </div>
      </div>
      <ProviderBottomNav />
    </div>
  );
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(String(value).replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function ReviewSkeleton() {
  return <div className="h-44 animate-pulse rounded-[22px] border border-[#E5EDE8] bg-white p-5"><div className="h-4 w-1/2 rounded bg-[#E8EEEA]" /><div className="mt-3 h-3 w-1/3 rounded bg-[#EEF3F0]" /><div className="mt-7 h-3 w-full rounded bg-[#EEF3F0]" /><div className="mt-2 h-3 w-4/5 rounded bg-[#EEF3F0]" /></div>;
}

export default ProviderReviewsPage;
