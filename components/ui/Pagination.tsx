// components/ui/Pagination.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  preserveParams?: boolean
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  preserveParams = false,
}: PaginationProps) {
  const searchParams = useSearchParams()

  // Function to create URL with current query params plus new page
  const createPageUrl = (page: number) => {
    if (!preserveParams) {
      return `${baseUrl}?page=${page}`
    }

    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    return `${baseUrl}?${params.toString()}`
  }

  if (totalPages <= 1) {
    return null
  }

  // Create array of page numbers to display
  const pageNumbers = []
  const maxVisiblePages = 5

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  return (
    <nav className='flex justify-center mt-6' aria-label='Pagination'>
      <ul className='inline-flex items-center -space-x-px'>
        {/* Previous page button */}
        <li>
          {currentPage > 1 ? (
            <Link
              href={createPageUrl(currentPage - 1)}
              className='block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700'
            >
              <span className='sr-only'>Previous</span>
              <svg
                className='w-5 h-5'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                  clipRule='evenodd'
                ></path>
              </svg>
            </Link>
          ) : (
            <span className='block px-3 py-2 ml-0 leading-tight text-gray-300 bg-white border border-gray-300 rounded-l-lg cursor-not-allowed'>
              <span className='sr-only'>Previous</span>
              <svg
                className='w-5 h-5'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                  clipRule='evenodd'
                ></path>
              </svg>
            </span>
          )}
        </li>

        {/* Page numbers */}
        {pageNumbers.map((page) => (
          <li key={page}>
            <Link
              href={createPageUrl(page)}
              className={`px-3 py-2 leading-tight border border-gray-300 ${
                currentPage === page
                  ? 'text-blue-600 bg-blue-50 border-blue-300 hover:bg-blue-100 hover:text-blue-700'
                  : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              {page}
            </Link>
          </li>
        ))}

        {/* Next page button */}
        <li>
          {currentPage < totalPages ? (
            <Link
              href={createPageUrl(currentPage + 1)}
              className='block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700'
            >
              <span className='sr-only'>Next</span>
              <svg
                className='w-5 h-5'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                  clipRule='evenodd'
                ></path>
              </svg>
            </Link>
          ) : (
            <span className='block px-3 py-2 leading-tight text-gray-300 bg-white border border-gray-300 rounded-r-lg cursor-not-allowed'>
              <span className='sr-only'>Next</span>
              <svg
                className='w-5 h-5'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                  clipRule='evenodd'
                ></path>
              </svg>
            </span>
          )}
        </li>
      </ul>
    </nav>
  )
}
