"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const API_BASE = "https://pane-analytics.in";

export default function Dashboard() {
  const [topPages, setTopPages] = useState([]);
  const [topReferrers, setTopReferrers] = useState([]);
  const [visitsOverTime, setVisitsOverTime] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/stats/top-pages`)
      .then((res) => res.json())
      .then((data) => setTopPages(data));

    fetch(`${API_BASE}/stats/top-referrers`)
      .then((res) => res.json())
      .then((data) => setTopReferrers(data));

    fetch(`${API_BASE}/stats/visits-over-time`)
      .then((res) => res.json())
      .then((data) => setVisitsOverTime(data));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Pane Analytics</h1>

      <h2>Visits Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={visitsOverTime}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="visits" stroke="#2C5282" />
        </LineChart>
      </ResponsiveContainer>

      <h2>Top Pages</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr><th>URL</th><th>Visits</th></tr>
        </thead>
        <tbody>
          {topPages.map((row, i) => (
            <tr key={i}>
              <td>{row.url}</td>
              <td>{row.visits}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Top Referrers</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr><th>Referrer</th><th>Visits</th></tr>
        </thead>
        <tbody>
          {topReferrers.map((row, i) => (
            <tr key={i}>
              <td>{row.referrer}</td>
              <td>{row.visits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}