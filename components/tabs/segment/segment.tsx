import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabContentsProps } from "../tabContentsProps";
import { cn } from "@/lib/utils";

export const Segment = ({
  contents,
  defaultValue,
}: {
  contents: TabContentsProps[];
  defaultValue?: string;
}) => {
  if (defaultValue === undefined) defaultValue = contents[0].value;

  return (
    <Tabs className="flex w-full h-fit p-0" defaultValue={defaultValue}>
      <TabsList className="flex w-full h-fit bg-primary opacity-80 py-[5px]">
        {contents.map((element, idx) => (
          <TabsTrigger
            key={idx}
            value={element.value}
            className={cn(
              "py-1",
              "w-full",
              "data-[state=active]:bg-secondary",
              "text-primary-foreground",
              "transition-none",
              "data-[state=active]:text-secondary-foreground",
              "text-base"
            )}
          >
            {element.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {contents.map((element, idx) => (
        <TabsContent key={idx} value={element.value}>
          {element.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};
