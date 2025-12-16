import React, { useState, useEffect } from 'react';
import { Icon24 } from '../icons/icon24';

interface SearchBarProps {
   placeholder?: string;
   onSearch?: (value: string) => void;
   onChange?: (value: string) => void;
   value?: string;
   className?: string;
   delay?: number; // ADD BY CKH 25.12.15
}

export const SearchBar = ({
   placeholder = '검색어를 입력하세요',
   onSearch,
   onChange,
   value: controlledValue,
   className = '',
   delay = 300 // ADD BY CKH 25.12.15
}: SearchBarProps) => {
   const [internalValue, setInternalValue] = useState('');
   const isControlled = controlledValue !== undefined;
   const value = isControlled ? controlledValue : internalValue;

   // ADD BY CKH 25.12.15
   useEffect(() => {
      if (!onSearch) return;

       const handler = setTimeout(() => {
         onSearch(value.trim());
       }, delay);
   
       return () => clearTimeout(handler)
     }, [value, delay, onSearch]);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (!isControlled) {
         setInternalValue(newValue);
      }
      onChange?.(newValue);
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSearch?.(value);
   };

   const handleClear = () => {
      const newValue = '';
      if (!isControlled) {
         setInternalValue(newValue);
      }
      onChange?.(newValue);
      // onSearch?.(newValue);
   };

   return (
      <form onSubmit={handleSubmit} className={`relative ${className}`}>
         <div className="relative flex items-center">
            <Icon24 name="search" className="absolute left-4 h-6 w-6" />

            <input
               type="text"
               value={value}
               onChange={handleChange}
               placeholder={placeholder}
               className="w-full py-2 pl-12 bg-primary-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007DE4] focus:border-transparent transition-all"
            />

            {value && (
               <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
               >
                  <Icon24 name="closeblack" className="h-6 w-6 cursor-pointer" />
               </button>
            )}
         </div>
      </form>
   );
};
