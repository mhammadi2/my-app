// app/api/webhooks/stripe/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    await handleSuccessfulPayment(paymentIntent)
  } else if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    await handleFailedPayment(paymentIntent)
  }

  return NextResponse.json({ received: true })
}

async function handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Check if this is a donation payment
    if (paymentIntent.metadata.donationType === 'donation') {
      // Update donation status
      await prisma.donation.update({
        where: { paymentId: paymentIntent.id },
        data: { status: 'COMPLETED' },
      })

      // Here you would also send a receipt email
      // sendReceiptEmail(paymentIntent.metadata);
    } else if (paymentIntent.metadata.donationType === 'registration') {
      // Handle event registration payment (similar to what you already have)
      await prisma.registration.update({
        where: { paymentIntentId: paymentIntent.id },
        data: { status: 'CONFIRMED' },
      })
    }
  } catch (error) {
    console.error('Error updating payment record:', error)
  }
}

async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
  try {
    if (paymentIntent.metadata.donationType === 'donation') {
      await prisma.donation.update({
        where: { paymentId: paymentIntent.id },
        data: { status: 'FAILED' },
      })
    } else if (paymentIntent.metadata.donationType === 'registration') {
      await prisma.registration.update({
        where: { paymentIntentId: paymentIntent.id },
        data: { status: 'FAILED' },
      })
    }
  } catch (error) {
    console.error('Error updating failed payment record:', error)
  }
}
