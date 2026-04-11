import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/Navbar';
import { ModeProvider } from '@/components/ModeProvider';
import { ProgressProvider } from '@/components/ProgressProvider';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "PromptCraft Academy — Interactive Prompt Engineering Tutorial",
  description: "Master prompt engineering with Claude through interactive exercises, gamified learning, and real-time AI feedback.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`antialiased bg-white text-zinc-900 ${inter.className}`}>
        <ModeProvider>
          <ProgressProvider>
            <Navbar />
            <main className="pt-16">{children}</main>
          </ProgressProvider>
        </ModeProvider>
      </body>
    </html>
  );
}
