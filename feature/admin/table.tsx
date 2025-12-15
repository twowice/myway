'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useRef, useState } from 'react';

interface TableOption<T = string> {
   key: string & keyof T;
   label: string;
   width?: string;
   render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface TableProps<T = string> {
   columns: TableOption<T>[];
   data: T[];
   className?: string;
   emptyMessage?: string;
   itemsPerPage?: number;
}

export function TableComponent<T extends Record<string, any>>({
   columns = [],
   data = [],
   className,
   emptyMessage = '데이터가 없습니다.',
   itemsPerPage = 12,
}: TableProps<T>) {
   const containerRef = useRef<HTMLDivElement>(null);
   const [rowHeight, setRowHeight] = useState('60px');

   useEffect(() => {
      if (containerRef.current) {
         const updateHeight = () => {
            const containerHeight = containerRef.current?.clientHeight || 0;
            const headerHeight = 48; // h-12 = 48px
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

   // 항상 itemsPerPage만큼 행을 표시 (빈 행으로 채우기)
   const emptyRowsCount = Math.max(0, itemsPerPage - data.length);
   const emptyRows = Array.from({ length: emptyRowsCount });

   return (
      <div ref={containerRef} className="w-full h-full border rounded-lg overflow-hidden bg-background">
         <Table className={`table-fixed w-full ${className || ''}`}>
            <colgroup>
               {columns.map((column, index) => (
                  <col key={index} className={column.width} />
               ))}
            </colgroup>

            {/* 헤더 */}
            <TableHeader className="bg-primary/10">
               <TableRow className="h-12">
                  {columns.map(column => (
                     <TableHead key={String(column.key)} className="text-center text-sm font-semibold">
                        {column.label}
                     </TableHead>
                  ))}
               </TableRow>
            </TableHeader>

            {/* 바디 */}
            <TableBody>
               {data.length === 0 ? (
                  // 데이터가 하나도 없을 때
                  <>
                     {Array.from({ length: itemsPerPage }).map((_, index) => (
                        <TableRow key={`empty-all-${index}`} style={{ height: rowHeight }}>
                           <TableCell colSpan={columns.length} className="text-center align-middle">
                              {index === Math.floor(itemsPerPage / 2) && (
                                 <p className="text-muted-foreground">{emptyMessage}</p>
                              )}
                           </TableCell>
                        </TableRow>
                     ))}
                  </>
               ) : (
                  <>
                     {/* 실제 데이터 */}
                     {data.map((row, rowIndex) => (
                        <TableRow
                           key={rowIndex}
                           style={{ height: rowHeight }}
                           className="hover:bg-muted/30 transition-colors"
                        >
                           {columns.map(column => (
                              <TableCell
                                 key={String(column.key)}
                                 className={`
                                    text-center 
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

                     {/* 빈 행으로 채우기 */}
                     {emptyRows.map((_, index) => (
                        <TableRow key={`empty-${index}`} style={{ height: rowHeight }} className="pointer-events-none">
                           {columns.map(column => (
                              <TableCell key={String(column.key)} className="text-center align-middle">
                                 {/* 빈 셀 */}
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
