// components/events/EventsList.tsx
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

type Event = {
  id: string
  title: string
  description: string
  date: Date
  location: string
  category: string
  organizer?: {
    name: string
    email: string
  }
}

interface EventsListProps {
  events: Event[]
}

export default function EventsList({ events }: EventsListProps) {
  if (events.length === 0) {
    return (
      <div className='text-center py-10'>
        <p className='text-gray-500'>No events found</p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {events.map((event) => (
        <div
          key={event.id}
          className='bg-white rounded-lg shadow-md overflow-hidden border border-gray-200'
        >
          <div className='p-5'>
            <div className='mb-2 flex justify-between items-start'>
              <span className='inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full'>
                {event.category}
              </span>
              <span className='text-sm text-gray-500'>
                {formatDate(event.date)}
              </span>
            </div>

            <Link href={`/events/${event.id}`}>
              <h3 className='text-xl font-bold mb-2 hover:text-blue-600'>
                {event.title}
              </h3>
            </Link>

            <p className='text-gray-600 mb-4 line-clamp-2'>
              {event.description}
            </p>

            <div className='flex items-center justify-between'>
              <div className='flex items-center text-sm text-gray-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 mr-1'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
                {event.location}
              </div>

              {event.organizer && (
                <div className='text-xs text-gray-500'>
                  by {event.organizer.name || event.organizer.email}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
