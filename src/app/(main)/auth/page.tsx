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
import { useState } from "react";
import toast from "react-hot-toast";

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
        toast.loading(res.message);
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
    <div className="flex gap-2.5">
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
        <Input
          placeholder="Email"
          className="w-full"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          className="w-full"
          onChange={(e) => setPassword(e.target.value)}
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
        <div className="flex gap-5 items-center">
          <p className="text-title2 font-semibold">General Policy</p>
          <hr className="h-[20px] bg-muted-foreground w-0.5" />
          <p className="text-title2 font-semibold">Terms and Conditions</p>
        </div>
        <p className="text-title2 font-medium text-muted-foreground">
          By signing in you’re agreeing to our Terms and conditions and policies
        </p>
      </div>
    </div>
  );
}
