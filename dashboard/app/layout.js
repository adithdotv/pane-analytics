import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-mono" });

export const metadata = {
  title: "Pane Analytics — privacy-friendly website analytics",
  description:
    "Self-hosted, cookie-free website analytics. No personal data stored, no cross-site tracking — just visits, top pages, and referrers.",
  metadataBase: new URL("https://pane-analytics.in"),
  openGraph: {
    title: "Pane Analytics",
    description: "Privacy-friendly, self-hosted website analytics. No cookies, no tracking.",
    url: "https://pane-analytics.in",
    siteName: "Pane Analytics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pane Analytics",
    description: "Privacy-friendly, self-hosted website analytics. No cookies, no tracking.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${mono.variable}`}>
        {children}
      </body>
    </html>
  );
}