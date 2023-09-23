import "./globals.css";
import type { Metadata } from "next";
import { Bungee_Inline, Inter } from "next/font/google";

import { Roboto } from "next/font/google";
import { cn } from "@/lib/utils";
import NavBar from "@/components/NavBar";
import Providers from "@/components/ui/Providers";

const inter = Inter({ subsets: ["latin"] });

const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
});

const bungee = Bungee_Inline({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Know It All",
  description: "Quiz game powered by AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(bungee.className, "antialiased min-h-screen pt-16")}>
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
