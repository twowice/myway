"use client";

import { useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

/**
 * @typedef {object} EllipsisPaginationProps
 * @property {number} currentPage - 현재 활성화된 페이지 번호 (1부터 시작).
 * @property {number} totalPages - 전체 페이지의 총 개수.
 * @property {(changedPage: number) => void} handlePageChange - 페이지 번호 변경 시 호출될 콜백 함수. 변경된 페이지 번호를 인자로 받습니다.
 */

/**
 * `EllipsisPagination` 컴포넌트는 현재 페이지를 중심으로 일정 수의 페이지 링크를 표시하고,
 * 페이지 수가 많을 경우 생략점(`...`)을 사용하여 전체 페이지 목록을 간결하게 보여주는 페이지네이션 UI를 제공합니다.
 * shadcn/ui의 Pagination 컴포넌트들을 활용하여 구현되었습니다.
 *
 * @param {EllipsisPaginationProps} props - 컴포넌트 프로퍼티.
 * @returns {React.ReactElement} Ellipsis Pagination UI 컴포넌트.
 *
 * @example
 * ```jsx
 * // 예시 사용법
 * function MyPage() {
 *   const [page, setPage] = React.useState(1);
 *   const totalPages = 20; // 실제로는 서버에서 받아오거나 계산된 총 페이지 수
 *
 *   const handlePageChange = (newPage) => {
 *     // 페이지 이동 로직 (예: 라우터 변경, API 호출 등)
 *     setPage(newPage);
 *     console.log(`페이지가 ${newPage}로 변경되었습니다.`);
 *   };
 *
 *   return (
 *     <div className="flex justify-center p-4">
 *       <EllipsisPagination
 *         currentPage={page}
 *         totalPages={totalPages}
 *         handlePageChange={handlePageChange}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export const EllipsisPagination = ({
  currentPage,
  totalPages,
  handlePageChange,
}: {
  currentPage: number;
  totalPages: number;
  handlePageChange: (changedPage: number) => void;
}): React.ReactElement => {
  const pageNumbersToDisplay = useMemo(() => {
    if (totalPages === 0) return [];

    const numbers: (number | "ellipsis")[] = [];
    const siblingCount = 1;

    const startPage = Math.max(1, currentPage - siblingCount);
    const endPage = Math.min(totalPages, currentPage + siblingCount);

    numbers.push(1);

    if (startPage > 2) {
      numbers.push("ellipsis");
    } else if (startPage === 2) {
      numbers.push(2);
    }

    for (
      let i = Math.max(2, startPage);
      i <= Math.min(totalPages - 1, endPage);
      i++
    ) {
      if (!numbers.includes(i)) {
        numbers.push(i);
      }
    }

    if (endPage < totalPages - 1) {
      const lastNumAdded = numbers[numbers.length - 1];
      if (
        !(
          typeof lastNumAdded === "number" &&
          lastNumAdded === totalPages - 1 &&
          numbers.includes("ellipsis", numbers.length - 2)
        )
      ) {
        numbers.push("ellipsis");
      }
    } else if (endPage === totalPages - 1) {
      if (!numbers.includes(totalPages - 1)) {
        numbers.push(totalPages - 1);
      }
    }

    if (!numbers.includes(totalPages)) {
      numbers.push(totalPages);
    }

    const uniqueAndCleanedNumbers: (number | "ellipsis")[] = [];
    numbers.forEach((item) => {
      const lastItem =
        uniqueAndCleanedNumbers[uniqueAndCleanedNumbers.length - 1];

      if (item === "ellipsis" && lastItem === "ellipsis") {
        return;
      }

      if (
        item === 3 &&
        lastItem === "ellipsis" &&
        uniqueAndCleanedNumbers.length === 1 &&
        uniqueAndCleanedNumbers[0] === 1
      ) {
        uniqueAndCleanedNumbers.pop();
        uniqueAndCleanedNumbers.push(2);
        uniqueAndCleanedNumbers.push(3);
        return;
      }
      if (
        item === totalPages - 2 &&
        lastItem === "ellipsis" &&
        numbers.includes(totalPages)
      ) {
        if (
          uniqueAndCleanedNumbers.length > 1 &&
          uniqueAndCleanedNumbers[uniqueAndCleanedNumbers.length - 1] ===
            "ellipsis" &&
          uniqueAndCleanedNumbers[uniqueAndCleanedNumbers.length - 2] ===
            totalPages - 2
        ) {
          uniqueAndCleanedNumbers.pop();
          uniqueAndCleanedNumbers.push(totalPages - 1);
          uniqueAndCleanedNumbers.push(totalPages);
          return;
        }
      }

      if (
        typeof item === "number" &&
        typeof lastItem === "number" &&
        item === lastItem
      ) {
        return;
      }

      uniqueAndCleanedNumbers.push(item);
    });

    if (
      uniqueAndCleanedNumbers.filter((n) => typeof n === "number").length >=
        totalPages ||
      totalPages <= siblingCount * 2 + 1 + 2
    ) {
      return Array.from({ length: totalPages }, (_, i) => i + 1); // 모든 페이지를 보여줌
    }

    return uniqueAndCleanedNumbers;
  }, [currentPage, totalPages]);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? `?page=${currentPage - 1}` : "#"}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) {
                handlePageChange(currentPage - 1);
              }
            }}
            aria-disabled={currentPage <= 1}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {pageNumbersToDisplay.map((element, index) => (
          <PaginationItem
            key={element === "ellipsis" ? `ellipsis-${index}` : element}
          >
            {element === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={`?page=${element}`}
                isActive={element === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(element as number);
                }}
              >
                {element}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={currentPage < totalPages ? `?page=${currentPage + 1}` : "#"}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) {
                handlePageChange(currentPage + 1);
              }
            }}
            aria-disabled={currentPage >= totalPages}
            className={
              currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
