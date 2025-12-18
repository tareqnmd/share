import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeShare",
  description: "Share code securely",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100`}>
        <Providers>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 container mx-auto p-4">
                    {children}
                </main>
            </div>
        </Providers>
      </body>
    </html>
  );
}
