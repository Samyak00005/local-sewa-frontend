import { useCallback, useEffect, useState } from "react";

import { apiRequest } from "../lib/api";

let directoryCache = null;
let directoryRequest = null;

export function invalidateServiceDirectory() {
  directoryCache = null;
  directoryRequest = null;
}

async function loadDirectory(force = false) {
  if (!force && directoryCache) return directoryCache;
  if (!force && directoryRequest) return directoryRequest;

  directoryRequest = Promise.all([
    apiRequest("/api/categories", { token: null }),
    apiRequest("/api/providers", { token: null }),
  ]).then(([categoryResponse, providerResponse]) => {
    const providers = Array.isArray(providerResponse.providers)
      ? providerResponse.providers
      : [];
    const providerCounts = providers.reduce((counts, provider) => {
      const slug = provider.category || "";
      counts[slug] = (counts[slug] || 0) + 1;
      return counts;
    }, {});

    directoryCache = {
      categories: (categoryResponse.categories || []).map((category) => ({
        ...category,
        providerCount: providerCounts[category.slug] || 0,
      })),
      providers,
    };
    return directoryCache;
  }).finally(() => {
    directoryRequest = null;
  });

  return directoryRequest;
}

export function useServiceDirectory() {
  const [directory, setDirectory] = useState(
    directoryCache || { categories: [], providers: [] },
  );
  const [loading, setLoading] = useState(!directoryCache);
  const [error, setError] = useState("");

  const refresh = useCallback(async (force = false) => {
    setLoading(true);
    setError("");
    try {
      const nextDirectory = await loadDirectory(force);
      setDirectory(nextDirectory);
    } catch (requestError) {
      setError(requestError.message || "Unable to load services right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    loadDirectory()
      .then((nextDirectory) => {
        if (active) setDirectory(nextDirectory);
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message || "Unable to load services right now.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { ...directory, loading, error, refresh };
}
