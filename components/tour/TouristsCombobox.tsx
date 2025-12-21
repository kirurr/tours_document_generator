"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronsUpDown } from "lucide-react";
import { Tourist } from "@/tourist/schema";

type TouristComboboxProps = {
  tourists: Tourist[];
  customerId?: string;
  selectedTourists: string[];
  onToggleTourist: (touristId: string) => void;
};

export function TouristsCombobox({
  tourists,
  customerId,
  selectedTourists,
  onToggleTourist,
}: TouristComboboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          {selectedTourists.length > 0 ? (
            `Выбрано туристов: ${selectedTourists.length}`
          ) : (
            <span className="text-muted-foreground">Выберите туристов</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Поиск туриста..." />
          <CommandList>
            <CommandEmpty>Турист не найден</CommandEmpty>
            <CommandGroup>
              {tourists.map((tourist) => (
                <CommandItem
                  key={tourist.id}
                  value={tourist.name}
                  disabled={customerId === tourist.id.toString()}
                  onSelect={() => onToggleTourist(tourist.id.toString())}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <Checkbox
                      className="**:text-primary-foreground"
                      disabled={customerId === tourist.id.toString()}
                      checked={selectedTourists.includes(tourist.id.toString())}
                      onCheckedChange={() =>
                        onToggleTourist(tourist.id.toString())
                      }
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{tourist.name}</span>
                      <span className="text-xs text-muted-foreground">
                        Паспорт: {tourist.passport}
                      </span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
