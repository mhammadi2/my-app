// app/api/donations/create-payment-intent/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { amount, anonymous = false } = body

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: 'Valid donation amount is required' },
        { status: 400 }
      )
    }

    // Get user session if available
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency: 'usd',
      metadata: {
        donationType: 'donation',
        userId: userId || 'anonymous',
        anonymous: anonymous.toString(),
      },
    })

    // Create donation record
    const donation = await prisma.donation.create({
      data: {
        amount,
        status: 'PENDING',
        paymentId: paymentIntent.id,
        // If user is logged in, associate the donation with their account
        ...(userId && { userId }),
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      donationId: donation.id,
    })
  } catch (error) {
    console.error('Donation payment intent creation failed:', error)
    return NextResponse.json(
      { error: 'Failed to process donation' },
      { status: 500 }
    )
  }
}
