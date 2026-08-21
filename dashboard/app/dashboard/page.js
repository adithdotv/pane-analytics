"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

import PaneMark from "@/components/PaneMark";
import CreateSiteForm from "@/components/CreateSiteForm";
import SiteSwitcher from "@/components/SiteSwitcher";
import { useDashboard } from "@/hooks/useDashboard";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-mono" });

function StatBlock({ value, label }) {
  return (
    <div className="flex flex-col gap-1">
      <span className={`${mono.className} text-[32px] leading-none font-medium text-[#1B2430]`}>
        {value}
      </span>
      <span className="text-[13px] text-[#5B6B7C]">{label}</span>
    </div>
  );
}

function EmptyState({ siteKey }) {
  return (
    <div className="rounded-xl border border-[#E4E9EF] bg-white p-8 text-center">
      <p className={`${display.className} text-[18px] font-medium text-[#1B2430] mb-2`}>
        No visits yet
      </p>
      <p className="text-[14px] text-[#5B6B7C] mb-4">
        Add this snippet to your site to start seeing data here.
      </p>
      <code className="block bg-[#F7F9FB] border border-[#E4E9EF] rounded-lg px-4 py-3 text-[13px] text-[#2E6FED] text-left overflow-x-auto">
        {`<script src="https://pane-analytics.in/tracker.js" data-site="${siteKey}"></script>`}
      </code>
    </div>
  );
}

export default function Dashboard() {
  const { isLoading, error, sites, selectedSiteId, selectSite, stats, addSite, logout } = useDashboard();
  const [isAddingSite, setIsAddingSite] = useState(false);
  const { topPages, topReferrers, visitsOverTime } = stats;

  const todayVisits = visitsOverTime.length
    ? visitsOverTime[visitsOverTime.length - 1].visits
    : 0;
  const hasData = topPages.length || topReferrers.length || visitsOverTime.length;
  const selectedSite = sites.find((s) => s.id === selectedSiteId);

  if (isLoading) {
    return <div className="min-h-screen bg-[#F7F9FB]" />;
  }

  async function handleAddSite(name) {
    await addSite(name);
    setIsAddingSite(false);
  }

  return (
    <div className={`${display.variable} ${mono.variable} min-h-screen bg-[#F7F9FB] px-6 py-10 sm:px-10`}>
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2.5">
            <PaneMark />
            <span className={`${display.className} text-[19px] font-medium text-[#1B2430]`}>
              Pane
            </span>
          </div>
          <div className="flex items-center gap-4">
            {sites.length > 0 && (
              <>
                <SiteSwitcher sites={sites} selectedSiteId={selectedSiteId} onSelect={selectSite} />
                <button
                  onClick={() => setIsAddingSite((current) => !current)}
                  className="text-[13px] text-[#5B6B7C] hover:text-[#1B2430]"
                >
                  + New site
                </button>
              </>
            )}
            <button onClick={logout} className="text-[13px] text-[#5B6B7C] hover:text-[#1B2430]">
              Log out
            </button>
          </div>
        </div>

        {error && <p className="mb-4 text-[13px] text-[#D64545]">{error}</p>}

        {isAddingSite && (
          <div className="mb-6">
            <CreateSiteForm onCreate={handleAddSite} onCancel={() => setIsAddingSite(false)} />
          </div>
        )}

        {sites.length === 0 ? (
          <CreateSiteForm onCreate={addSite} />
        ) : !hasData ? (
          <EmptyState siteKey={selectedSite?.site_key} />
        ) : (
          <>
            {/* Hero stats */}
            <div className="flex gap-10 mb-8 pb-8 border-b border-[#E4E9EF]">
              <StatBlock value={todayVisits} label="Visits today" />
              <StatBlock value={topReferrers.length} label="Referrer sources" />
              <StatBlock value={topPages.length} label="Pages tracked" />
            </div>

            {/* Chart card with pane-grid signature */}
            <div
              className="rounded-xl border border-[#E4E9EF] bg-white p-6 mb-6"
              style={{
                backgroundImage:
                  "linear-gradient(#EEF2F7 0.5px, transparent 0.5px), linear-gradient(90deg, #EEF2F7 0.5px, transparent 0.5px)",
                backgroundSize: "28px 28px",
              }}
            >
              <p className={`${display.className} text-[15px] font-medium text-[#1B2430] mb-4`}>
                Visits over time
              </p>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={visitsOverTime}>
                  <CartesianGrid stroke="transparent" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#5B6B7C" }} axisLine={{ stroke: "#E4E9EF" }} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#5B6B7C" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #E4E9EF", fontSize: 13 }}
                  />
                  <Line type="monotone" dataKey="visits" stroke="#2E6FED" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Two-column tables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="rounded-xl border border-[#E4E9EF] bg-white p-6">
                <p className={`${display.className} text-[15px] font-medium text-[#1B2430] mb-4`}>
                  Top pages
                </p>
                <div className="flex flex-col">
                  {topPages.map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2.5 border-b border-[#F0F3F7] last:border-0"
                    >
                      <span className="text-[13px] text-[#1B2430] truncate pr-4">{row.url}</span>
                      <span className={`${mono.className} text-[13px] text-[#5B6B7C]`}>{row.visits}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#E4E9EF] bg-white p-6">
                <p className={`${display.className} text-[15px] font-medium text-[#1B2430] mb-4`}>
                  Top referrers
                </p>
                <div className="flex flex-col">
                  {topReferrers.map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2.5 border-b border-[#F0F3F7] last:border-0"
                    >
                      <span className="text-[13px] text-[#1B2430] truncate pr-4">{row.referrer}</span>
                      <span className={`${mono.className} text-[13px] text-[#5B6B7C]`}>{row.visits}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
