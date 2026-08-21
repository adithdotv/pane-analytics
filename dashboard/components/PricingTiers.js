"use client";

import { useState } from "react";
import Link from "next/link";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-mono" });

const TIERS = [
  {
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    period: "forever",
    description: "For side projects, portfolios, and testing the waters.",
    features: [
      "1 site",
      "10,000 pageviews/month",
      "30-day data retention",
      "Core dashboard — pageviews, referrers, top pages, countries",
      "No credit card required",
    ],
    cta: { label: "Start free", href: "/signup" },
  },
  {
    name: "Pro",
    highlight: "Most popular",
    priceMonthly: 299,
    priceYearly: 2999,
    description: "For indie developers and small SaaS founders running real products.",
    features: [
      "Up to 5 sites",
      "100,000 pageviews/month combined",
      "12-month data retention",
      "Custom events & goal tracking",
      "Weekly/monthly email reports",
      "Email support",
    ],
    cta: { label: "Upgrade to Pro", href: "/activate?plan=pro" },
  },
  {
    name: "Business",
    priceMonthly: 799,
    priceYearly: 7999,
    description: "For agencies and teams managing multiple client sites.",
    features: [
      "Up to 20 sites",
      "500,000 pageviews/month combined",
      "Unlimited data retention",
      "Team seats (multiple logins)",
      "Priority support",
      "Custom events & goal tracking",
    ],
    cta: { label: "Upgrade to Business", href: "/activate?plan=business" },
  },
];

function formatPrice(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function PricingTiers() {
  const [billing, setBilling] = useState("monthly");

  return (
    <div>
      <div className="mb-10 flex justify-center">
        <div className="inline-flex rounded-lg border border-[#E4E9EF] bg-white p-1">
          <button
            onClick={() => setBilling("monthly")}
            className={`rounded-md px-4 py-1.5 text-[13px] font-medium ${
              billing === "monthly" ? "bg-[#2E6FED] text-white" : "text-[#5B6B7C]"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`rounded-md px-4 py-1.5 text-[13px] font-medium ${
              billing === "yearly" ? "bg-[#2E6FED] text-white" : "text-[#5B6B7C]"
            }`}
          >
            Yearly (save ~15%)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {TIERS.map((tier) => {
          const isYearly = billing === "yearly" && tier.priceMonthly > 0;
          const price = isYearly ? tier.priceYearly : tier.priceMonthly;
          const period = tier.period ?? (isYearly ? "/year" : "/month");

          return (
            <div
              key={tier.name}
              className={`flex flex-col rounded-xl border bg-white p-6 ${
                tier.highlight ? "border-[#2E6FED]" : "border-[#E4E9EF]"
              }`}
            >
              {tier.highlight && (
                <span className="mb-3 inline-block w-fit rounded-full bg-[#2E6FED] px-2.5 py-0.5 text-[11px] font-medium text-white">
                  {tier.highlight}
                </span>
              )}
              <p className={`${display.className} text-[17px] font-medium text-[#1B2430]`}>{tier.name}</p>
              <p className="mt-3">
                <span className={`${mono.className} text-[30px] font-medium text-[#1B2430]`}>
                  {formatPrice(price)}
                </span>
                <span className="text-[13px] text-[#5B6B7C]"> {period}</span>
              </p>
              {isYearly && (
                <p className="mt-1 text-[12px] text-[#5B6B7C]">
                  billed yearly · {formatPrice(tier.priceMonthly)}/month if billed monthly
                </p>
              )}
              <p className="mt-3 text-[13px] leading-relaxed text-[#5B6B7C]">{tier.description}</p>

              <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-[13px] leading-relaxed text-[#1B2430]">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#2E6FED]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={tier.cta.href}
                className={`mt-6 rounded-lg px-4 py-2.5 text-center text-[14px] font-medium ${
                  tier.highlight
                    ? "bg-[#2E6FED] text-white hover:bg-[#2660D1]"
                    : "border border-[#E4E9EF] text-[#1B2430] hover:border-[#2E6FED]"
                }`}
              >
                {tier.cta.label}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
