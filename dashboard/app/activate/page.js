import Link from "next/link";
import { Space_Grotesk } from "next/font/google";

import PaneMark from "@/components/PaneMark";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-display" });

const CONTACT_EMAIL = "adithv137@gmail.com";
const WHATSAPP_NUMBER = "+918138837101";
const WHATSAPP_LINK = "https://wa.me/918138837101";

const PLAN_NAMES = {
  pro: "Pro",
  business: "Business",
};

export const metadata = {
  title: "Activate your plan — Pane Analytics",
};

export default async function ActivatePage({ searchParams }) {
  const { plan } = await searchParams;
  const planName = PLAN_NAMES[plan] ?? "paid";

  return (
    <div className={`${display.variable} min-h-screen bg-[#F7F9FB] flex items-center justify-center px-6 py-16`}>
      <div className="w-full max-w-md rounded-xl border border-[#E4E9EF] bg-white p-8 text-center">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <PaneMark />
          <span className={`${display.className} text-[19px] font-medium text-[#1B2430]`}>Pane</span>
        </div>

        <p className={`${display.className} text-[19px] font-medium text-[#1B2430] mb-2`}>
          Let&apos;s activate your {planName} plan
        </p>
        <p className="text-[14px] leading-relaxed text-[#5B6B7C] mb-6">
          We&apos;re manually activating paid plans while we&apos;re early. Message us with the
          email you signed up with and we&apos;ll get your plan turned on, usually within a few hours.
        </p>

        <div className="flex flex-col gap-3">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-[#2E6FED] px-4 py-2.5 text-[14px] font-medium text-white hover:bg-[#2660D1]"
          >
            Message on WhatsApp ({WHATSAPP_NUMBER})
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Activate ${planName} plan`}
            className="rounded-lg border border-[#E4E9EF] px-4 py-2.5 text-[14px] font-medium text-[#1B2430] hover:border-[#2E6FED]"
          >
            Email {CONTACT_EMAIL}
          </a>
        </div>

        <Link href="/pricing" className="mt-6 inline-block text-[13px] text-[#5B6B7C] hover:text-[#1B2430]">
          ← Back to pricing
        </Link>
      </div>
    </div>
  );
}
