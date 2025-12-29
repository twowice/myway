'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useRef, useState } from 'react';

interface TableOption<T = string> {
   key: string & keyof T;
   label: string;
   width?: string;
   align?: 'left' | 'center' | 'right';
   render?: (value: any, row: T) => React.ReactNode;
}

interface TableProps<T = string> {
   columns: TableOption<T>[];
   data: T[];
   className?: string;
   emptyMessage?: string;
   itemsPerPage?: number;
   onRowClick?: (row: T) => void;
}

export function TableComponent<T extends Record<string, any>>({
   columns = [],
   data = [],
   className,
   emptyMessage = '데이터가 없습니다.',
   itemsPerPage = 10,
   onRowClick,
}: TableProps<T>) {
   const containerRef = useRef<HTMLDivElement>(null);
   const [rowHeight, setRowHeight] = useState('60px');

   useEffect(() => {
      if (containerRef.current) {
         const updateHeight = () => {
            const containerHeight = containerRef.current?.clientHeight || 0;
            const headerHeight = 40;
            const availableHeight = containerHeight - headerHeight;
            const calculatedHeight = availableHeight / itemsPerPage;
            setRowHeight(`${calculatedHeight}px`);
         };

         updateHeight();
         window.addEventListener('resize', updateHeight);
         return () => window.removeEventListener('resize', updateHeight);
      }
   }, [itemsPerPage]);

   // 빈 컬럼 체크
   if (!columns || columns.length === 0) {
      return (
         <div className="flex h-full justify-center items-center rounded-lg border bg-muted/5">
            <p className="text-muted-foreground">{emptyMessage}</p>
         </div>
      );
   }

   return (
      <div ref={containerRef} className="w-full h-full overflow-auto border rounded-md bg-background">
         <Table className={`w-full min-w-max ${className || ''}`}>
            <colgroup>
               {columns.map((column, index) => (
                  <col key={index} className={column.width} />
               ))}
            </colgroup>

            {/* 헤더 */}
            <TableHeader className="sticky top-0 z-10">
               <TableRow className="h-10">
                  {columns.map(column => (
                     <TableHead
                        key={String(column.key)}
                        className="align-middle text-center text-sm font-semibold whitespace-nowrap bg-primary/10"
                     >
                        {column.label}
                     </TableHead>
                  ))}
               </TableRow>
            </TableHeader>

            {/* 바디 */}
            <TableBody>
               {data.length === 0 ? (
                  // 데이터가 하나도 없을 때
                  <TableRow style={{ height: `calc(${rowHeight} * ${itemsPerPage})` }}>
                     <TableCell colSpan={columns.length} className="text-center align-middle">
                        <p className="text-muted-foreground text-lg">{emptyMessage}</p>
                     </TableCell>
                  </TableRow>
               ) : (
                  <>
                     {/* 실제 데이터 */}
                     {data.map((row, rowIndex) => (
                        <TableRow
                           key={rowIndex}
                           style={{ height: rowHeight }}
                           onClick={() => onRowClick?.(row)}
                           className={`hover:bg-muted/30 transition-colors
                           ${onRowClick ? 'cursor-pointer' : ''}`}
                        >
                           {columns.map(column => (
                              <TableCell
                                 key={String(column.key)}
                                 className={`
                                     ${column.align === 'left' ? 'text-left' : column.align === 'right' ? 'text-right' : 'text-center'}
                                    align-middle 
                                    text-sm
                                    px-4
                                    ${column.key === columns[0].key ? 'font-medium' : ''}
                                 `}
                              >
                                 {column.render ? column.render(row[column.key], row) : String(row[column.key] ?? '-')}
                              </TableCell>
                           ))}
                        </TableRow>
                     ))}
                  </>
               )}
            </TableBody>
         </Table>
      </div>
   );
}
