"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          BC Casting
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4">
          <Button onClick={() => router.push("/")} variant="ghost">
            Home
          </Button>
          <Link href="/find-talent">
            <Button variant="ghost">Find Talent</Button>
          </Link>
          <Link href="/acting-slots">
            <Button variant="ghost">Acting Slots</Button>
          </Link>
          <Link href="/job-vacancies">
            <Button variant="ghost">Job Vacancies</Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost">About Us</Button>
          </Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex gap-2.5">
          <Link href="/auth">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Become a Face</Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded hover:bg-muted"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-background border-t border-border px-4 py-3 space-y-3">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">
              Home
            </Button>
          </Link>
          <Link href="/find-talent" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">
              Find Talent
            </Button>
          </Link>
          <Link href="/acting-slots" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">
              Acting Slots
            </Button>
          </Link>
          <Link href="/job-vacancies" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">
              Job Vacancies
            </Button>
          </Link>
          <Link href="/about" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">
              About Us
            </Button>
          </Link>

          <div className="flex gap-2 pt-2">
            <Link href="/auth" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full">
                Login
              </Button>
            </Link>
            <Link href="/dashboard" onClick={() => setIsOpen(false)}>
              <Button className="w-full">Become a Face</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
