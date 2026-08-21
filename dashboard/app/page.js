import Link from "next/link";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

import PaneMark from "@/components/PaneMark";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-mono" });

const PROBLEMS = [
  "GA4 buries you in menus you'll never use, and slows down your site.",
  "Plausible and Fathom charge $9–15/month starting out — real money for a side project.",
  "Umami is free, but “free” means you're the one keeping the server alive at 2am.",
];

const FEATURES = [
  {
    title: "No cookies, no consent banners",
    description: "Fully GDPR/DPDP-compliant by default. Nothing to configure, nothing to explain to a lawyer.",
  },
  {
    title: "One-line install",
    description: "Drop in a single script tag. Your dashboard starts filling in under a minute.",
  },
  {
    title: "Multi-site from day one",
    description: "Manage every project — client sites, side projects, your startup — from one account.",
  },
  {
    title: "Self-host or let us host it",
    description: "Full control if you want it. Zero maintenance if you don't.",
  },
];

const FAQS = [
  {
    question: "Is my data really not sold or shared?",
    answer:
      "No third-party trackers, no ad network integrations. Your data stays in your account (or your own server, if self-hosted).",
  },
  {
    question: "Do I need a cookie consent banner?",
    answer: "No. Pane doesn't use cookies or collect personal data, so most consent requirements don't apply.",
  },
  {
    question: "Can I move from Google Analytics easily?",
    answer: "Yes — swap one script tag. Historical GA data won't transfer, but you'll start collecting from day one.",
  },
  {
    question: "What happens if I outgrow the free plan?",
    answer: "You'll get a heads-up before any limit hits, no surprise cutoffs.",
  },
];

function NavBar() {
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 sm:px-10">
      <div className="flex items-center gap-2.5">
        <PaneMark />
        <span className={`${display.className} text-[19px] font-medium text-[#1B2430]`}>Pane</span>
      </div>
      <nav className="hidden items-center gap-6 sm:flex">
        <a href="#features" className="text-[13px] text-[#5B6B7C] hover:text-[#1B2430]">Features</a>
        <Link href="/pricing" className="text-[13px] text-[#5B6B7C] hover:text-[#1B2430]">Pricing</Link>
        <a href="#faq" className="text-[13px] text-[#5B6B7C] hover:text-[#1B2430]">FAQ</a>
      </nav>
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-[13px] text-[#5B6B7C] hover:text-[#1B2430]">Log in</Link>
        <Link
          href="/login"
          className="rounded-lg bg-[#2E6FED] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#2660D1]"
        >
          Start free
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 text-center sm:px-10 sm:py-24">
      <h1 className={`${display.className} text-[36px] font-medium leading-tight text-[#1B2430] sm:text-[48px]`}>
        Website analytics that don&apos;t cost more than your hosting.
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-[#5B6B7C]">
        Pane is simple, cookie-free analytics for indie developers and small teams.
        No cookie banners, no bloated dashboards, no $9/month for 10K pageviews.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/login"
          className="rounded-lg bg-[#2E6FED] px-6 py-3 text-[14px] font-medium text-white hover:bg-[#2660D1]"
        >
          Start free — no credit card
        </Link>
        <a
          href="#preview"
          className="rounded-lg border border-[#E4E9EF] bg-white px-6 py-3 text-[14px] font-medium text-[#1B2430] hover:border-[#2E6FED]"
        >
          See live demo
        </a>
      </div>
      <p className="mt-5 text-[13px] text-[#5B6B7C]">Self-hosted or cloud. Your data, your call.</p>
    </section>
  );
}

function DashboardPreview() {
  return (
    <section id="preview" className="mx-auto max-w-3xl px-6 sm:px-10">
      <div
        className="rounded-xl border border-[#E4E9EF] bg-white p-6"
        style={{
          backgroundImage:
            "linear-gradient(#EEF2F7 0.5px, transparent 0.5px), linear-gradient(90deg, #EEF2F7 0.5px, transparent 0.5px)",
          backgroundSize: "28px 28px",
        }}
      >
        <div className="flex gap-10 mb-6 pb-6 border-b border-[#E4E9EF]">
          <div className="flex flex-col gap-1">
            <span className={`${mono.className} text-[28px] leading-none font-medium text-[#1B2430]`}>1,204</span>
            <span className="text-[13px] text-[#5B6B7C]">Visits today</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className={`${mono.className} text-[28px] leading-none font-medium text-[#1B2430]`}>18</span>
            <span className="text-[13px] text-[#5B6B7C]">Referrer sources</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className={`${mono.className} text-[28px] leading-none font-medium text-[#1B2430]`}>32</span>
            <span className="text-[13px] text-[#5B6B7C]">Pages tracked</span>
          </div>
        </div>
        <svg viewBox="0 0 400 100" className="w-full" preserveAspectRatio="none" height="100">
          <polyline
            points="0,80 40,70 80,74 120,50 160,55 200,30 240,38 280,22 320,28 360,10 400,15"
            fill="none"
            stroke="#2E6FED"
            strokeWidth="2"
          />
        </svg>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 sm:px-10 sm:py-24">
      <h2 className={`${display.className} text-center text-[26px] font-medium leading-snug text-[#1B2430] sm:text-[30px]`}>
        Google Analytics is bloated. Plausible is expensive. Umami needs a DevOps engineer.
      </h2>
      <ul className="mx-auto mt-8 flex max-w-xl flex-col gap-4">
        {PROBLEMS.map((problem) => (
          <li key={problem} className="flex gap-3 text-[15px] leading-relaxed text-[#5B6B7C]">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2E6FED]" />
            {problem}
          </li>
        ))}
      </ul>
      <p className={`${display.className} mt-8 text-center text-[16px] font-medium text-[#1B2430]`}>
        Pane gives you the simple dashboard, without the trade-off.
      </p>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-3xl px-6 py-16 sm:px-10 sm:py-24">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="rounded-xl border border-[#E4E9EF] bg-white p-6">
            <p className={`${display.className} text-[16px] font-medium text-[#1B2430] mb-2`}>{feature.title}</p>
            <p className="text-[14px] leading-relaxed text-[#5B6B7C]">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingTeaser() {
  return (
    <section id="pricing" className="mx-auto max-w-3xl px-6 py-16 text-center sm:px-10 sm:py-24">
      <h2 className={`${display.className} text-[26px] font-medium text-[#1B2430] sm:text-[30px]`}>
        Pricing that makes sense in rupees.
      </h2>
      <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-[#5B6B7C]">
        Free for your first site, up to 10K views/month.
        Paid plans start at ₹299/month — less than a coffee subscription.
      </p>
      <Link href="/pricing" className="mt-6 inline-block text-[14px] font-medium text-[#2E6FED]">
        See full pricing →
      </Link>
    </section>
  );
}

function SocialProof() {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-16 text-center sm:px-10 sm:pb-24">
      <p className="text-[13px] text-[#5B6B7C]">Built and battle-tested on pane-analytics.in itself.</p>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-2xl px-6 py-16 sm:px-10 sm:py-24">
      <h2 className={`${display.className} text-center text-[26px] font-medium text-[#1B2430] sm:text-[30px] mb-8`}>
        Frequently asked questions
      </h2>
      <div className="flex flex-col gap-3">
        {FAQS.map((faq) => (
          <details key={faq.question} className="rounded-xl border border-[#E4E9EF] bg-white p-5">
            <summary className="cursor-pointer text-[15px] font-medium text-[#1B2430]">{faq.question}</summary>
            <p className="mt-3 text-[14px] leading-relaxed text-[#5B6B7C]">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function FooterCTA() {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-16 text-center sm:px-10 sm:pb-24">
      <h2 className={`${display.className} text-[24px] font-medium leading-snug text-[#1B2430] sm:text-[28px]`}>
        Stop paying analytics-company rent for a widget you&apos;ll check once a week.
      </h2>
      <Link
        href="/login"
        className="mt-6 inline-block rounded-lg bg-[#2E6FED] px-6 py-3 text-[14px] font-medium text-white hover:bg-[#2660D1]"
      >
        Start free
      </Link>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#E4E9EF] px-6 py-8 sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <PaneMark />
          <span className={`${display.className} text-[14px] font-medium text-[#1B2430]`}>Pane</span>
        </div>
        <p className="text-[13px] text-[#5B6B7C]">&copy; {new Date().getFullYear()} Pane Analytics.</p>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className={`${display.variable} ${mono.variable} min-h-screen bg-[#F7F9FB]`}>
      <NavBar />
      <Hero />
      <DashboardPreview />
      <ProblemSection />
      <Features />
      <PricingTeaser />
      <SocialProof />
      <FAQ />
      <FooterCTA />
      <Footer />
    </div>
  );
}
