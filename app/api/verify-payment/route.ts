// app/api/verify-payment/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: Request) {
  try {
    const { paymentIntent } = await req.json()

    if (!paymentIntent) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      )
    }

    // Verify payment status with Stripe
    const intent = await stripe.paymentIntents.retrieve(paymentIntent)

    // Check registration status in database
    const registration = await prisma.registration.findUnique({
      where: { paymentIntentId: paymentIntent },
      include: { event: { select: { title: true } } },
    })

    if (!registration) {
      return NextResponse.json(
        { status: 'failed', message: 'Registration not found' },
        { status: 404 }
      )
    }

    // Return appropriate response based on payment status
    if (intent.status === 'succeeded') {
      return NextResponse.json({
        status: 'succeeded',
        message: 'Payment successful',
        event: registration.event.title,
        ticketCount: registration.ticketCount,
      })
    } else if (intent.status === 'processing') {
      return NextResponse.json({
        status: 'processing',
        message: 'Your payment is still processing',
      })
    } else {
      return NextResponse.json({
        status: 'failed',
        message: 'Payment was not successful',
      })
    }
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { status: 'failed', message: 'Error verifying payment status' },
      { status: 500 }
    )
  }
}
