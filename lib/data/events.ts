// lib/data/events.ts
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

type EventFilters = {
  category?: string
  location?: string
  upcoming?: boolean
}

export async function fetchEvents(
  params: { [key: string]: string | string[] | undefined } = {}
) {
  // Safe way to extract values without using Object methods on searchParams
  const page = typeof params.page === 'string' ? parseInt(params.page, 10) : 1
  const limit =
    typeof params.limit === 'string' ? parseInt(params.limit, 10) : 10
  const skip = (page - 1) * limit

  // Safely extract filter values
  const category =
    typeof params.category === 'string' ? params.category : undefined
  const location =
    typeof params.location === 'string' ? params.location : undefined
  const upcoming = params.upcoming === 'true'

  // Build where conditions based on filters
  const where: Prisma.EventWhereInput = {}

  if (category) {
    where.category = category
  }

  if (location) {
    where.location = {
      contains: location,
      mode: 'insensitive',
    }
  }

  if (upcoming) {
    // Logic for filtering upcoming events
    const today = new Date()
    const formattedDate = today.toISOString().split('T')[0] // Format: YYYY-MM-DD

    where.date = {
      gte: formattedDate, // Greater than or equal to today
    }
  }

  // Fetch events with pagination
  const events = await prisma.event.findMany({
    where,
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
    skip,
    take: limit,
  })

  // Count total events for pagination
  const total = await prisma.event.count({ where })

  return {
    events,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}
