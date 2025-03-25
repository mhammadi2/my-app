// lib/data.ts
import prisma from '@/prisma/db'

export type PaginationResult = {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export type EventsResult = {
  events: any[]
  pagination: PaginationResult
}

// Accept a query string instead of searchParams object
export async function fetchEvents(queryString: string): Promise<EventsResult> {
  try {
    // Parse the query string to get filter values
    const urlSearchParams = new URLSearchParams(queryString)

    // Safely extract values from URLSearchParams
    const page = parseInt(urlSearchParams.get('page') || '1')
    const limit = parseInt(urlSearchParams.get('limit') || '10')
    const category = urlSearchParams.get('category')
    const location = urlSearchParams.get('location')
    const upcoming = urlSearchParams.get('upcoming')

    const skip = (page - 1) * limit

    // Build the where clause based on filters
    const where: any = {}

    if (category) {
      where.category = category
    }

    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive',
      }
    }

    if (upcoming === 'true') {
      where.date = {
        gte: new Date(),
      }
    }

    // Get total count for pagination
    const totalItems = await prisma.event.count({ where })

    // Fetch events with pagination and sorting
    const events = await prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        date: 'asc',
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Calculate pagination info
    const totalPages = Math.ceil(totalItems / limit)

    return {
      events,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
      },
    }
  } catch (error) {
    console.error('Error fetching events:', error)
    // Return empty result on error
    return {
      events: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 10,
      },
    }
  }
}

// Remaining functions stay the same...
export async function fetchEventById(id: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
    return event
  } catch (error) {
    console.error('Error fetching event:', error)
    return null
  }
}
