import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TabItem {
   value: string;
   label: string;
   content: React.ReactNode;
}

interface TabProps {
   items: TabItem[];
   defaultValue?: string;
   className?: string;
}

export default function Tab({ items, className }: TabProps) {
   return (
      <Tabs defaultValue={items[0].value} className={className}>
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
