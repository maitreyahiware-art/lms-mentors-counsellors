"use client";

import { Playfair_Display, Outfit } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import "./globals.css";
import { useState } from "react";
import { Search, Bell, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <html lang="en">
      <head>
        <title>Balance Nutrition | Mentor LMS Premium</title>
        <meta name="description" content="The world's most trusted Indian health ecosystem mentor portal." />
      </head>
      <body className={`${playfair.variable} ${outfit.variable} font-sans text-[#0E5858] bg-[#FAFCEE] antialiased overflow-x-hidden`}>
        <div className="flex min-h-screen">
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

          <div
            className={`flex-1 transition-all duration-500 ease-in-out ${isCollapsed ? 'ml-[88px]' : 'ml-[280px]'
              } relative overflow-hidden`}
          >
            {/* High-End Top Bar */}
            <header className="sticky top-0 z-40 bg-[#FAFCEE]/80 backdrop-blur-xl border-b border-[#0E5858]/5 px-8 lg:px-12 py-6 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/50 border border-white rounded-2xl shadow-sm text-[#0E5858]/40 hover:text-[#0E5858] transition-all cursor-text group">
                  <Search size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest group-hover:pl-1 transition-all">Search Training...</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  <span className="text-[10px] font-bold text-[#0E5858]/40 uppercase tracking-[0.2em]">Operational Network: Active</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="h-8 w-px bg-gray-200 mx-2"></div>
                <button className="relative p-2 text-[#0E5858]/60 hover:text-[#0E5858] transition-colors">
                  <Bell size={22} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-[#FFCC00] rounded-full ring-2 ring-[#FAFCEE]"></span>
                </button>
                <button className="bg-[#0E5858] text-white px-6 py-2.5 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-[#00B6C1] transition-all flex items-center gap-2">
                  <Sparkles size={14} />
                  Live Session
                </button>
              </div>
            </header>

            <main className="relative z-0">
              {children}
            </main>

            {/* Subtle Gradient Background Blob */}
            <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00B6C1]/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FFCC00]/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
          </div>
        </div>
      </body>
    </html>
  );
}
