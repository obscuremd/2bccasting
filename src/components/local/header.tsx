"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Header() {
  const router = useRouter();

  return (
    <div className="flex justify-between w-full items-center">
      <div className="flex gap-2.5 items-center">
        <p className="text-h3 font-semibold">BC Casting</p>
        <Button onClick={() => router.push("/")} size={"lg"} variant={"ghost"}>
          Home
        </Button>
        <Link href={"/find-talent"}>
          <Button size={"lg"} variant={"ghost"}>
            Find Talent
          </Button>
        </Link>
        <Button size={"lg"} variant={"ghost"}>
          Acting Slots
        </Button>
        <Button size={"lg"} variant={"ghost"}>
          Job Vacancies
        </Button>
        <Button size={"lg"} variant={"ghost"}>
          ABout Us
        </Button>
      </div>
      <div className="flex gap-2.5">
        <Link href={"/auth"}>
          <Button variant={"ghost"}>Login</Button>
        </Link>
        <Link href={"/dashboard"}>
          <Button>Become a Face</Button>
        </Link>
      </div>
    </div>
  );
}
