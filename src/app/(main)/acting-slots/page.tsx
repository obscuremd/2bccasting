"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [value, setValue] = useState<number[]>([50]); // initial slider value (percentage)

  // Calculate Roles (0 - 100 → 0 - 50 roles)
  const roles = Math.round((value[0] / 100) * 50);

  // Calculate Amount ($4.5M max at 100%)
  const amount = (value[0] / 100) * 4500000;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-2 text-center">Acting Slots</h1>
      <div className="w-24 border-b-2 border-gray-500 mb-6"></div>

      {/* Description */}
      <p className="text-center text-gray-300 max-w-2xl mb-10">
        We are one of Nigeria’s leading casting agencies, with experience
        providing production with the artists they need. From extras to leading
        characters. If you are looking for exposure and recognition, you have
        come to the right place.
      </p>

      {/* Dynamic Amount */}
      <p className="text-4xl font-semibold mb-10">
        ${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </p>

      {/* Slider for roles */}
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

      {/* Continue Button */}
      <Button
        size="lg"
        className="bg-white text-black hover:bg-gray-200 px-12 py-6 text-lg rounded-md font-semibold"
      >
        Continue
      </Button>
    </div>
  );
}
