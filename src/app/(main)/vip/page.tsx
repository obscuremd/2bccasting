"use client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/ApiService";
import axios from "axios";
import { Handshake, ArrowUp } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

// 👇 Dynamic import fixes "window is not defined"
const PaystackButton = dynamic(
  () => import("react-paystack").then((mod) => mod.PaystackButton),
  { ssr: false }
);

export default function Page() {
  const router = useRouter();
  const [plan, setPlan] = useState<number>();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function getUser() {
      const response = await getCurrentUser();
      if (response.status === "error") {
        toast.error("Unauthorized");
        router.push("/");
      } else if (response.status === "pending") {
        toast.error("You're not done registering");
        router.push("/auth/register");
      } else {
        setUser(response.user);
      }
    }
    getUser();
  }, [router]);

  const plans = [
    {
      title: "Monthly",
      amount: 2400 * 100, // kobo
      price: "₦2,400/Month",
      yearly: "₦24,000/Year",
      discount: "20% off",
    },
    {
      title: "Yearly",
      amount: 240000 * 100,
      price: "₦20,000/Month",
      yearly: "₦240,000/Year",
      discount: "20% off",
    },
  ];

  const userEmail = user?.email ?? "user@example.com";

  return (
    <div className="flex flex-col gap-6 justify-center items-center">
      <p className="text-h3 font-semibold">Become a VIP 🌟</p>
      <p className="text-h5 font-medium text-muted-foreground">
        No Commitment, Cancel anytime
      </p>
      <hr className="w-full bg-muted-foreground" />

      {/* Features */}
      <div className="flex flex-col gap-10">
        {[
          "Topping the rank on the website category chat.",
          "Your Business number and Email will be seen by prospects",
          "Get Premium insight from potential recruiters",
          "Prospective Recruiter will contact you Directly",
          "No Agency Slashing your money or pay check",
          "You get to keep 100% of your income",
        ].map((text, i) => (
          <p key={i} className="text-h5 font-medium flex gap-4 items-center">
            <ArrowUp />
            {text}
          </p>
        ))}
      </div>

      {/* Pricing */}
      <div className="flex gap-6">
        {plans.map((p, i) => (
          <button key={i} onClick={() => setPlan(i)}>
            <PricingCard
              active={plan === i}
              title={p.title}
              price={p.price}
              yearly={p.yearly}
              discount={p.discount}
            />
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="flex gap-5 items-center">
        <p className="text-h5 font-medium">Restore Purchases</p>
        <hr className="h-[20px] bg-muted-foreground w-0.5" />
        <p className="text-h5 font-medium">Terms and Conditions</p>
      </div>
      <p className="text-h5 font-medium">Privacy Policy</p>

      {/* Paystack Button */}
      {plan !== undefined && (
        <PaystackButton
          publicKey={process.env.NEXT_PUBLIC_PAYSTACK_KEY ?? ""}
          amount={plans[plan].amount}
          email={userEmail}
          text="Continue"
          onSuccess={(reference) => {
            console.log("Payment complete! Reference:", reference);
            axios.put("/api/user", {
              id: user?._id,
              vip: true,
            });
            toast.success("Payment Successful");
          }}
          onClose={() => console.log("Payment closed")}
        />
      )}
    </div>
  );
}

function PricingCard({
  active,
  title,
  price,
  yearly,
  discount,
}: {
  active: boolean;
  title: string;
  price: string;
  yearly: string;
  discount?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0px 8px 24px rgba(0,0,0,0.1)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative"
    >
      <Card
        className={`${
          active ? "bg-foreground text-background" : "bg-background"
        } hover:bg-foreground hover:text-background border border-input flex flex-col rounded-2xl p-6 gap-6 items-center text-center`}
      >
        <p className="text-title1 font-medium flex gap-2 items-center">
          <Handshake />
          {title}
        </p>
        <p className="text-h5 font-bold">{price}</p>
        <p className="text-title1 font-medium">{yearly}</p>
      </Card>

      {discount && (
        <Badge className="absolute -top-2 right-2">{discount}</Badge>
      )}
    </motion.div>
  );
}
