import { Icon24 } from "@/components/icons/icon24";
import { Button } from "@/components/ui/button";

export const RouteSearchItem = ({}: {}) => {
  return (
    <div className="flex flex-col gap-2 bg-secondary p-4 rounded-lg">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-4 items-center text-[12px]">
          <p className="font-semibold text-primary">최적</p>
          <div className="flex flex-row gap-1 items-center">
            <p className="font-bold text-[16px]">19</p>
            <p>분</p>
          </div>
          <p className="text-opacity-80">오후 03:54 도착</p>
        </div>
        <Button variant={"ghost"} className="cursor-pointer">
          <Icon24 name={"go"} className="h-6 w-6" />
        </Button>
      </div>
      <div></div>
    </div>
  );
};
