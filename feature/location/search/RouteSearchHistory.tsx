import { Icon24 } from "@/components/icons/icon24";
import { Button } from "@/components/ui/button";

export const RouteSearchHistoryItem = ({
  order,
  departure,
  destination,
  onSelect,
  onDelete,
}: {
  order: number;
  departure: string;
  destination: string;
  onSelect?: () => void;
  onDelete?: () => void;
}) => {
  const orderstring = order < 10 ? "0" + String(order) : String(order);
  return (
    <div className="flex border-b border-primary-foreground w-full justify-between p-2">
      <div className="flex flex-row gap-2 items-center">
        <p>{orderstring}</p>
        <button
          type="button"
          onClick={onSelect}
          className="flex flex-row gap-2 items-center"
        >
          <p>{departure}</p>
          <Icon24 name="arrow" />
          <p>{destination}</p>
        </button>
      </div>
      <Button variant={"ghost"} onClick={onDelete}>
        <Icon24 name="closeblack" />
      </Button>
    </div>
  );
};
