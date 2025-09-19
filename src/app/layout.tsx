import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { Bai_Jamjuree } from "next/font/google";
import Particles from "@/components/local/Particles";
import { Toaster } from "react-hot-toast";

// Load Bai Jamjuree font
const baiJamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["200"],
  variable: "--font-bai-jamjuree",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BC Casting",
  description:
    "Where talent meets opportunity – actors, models, creators, and scouts.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "BC Casting",
    description: "Discover and connect with top talents and recruiters.",
    url: "https://bccasting.com",
    siteName: "BC Casting",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BC Casting",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${baiJamjuree.variable} antialiased relative`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <div className="absolute inset-0 -z-10">
            <Particles
              particleColors={["#ffffff", "#ffffff"]}
              particleCount={200}
              particleSpread={10}
              speed={0.1}
              particleBaseSize={100}
              moveParticlesOnHover={true}
              alphaParticles={false}
              disableRotation={false}
            />
          </div>
          <div className="fixed top-4 right-4 z-20">
            <ThemeSwitch />
          </div>
          <div className="z-10 p-16">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
