"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { getCurrentUser } from "@/lib/ApiService";

export default function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const [auth, setAuth] = useState<{
    user: User | null;
    status: "success" | "error" | "pending";
  }>({ user: null, status: "error" });

  useEffect(() => {
    async function fetchUser() {
      const u = await getCurrentUser();
      setAuth(u);
    }
    fetchUser();
  }, []);

  const renderAuthButtons = () => {
    if (auth.status === "pending") {
      return (
        <Button onClick={() => router.push("/auth/register")} variant="ghost">
          Complete Registration
        </Button>
      );
    }
    if (auth.status === "success" && auth.user) {
      return (
        <Link href={"/dashboard"}>
          <Button variant="ghost">
            <img
              src={
                auth.user.profile_picture ||
                "https://images.unsplash.com/vector-1739893036643-a343cc79901b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHVzZXIlMjBpY29ufGVufDB8fDB8fHww"
              }
              className="h-5 w-5 rounded-full"
            />
            {auth.user.fullname}
          </Button>
        </Link>
      );
    }
    return (
      <>
        <Link href="/auth">
          <Button variant="ghost">Login</Button>
        </Link>
        <Link href="/auth">
          <Button>Become a Face</Button>
        </Link>
      </>
    );
  };

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:py-8 ">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          BC Castings
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
          <Link href="/acting-slots/membership-slots">
            <Button variant="ghost">Membership Slots</Button>
          </Link>
          <Link href="/job-vacancies">
            <Button variant="ghost">Job Vacancies</Button>
          </Link>
        </nav>

        {/* Desktop Auth/Profile */}
        <div className="hidden md:flex gap-2.5">{renderAuthButtons()}</div>

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
          <Link
            href="/acting-slots/membership-slots"
            onClick={() => setIsOpen(false)}
          >
            <Button variant="ghost">Membership Slots</Button>
          </Link>
          <Link href="/job-vacancies" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">
              Job Vacancies
            </Button>
          </Link>

          <div className="flex gap-2 pt-2">{renderAuthButtons()}</div>
        </div>
      )}
    </header>
  );
}
