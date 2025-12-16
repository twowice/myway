"use client";

import { Icon24 } from "@/components/icons/icon24";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const RouteSearchBar = ({
  order,
  total,
}: {
  order: number;
  total: number;
}) => {
  let no = order;
  const getPlaceholder = () => {
    if (no === 1) return "출발지";
    else if (order === total) return "목적지";
    else return `경유지 ${order - 1}`;
  };

  const [placeholder, setPlaceholder] = useState(getPlaceholder());

  return (
    <div className="flex flex-row justify-between align-middle gap-2.5 h-10 bg-secondary">
      <Input
        className="border-0 bg-none rounded-none shadow-none focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder={placeholder}
      ></Input>
      <div className="flex flex-row">
        <Button variant={"ghost"} className="cursor-pointer">
          <Icon24 name="closeblack" />
        </Button>
        <Button variant={"ghost"} className="cursor-pointer">
          <Icon24 name="hambugi" />
        </Button>
      </div>
    </div>
  );
};
