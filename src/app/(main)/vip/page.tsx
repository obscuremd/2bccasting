"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, Handshake } from "lucide-react";
import { motion } from "motion/react";

export default function Page() {
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

      {/* Pricing Cards */}
      <div className="flex gap-6">
        <PricingCard
          title="Monthly"
          price="$2,000/Month"
          discount="20% off"
          yearly="$24,000 Year"
        />
        <PricingCard
          title="Yearly"
          price="$20,000/Month"
          yearly="$240,000 Year"
          discount="20% off"
        />
      </div>

      <div className="flex gap-5 items-center">
        <p className="text-h5 font-medium flex gap-4 items-center">
          Restore Purchases
        </p>
        <hr className="h-[20px] bg-muted-foreground w-0.5" />
        <p className="text-h5 font-medium flex gap-4 items-center">
          Terms and Conditions
        </p>
      </div>
      <p className="text-h5 font-medium flex gap-4 items-center">
        Privacy Policy
      </p>

      <Button size={"lg"} className="w-full">
        Continue
      </Button>
    </div>
  );
}

function PricingCard({
  title,
  price,
  yearly,
  discount,
}: {
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
      <Card className="bg-background hover:bg-foreground hover:text-background border border-input flex flex-col rounded-2xl p-6 gap-6 items-center text-center">
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
