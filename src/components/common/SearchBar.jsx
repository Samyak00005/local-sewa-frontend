import { Cancel01Icon, Search02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const SEARCH_HISTORY_KEY = "__localSewaSearchSession";

function SearchBar({
  placeholder = "Search services...",
  value,
  onChange,
  onSubmit,
  suggestions = [],
  onSuggestionSelect,
  className = "",
  tone = "hero",
}) {
  const [internalValue, setInternalValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const historySessionRef = useRef(null);
  const historyClosingRef = useRef(false);
  const pendingCloseActionRef = useRef(null);
  const query = value === undefined ? internalValue : value;

  const filteredSuggestions = useMemo(() => {
    const normalizedQuery = String(query || "").trim().toLowerCase();
    return suggestions
      .filter((item) => {
        if (!normalizedQuery) return true;
        return `${item.label || ""} ${item.subtitle || ""}`.toLowerCase().includes(normalizedQuery);
      })
      .slice(0, 6);
  }, [query, suggestions]);

  const closeSearchUi = useCallback(() => {
    setIsOpen(false);
    inputRef.current?.blur();
  }, []);

  const closeSearch = useCallback((afterClose) => {
    if (typeof afterClose === "function") {
      pendingCloseActionRef.current = afterClose;
    }

    if (historySessionRef.current && !historyClosingRef.current) {
      historyClosingRef.current = true;
      window.history.back();
      return;
    }

    if (!historySessionRef.current) {
      closeSearchUi();
      const action = pendingCloseActionRef.current;
      pendingCloseActionRef.current = null;
      action?.();
    }
  }, [closeSearchUi]);

  const openMobileSearchSession = useCallback(() => {
    if (window.innerWidth > 768 || historySessionRef.current) return;
    const sessionId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.history.pushState(
      { ...(window.history.state || {}), [SEARCH_HISTORY_KEY]: sessionId },
      "",
      window.location.href,
    );
    historySessionRef.current = sessionId;
  }, []);

  const closeBeforeOutsideAction = useCallback(() => {
    if (historySessionRef.current && window.history.state?.[SEARCH_HISTORY_KEY] === historySessionRef.current) {
      const nextState = { ...(window.history.state || {}) };
      delete nextState[SEARCH_HISTORY_KEY];
      window.history.replaceState(nextState, "", window.location.href);
    }
    historySessionRef.current = null;
    historyClosingRef.current = false;
    pendingCloseActionRef.current = null;
    closeSearchUi();
  }, [closeSearchUi]);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!wrapperRef.current || wrapperRef.current.contains(event.target)) return;
      if (event.target.closest?.("a[href], button, [role='button']")) {
        closeBeforeOutsideAction();
        return;
      }
      closeSearch();
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSearch();
      }
    };
    const closeOnBrowserBack = () => {
      if (!historySessionRef.current) return;
      historySessionRef.current = null;
      historyClosingRef.current = false;
      closeSearchUi();
      const action = pendingCloseActionRef.current;
      pendingCloseActionRef.current = null;
      action?.();
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("popstate", closeOnBrowserBack);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("popstate", closeOnBrowserBack);

      if (historySessionRef.current && window.history.state?.[SEARCH_HISTORY_KEY] === historySessionRef.current) {
        const nextState = { ...(window.history.state || {}) };
        delete nextState[SEARCH_HISTORY_KEY];
        window.history.replaceState(nextState, "", window.location.href);
      }
      historySessionRef.current = null;
      historyClosingRef.current = false;
      pendingCloseActionRef.current = null;
    };
  }, [closeBeforeOutsideAction, closeSearch, closeSearchUi]);

  const handleChange = (event) => {
    if (value === undefined) setInternalValue(event.target.value);
    onChange?.(event);
    setIsOpen(true);
  };

  const clearSearch = () => {
    const syntheticEvent = { target: { value: "" } };
    if (value === undefined) setInternalValue("");
    onChange?.(syntheticEvent);
    closeSearch();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const submittedQuery = String(query || "").trim();
    closeSearch(() => onSubmit?.(submittedQuery));
  };

  const selectSuggestion = (suggestion) => {
    if (value === undefined) setInternalValue(suggestion.label);
    closeSearch(() => onSuggestionSelect?.(suggestion));
  };

  const handleFocus = () => {
    if (suggestions.length) setIsOpen(true);
    openMobileSearchSession();
  };

  const handleBlur = () => {
    window.setTimeout(() => {
      if (wrapperRef.current && !wrapperRef.current.contains(document.activeElement)) {
        closeSearch();
      }
    }, 120);
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <form
        role="search"
        onSubmit={handleSubmit}
        className={`flex min-h-14 w-full items-center gap-3 rounded-[26px] border bg-white pl-4 pr-2 py-1.5 transition focus-within:border-[#86EFAC] focus-within:ring-4 focus-within:ring-[#DCFCE7] ${
          tone === "surface"
            ? "border-[#DDE9E1] shadow-[0_8px_24px_rgba(15,23,42,0.06)]"
            : "border-white/30 shadow-[0_12px_35px_rgba(0,0,0,0.14)]"
        }`}
      >
        <HugeiconsIcon icon={Search02Icon} size={22} strokeWidth={2} className="shrink-0 text-[#64748B]" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          aria-label={placeholder}
          aria-expanded={isOpen && filteredSuggestions.length > 0}
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#111827] outline-none placeholder:text-[#94A3B8] sm:text-base [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button type="button" onClick={clearSearch} aria-label="Clear search" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#94A3B8] transition hover:bg-[#F1F5F9] hover:text-[#334155]">
            <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={2} />
          </button>
        )}
        <button type="submit" aria-label="Search" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#16A34A] p-0 text-white shadow-sm transition hover:bg-[#15803D] active:scale-95">
          <HugeiconsIcon icon={Search02Icon} size={18} strokeWidth={2} />
        </button>
      </form>

      {isOpen && filteredSuggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[min(18rem,45vh)] overflow-y-auto overscroll-contain rounded-2xl border border-[#DDE9E1] bg-white p-2 text-[#10231A] shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
          {filteredSuggestions.map((suggestion) => (
            <button key={suggestion.value || suggestion.label} type="button" onClick={() => selectSuggestion(suggestion)} className="flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-left transition hover:bg-[#F0FDF4]">
              <span>
                <span className="block text-sm font-bold">{suggestion.label}</span>
                {suggestion.subtitle && <span className="mt-0.5 block text-xs text-[#64748B]">{suggestion.subtitle}</span>}
              </span>
              <HugeiconsIcon icon={Search02Icon} size={17} strokeWidth={2} className="shrink-0 text-[#16A34A]" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
