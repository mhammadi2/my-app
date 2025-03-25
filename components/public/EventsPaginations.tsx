// components/events/EventsPagination.tsx
'use client'

import { useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export default function EventsPagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // Create a new URLSearchParams instance so we can modify it
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className='flex items-center gap-2'>
      {currentPage > 1 && (
        <Link
          href={createPageURL(currentPage - 1)}
          className='px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md'
        >
          Previous
        </Link>
      )}

      <span className='px-4 py-2'>
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages && (
        <Link
          href={createPageURL(currentPage + 1)}
          className='px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md'
        >
          Next
        </Link>
      )}
    </div>
  )
}
