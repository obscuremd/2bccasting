"use client";
import { getCurrentUser } from "@/lib/ApiService";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    async function CheckRegistrationStatus() {
      const response = await getCurrentUser();
      if (response.status === "pending") {
        toast.error("your registration is still pending");
        router.push("/auth/register");
      } else if (response.status === "success") {
        router.push("/dashboard");
      } else {
        router.push("/auth");
      }
    }

    CheckRegistrationStatus();
  }, []);
  return (
    <main className="flex flex-col min-h-screen gap-[100px]">{children}</main>
  );
}
