export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Formix - Turn Web Forms Into WhatsApp Messages | Form Builder",
  description: "Instantly capture client inquiries on WhatsApp. Turn web forms into real conversations. Respond faster. Close more deals. Start free with 50 messages.",
  keywords: "forms, WhatsApp, lead capture, contact forms, form builder, WhatsApp automation, lead generation",
  
  openGraph: {
    title: "Formix - Forms to WhatsApp",
    description: "Turn web forms into WhatsApp messages. Capture leads instantly.",
    url: "https://formix.ximplex.app",
    siteName: "Formix",
    images: [
      {
        url: "https://formix.ximplex.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Formix - Forms to WhatsApp",
      },
    ],
    type: "website",
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Formix - Forms to WhatsApp",
    description: "Turn web forms into WhatsApp messages instantly.",
    images: ["https://formix.ximplex.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Canonical */}
        <link rel="canonical" href="https://formix.ximplex.app" />
        
        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        
        {/* Schema.json (LD-JSON) para Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Formix",
              description: "Turn web forms into WhatsApp messages",
              url: "https://formix.ximplex.app",
              applicationCategory: "BusinessApplication",
              offers: {
                "@type": "Offer",
                price: "19",
                priceCurrency: "USD",
                priceValidUntil: "2025-12-31",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "120",
              },
            }),
          }}
        />
        
        {/* Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-S9MCMFV72K`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-S9MCMFV72K');
            `,
          }}
        />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}