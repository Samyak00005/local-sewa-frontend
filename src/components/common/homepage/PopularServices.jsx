import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

import { getServicePresentation } from "../../../config/serviceCatalog";
import { useServiceDirectory } from "../../../hooks/useServiceDirectory";

function PopularServices() {
  const { categories, loading, error, refresh } = useServiceDirectory();

  return (
    <section className="relative -mt-5 px-4 pb-7 sm:-mt-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[28px] border border-[#E5EDE8] bg-white p-5 shadow-[0_14px_45px_rgba(15,23,42,0.09)] sm:p-7">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#16A34A] sm:text-xs">Explore</p>
            <h2 className="text-xl font-extrabold tracking-[-0.035em] text-[#10231A] sm:text-2xl">Popular services</h2>
            <p className="mt-1 text-xs text-[#6B7280] sm:text-sm">Quick access to the most requested local services</p>
          </div>
          <Link to="/services" className="flex shrink-0 items-center gap-1 text-sm font-bold text-[#15803D] transition hover:text-[#16A34A]">
            See all
            <HugeiconsIcon icon={ArrowRight02Icon} size={17} strokeWidth={2} />
          </Link>
        </div>

        {error && !categories.length ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            <p>{error}</p>
            <button type="button" onClick={() => refresh(true)} className="mt-2 font-bold underline">Try again</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {loading && !categories.length
              ? Array.from({ length: 4 }, (_, index) => <ServiceSkeleton key={index} />)
              : categories.slice(0, 4).map((category) => {
                  const service = getServicePresentation(category);
                  return (
                    <Link
                      key={service.slug}
                      to={`/services/${service.slug}`}
                      className="group relative flex min-h-28 flex-col items-center justify-center overflow-hidden rounded-[18px] border border-[#E5EDE8] bg-[#FBFEFC] px-2 py-4 text-center transition duration-300 hover:-translate-y-1 hover:border-[#86EFAC] hover:bg-[#F0FDF4] hover:shadow-[0_10px_25px_rgba(22,163,74,0.10)]"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF8EE] text-[#15803D] transition group-hover:bg-[#DCFCE7]">
                        <HugeiconsIcon icon={service.icon} size={24} strokeWidth={1.8} />
                      </div>
                      <span className="mt-2 text-xs font-bold leading-4 text-[#334155] group-hover:text-[#15803D]">{service.name}</span>
                      <span className="mt-1 text-[10px] font-medium text-[#94A3B8]">{category.providerCount} providers</span>
                    </Link>
                  );
                })}
          </div>
        )}
      </div>
    </section>
  );
}

function ServiceSkeleton() {
  return (
    <div className="min-h-28 animate-pulse rounded-[18px] border border-[#EEF3F0] bg-[#FAFCFB] p-4">
      <div className="mx-auto h-12 w-12 rounded-2xl bg-[#E8EEEA]" />
      <div className="mx-auto mt-3 h-3 w-16 rounded-full bg-[#E8EEEA]" />
    </div>
  );
}

export default PopularServices;
