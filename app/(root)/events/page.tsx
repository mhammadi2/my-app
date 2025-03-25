// app/(root)/events/page.tsx
import { fetchEvents } from '@/lib/data'
import EventsList from '@/components/events/EventsList'
import EventsFilter from '@/components/events/EventsFilter'

interface PageProps {
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default async function RecentEvents({ searchParams = {} }: PageProps) {
  // Create a new request URL for the current page with the search parameters
  // This avoids direct property access of searchParams
  const url = new URL('/api/events', 'http://localhost:3000')

  // Add search parameters to the URL - using URL class to handle this safely
  Object.keys(searchParams).forEach((key) => {
    const value = searchParams[key]
    if (typeof value === 'string') {
      url.searchParams.append(key, value)
    }
  })

  // Get the query string from the URL
  const queryString = url.searchParams.toString()

  // Fetch events using the query string
  const { events, pagination } = await fetchEvents(queryString)

  return (
    <section className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Events</h1>

      <EventsFilter />

      <div className='mt-6'>
        <EventsList events={events} />
      </div>

      {/* Simple pagination without accessing searchParams directly */}
      {pagination && pagination.totalPages > 1 && (
        <div className='mt-8 flex justify-center'>
          <div className='flex items-center gap-2'>
            {pagination.currentPage > 1 && (
              <a
                href={`/events?page=${pagination.currentPage - 1}`}
                className='px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md'
              >
                Previous
              </a>
            )}

            <span className='px-4 py-2'>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            {pagination.currentPage < pagination.totalPages && (
              <a
                href={`/events?page=${pagination.currentPage + 1}`}
                className='px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md'
              >
                Next
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
