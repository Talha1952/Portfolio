import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Talha Haseeb – Full-Stack Developer | Architecting Scalable Business Solutions",
  description:
    "Full-Stack Developer specializing in POS systems, business websites, and custom web apps. Chat with Estimato to start your project.",
  keywords: ["Full-Stack Developer", "Next.js", "POS System", "Web App", "Pakistan"],
  openGraph: {
    title: "Talha Haseeb – Full-Stack Developer",
    description: "Architecting Scalable Business Solutions",
    type: "website",
  },
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
        <AppProvider>
          <SiteSettings />
          <CustomCursor />
          <SmoothScroll>{children}</SmoothScroll>
        </AppProvider>
      </body>
    </html>
  );
}
