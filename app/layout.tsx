import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RootProviders } from "./root-providers";

export const dynamic = 'force-dynamic';

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Uncubed",
  description: "AI-powered startup co-pilot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <RootProviders>
          {children}
        </RootProviders>
      </body>
    </html>
  );
}
