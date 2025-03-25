// components/registration/CheckoutWrapper.tsx
'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { RegistrationForm } from './RegistrationForm'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

interface CheckoutWrapperProps {
  event: {
    id: string
    title: string
    registrationFee: number
    maxTicketsPerPerson?: number | null
  }
}

export function CheckoutWrapper({ event }: CheckoutWrapperProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const createPaymentIntent = async (formData: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment')
      }

      setClientSecret(data.clientSecret)
    } catch (error) {
      console.error('Payment intent creation failed:', error)
      alert('Failed to initialize payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Appearance options for Stripe Elements
  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0284c7',
      colorBackground: '#ffffff',
      colorText: '#1e293b',
    },
  }

  if (!event.registrationFee) {
    return (
      <Card>
        <CardContent className='pt-6'>
          <p>
            Registration is free for this event. Please contact the organizer
            for more details.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='w-full max-w-md mx-auto'>
      {loading ? (
        <div className='flex justify-center items-center py-10'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <span className='ml-2'>Preparing registration...</span>
        </div>
      ) : clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
          <RegistrationForm
            event={event}
            clientSecret={clientSecret}
            onSubmit={createPaymentIntent}
          />
        </Elements>
      ) : (
        <RegistrationForm
          event={event}
          clientSecret={null}
          onSubmit={createPaymentIntent}
        />
      )}
    </div>
  )
}
