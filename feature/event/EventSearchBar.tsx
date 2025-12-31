'use client';

import { Input } from '@/components/ui/input';
import { PartyCreate } from '../party/partyCreatePopup';
import { useCallback, useEffect, useRef, useState } from 'react';

type EventSuggestion = {
   id: number;
   title: string;
   address?: string;
   start_date?: string;
   end_date?: string;
};

export const EventSearchBar = ({
   create,
   setCreate,
}: {
   create: PartyCreate;
   setCreate: (info: PartyCreate) => void;
}) => {
   const [inputValue, setInputValue] = useState(create.eventName ?? '');
   const [suggestions, setSuggestions] = useState<EventSuggestion[]>([]);
   const [isSearching, setIsSearching] = useState(false);
   const [showSuggestions, setShowSuggestions] = useState(false);
   const [isEventSelected, setIsEventSelected] = useState(false);
   const [isUserEditing, setIsUserEditing] = useState(false);
   const searchContainerRef = useRef<HTMLDivElement>(null);

   const fetchSuggestions = useCallback(async (query: string) => {
      setIsSearching(true);
      try {
         const res = await fetch(`/api/events?keyword=${encodeURIComponent(query)}&limit=8&offset=0`);
         if (!res.ok) {
            throw new Error('이벤트 검색 실패');
         }
         const json = await res.json();
         const data = Array.isArray(json?.data) ? json.data : [];
         setSuggestions(
            data.map((event: any) => ({
               id: event.id,
               title: event.title,
               address: event.address,
               start_date: event.start_date,
               end_date: event.end_date,
            })),
         );
         setShowSuggestions(data.length > 0);
      } catch (error) {
         console.error('이벤트 검색 에러:', error);
         setSuggestions([]);
         setShowSuggestions(false);
      } finally {
         setIsSearching(false);
      }
   }, []);

   useEffect(() => {
      if (isEventSelected || !showSuggestions) {
         return;
      }

      if (!inputValue.trim()) {
         setSuggestions([]);
         return;
      }

      if (inputValue.trim().length < 2) {
         setSuggestions([]);
         setShowSuggestions(false);
         return;
      }

      const handler = setTimeout(() => {
         fetchSuggestions(inputValue.trim());
      }, 300);

      return () => {
         clearTimeout(handler);
      };
   }, [inputValue, fetchSuggestions, isEventSelected, showSuggestions]);

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = e.target.value;
      setInputValue(nextValue);
      setCreate({ ...create, eventName: nextValue });
      setIsUserEditing(true);
      if (isEventSelected) {
         setIsEventSelected(false);
      }
      if (nextValue.trim()) {
         setShowSuggestions(true);
      } else {
         setShowSuggestions(false);
      }
   };

   const handleSuggestionClick = (event: EventSuggestion) => {
      setInputValue(event.title);
      setCreate({ ...create, eventName: event.title });
      setSuggestions([]);
      setShowSuggestions(false);
      setIsEventSelected(true);
      setIsUserEditing(false);
   };

   const handleOutsideClick = useCallback(
      (event: MouseEvent) => {
         if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
            if (showSuggestions) {
               setSuggestions([]);
               setShowSuggestions(false);
            }
            setIsSearching(false);
            setIsEventSelected(false);
         }
      },
      [showSuggestions],
   );

   useEffect(() => {
      document.addEventListener('mousedown', handleOutsideClick);
      return () => {
         document.removeEventListener('mousedown', handleOutsideClick);
      };
   }, [handleOutsideClick]);

   useEffect(() => {
      if (isUserEditing) return;

      if (inputValue !== (create.eventName ?? '')) {
         setInputValue(create.eventName ?? '');
      }
   }, [create.eventName, inputValue, isUserEditing]);

   return (
      <div className="relative flex flex-col gap-2" ref={searchContainerRef}>
         <label className="text-sm font-medium text-gray-700">
            이벤트명
            <span className="text-red-500">*</span>
         </label>
         <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={() => setIsUserEditing(false)}
            onFocus={() => {
               if (inputValue.trim() && suggestions.length > 0 && !isEventSelected) {
                  setShowSuggestions(true);
               }
            }}
            placeholder="이벤트 명을 입력하세요."
         />

         {inputValue && showSuggestions && !isSearching && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-14 max-h-60 overflow-y-auto">
               {suggestions.map(event => (
                  <li
                     key={event.id}
                     className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                     onMouseDown={e => e.preventDefault()}
                     onClick={() => handleSuggestionClick(event)}
                  >
                     <div className="font-semibold">{event.title}</div>
                     <div className="text-gray-500 text-xs">
                        {event.start_date && event.end_date
                           ? `${event.start_date} ~ ${event.end_date}`
                           : event.start_date || event.end_date || ''}
                     </div>
                     {event.address && <div className="text-gray-500 text-xs">{event.address}</div>}
                  </li>
               ))}
            </ul>
         )}

         {inputValue && showSuggestions && isSearching && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-14 px-4 py-2 text-sm text-gray-500">
               검색 중...
            </div>
         )}

         {inputValue && showSuggestions && !isSearching && suggestions.length === 0 && !isEventSelected && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-14 px-4 py-2 text-sm text-gray-500">
               검색 결과가 없습니다.
            </div>
         )}
      </div>
   );
};
