'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
   return (
      <CheckboxPrimitive.Root
         data-slot="checkbox"
         className={cn(
            'size-5 shrink-0 rounded-[4px] border-[3px] border-[#04152F]/20',
            'data-[state=checked]:border-[#007DE4] data-[state=checked]:bg-transparent',
            'transition-colors outline-none',
            'focus-visible:ring-2 focus-visible:ring-[#007DE4] focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
         )}
         {...props}
      >
         <CheckboxPrimitive.Indicator
            data-slot="checkbox-indicator"
            className="grid place-content-center text-[#007DE4]"
         >
            <CheckIcon className="size-3.5 stroke-4" />
         </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
   );
}

export { Checkbox };
