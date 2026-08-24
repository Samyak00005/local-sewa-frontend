import { CheckmarkCircle01Icon, FlashIcon, Search02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useServiceDirectory } from "../../../../hooks/useServiceDirectory";
import SearchBar from "../../SearchBar";

function HeroContent() {
  const navigate = useNavigate();
  const { categories, providers } = useServiceDirectory();
  const [query, setQuery] = useState("");
  const suggestions = useMemo(
    () => categories.map((category) => ({
      label: category.name,
      value: category.slug,
      subtitle: `${category.providerCount} local ${category.providerCount === 1 ? "provider" : "providers"}`,
    })),
    [categories],
  );

  const search = (searchQuery) => {
    if (!searchQuery) return;
    const exactCategory = categories.find(
      (category) => category.name.toLowerCase() === searchQuery.toLowerCase() || category.slug === searchQuery.toLowerCase().replaceAll(" ", "-"),
    );
    navigate(exactCategory ? `/services/${exactCategory.slug}` : `/services?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(340px,0.88fr)] lg:gap-14">
      <div>
        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-[#D8FBE5] sm:text-[11px]">
          <HugeiconsIcon icon={FlashIcon} size={15} strokeWidth={2} />
          Trusted help, close to home
        </p>
        <h1 className="max-w-3xl text-[34px] font-extrabold leading-[1.05] tracking-[-0.04em] text-white sm:text-[44px] lg:text-[58px]">
          Local services,
          <span className="block text-[#C7F9D9]">without the hassle.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
          Compare trusted professionals, contact them directly and manage every booking from one simple place.
        </p>
        <SearchBar
          className="mt-6 max-w-3xl"
          placeholder="What service do you need?"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onSubmit={search}
          suggestions={suggestions}
          onSuggestionSelect={(suggestion) => navigate(`/services/${suggestion.value}`)}
        />
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-white/80 sm:text-sm">
          {["Direct contact", "Verified profiles", "Simple booking"].map((item) => (
            <span key={item} className="inline-flex items-center gap-1.5">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} strokeWidth={2} className="text-[#A7F3C0]" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="rounded-[30px] border border-white/20 bg-white/12 p-5 shadow-[0_28px_80px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <div className="rounded-[22px] bg-white p-5 text-[#10231A] shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#16A34A]">Live directory</p>
                <h2 className="mt-1 text-xl font-extrabold">Help available today</h2>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#DCFCE7] text-[#15803D]">
                <HugeiconsIcon icon={Search02Icon} size={22} strokeWidth={2} />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {categories.slice(0, 4).map((category) => (
                <Link key={category.slug} to={`/services/${category.slug}`} className="rounded-2xl border border-[#E5EDE8] bg-[#FAFCFB] p-3 transition hover:-translate-y-0.5 hover:border-[#86EFAC] hover:bg-[#F0FDF4]">
                  <p className="truncate text-sm font-extrabold">{category.name}</p>
                  <p className="mt-1 text-xs text-[#64748B]">{category.providerCount} providers</p>
                </Link>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#10231A] px-4 py-3 text-white">
              <span className="text-sm font-semibold">Professionals listed</span>
              <span className="text-xl font-extrabold text-[#86EFAC]">{providers.length}+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroContent;
