import { RouteDetailItem } from "./RouteDetailItem";
import { RouteProgressBar } from "./RouteProgressBar";

export const RouteDetailBody = () => {
  const subPaths = [{}];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-2">
        <div className="flex flex-row gap-1">
          <p>19</p>
          <p>분</p>
        </div>
        <p>오후 03:54분 도착</p>
      </div>
      {/* <RouteProgressBar segments={}/> */}
      <div className="flex flex-col gap-4 pt-2">
        <RouteDetailItem />
        <RouteDetailItem />
      </div>
    </div>
  );
};
