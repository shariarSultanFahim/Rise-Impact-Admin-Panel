"use client";

import { useMemo, useState } from "react";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import type { TrendPeriod } from "@/types/overview";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface PeriodComboboxProps {
  value: TrendPeriod;
  onChange: (value: TrendPeriod) => void;
}

const PERIOD_OPTIONS: Array<{ label: string; value: TrendPeriod }> = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 3 months", value: "3m" },
  { label: "Last 6 months", value: "6m" },
  { label: "Last 12 months", value: "12m" }
];

export default function PeriodCombobox({ value, onChange }: PeriodComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    return PERIOD_OPTIONS.find((option) => option.value === value)?.label ?? "Select period";
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[180px] justify-between bg-white"
        >
          {selectedLabel}
          <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0" align="end">
        <Command>
          <CommandInput placeholder="Search period..." />
          <CommandList>
            <CommandEmpty>No period found.</CommandEmpty>
            <CommandGroup>
              {PERIOD_OPTIONS.map((option) => (
                <CommandItem
                  key={option.value}
                  value={`${option.label} ${option.value}`}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn("size-4", value === option.value ? "opacity-100" : "opacity-0")}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
