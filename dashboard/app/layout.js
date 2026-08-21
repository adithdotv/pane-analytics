import Script from "next/script";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-mono" });

export const metadata = {
  title: "Pane Analytics — website analytics that don't cost more than your hosting",
  description:
    "Simple, cookie-free analytics for indie developers and small teams. No bloated dashboards, no $9/month for 10K pageviews. Self-hosted or cloud.",
  metadataBase: new URL("https://pane-analytics.in"),
  openGraph: {
    title: "Pane Analytics",
    description: "Simple, cookie-free website analytics that doesn't cost more than your hosting.",
    url: "https://pane-analytics.in",
    siteName: "Pane Analytics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pane Analytics",
    description: "Simple, cookie-free website analytics that doesn't cost more than your hosting.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${mono.variable}`}>
        {children}
        <Script
          src="https://pane-analytics.in/tracker.js"
          data-site="pk_2da04542f744f8d90d614721"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}