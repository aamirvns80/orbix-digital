import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toast";
import { TRPCProvider } from "@/lib/trpc/client";
import { PageTransition } from "@/components/ui/page-transition";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { ChatBot } from "@/components/chatbot";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://MarketifyDigiAI.com";

export const metadata: Metadata = {
  title: {
    default: "MarketifyDigiAI — Marketing Agency Management Platform",
    template: "%s | MarketifyDigiAI",
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
  authors: [{ name: "MarketifyDigiAI Team" }],
  creator: "MarketifyDigiAI",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "MarketifyDigiAI",
    title: "MarketifyDigiAI — Marketing Agency Management Platform",
    description:
      "Full-service digital marketing platform. Manage leads, clients, and campaigns. Trusted by 500+ businesses.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MarketifyDigiAI — Marketing Agency Management Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MarketifyDigiAI — Marketing Agency Management Platform",
    description:
      "Full-service digital marketing platform. Manage leads, clients, and campaigns. Trusted by 500+ businesses.",
    images: ["/og-image.png"],
    creator: "@MarketifyDigiAI",
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
  name: "MarketifyDigiAI",
  description:
    "Full-service digital marketing agency trusted by 500+ Indian businesses.",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  sameAs: [
    "https://twitter.com/marketifydigiai",
    "https://linkedin.com/company/marketifydigiai",
    "https://instagram.com/marketifydigiai",
    "https://youtube.com/@marketifydigiai",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-98765-43210",
    contactType: "sales",
    email: "hello@marketifydigiai.com",
    availableLanguage: ["English", "Hindi"],
  },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "INR",
    lowPrice: "4999",
    highPrice: "14999",
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
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JE357ELVZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JE357ELVZ');
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider>
          <TRPCProvider>
            <PageTransition>
              {children}
            </PageTransition>
            <WhatsAppButton />
            <ChatBot />
            <Toaster />
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
