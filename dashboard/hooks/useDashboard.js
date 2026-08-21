"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ApiError,
  createSite,
  getCurrentUser,
  getTopPages,
  getTopReferrers,
  getVisitsOverTime,
  listSites,
  logout as logoutRequest,
} from "@/lib/api";

export function useDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [sites, setSites] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [stats, setStats] = useState({ topPages: [], topReferrers: [], visitsOverTime: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const logout = useCallback(async () => {
    await logoutRequest().catch(() => {});
    router.replace("/login");
  }, [router]);

  useEffect(() => {
    getCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
        return listSites();
      })
      .then((fetchedSites) => {
        setSites(fetchedSites);
        setSelectedSiteId((current) => current ?? fetchedSites[0]?.id ?? null);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          router.replace("/login");
          return;
        }
        setError("Couldn't load your sites.");
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  useEffect(() => {
    if (!user || !selectedSiteId) return;

    Promise.all([
      getTopPages(selectedSiteId),
      getTopReferrers(selectedSiteId),
      getVisitsOverTime(selectedSiteId),
    ])
      .then(([topPages, topReferrers, visitsOverTime]) => {
        setStats({ topPages, topReferrers, visitsOverTime });
      })
      .catch(() => setError("Couldn't load stats for this site."));
  }, [user, selectedSiteId]);

  const addSite = useCallback(async (name) => {
    const newSite = await createSite(name);
    setSites((current) => [...current, newSite]);
    setSelectedSiteId(newSite.id);
    return newSite;
  }, []);

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
