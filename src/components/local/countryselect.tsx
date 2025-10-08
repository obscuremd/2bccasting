"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type State = { name: string };
type Country = { name: string; code2: string; states?: State[] };

export default function LocationSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    fetch("/countries.json")
      .then((res) => res.json())
      .then((data: Country[]) => {
        // flatten into ["State, Country"] or just ["Country"]
        const mapped: string[] = data.flatMap((c: Country) =>
          c.states && c.states.length > 0
            ? c.states.map((s: State) => `${s.name}, ${c.name}`)
            : [c.name]
        );
        setOptions(mapped);
      });
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="justify-between">
          {value || "Select location..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search location..." />
          <CommandList>
            <CommandEmpty>No location found.</CommandEmpty>
            <CommandGroup>
              {options.map((opt, idx) => (
                <CommandItem
                  key={idx}
                  value={opt}
                  onSelect={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                >
                  {opt}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
