"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Auth, OtpVerify } from "@/lib/ApiService";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // dialog control

  async function Authenticate() {
    setLoading(true);
    try {
      if (email === "" || password === "") {
        toast.error("provide email or password");
        return;
      }

      const res = await Auth({ email, password });
      if (res.status === "error") {
        toast.error(res.message);
        return;
      }
      // open dialog if successful
      setIsOpen(true);
    } finally {
      setLoading(false);
    }
  }
  async function VerifyOtp() {
    setLoading(true);
    try {
      const res = await OtpVerify({ email, code: Number(code) });
      if (res.status === "error") {
        toast.error(res.message);
        return;
      } else if (res.status === "pending") {
        toast.error(res.message);
        router.push("/auth/register");
      } else {
        toast("Otp Verified");
        router.push("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex md:flex-row flex-col md:gap-2.5">
      {/* Success Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="flex flex-col gap-10">
          <DialogHeader>
            <DialogTitle>Otp Verification</DialogTitle>
            <DialogDescription>
              a six digit Otp has been sent to your email, please input it below
            </DialogDescription>
          </DialogHeader>
          <InputOTP maxLength={6} onChange={(value) => setCode(value)}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <Button onClick={VerifyOtp} className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2Icon className="animate-spin" />
                Please wait
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Splash + Form */}

      <img
        src="/splash.png"
        alt="Splash"
        className="hidden md:block h-[70vh] md:w-2/3 object-cover"
      />
      <div className="md:p-8 flex flex-col gap-5 items-center justify-center">
        <div className="flex flex-col gap-2">
          <p className="text-h3 font-semibold text-center">
            Unlock opportunities. Join the stage.
          </p>
          <p className="text-title2 font-medium text-center">
            ✨ Join BC Casting to connect with recruiters, discover
            opportunities, and showcase your talent—all in one place.
          </p>
        </div>
        <Input
          placeholder="Email"
          className="w-full"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          placeholder="Password"
          type="password"
          className="w-full"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button onClick={Authenticate} className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2Icon className="animate-spin" />
              Please wait
            </>
          ) : (
            "Continue"
          )}
        </Button>
        <PolicyLinks />
        <p className="text-title2 font-medium text-muted-foreground text-center">
          By signing in you’re agreeing to our Terms and conditions and policies
        </p>
      </div>
    </div>
  );
}

function PolicyLinks() {
  const [open, setOpen] = useState(false);
  const [doc, setDoc] = useState<"privacy" | "terms" | null>(null);

  const openDoc = (type: "privacy" | "terms") => {
    setDoc(type);
    setOpen(true);
  };

  return (
    <div className="flex gap-5 items-center">
      <button
        onClick={() => openDoc("privacy")}
        className="text-title2 font-semibold hover:underline cursor-pointer"
      >
        General Policy
      </button>
      <hr className="h-[20px] bg-muted-foreground w-0.5" />
      <button
        onClick={() => openDoc("terms")}
        className="text-title2 font-semibold hover:underline cursor-pointer"
      >
        Terms and Conditions
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {doc === "privacy" ? "General Policy" : "Terms and Conditions"}
            </DialogTitle>
          </DialogHeader>
          <iframe
            src={
              doc === "privacy"
                ? "/PrivacyPolicy.pdf"
                : "/TermsAndConditions.pdf"
            }
            className="flex-1 w-full rounded-md"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
