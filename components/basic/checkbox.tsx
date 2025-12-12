'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface CheckboxOption {
   value: string;
   label: string;
   disabled?: boolean;
}

interface CheckboxProps {
   options: CheckboxOption[];
   defaultValues?: string[];
   values?: string[];
   onValueChange?: (value: string[]) => void;
   name?: string;
   className?: string;
   itemGap?: string;
   fontSize?: string;
}

export function CheckboxComponent({
   options,
   defaultValues = [],
   values,
   onValueChange,
   name = 'checkbox',
   className = 'flex gap-2',
   itemGap = 'gap-1',
   fontSize = '14px',
}: CheckboxProps) {
   const [internalValues, setInternalValues] = useState<string[]>(defaultValues);
   const currentValues = values ?? internalValues;

   const handleCheckbox = (optionValue: string, checked: boolean) => {
      const newValues = checked ? [...currentValues, optionValue] : currentValues.filter(v => v !== optionValue);
      setInternalValues(newValues);
      onValueChange?.(newValues);
   };
   return (
      <div className={className}>
         {options.map(option => (
            <div key={option.value} className={`flex items-center ${itemGap} gap-2`}>
               <Checkbox
                  id={`${name}-${option.value}`}
                  className="w-5 h-5"
                  checked={currentValues.includes(option.value)}
                  onCheckedChange={checked => handleCheckbox(option.value, checked as boolean)}
                  disabled={option.disabled}
               />
               <Label
                  htmlFor={`${name}-${option.value}`}
                  className={currentValues.includes(option.value) ? 'font-semibold' : 'font-normal'}
                  style={{ color: '#04152F', fontSize }}
               >
                  {option.label}
               </Label>
            </div>
         ))}
      </div>
   );
}
