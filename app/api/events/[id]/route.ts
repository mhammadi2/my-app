// app/api/events/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
// NOTE: Adjust the import statement to match your actual export from options.ts
import authOptions from '@/app/api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Zod schema for validating possible update fields
const eventUpdateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  imageUrl: z.string().url().optional(),
  location: z.string().min(3).optional(),
  date: z.string().min(1).optional(),
  startTime: z.string().min(1).optional(),
  endTime: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  capacity: z.coerce.number().int().positive().optional(),
})

/**
 * GET /api/events/[id]
 * Fetch a single event by its ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        organizer: {
          select: { id: true, name: true, image: true },
        },
        attendees: {
          select: { id: true, userId: true },
        },
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Count current registrations
    const registeredAttendees = event.attendees.length

    // Omit the raw attendees array in the response
    const responseData = {
      ...event,
      registeredAttendees,
      attendees: undefined, // intentionally excluded
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event details' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/events/[id]
 * Update an existing event (only allowed by the organizer)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Use the corrected import for NextAuthOptions
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify event exists and fetch its organizer & attendees
    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        attendees: true,
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Ensure the current user is the event organizer
    if (event.organizerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden: Only the event organizer can edit this event' },
        { status: 403 }
      )
    }

    // Parse and validate the incoming request body
    const body = await req.json()
    const validatedData = eventUpdateSchema.parse(body)

    // Prevent decreasing capacity below the current number of attendees
    if (
      validatedData.capacity !== undefined &&
      validatedData.capacity < event.attendees.length
    ) {
      return NextResponse.json(
        {
          error: 'Capacity cannot be lower than current registrations',
          currentRegistrations: event.attendees.length,
        },
        { status: 400 }
      )
    }

    // Perform the update
    const updatedEvent = await prisma.event.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        organizer: {
          select: { id: true, name: true, image: true },
        },
        attendees: {
          select: { id: true },
        },
      },
    })

    // Count the updated registrations
    const registeredAttendees = updatedEvent.attendees.length

    // Omit the raw attendees array in the response
    const responseData = {
      ...updatedEvent,
      registeredAttendees,
      attendees: undefined,
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error updating event:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid event data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/events/[id]
 * Delete an existing event (only allowed by the organizer)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify the event exists
    const event = await prisma.event.findUnique({
      where: { id: params.id },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Ensure the current user is the event organizer
    if (event.organizerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden: Only the event organizer can delete this event' },
        { status: 403 }
      )
    }

    // Delete the event and its related records within a transaction
    await prisma.$transaction([
      prisma.eventRegistration.deleteMany({ where: { eventId: params.id } }),
      // If you have a ticket system, remove tickets as well
      prisma.eventTicket.deleteMany({ where: { eventId: params.id } }),
      prisma.event.delete({ where: { id: params.id } }),
    ])

    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}
