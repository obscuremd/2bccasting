"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import { getCurrentUser } from "@/lib/ApiService";

export default function Page() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function ChangePassword() {
    if (!password.trim() || !confirmPassword.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // Get token (user must be logged in to change password)
      const token = localStorage.getItem("auth_token");
      if (!token) {
        toast.error("You must be logged in to change your password");
        router.push("/login");
        return;
      }

      // Decode user ID from token
      const user = await getCurrentUser();

      if (user.user === null) {
        toast.error("Invalid session, please log in again");
        router.push("/login");
        return;
      }

      const response = await axios.put("/api/user", {
        id: user.user?._id,
        password,
      });

      if (response.status === 200 && response.data.token) {
        // ✅ Store new token (if backend returned one after password update)
        localStorage.setItem("auth_token", response.data.token);
        toast.success("Password changed successfully!");
        router.push("/dashboard"); // redirect user
      } else {
        toast.error("Failed to change password");
      }
    } catch (error) {
      console.error("Change Password Error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex md:flex-row flex-col md:gap-2.5">
      <img
        src="/splash.png"
        alt="Splash"
        className="hidden md:block h-[70vh] md:w-2/3 object-cover"
      />

      <div className="md:p-8 flex flex-col gap-5 items-center justify-center w-full md:w-1/3">
        <div className="flex flex-col gap-2">
          <p className="text-h3 font-semibold text-center">Change Password</p>
          <p className="text-title2 font-medium text-center text-muted-foreground">
            Enter your new password below to secure your account.
          </p>
        </div>

        <Input
          type="password"
          placeholder="New Password"
          className="w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          className="w-full"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button onClick={ChangePassword} className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2Icon className="animate-spin mr-2" />
              Updating Password...
            </>
          ) : (
            "Change Password"
          )}
        </Button>

        <PolicyLinks />

        <p className="text-title2 font-medium text-muted-foreground text-center">
          By changing your password, you agree to our Terms and Conditions and
          Privacy Policy.
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
