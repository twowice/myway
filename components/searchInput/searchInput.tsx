//////////////////////////////
//                          //
//   SEARCHINPUT 공통 모듈   //
//                          //
//////////////////////////////
/*  
    *** 예시 사용법 ***
    const onSearch = (keyword: string) => {
      console.log("검색 중...", keyword);
    };
    <SearchInput onSearch={onSearch} delay={300}/>
*/

"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Icon24 } from "@/components/icons/icon24";

interface SearchInputProps {
  onSearch: (keyword: string) => void;
  delay?: number; // 디바운스 지연시간 (300ms)
}

export function SearchInput({ onSearch, delay = 300 }: SearchInputProps) {
  const [keyword, setKeyword] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(keyword.trim());
    }, delay);

    return () => clearTimeout(handler)
  }, [keyword, delay, onSearch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  return (
    <div className="relative w-[400px] h-[40px]">
      <input
        type="text"
        className="
          w-full h-full 
          rounded-[4px]
          pr-12
          pl-4
          py-2
          text-sm
          focus:outline-none focus:ring-2 focus:ring-primary
          bg-[#F1F5FA]"
        value={keyword}
        onChange={handleChange}
      />
      <button
        onClick={() => onSearch(keyword)}
        className="
          absolute right-3 top-1/2 -translate-y-1/2
          text-gray-500 hover:text-black
        "
      >
        <Icon24 name="search" />
      </button>
    </div>
  );
}
