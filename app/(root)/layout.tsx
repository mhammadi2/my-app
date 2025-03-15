"use client";
import React from "react";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <SessionProvider>
            <Header />
            <main className="flex-1">{children}</main>
          </SessionProvider>
          <Footer />
        </div>
      </body>
    </html>
  );
}
