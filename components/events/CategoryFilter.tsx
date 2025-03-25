'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface CategoryFilterProps {
  selectedCategory?: string
}

// Define event categories - you can extend this list as needed
const EVENT_CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'conference', label: 'Conference' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'networking', label: 'Networking' },
  { value: 'music', label: 'Music' },
  { value: 'sports', label: 'Sports' },
  { value: 'festival', label: 'Festival' },
  { value: 'charity', label: 'Charity' },
  { value: 'other', label: 'Other' },
]

export default function CategoryFilter({
  selectedCategory = '',
}: CategoryFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value

    // Create a new URLSearchParams instance for modification
    const params = new URLSearchParams(searchParams.toString())

    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }

    // Reset to page 1 when filter changes
    params.set('page', '1')

    // Navigate to the new URL
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className='relative w-full max-w-xs'>
      <select
        id='category-filter'
        className='block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500'
        value={selectedCategory || ''}
        onChange={handleCategoryChange}
      >
        {EVENT_CATEGORIES.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>
    </div>
  )
}
