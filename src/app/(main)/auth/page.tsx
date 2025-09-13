"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  function Authenticate() {
    router.push("/auth/register");
  }

  return (
    <div className="flex gap-2.5">
      <img
        src="/splash.png"
        alt="Splash"
        className="h-[70vh] w-2/3 object-cover"
      />
      <div className="p-8 flex flex-col gap-5 items-center justify-center">
        <div className="flex flex-col gap-2">
          <p className="text-h3 font-semibold text-center">
            Unlock opportunities. Join the stage.
          </p>
          <p className="text-title2 font-medium text-center">
            ✨ Join BC Casting to connect with recruiters, discover
            opportunities, and showcase your talent—all in one place.
          </p>
        </div>
        <Input placeholder="Email" className="w-full" />
        <Input placeholder="Password" className="w-full" />
        <Button onClick={Authenticate} className="w-full">
          Continue
        </Button>
        <div className="flex gap-5 items-center">
          <p className="text-title2 font-semibold">General Policy</p>
          <hr className="h-[20px] bg-muted-foreground w-0.5" />
          <p className="text-title2 font-semibold">Terms and Conditions</p>
        </div>
        <p className="text-title2 font-medium text-muted-foreground">
          By SIgning in you’re agreeing to our Terms and conditions and policies
        </p>
      </div>
    </div>
  );
}
