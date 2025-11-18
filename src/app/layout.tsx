import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { Bai_Jamjuree, Montserrat } from "next/font/google";
import Particles from "@/components/local/Particles";
import { Toaster } from "react-hot-toast";
import { app } from "@/lib/firebaseConfig";
import { Footer } from "@/components/local/footer";
import { Whatsapp } from "iconoir-react";
app;
// Load Bai Jamjuree font
const baiJamjuree = Bai_Jamjuree({
  subsets: ["latin"],
  weight: ["200"],
});
const playpenSansDeva = Montserrat({
  subsets: ["latin"],
  weight: ["200"],
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
      <body className={`${baiJamjuree.className} antialiased relative`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
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
          <a
            target="_blank"
            rel="noopener noreferrer"
            aria-label={"WhatsApp"}
            href="https://wa.me/2347047777561"
            className={`fixed bottom-3 right-3 z-50 h-10 w-fit p-2 rounded-full flex gap-2 text-sm backdrop-blur-xl items-center justify-center bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-all duration-200 hover:scale-105`}
          >
            <Whatsapp className="h-5 w-5 text-[#25D366]" />
            Chat with us
          </a>
          <div className="z-10 md:p-16 md:pt-0 p-2 pt-4">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
