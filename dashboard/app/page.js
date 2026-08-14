"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-mono" });

const API_BASE = "https://pane-analytics.in";

function PaneMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="1" y="1" width="20" height="20" rx="3" stroke="#2E6FED" strokeWidth="1.6" />
      <line x1="11" y1="1" x2="11" y2="21" stroke="#2E6FED" strokeWidth="1.6" />
      <line x1="1" y1="11" x2="21" y2="11" stroke="#2E6FED" strokeWidth="1.6" />
    </svg>
  );
}

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

function EmptyState() {
  return (
    <div className="rounded-xl border border-[#E4E9EF] bg-white p-8 text-center">
      <p className={`${display.className} text-[18px] font-medium text-[#1B2430] mb-2`}>
        No visits yet
      </p>
      <p className="text-[14px] text-[#5B6B7C] mb-4">
        Add this snippet to your site to start seeing data here.
      </p>
      <code className="block bg-[#F7F9FB] border border-[#E4E9EF] rounded-lg px-4 py-3 text-[13px] text-[#2E6FED] text-left overflow-x-auto">
        {'<script src="https://pane-analytics.in/tracker.js"></script>'}
      </code>
    </div>
  );
}

export default function Dashboard() {
  const [topPages, setTopPages] = useState([]);
  const [topReferrers, setTopReferrers] = useState([]);
  const [visitsOverTime, setVisitsOverTime] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/stats/top-pages`).then((r) => r.json()).then(setTopPages);
    fetch(`${API_BASE}/stats/top-referrers`).then((r) => r.json()).then(setTopReferrers);
    fetch(`${API_BASE}/stats/visits-over-time`).then((r) => r.json()).then(setVisitsOverTime);
  }, []);

  const todayVisits = visitsOverTime.length
    ? visitsOverTime[visitsOverTime.length - 1].visits
    : 0;
  const hasData = topPages.length || topReferrers.length || visitsOverTime.length;

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
            <span className="text-[13px] text-[#5B6B7C]">pane-analytics.in</span>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#17B893] opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#17B893]"></span>
              </span>
              <span className="text-[13px] text-[#5B6B7C]">Live</span>
            </div>
          </div>
        </div>

        {!hasData ? (
          <EmptyState />
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