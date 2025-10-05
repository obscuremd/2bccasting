"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import axios from "axios";
import toast from "react-hot-toast";

// dynamically load PaystackButton only on client
const PaystackButton = dynamic(
  () => import("react-paystack").then((mod) => mod.PaystackButton),
  { ssr: false }
);

export default function Page() {
  const [value, setValue] = useState<number[]>([50]);

  const roles = Math.round((value[0] / 100) * 60);
  const amount = (value[0] / 100) * 5000000;
  const userEmail = "testuser@example.com";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2 text-center">Acting Slots</h1>
      <div className="w-24 border-b-2 border-gray-500 mb-6"></div>

      <p className="text-center text-gray-300 max-w-2xl mb-10">
        We are one of Nigeria’s leading casting agencies, with experience
        providing production with the artists they need. From extras to leading
        characters. If you are looking for exposure and recognition, you have
        come to the right place.
      </p>

      <p className="text-4xl font-semibold mb-10">
        ₦{amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </p>

      <div className="w-full max-w-3xl mb-16">
        <div className="flex justify-between text-sm mb-2">
          <span>Roles</span>
          <span>{roles} Roles</span>
        </div>
        <Slider
          value={value}
          onValueChange={setValue}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* Define a type for the Paystack reference object */}
      <PaystackButton
        publicKey={process.env.NEXT_PUBLIC_LIVE_PAYSTACK_KEY ?? ""}
        amount={amount * 100}
        email={userEmail}
        text={"Continue"}
        onSuccess={(reference: {
          reference: string;
          status: string;
          transaction: string;
          message?: string;
          trxref?: string;
          // Add more specific fields as needed based on Paystack docs
        }) => {
          console.log("Payment complete! Reference:", reference);
          axios.put("/api/user", { id: "12345", vip: true });
          toast.success("Payment Successful");
        }}
        onClose={() => console.log("Payment closed")}
      />
    </div>
  );
}
