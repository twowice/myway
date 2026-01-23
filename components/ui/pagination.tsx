import * as React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button/button';
import type { VariantProps } from 'class-variance-authority';

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
   return (
      <nav
         role="navigation"
         aria-label="pagination"
         data-slot="pagination"
         className={cn('mx-auto flex w-full justify-center', className)}
         {...props}
      />
   );
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
   return (
      <ul data-slot="pagination-content" className={cn('flex flex-row items-center gap-1', className)} {...props} />
   );
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
   return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
   isActive?: boolean;
   size?: VariantProps<typeof buttonVariants>['size'];
   variant?: VariantProps<typeof buttonVariants>['variant'];
} & Omit<React.ComponentProps<'a'>, 'size'>;

function PaginationLink({
   className,
   isActive,
   size = 'icon',
   variant,
   ...props
}: PaginationLinkProps) {
   return (
      <a
         aria-current={isActive ? 'page' : undefined}
         data-slot="pagination-link"
         data-active={isActive}
         className={cn(
            buttonVariants({
               variant: variant ?? (isActive ? 'default' : 'secondary'),
               size,
            }),
            className,
            'font-semibold',
            'transition-none',
         )}
         {...props}
      />
   );
}

function PaginationPrevious({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
   return (
      <PaginationLink
         aria-label="Go to previous page"
         size="icon"
         variant="ghost"
         className={cn('gap-1 px-2.5 sm:pl-2.5 cursor-pointer', className)}
         {...props}
      >
         <ChevronLeftIcon className="text-foreground" />
      </PaginationLink>
   );
}

function PaginationNext({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
   return (
      <PaginationLink
         aria-label="Go to next page"
         size="icon"
         variant="ghost"
         className={cn('gap-1 px-2.5 sm:pr-2.5 cursor-pointer', className)}
         {...props}
      >
         <ChevronRightIcon className="text-foreground" />
      </PaginationLink>
   );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
   return (
      <span
         aria-hidden
         data-slot="pagination-ellipsis"
         className={cn('flex size-9 items-center justify-center', className)}
         {...props}
      >
         <MoreHorizontalIcon className="size-4 text-foreground" />
         <span className="sr-only">More pages</span>
      </span>
   );
}

export {
   Pagination,
   PaginationContent,
   PaginationLink,
   PaginationItem,
   PaginationPrevious,
   PaginationNext,
   PaginationEllipsis,
};
