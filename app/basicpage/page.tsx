'use client';
import { CheckboxComponent } from '@/components/basic/checkbox';
import { ComboboxComponent } from '@/components/basic/combo';
import { RadioComponent } from '@/components/basic/radio';
import { Icon24 } from '@/components/icons/icon24';
import { Button } from '@/components/ui/button/button';

export default function Basic() {
   return (
      <>
         {/* radio */}
         <RadioComponent
            options={[
               { value: 'default', label: 'Default' },
               { value: 'comfortable', label: 'Comfortable' },
               { value: 'compact', label: 'Compact' },
            ]}
            defaultValue="comfortable"
         />
         {/* checkbox */}
         <CheckboxComponent
            options={[
               { value: 'default', label: 'Default' },
               { value: 'comfortable', label: 'Comfortable' },
               { value: 'compact', label: 'Compact' },
            ]}
         />
         {/* combo */}
         <ComboboxComponent
            options={[
               { value: 'default', label: 'Default' },
               { value: 'comfortable', label: 'Comfortable' },
               { value: 'compact', label: 'Compact' },
            ]}
         />
         <div className="flex flex-wrap items-center">
            <Button variant={'default'} size={'lg'}>
               버튼
            </Button>
            <Button variant={'destructive'} size={'lg'}>
               버튼
            </Button>
            <Button variant={'outline'} size={'lg'}>
               버튼
            </Button>
            <Button variant={'secondary'} size={'lg'}>
               버튼
            </Button>
            <Button variant={'ghost'} size={'lg'}>
               버튼
            </Button>
            <Button disabled size={'lg'}>
               버튼
            </Button>
            <Button variant={'icon-left'} size={'lg'}>
               <Icon24 name="back" className="text-primary-foreground" />
               버튼
            </Button>
            <Button variant={'icon-right'} size={'lg'}>
               <Icon24 name="go" className="text-primary-foreground" />
               버튼
            </Button>
            <Button variant={'add'} size={'lg'}>
               <Icon24 name="plus" className="text-primary-foreground" />
               버튼
            </Button>
         </div>
      </>
   );
}
