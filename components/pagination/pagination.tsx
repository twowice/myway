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

export const EllipsisPagination = ({
  currentPage,
  totalPages,
  handlePageChange,
}: {
  currentPage: number;
  totalPages: number;
  handlePageChange: (changedPage: number) => void;
}) => {
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
