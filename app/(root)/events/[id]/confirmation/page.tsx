// app/(root)/events/[id]/confirmation/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'success' | 'processing' | 'failed'>(
    'processing'
  )
  const [message, setMessage] = useState('Processing your payment...')

  useEffect(() => {
    // Get the payment_intent and payment_intent_client_secret from the URL
    const paymentIntent = searchParams.get('payment_intent')
    const paymentIntentClientSecret = searchParams.get(
      'payment_intent_client_secret'
    )
    const redirectStatus = searchParams.get('redirect_status')

    if (redirectStatus === 'succeeded') {
      setStatus('success')
      setMessage('Payment successful! Your registration is complete.')
    } else if (redirectStatus === 'failed') {
      setStatus('failed')
      setMessage('Payment failed. Please try again or contact support.')
    } else {
      // You could verify the payment status by calling your backend
      // that would check with Stripe directly
      fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntent, paymentIntentClientSecret }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'succeeded') {
            setStatus('success')
            setMessage('Payment successful! Your registration is complete.')
          } else {
            setStatus('failed')
            setMessage(
              data.message ||
                'Something went wrong. Please check your payment status.'
            )
          }
        })
        .catch(() => {
          setStatus('failed')
          setMessage('Error verifying payment. Please contact support.')
        })
    }
  }, [searchParams])

  return (
    <div className='container mx-auto px-4 py-12'>
      <Button asChild variant='ghost' className='mb-6'>
        <Link href='/events' className='flex items-center'>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Events
        </Link>
      </Button>

      <div className='max-w-md mx-auto'>
        <Card>
          <CardHeader>
            <CardTitle className='text-center'>
              Registration{' '}
              {status === 'processing'
                ? 'Processing'
                : status === 'success'
                ? 'Complete'
                : 'Failed'}
            </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col items-center'>
            {status === 'success' ? (
              <CheckCircle className='h-16 w-16 text-green-500 mb-4' />
            ) : status === 'failed' ? (
              <XCircle className='h-16 w-16 text-red-500 mb-4' />
            ) : (
              <div className='animate-pulse h-16 w-16 rounded-full bg-gray-200 mb-4' />
            )}

            <p className='text-center mb-6'>{message}</p>

            {status === 'success' && (
              <p className='text-sm text-center text-muted-foreground mb-6'>
                A confirmation email has been sent to your email address.
              </p>
            )}

            <div className='flex gap-4'>
              <Button asChild variant='outline'>
                <Link href='/events'>Browse More Events</Link>
              </Button>

              {status === 'failed' && (
                <Button asChild>
                  <Link href='/contact'>Contact Support</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
