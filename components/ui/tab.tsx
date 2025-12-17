import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TabItem {
   value: string;
   label: string;
   content: React.ReactNode;
}

interface TabProps {
   items: TabItem[];
   value?: string;
   onValueChange?: (value: string) => void;
   defaultValue?: string;
   className?: string;
}

export default function Tab({ items, className, value, onValueChange }: TabProps) {
   return (
      <Tabs defaultValue={items[0].value} className={className} value={value} onValueChange={onValueChange}>
         <TabsList>
            {items.map(item => (
               <TabsTrigger key={item.value} value={item.value}>
                  {item.label}
               </TabsTrigger>
            ))}
         </TabsList>
         {items.map(item => (
            <TabsContent key={item.value} value={item.value}>
               {item.content}
            </TabsContent>
         ))}
      </Tabs>
   );
}
