import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Talha Haseeb | AI Automation Expert & Custom SaaS Developer",
  description:
    "Top-tier AI and Full-Stack development services. Specializing in Voice AI Agents, WhatsApp Chatbots, Make.com Automation, Custom SaaS, and E-commerce websites. Partner with Talha Haseeb for digital excellence worldwide.",
  keywords: [
    "Voice AI Agent Development",
    "WhatsApp Chatbot Developer",
    "AI Appointment Setting Service",
    "Lead Qualification Bot Setup",
    "Custom SaaS Development Service",
    "No-Code Website Developer",
    "Vapi AI Agent Setup",
    "Make.com Automation Expert",
    "AI Receptionist for Agencies",
    "Zero Code AI Automation",
    "WhatsApp Business API Integration",
    "AI Sales Bot for Real Estate",
    "Voice AI for E-commerce",
    "Framer Website Developer",
    "Calendly Automation Setup",
    "E-commerce Websites",
    "Business Websites",
    "Full-Stack Developer",
    "Next.js Developer"
  ],
  authors: [{ name: "Talha Haseeb" }],
  creator: "Talha Haseeb",
  publisher: "DevSphere",
  openGraph: {
    title: "Talha Haseeb | AI Automation & Custom Web Expert",
    description: "Global expert in Voice AI, Chatbots, and High-Performance Web Architecture.",
    type: "website",
    url: "https://talhadevsphere.vercel.app",
    siteName: "Talha Haseeb Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Talha Haseeb | Global AI Automation Expert",
    description: "Architecting scalable business solutions and intelligent automation workflows worldwide.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const generateSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "DevSphere by Talha Haseeb",
    "image": "https://talhadevsphere.vercel.app/profile.png",
    "url": "https://talhadevsphere.vercel.app",
    "priceRange": "$$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Global",
      "addressCountry": "PK"
    },
    "description": "Premium AI Automation, WhatsApp Chatbot Integration, Voice AI Agents, and Custom SaaS Full-Stack Development Services.",
    "founder": {
      "@type": "Person",
      "name": "Talha Haseeb",
      "jobTitle": "Full Stack & AI Automation Developer"
    },
    "makesOffer": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Voice AI Agent Development" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "WhatsApp Chatbot Developer" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "AI Appointment Setting Service" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom SaaS Development" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Make.com Automation" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Vapi AI Agent Setup" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "No-Code Website Developer" } }
    ]
  };
};


export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import SiteSettings from "@/components/SiteSettings";
import CustomCursor from "@/components/CustomCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* JSON-LD Schema for Global SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateSchema()) }}
        />
        <AppProvider>
          <SiteSettings />
          <CustomCursor />
          <SmoothScroll>{children}</SmoothScroll>
        </AppProvider>
      </body>
    </html>
  );
}
