"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Check, Clipboard } from "lucide-react";

interface CopyButtonProps {
  value: string;
}

export function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex items-center justify-between w-full max-w-md rounded-md border bg-muted py-1 px-2 shadow-sm">
      {/* Clipboard preview (the text) */}
      <span className="truncate text-sm text-foreground">{value}</span>

      {/* Copy button with tooltip */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-muted-foreground rounded-sm text-sm"
          >
            {copied ? <Check size={15} /> : <Clipboard size={15} />}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          {copied ? "Copied to clipboard" : "Click to copy"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
