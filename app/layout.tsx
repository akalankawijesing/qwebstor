import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import { getCurrentSession } from "@/lib/auth";
import { siteConfig } from "@/lib/config";
import { SanityLive } from "@/sanity/lib/live";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default:siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {user} = await getCurrentSession();

  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <Header user={user}/>
        {children}
        <SanityLive/>
      </body>
    </html>
  );
}
