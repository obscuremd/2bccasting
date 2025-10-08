"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface Props {
  image?: string;
  primary_text?: string;
  secondary_text?: string;
  category?: string;
  profile?: boolean; // if true → fixed card size, no hover overlay
}

export default function CustomCard({
  image,
  primary_text,
  secondary_text,
  category,
  profile = false,
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative mb-6 break-inside-avoid rounded-2xl overflow-hidden cursor-pointer"
      onMouseEnter={() => !profile && setVisible(true)}
      onMouseLeave={() => !profile && setVisible(false)}
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
          profile ? "w-full md:w-[400px]" : "w-full md:w-[200px]"
        }`}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* Only show overlay in non-profile mode */}
      <AnimatePresence>
        {!profile && visible && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 w-full p-4 
                       bg-[linear-gradient(180deg,rgba(255,255,255,0)_-40.42%,#7F7F81_198.33%)]
                       backdrop-blur-[8.5px] text-white"
          >
            <p className="text-title2 font-bold">{primary_text}</p>
            <p className="text-body font-medium">Age: {secondary_text}</p>
            <p className="text-body font-medium">{category}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
