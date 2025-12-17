"use client";

import { Icon24 } from "@/components/icons/icon24";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchNaverPlaceSuggestions } from "@/lib/map/search";
import { SelectedPlace } from "@/types/map/place";
import { useState, useCallback, useEffect, useRef } from "react";

type OnPlaceSelectCallback = (placeInfo: SelectedPlace) => void;

export const RouteSearchBar = ({
  order,
  total,
  onPlaceSelect,
}: {
  order: number;
  total: number;
  onPlaceSelect?: OnPlaceSelectCallback;
}) => {
  const getPlaceholder = () => {
    if (order === 1) return "출발지";
    else if (order === total) return "목적지";
    else return `경유지 ${order - 1}`;
  };

  const [placeholder] = useState(getPlaceholder());
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<SelectedPlace[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPlaceSelected, setIsPlaceSelected] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const debouncedFetchSuggestions = useCallback(async (query: string) => {
    try {
      const data = await fetchNaverPlaceSuggestions(query);
      setSuggestions(data.addresses || []);
      if (data.addresses && data.addresses.length > 0) {
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("장소 검색 에러 (Next.js API Route 호출):", error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (isPlaceSelected || !showSuggestions) {
      return;
    }

    if (!inputValue.trim()) {
      setSuggestions([]);
      return;
    }

    const handler = setTimeout(() => {
      debouncedFetchSuggestions(inputValue);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, debouncedFetchSuggestions, isPlaceSelected, showSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (isPlaceSelected) {
      setIsPlaceSelected(false);
    }
    if (e.target.value.trim()) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (place: any) => {
    setInputValue(place.name);
    setSuggestions([]);
    setShowSuggestions(false);
    setIsPlaceSelected(true);
    if (onPlaceSelect) {
      onPlaceSelect({
        order,
        name: place.name,
        address: place.address,
        lat: place.lat,
        lng: place.lng,
      });
    }
  };

  const handleOutsideClick = useCallback(
    (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        if (showSuggestions) {
          setSuggestions([]);
          setShowSuggestions(false);
        }
        setIsSearching(false);
        setIsPlaceSelected(false);
      }
    },
    [showSuggestions]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  return (
    <div
      className="relative flex flex-col gap-2.5 h-10 bg-secondary"
      ref={searchContainerRef}
    >
      <div className="flex flex-row justify-between align-middle gap-2.5 h-10 w-full">
        <Input
          className="border-0 bg-none rounded-none shadow-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none input-no-focus-ring w-full"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (
              inputValue.trim() &&
              suggestions.length > 0 &&
              !isPlaceSelected
            ) {
              setShowSuggestions(true);
            }
          }}
        />
        <div className="flex flex-row">
          <Button
            variant={"ghost"}
            className="cursor-pointer"
            onClick={() => {
              setInputValue("");
              setSuggestions([]);
              setShowSuggestions(false);
              setIsPlaceSelected(false);
            }}
          >
            <Icon24 name="closeblack" />
          </Button>
          <Button variant={"ghost"} className="cursor-pointer">
            <Icon24 name="hambugi" />
          </Button>
        </div>
      </div>

      {inputValue &&
        showSuggestions &&
        !isSearching &&
        suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-10 max-h-60 overflow-y-auto">
            {suggestions.map((place: any, index: number) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSuggestionClick(place)}
              >
                <div className="font-semibold">{place.name}</div>
                <div className="text-gray-500 text-xs">{place.address}</div>
              </li>
            ))}
          </ul>
        )}

      {inputValue && showSuggestions && isSearching && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-10 px-4 py-2 text-sm text-gray-500">
          검색 중...
        </div>
      )}

      {inputValue &&
        showSuggestions &&
        !isSearching &&
        suggestions.length === 0 &&
        !isPlaceSelected && (
          <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-10 px-4 py-2 text-sm text-gray-500">
            검색 결과가 없습니다.
          </div>
        )}
    </div>
  );
};
