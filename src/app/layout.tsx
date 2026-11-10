import type { Metadata } from "next";
import { Inter, Sarabun } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MindMap AI – เว็บแอปพลิเคชันสรุปรายงานและสร้างแผนผังความคิดด้วย AI",
  description: "AI-Powered Mind Map & Document Summarizer for Students & Researchers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${inter.variable} ${sarabun.variable} h-full`}>
      <body className="min-h-full bg-[#F7F8FC] text-[#202033] antialiased">
        {children}
      </body>
    </html>
  );
}
