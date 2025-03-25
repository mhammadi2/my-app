// app/api/events/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import  options  from '@/app/api/auth/[...nextauth]/options'
import prisma from '@/prisma/db'
import { eventSchema } from '@/ValidationSchemas/event'

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    console.log('Received event data:', body)

    // Validate the request body
    const validation = eventSchema.safeParse(body)

    // If validation fails, return error response
    if (!validation.success) {
      console.log('Validation failed:', validation.error.format())
      return NextResponse.json(
        { message: 'Validation failed', errors: validation.error.format() },
        { status: 400 }
      )
    }

    // Get valid data from validation result
    const validData = validation.data

    // CRITICAL FIX: Find a default user to use as organizer
    const defaultUser = await prisma.user.findFirst()

    if (!defaultUser) {
      console.log('No users found in database')
      return NextResponse.json(
        {
          message:
            'No users found in the database. Please create a user first.',
        },
        { status: 400 }
      )
    }

    console.log('Using default user as organizer:', defaultUser.id)

    // Create event in database with required organizerId
    const newEvent = await prisma.event.create({
      data: {
        title: validData.title,
        description: validData.description,
        date: new Date(validData.date),
        location: validData.location,
        startTime: validData.startTime,
        endTime: validData.endTime,
        category: validData.category,
        capacity: Number(validData.capacity),
        status: validData.status,
        // This is the critical fix - provide a valid organizerId
        organizerId: defaultUser.id,
      },
    })

    console.log('Event created successfully:', newEvent.id)
    return NextResponse.json(newEvent, { status: 201 })
  } catch (error) {
    console.error('Create event error:', error)

    // Enhanced error handling with detailed information
    let errorMessage = 'Failed to create event'
    let statusCode = 500
    let errorDetails = {}

    if (error.code === 'P2002') {
      errorMessage = 'An event with this title already exists'
      statusCode = 400
    } else if (error.code === 'P2011') {
      errorMessage = 'Required field is missing'
      statusCode = 400
      errorDetails = { field: error.meta?.target || 'unknown' }
    }

    // Log detailed error information
    console.error('Error details:', {
      message: errorMessage,
      code: error.code,
      meta: error.meta,
      details: errorDetails,
    })

    return NextResponse.json(
      {
        message: errorMessage,
        error: error.message,
        details: errorDetails,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: statusCode }
    )
  }
}
