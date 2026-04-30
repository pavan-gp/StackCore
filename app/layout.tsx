import { TempoInit } from "@/components/tempo-init";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import AIAssistant from "@/components/ai-assistant";

export const metadata: Metadata = {
  title: "Jnana Setu — Peer-to-Peer Skill Barter Platform",
  description: "Bridge of Knowledge. Trade skills with fellow students. No money required — just knowledge exchange.",
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,700;9..144,900&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'Space Grotesk', sans-serif", backgroundColor: "#0F1F35", color: "#EDF2F7" }}>
        {children}
        <AIAssistant />
        <TempoInit />
      </body>
    </html>
  );
}
