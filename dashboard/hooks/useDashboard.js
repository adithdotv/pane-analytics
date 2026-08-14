"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ApiError,
  createSite,
  getTopPages,
  getTopReferrers,
  getVisitsOverTime,
  listSites,
} from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth";

export function useDashboard() {
  const router = useRouter();
  const [token] = useState(() => getToken());
  const [sites, setSites] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [stats, setStats] = useState({ topPages: [], topReferrers: [], visitsOverTime: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const logout = useCallback(() => {
    clearToken();
    router.replace("/login");
  }, [router]);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  useEffect(() => {
    if (!token) return;

    listSites(token)
      .then((fetchedSites) => {
        setSites(fetchedSites);
        setSelectedSiteId((current) => current ?? fetchedSites[0]?.id ?? null);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          logout();
          return;
        }
        setError("Couldn't load your sites.");
      })
      .finally(() => setIsLoading(false));
  }, [token, logout]);

  useEffect(() => {
    if (!token || !selectedSiteId) return;

    Promise.all([
      getTopPages(token, selectedSiteId),
      getTopReferrers(token, selectedSiteId),
      getVisitsOverTime(token, selectedSiteId),
    ])
      .then(([topPages, topReferrers, visitsOverTime]) => {
        setStats({ topPages, topReferrers, visitsOverTime });
      })
      .catch(() => setError("Couldn't load stats for this site."));
  }, [token, selectedSiteId]);

  const addSite = useCallback(
    async (name) => {
      const newSite = await createSite(token, name);
      setSites((current) => [...current, newSite]);
      setSelectedSiteId(newSite.id);
      return newSite;
    },
    [token]
  );

  return {
    isLoading,
    error,
    sites,
    selectedSiteId,
    selectSite: setSelectedSiteId,
    stats,
    addSite,
    logout,
  };
}
