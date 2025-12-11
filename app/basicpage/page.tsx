import { CheckboxComponent } from '@/components/basic/checkbox';
import { RadioComponent } from '@/components/basic/radio';

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
      </>
   );
}
