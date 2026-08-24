import { useCallback, useEffect, useState } from "react";

import { apiRequest } from "../lib/api";

export const PROVIDER_REQUESTS_CHANGED_EVENT = "local-sewa:provider-requests-changed";

export function useProviderRequestCount() {
  const [pendingCount, setPendingCount] = useState(0);

  const refresh = useCallback(() => {
    let active = true;
    apiRequest("/api/provider/request-count")
      .then((data) => {
        if (active) setPendingCount(Math.max(0, Number(data.pendingCount) || 0));
      })
      .catch(() => {
        // Keep the last known badge count during a temporary network failure.
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let cancelPendingRequest = refresh();
    const refreshCount = () => {
      cancelPendingRequest?.();
      cancelPendingRequest = refresh();
    };
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") refreshCount();
    };
    const intervalId = window.setInterval(refreshCount, 30000);

    window.addEventListener("focus", refreshCount);
    window.addEventListener(PROVIDER_REQUESTS_CHANGED_EVENT, refreshCount);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      cancelPendingRequest?.();
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshCount);
      window.removeEventListener(PROVIDER_REQUESTS_CHANGED_EVENT, refreshCount);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [refresh]);

  return pendingCount;
}
