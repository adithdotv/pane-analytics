import Link from "next/link";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

import PaneMark from "@/components/PaneMark";
import PricingTiers from "@/components/PricingTiers";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-mono" });

export const metadata = {
  title: "Pricing — Pane Analytics",
  description: "Simple pricing. No surprises, no per-event math. Start free, upgrade only when you need to.",
};

const FAQS = [
  {
    question: "Can I switch plans anytime?",
    answer: "Yes — upgrade or downgrade whenever you like. Downgrades take effect at the end of your current billing cycle.",
  },
  {
    question: "What counts as a \"pageview\"?",
    answer: "Every page load tracked by the Pane script on any of your connected sites, combined across all sites on your plan.",
  },
  {
    question: "Do you offer refunds?",
    answer: "If Pane isn't a fit within the first 7 days of a paid plan, message us and we'll refund you — no long forms, no hard questions.",
  },
  {
    question: "Is there a discount for students or nonprofits?",
    answer: "Reach out directly — happy to work something out case by case while we're early.",
  },
  {
    question: "What happens to my data if I downgrade to Free?",
    answer: "Your existing data stays intact, but retention drops to the Free plan's 30-day window going forward.",
  },
];

function NavBar() {
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 sm:px-10">
      <Link href="/" className="flex items-center gap-2.5">
        <PaneMark />
        <span className={`${display.className} text-[19px] font-medium text-[#1B2430]`}>Pane</span>
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-[13px] text-[#5B6B7C] hover:text-[#1B2430]">Log in</Link>
        <Link
          href="/signup"
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
    <section className="mx-auto max-w-2xl px-6 py-16 text-center sm:px-10 sm:py-20">
      <h1 className={`${display.className} text-[34px] font-medium leading-tight text-[#1B2430] sm:text-[42px]`}>
        Simple pricing. No surprises, no per-event math.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-[#5B6B7C]">
        Start free. Upgrade only when your traffic actually needs it.
      </p>
    </section>
  );
}

function LimitPolicy() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-16 sm:px-10 sm:py-20">
      <div className="rounded-xl border border-[#E4E9EF] bg-white p-8 text-center">
        <p className={`${display.className} text-[17px] font-medium text-[#1B2430] mb-2`}>
          What happens if I go over my limit?
        </p>
        <p className="text-[14px] leading-relaxed text-[#5B6B7C]">
          We don&apos;t cut you off. If you cross your monthly pageview limit, you&apos;ll get an
          email heads-up and a short grace period to upgrade — tracking never just stops mid-month.
        </p>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-16 sm:px-10 sm:py-20">
      <h2 className={`${display.className} text-center text-[24px] font-medium text-[#1B2430] sm:text-[28px] mb-8`}>
        Pricing questions
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
    <section className="mx-auto max-w-2xl px-6 pb-16 text-center sm:px-10 sm:pb-20">
      <h2 className={`${display.className} text-[22px] font-medium text-[#1B2430] sm:text-[26px]`}>
        Still comparing? Try it free — no card, no commitment.
      </h2>
      <Link
        href="/signup"
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

export default function PricingPage() {
  return (
    <div className={`${display.variable} ${mono.variable} min-h-screen bg-[#F7F9FB]`}>
      <NavBar />
      <Hero />
      <section className="mx-auto max-w-4xl px-6 sm:px-10">
        <PricingTiers />
      </section>
      <LimitPolicy />
      <FAQ />
      <FooterCTA />
      <Footer />
    </div>
  );
}
