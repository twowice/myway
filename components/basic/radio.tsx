'use client';

import { Label } from '@radix-ui/react-label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';

interface RadioOption {
   value: string;
   label: string;
}

interface RadioProps {
   options: RadioOption[];
   defaultValue?: string;
   value?: string;
   onValueChange?: (value: string) => void;
   name?: string;
   className?: string;
   itemGap?: string;
   fontSize?: string;
}

export function RadioComponent({
   options,
   defaultValue,
   value,
   onValueChange,
   name = 'radio-group',
   className = 'flex gap-2',
   itemGap = 'gap-1',
   fontSize = '14px',
}: RadioProps) {
   const [internalValue, setInternalValue] = useState(defaultValue);
   const currentValue = value ?? internalValue;

   const handleRadio = (newValue: string) => {
      setInternalValue(newValue);
      onValueChange?.(newValue);
   };

   return (
      <RadioGroup defaultValue={defaultValue} value={value} onValueChange={handleRadio} className={className}>
         {options.map(option => {
            return (
               <div key={option.value} className={`flex items-center ${itemGap} gap-2`}>
                  <RadioGroupItem value={option.value} id={`${name}-${option.value}`} className="w-5 h-5" />
                  <Label
                     htmlFor={`${name}-${option.value}`}
                     className={currentValue === option.value ? 'font-semibold' : 'font-normal'}
                     style={{ color: '#04152F', fontSize }}
                  >
                     {option.label}
                  </Label>
               </div>
            );
         })}
      </RadioGroup>
   );
}
