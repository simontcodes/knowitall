import "./globals.css";
import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";

import { Roboto } from "next/font/google";
import { cn } from "@/lib/utils";
import NavBar from "@/components/NavBar";
import Providers from "@/components/ui/Providers";
import { Toaster } from "@/components/ui/toaster";

// const inter = Inter({ subsets: ["latin"] });

const robotoMono = Roboto_Mono({
	subsets: ["latin"],
	weight: ["400", "600", "700"],
});

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
			<body
				className={cn(robotoMono.className, "antialiased min-h-screen pt-16")}
			>
				<Providers>
					<NavBar />
					{children}
					<Toaster />
				</Providers>
			</body>
		</html>
	);
}
