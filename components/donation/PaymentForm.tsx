// components/donation/PaymentForm.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { ArrowLeft, LockIcon, CreditCard } from 'lucide-react'

interface PaymentFormProps {
  amount: number
  onCancel: () => void
}

export function PaymentForm({ amount, onCancel }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setErrorMessage(null)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/donate/thank-you`,
        },
      })

      if (error) {
        setErrorMessage(
          error.message || 'An error occurred during payment processing'
        )
      }
    } catch (err) {
      console.error('Payment confirmation error:', err)
      setErrorMessage('An unexpected error occurred. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold mb-2'>Complete Your Donation</h2>
        <div className='flex items-center text-gray-600 mb-4'>
          <CreditCard className='mr-2 h-5 w-5' />
          <p>
            You're donating{' '}
            <span className='font-semibold'>${amount.toFixed(2)}</span> to
            support our mission
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='bg-gray-50 rounded-lg p-4 mb-4'>
          <PaymentElement />
        </div>

        {errorMessage && (
          <div className='p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md'>
            <div className='flex items-start'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 mr-2 mt-0.5 flex-shrink-0'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                  clipRule='evenodd'
                />
              </svg>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        <div className='flex justify-between gap-4'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            disabled={isProcessing}
            className='flex-1 h-12'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back
          </Button>
          <Button
            type='submit'
            disabled={!stripe || isProcessing}
            className='flex-1 h-12 text-base font-medium'
          >
            {isProcessing ? (
              <span className='flex items-center'>
                <span className='mr-2 h-5 w-5 animate-spin rounded-full border-4 border-white border-t-transparent'></span>
                Processing...
              </span>
            ) : (
              <span className='flex items-center'>
                <LockIcon className='mr-2 h-4 w-4' />
                Complete Donation
              </span>
            )}
          </Button>
        </div>

        <div className='text-center text-sm text-gray-500 mt-4 flex justify-center items-center'>
          <LockIcon className='h-3 w-3 mr-1' />
          Secure payment powered by Stripe
        </div>
      </form>
    </div>
  )
}
