import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toast";
import { TRPCProvider } from "@/lib/trpc/client";
import { PageTransition } from "@/components/ui/page-transition";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://OrbixDigital.com";

export const metadata: Metadata = {
  title: {
    default: "OrbixDigital — Marketing Agency Management Platform",
    template: "%s | OrbixDigital",
  },
  description:
    "Full-service digital marketing platform. Manage leads, clients, content, and campaigns from a single dashboard. Trusted by 500+ businesses.",
  keywords: [
    "marketing agency",
    "CRM",
    "lead management",
    "content management",
    "agency platform",
    "marketing automation",
    "client management",
  ],
  authors: [{ name: "OrbixDigital Team" }],
  creator: "OrbixDigital",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "OrbixDigital",
    title: "OrbixDigital — Marketing Agency Management Platform",
    description:
      "Full-service digital marketing platform. Manage leads, clients, and campaigns. Trusted by 500+ businesses.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "OrbixDigital — Marketing Agency Management Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OrbixDigital — Marketing Agency Management Platform",
    description:
      "Full-service digital marketing platform. Manage leads, clients, and campaigns. Trusted by 500+ businesses.",
    images: ["/og-image.svg"],
    creator: "@OrbixDigital",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-icon.svg",
  },
};

// JSON-LD structured data for the organization
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "OrbixDigital",
  description:
    "Full-service digital marketing platform trusted by 500+ businesses worldwide.",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  sameAs: [
    "https://twitter.com/OrbixDigital",
    "https://linkedin.com/company/OrbixDigital",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-555-987-6543",
    contactType: "sales",
    email: "hello@OrbixDigital.com",
    availableLanguage: "English",
  },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "49",
    highPrice: "149",
    offerCount: "3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider>
          <TRPCProvider>
            <PageTransition>
              {children}
            </PageTransition>
            <Toaster />
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
