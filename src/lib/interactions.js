export function installAppInteractions() {
  if (window.__localSewaInteractionsInstalled) return;
  window.__localSewaInteractionsInstalled = true;

  const updateViewportHeight = () => {
    const viewport = window.visualViewport;
    const height = viewport?.height || window.innerHeight;
    const keyboardHeight = Math.max(0, window.innerHeight - height - (viewport?.offsetTop || 0));
    document.documentElement.style.setProperty("--app-viewport-height", `${height}px`);
    document.documentElement.style.setProperty("--keyboard-height", `${keyboardHeight}px`);
  };

  const isEditableField = (element) => element?.matches?.("input, textarea, select");

  let lastHapticAt = 0;
  const navigationHaptic = () => {
    const now = Date.now();
    if (now - lastHapticAt < 120) return;
    lastHapticAt = now;
    try {
      navigator.vibrate?.(10);
    } catch {
      // Haptics are an optional device enhancement.
    }
  };

  const handleNavigation = (event) => {
    const target = event.target.closest?.("a[href], button[data-navigation]");
    if (!target || target.disabled) return;
    navigationHaptic();
  };

  const originalPushState = window.history.pushState.bind(window.history);
  const originalReplaceState = window.history.replaceState.bind(window.history);
  window.history.pushState = (...args) => {
    navigationHaptic();
    return originalPushState(...args);
  };
  window.history.replaceState = (...args) => {
    navigationHaptic();
    return originalReplaceState(...args);
  };

  const revealField = (field, behavior = "smooth") => {
    if (!isEditableField(field) || window.innerWidth > 768) return;
    const viewport = window.visualViewport;
    const viewportTop = viewport?.offsetTop || 0;
    const viewportBottom = viewportTop + (viewport?.height || window.innerHeight);
    const rect = field.getBoundingClientRect();
    const safeTop = viewportTop + 18;
    const safeBottom = viewportBottom - 24;

    if (rect.top < safeTop || rect.bottom > safeBottom) {
      field.scrollIntoView({
        block: field.type === "search" ? "start" : "center",
        inline: "nearest",
        behavior,
      });
    }
  };

  const keepFocusedFieldVisible = (event) => {
    const field = event.target.closest?.("input, textarea, select");
    if (!field || window.innerWidth > 768) return;
    document.body.classList.add("keyboard-active");
    updateViewportHeight();
    [80, 300, 600].forEach((delay, index) => {
      window.setTimeout(() => revealField(field, index === 0 ? "auto" : "smooth"), delay);
    });
  };

  const handleFocusOut = () => {
    window.setTimeout(() => {
      if (!isEditableField(document.activeElement)) {
        document.body.classList.remove("keyboard-active");
        updateViewportHeight();
      }
    }, 120);
  };

  const handleViewportResize = () => {
    updateViewportHeight();
    if (document.body.classList.contains("keyboard-active")) {
      window.setTimeout(() => revealField(document.activeElement), 80);
    }
  };

  updateViewportHeight();
  document.addEventListener("click", handleNavigation, { passive: true });
  document.addEventListener("focusin", keepFocusedFieldVisible);
  document.addEventListener("focusout", handleFocusOut);
  window.addEventListener("popstate", navigationHaptic, { passive: true });
  window.addEventListener("resize", handleViewportResize, { passive: true });
  window.visualViewport?.addEventListener("resize", handleViewportResize, { passive: true });
}
