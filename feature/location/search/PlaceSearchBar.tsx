"use client";

import { Input } from "@/components/ui/input";
import { fetchNaverPlaceSuggestions } from "@/lib/map/search";
import { PlaceResult } from "@/types/map/place";
import { useCallback, useEffect, useRef, useState } from "react";
import { PartyCreate } from "@/feature/party/partyCreatePopup";

export const PlaceSearchBar = ({
  create,
  setCreate,
}: {
  create: PartyCreate;
  setCreate: (info: PartyCreate) => void;
}) => {
  const [inputValue, setInputValue] = useState(create.location ?? "");
  const [suggestions, setSuggestions] = useState<PlaceResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPlaceSelected, setIsPlaceSelected] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isUserEditing, setIsUserEditing] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const debouncedFetchSuggestions = useCallback(async (query: string) => {
    setIsSearching(true);
    try {
      const data = await fetchNaverPlaceSuggestions(query);
      const nextSuggestions = data.addresses || [];
      setSuggestions(nextSuggestions);
      setShowSuggestions(nextSuggestions.length > 0);
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
      debouncedFetchSuggestions(inputValue.trim());
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, debouncedFetchSuggestions, isPlaceSelected, showSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    setInputValue(nextValue);
    setCreate({ ...create, location: nextValue });
    setIsUserEditing(true);
    if (isPlaceSelected) {
      setIsPlaceSelected(false);
    }
    if (nextValue.trim()) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (place: PlaceResult) => {
    setInputValue(place.name);
    setCreate({ ...create, location: place.name });
    setSuggestions([]);
    setShowSuggestions(false);
    setIsPlaceSelected(true);
    setIsUserEditing(false);
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
    [showSuggestions],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  useEffect(() => {
    if (isUserEditing) return;

    if (inputValue !== (create.location ?? "")) {
      setInputValue(create.location ?? "");
    }
  }, [create.location, inputValue, isUserEditing]);

  return (
    <div className="relative flex flex-col gap-2" ref={searchContainerRef}>
      <label className="text-sm font-medium text-gray-700">
        위치
        <span className="text-red-500">*</span>
      </label>
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={() => setIsUserEditing(false)}
        onFocus={() => {
          if (inputValue.trim() && suggestions.length > 0 && !isPlaceSelected) {
            setShowSuggestions(true);
          }
        }}
        placeholder="장소를 입력하세요."
      />

      {inputValue && showSuggestions && !isSearching && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-14 max-h-60 overflow-y-auto">
          {suggestions.map((place, index) => (
            <li
              key={`${place.name}-${index}`}
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
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-14 px-4 py-2 text-sm text-gray-500">
          검색 중...
        </div>
      )}

      {inputValue &&
        showSuggestions &&
        !isSearching &&
        suggestions.length === 0 &&
        !isPlaceSelected && (
          <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-14 px-4 py-2 text-sm text-gray-500">
            검색 결과가 없습니다.
          </div>
        )}
    </div>
  );
};
