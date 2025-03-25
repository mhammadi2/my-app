// app/api/create-payment-intent/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { eventId, ticketCount, email, name, phone } = body

    // Get event details
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    })

    if (!event || !event.registrationFee) {
      return NextResponse.json(
        { error: 'Event not found or no registration fee defined' },
        { status: 400 }
      )
    }

    // Calculate total amount
    const amount = event.registrationFee * ticketCount

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses cents
      currency: 'usd',
      metadata: {
        eventId,
        eventName: event.title,
        ticketCount: ticketCount.toString(),
        customerEmail: email,
        customerName: name,
        customerPhone: phone || '',
      },
    })

    // Create a pending registration in database
    await prisma.registration.create({
      data: {
        eventId,
        email,
        name,
        phone,
        ticketCount,
        amount,
        paymentIntentId: paymentIntent.id,
        status: 'PENDING',
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error('Payment intent creation failed:', error)
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
