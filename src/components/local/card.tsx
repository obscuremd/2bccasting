"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface Props {
  image?: string;
  primary_text?: string;
  secondary_text?: string;
  category?: string;
  profile?: boolean; // if true → fixed card size, no hover overlay
  bottom?: boolean; // if true → fixed card size, no hover overlay
}

export default function CustomCard({
  image,
  primary_text,
  secondary_text,
  category,
  profile = false,
  bottom = false,
}: Props) {
  return (
    <div
      className="relative mb-6 break-inside-avoid rounded-2xl overflow-hidden cursor-pointer"
      style={{
        width: "auto",
        height: "auto",
      }}
    >
      {/* Image */}
      <motion.img
        src={image}
        alt={primary_text}
        className={`object-cover rounded-2xl ${
          profile ? "w-full md:w-[400px]" : "w-full"
        }`}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* Only show animated overlay in non-profile & non-bottom modes */}
      {!profile && (
        <div
          className="absolute bottom-0 left-0 w-full p-4 
                 bg-[linear-gradient(180deg,rgba(255,255,255,0)_-40.42%,#7F7F81_198.33%)]
                 backdrop-blur-[8.5px] text-white"
        >
          <p className="text-title2 font-bold">{primary_text}</p>
          <p className="text-body font-medium">{secondary_text}</p>
          <p className="text-body font-medium whitespace-pre-line">
            {category}
          </p>
        </div>
      )}
    </div>
  );
}
