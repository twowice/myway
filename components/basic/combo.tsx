'use client';

import * as React from 'react';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Icon24 } from '../icons/icon24';

interface ComboboxOption {
   value: string;
   label: string;
}

interface ComboboxProps {
   options: ComboboxOption[];
   value?: string;
   onValueChange?: (value: string) => void;
   placeholder?: string;
   searchPlaceholder?: string;
   emptyMessage?: string;
   className?: string;
   width?: string;
   fontSize?: string;
}

export function ComboboxComponent({
   options,
   value,
   onValueChange,
   searchPlaceholder = 'Search for options',
   emptyMessage = 'No option found.',
   className = 'flex gap-2',
   width = 'w-[200px]',
   fontSize = '14px',
}: ComboboxProps) {
   const [open, setOpen] = React.useState(false);
   const [internalValue, setInternalValue] = React.useState(options[0]?.value || '');
   const currentValue = value ?? internalValue;

   const handleSelect = (selectedValue: string) => {
      if (value === undefined) {
         setInternalValue(selectedValue);
      }
      onValueChange?.(selectedValue);
      setOpen(false);
   };
   const selectedOption = options.find(option => option.value === currentValue);
   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               role="combobox"
               aria-expanded={open}
               className={cn(
                  width,
                  'justify-between border-[#04152F]/20',
                  className,
                  'focus:outline-none focus:ring-2 focus:ring-[#007DEF] focus:border-transparent transition-all"',
               )}
            >
               {selectedOption?.label || ''}
               <Icon24 name="down" className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
         </PopoverTrigger>
         <PopoverContent className={cn(width, 'p-0 border-[#04152F]/20')}>
            <Command>
               <CommandInput placeholder={searchPlaceholder} className="h-9" />
               <CommandList>
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                  <CommandGroup>
                     {options.map(option => (
                        <CommandItem
                           key={option.value}
                           value={option.value}
                           onSelect={handleSelect}
                           className={cn(
                              currentValue === option.value &&
                                 'font-semibold bg-[#007DEF]/80 text-[#F1F5FA] focus:outline-none focus:ring-2 focus:ring-[#007DEF] focus:border-transparent transition-all"',
                           )}
                        >
                           {option.label}
                           <Check
                              className={cn(
                                 'ml-auto h-4 w-4 text-[#F1F5FA]',
                                 currentValue === option.value ? 'opacity-100' : 'opacity-0',
                              )}
                              style={{ fontSize }}
                           />
                        </CommandItem>
                     ))}
                  </CommandGroup>
               </CommandList>
            </Command>
         </PopoverContent>
      </Popover>
   );
}
