// app/api/events/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const registrationSchema = z.object({
  eventId: z.string().min(1, { message: 'Event ID is required' }),
})

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to register for events.' },
        { status: 401 }
      )
    }

    // Validate request body
    const body = await req.json()
    const { eventId } = registrationSchema.parse(body)

    // Check if the event exists
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        attendees: true,
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Check if the event date has passed
    const eventDate = new Date(event.date)
    if (eventDate < new Date()) {
      return NextResponse.json(
        { error: 'Cannot register for past events' },
        { status: 400 }
      )
    }

    // Check if the event is full
    if (event.attendees.length >= event.capacity) {
      return NextResponse.json({ error: 'Event is full' }, { status: 400 })
    }

    // Check if user is already registered
    const existingRegistration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId: session.user.id,
        },
      },
    })

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'You are already registered for this event' },
        { status: 400 }
      )
    }

    // Create registration
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        userId: session.user.id,
      },
    })

    // Return success response
    return NextResponse.json({
      message: 'Registration successful',
      registrationId: registration.id,
    })
  } catch (error) {
    console.error('Error registering for event:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid registration data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to register for event' },
      { status: 500 }
    )
  }
}
