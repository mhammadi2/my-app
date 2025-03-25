// app/(root)/donate/thank-you/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  CheckCircle,
  XCircle,
  Calendar,
  ArrowRight,
  HomeIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import confetti from 'canvas-confetti'

export default function ThankYouPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'success' | 'processing' | 'failed'>(
    'processing'
  )
  const [message, setMessage] = useState('Processing your donation...')

  useEffect(() => {
    const paymentIntent = searchParams.get('payment_intent')
    const redirectStatus = searchParams.get('redirect_status')

    if (redirectStatus === 'succeeded') {
      setStatus('success')
      setMessage('Your donation was successful. Thank you for your generosity!')

      // Trigger confetti animation on success
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }, 300)
    } else if (redirectStatus === 'failed') {
      setStatus('failed')
      setMessage('Donation failed. Please try again or contact support.')
    } else {
      setStatus('processing')
      setMessage('We are processing your donation...')
    }
  }, [searchParams])

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4'>
      <div className='max-w-lg mx-auto'>
        <div
          className={`p-8 bg-white rounded-2xl shadow-sm border ${
            status === 'success'
              ? 'border-green-100'
              : status === 'failed'
              ? 'border-red-100'
              : 'border-gray-100'
          }`}
        >
          <div className='text-center mb-6'>
            {status === 'success' ? (
              <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4'>
                <CheckCircle className='h-8 w-8' />
              </div>
            ) : status === 'failed' ? (
              <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4'>
                <XCircle className='h-8 w-8' />
              </div>
            ) : (
              <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4'>
                <div className='h-8 w-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin'></div>
              </div>
            )}

            <h1 className='text-2xl font-bold text-gray-900 mb-2'>
              {status === 'success'
                ? 'Thank You for Your Donation!'
                : status === 'failed'
                ? 'Donation Failed'
                : 'Processing Donation'}
            </h1>

            <p className='text-gray-600 mb-6'>{message}</p>
          </div>

          {status === 'success' && (
            <div className='bg-green-50 border border-green-100 rounded-xl p-4 mb-6'>
              <div className='flex items-start'>
                <div className='mr-4 mt-1'>
                  <CheckCircle className='h-5 w-5 text-green-500' />
                </div>
                <div>
                  <h3 className='font-medium text-green-800'>
                    Donation Receipt
                  </h3>
                  <p className='text-green-700 text-sm mt-1'>
                    A receipt has been sent to your email address. Your donation
                    may be tax-deductible.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className='space-y-4'>
            <Button asChild className='w-full'>
              <Link
                href='/'
                className='inline-flex items-center justify-center'
              >
                <HomeIcon className='mr-2 h-4 w-4' />
                Return to Home
              </Link>
            </Button>

            {status === 'success' && (
              <>
                <Button asChild variant='outline' className='w-full'>
                  <Link
                    href='/events'
                    className='inline-flex items-center justify-center'
                  >
                    <Calendar className='mr-2 h-4 w-4' />
                    Explore Upcoming Events
                  </Link>
                </Button>

                <div className='pt-4 text-center'>
                  <p className='text-gray-600 mb-2'>Share your support</p>
                  <div className='flex justify-center space-x-4'>
                    <a
                      href='#'
                      className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors'
                    >
                      <svg
                        className='h-5 w-5'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                        aria-hidden='true'
                      >
                        <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
                      </svg>
                    </a>
                    <a
                      href='#'
                      className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors'
                    >
                      <svg
                        className='h-5 w-5'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                        aria-hidden='true'
                      >
                        <path
                          fillRule='evenodd'
                          d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </a>
                    <a
                      href='#'
                      className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors'
                    >
                      <svg
                        className='h-5 w-5'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                        aria-hidden='true'
                      >
                        <path
                          fillRule='evenodd'
                          d='M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </>
            )}

            {status === 'failed' && (
              <Button asChild variant='outline' className='w-full'>
                <Link
                  href='/donate'
                  className='inline-flex items-center justify-center'
                >
                  <ArrowRight className='mr-2 h-4 w-4' />
                  Try Again
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
