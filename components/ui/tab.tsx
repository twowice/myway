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
      <Tabs
         defaultValue={items[0].value}
         className={`flex flex-col h-full ${className || ''}`}
         value={value}
         onValueChange={onValueChange}
      >
         <TabsList className="shrink-0">
            {items.map(item => (
               <TabsTrigger key={item.value} value={item.value}>
                  {item.label}
               </TabsTrigger>
            ))}
         </TabsList>
         {items.map(item => (
            <TabsContent key={item.value} value={item.value} className="flex-1 min-h-0 mt-4">
               {item.content}
            </TabsContent>
         ))}
      </Tabs>
   );
}
