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
import { Loader2 } from "lucide-react";

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
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCountries() {
      try {
        setLoading(true);
        const res = await fetch("/countries.json");
        const data: Country[] = await res.json();

        // Flatten ["State, Country"] or ["Country"]
        const mapped: string[] = data.flatMap((c: Country) =>
          c.states && c.states.length > 0
            ? c.states.map((s: State) => `${s.name}, ${c.name}`)
            : [c.name]
        );

        setOptions(mapped);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCountries();
  }, []);

  // 🔎 Smart, trimmed, case-insensitive filtering
  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="justify-between">
          {value || "Select location..."}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder="Search location..."
            onValueChange={(v) => setSearch(v)}
          />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Loading locations...
                </span>
              </div>
            ) : filtered.length === 0 ? (
              <CommandEmpty>No location found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filtered.map((opt, idx) => (
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
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
