// app/(root)/donate/page.tsx
'use client'

import { useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { DonationForm } from '@/components/donation/DonationForm'
import { PaymentForm } from '@/components/donation/PaymentForm'
import { Loader2, Heart, Users, Home, BookOpen, HandHeart } from 'lucide-react'
import Image from 'next/image'

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export default function DonatePage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [donationAmount, setDonationAmount] = useState<number>(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDonationSubmit = async (data: {
    amount: number
    anonymous: boolean
    message?: string
  }) => {
    setIsProcessing(true)
    try {
      const response = await fetch('/api/donations/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to process donation')
      }

      setClientSecret(result.clientSecret)
      setDonationAmount(data.amount)
    } catch (error) {
      console.error('Donation processing failed:', error)
      alert('Failed to process donation. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = () => {
    setClientSecret(null)
  }

  // Options for Stripe Elements
  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0284c7',
      colorBackground: '#ffffff',
      colorText: '#1e293b',
    },
  }

  return (
    <>
      {/* Hero Section */}
      <div className='bg-gradient-to-r from-sky-500 to-indigo-600 text-white'>
        <div className='container mx-auto py-16 px-4 text-center'>
          <div className='inline-block p-3 rounded-full bg-white/20 mb-6'>
            <Heart className='w-8 h-8' />
          </div>
          <h1 className='text-4xl md:text-5xl font-bold mb-6'>
            Make a Difference Today
          </h1>
          <p className='text-xl max-w-2xl mx-auto mb-8 text-white/90'>
            Your generosity helps us serve the community and uphold our shared
            values. Together, we can build a brighter future.
          </p>
          <div className='flex justify-center'>
            <a
              href='#donate-form'
              className='inline-flex items-center justify-center px-6 py-3 bg-white text-sky-600 font-medium rounded-lg hover:bg-white/90 transition-colors'
            >
              Donate Now
            </a>
          </div>
        </div>
      </div>

      {/* Impact Section */}
      <div className='py-16 bg-white'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-12'>
            Your Donation Makes a Real Impact
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            <div className='bg-sky-50 p-6 rounded-xl text-center'>
              <div className='inline-flex items-center justify-center w-14 h-14 rounded-full bg-sky-100 text-sky-600 mb-4'>
                <BookOpen className='w-6 h-6' />
              </div>
              <h3 className='font-semibold text-lg mb-2'>Education</h3>
              <p className='text-gray-600'>
                Support Islamic education programs for children and adults
              </p>
            </div>

            <div className='bg-indigo-50 p-6 rounded-xl text-center'>
              <div className='inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 mb-4'>
                <Users className='w-6 h-6' />
              </div>
              <h3 className='font-semibold text-lg mb-2'>Community</h3>
              <p className='text-gray-600'>
                Fund essential community services and assistance programs
              </p>
            </div>

            <div className='bg-amber-50 p-6 rounded-xl text-center'>
              <div className='inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 text-amber-600 mb-4'>
                <Home className='w-6 h-6' />
              </div>
              <h3 className='font-semibold text-lg mb-2'>Facilities</h3>
              <p className='text-gray-600'>
                Help maintain and improve our community spaces
              </p>
            </div>

            <div className='bg-emerald-50 p-6 rounded-xl text-center'>
              <div className='inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mb-4'>
                <HandHeart className='w-6 h-6' />
              </div>
              <h3 className='font-semibold text-lg mb-2'>Outreach</h3>
              <p className='text-gray-600'>
                Support our outreach efforts and humanitarian initiatives
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Donation Section */}
      <div id='donate-form' className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto'>
            {/* Left Column - Info and Testimonials */}
            <div className='lg:w-1/2'>
              <div className='prose max-w-none mb-8'>
                <h2 className='text-3xl font-bold text-gray-900'>
                  Why Your Support Matters
                </h2>
                <p className='text-lg text-gray-700'>
                  Every contribution, regardless of size, helps us continue our
                  mission and support our community.
                </p>
                <ul className='space-y-2'>
                  <li className='flex items-start'>
                    <div className='mr-2 mt-1 bg-sky-100 p-1 rounded-full text-sky-600'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <span>100% secure and encrypted donations</span>
                  </li>
                  <li className='flex items-start'>
                    <div className='mr-2 mt-1 bg-sky-100 p-1 rounded-full text-sky-600'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <span>Tax-deductible contributions</span>
                  </li>
                  <li className='flex items-start'>
                    <div className='mr-2 mt-1 bg-sky-100 p-1 rounded-full text-sky-600'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <span>Immediate impact on our programs</span>
                  </li>
                </ul>
              </div>

              {/* Image */}
              <div className='relative h-64 rounded-xl overflow-hidden mb-8'>
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10'></div>
                <Image
                  src='/images/community-event.jpg'
                  alt='Community gathering'
                  fill
                  className='object-cover'
                  sizes='(max-width: 768px) 100vw, 50vw'
                />
                <div className='absolute bottom-4 left-4 right-4 text-white z-20'>
                  <p className='font-medium'>
                    Your donations helped fund our annual community gathering
                  </p>
                </div>
              </div>

              {/* Testimonials */}
              <div className='space-y-6'>
                <h3 className='text-xl font-semibold text-gray-900'>
                  What Our Donors Say
                </h3>

                <div className='bg-white p-6 rounded-xl border border-gray-100 shadow-sm'>
                  <p className='italic text-gray-700 mb-4'>
                    "Supporting this community has been one of the most
                    rewarding experiences of my life. I know my donations are
                    making a real difference."
                  </p>
                  <div className='flex items-center'>
                    <div className='h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-medium mr-3'>
                      AR
                    </div>
                    <div>
                      <p className='font-medium'>Aisha Rahman</p>
                      <p className='text-sm text-gray-500'>
                        Monthly Donor since 2023
                      </p>
                    </div>
                  </div>
                </div>

                <div className='bg-white p-6 rounded-xl border border-gray-100 shadow-sm'>
                  <p className='italic text-gray-700 mb-4'>
                    "I've seen firsthand how donations transform our ability to
                    serve those in need. Every contribution, no matter the size,
                    adds up to make an incredible impact."
                  </p>
                  <div className='flex items-center'>
                    <div className='h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium mr-3'>
                      MH
                    </div>
                    <div>
                      <p className='font-medium'>Mohammed Hassan</p>
                      <p className='text-sm text-gray-500'>Board Member</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Donation Form */}
            <div className='lg:w-1/2 lg:sticky lg:top-24 self-start'>
              <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden'>
                {isProcessing && !clientSecret ? (
                  <div className='flex flex-col items-center justify-center p-12 h-64'>
                    <Loader2 className='w-10 h-10 animate-spin text-primary mb-4' />
                    <p className='text-gray-600'>Preparing your donation...</p>
                  </div>
                ) : clientSecret ? (
                  <div className='p-6 md:p-8'>
                    <Elements
                      stripe={stripePromise}
                      options={{ clientSecret, appearance }}
                    >
                      <PaymentForm
                        amount={donationAmount}
                        onCancel={handleCancel}
                      />
                    </Elements>
                  </div>
                ) : (
                  <div className='p-6 md:p-8'>
                    <DonationForm
                      onSubmit={handleDonationSubmit}
                      processing={isProcessing}
                    />
                  </div>
                )}
              </div>

              {/* Security Notice */}
              <div className='mt-4 flex items-center justify-center text-sm text-gray-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 mr-2'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                    clipRule='evenodd'
                  />
                </svg>
                Secure donation processed by Stripe
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className='py-16 bg-white'>
        <div className='container mx-auto px-4 max-w-4xl'>
          <h2 className='text-3xl font-bold text-center mb-12'>
            Frequently Asked Questions
          </h2>

          <div className='grid gap-6'>
            <div className='border-b border-gray-200 pb-6'>
              <h3 className='text-xl font-semibold mb-2'>
                Is my donation tax-deductible?
              </h3>
              <p className='text-gray-600'>
                Yes, all donations are tax-deductible. You will receive a
                receipt via email that can be used for tax purposes.
              </p>
            </div>

            <div className='border-b border-gray-200 pb-6'>
              <h3 className='text-xl font-semibold mb-2'>
                Can I make a recurring donation?
              </h3>
              <p className='text-gray-600'>
                Yes, you can set up monthly recurring donations by selecting the
                recurring option on the donation form.
              </p>
            </div>

            <div className='border-b border-gray-200 pb-6'>
              <h3 className='text-xl font-semibold mb-2'>
                How is my donation used?
              </h3>
              <p className='text-gray-600'>
                Your donation supports our core programs including education,
                community services, facility maintenance, and outreach efforts.
                Our annual report provides a breakdown of how funds are
                allocated.
              </p>
            </div>

            <div className='border-b border-gray-200 pb-6'>
              <h3 className='text-xl font-semibold mb-2'>
                Can I donate anonymously?
              </h3>
              <p className='text-gray-600'>
                Yes, you can choose to make your donation anonymous during the
                donation process. Your information will still be recorded for
                tax purposes but will not be publicly displayed.
              </p>
            </div>

            <div className='pb-6'>
              <h3 className='text-xl font-semibold mb-2'>
                Are there other ways to support besides financial donations?
              </h3>
              <p className='text-gray-600'>
                Absolutely! We welcome volunteers and in-kind donations as well.
                Please contact us directly to learn about current volunteer
                opportunities and needed items.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// // app/(public)/donate/page.tsx
// import { DonateForm } from "@/components/public/DonateForm";

// export const metadata = {
//   title: "Donate | IslamicEvents",
//   description: "Support our mission with your generous donation",
// };

// export default function DonatePage() {
//   return (
//     <div className="container mx-auto px-4 py-12">
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-3xl font-bold text-center mb-6">
//           Support Our Mission
//         </h1>
//         <p className="text-gray-600 text-center mb-10">
//           Your donation helps us organize community events, educational
//           programs, and charitable initiatives. Every contribution makes a
//           difference.
//         </p>

//         <div className="bg-white shadow-sm rounded-lg p-6 mb-12">
//           <h2 className="text-xl font-semibold mb-6 text-center">
//             Make a Donation
//           </h2>
//           <DonateForm />
//         </div>

//         <div className="bg-emerald-50 rounded-lg p-6">
//           <h2 className="text-xl font-semibold mb-4 text-center">
//             How Your Donation Helps
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//             <div className="text-center">
//               <div className="bg-emerald-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <span className="text-emerald-700 text-xl">📚</span>
//               </div>
//               <h3 className="font-medium mb-2">Education</h3>
//               <p className="text-sm text-gray-600">
//                 Fund classes, workshops, and learning materials
//               </p>
//             </div>
//             <div className="text-center">
//               <div className="bg-emerald-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <span className="text-emerald-700 text-xl">🤝</span>
//               </div>
//               <h3 className="font-medium mb-2">Community</h3>
//               <p className="text-sm text-gray-600">
//                 Support events that bring people together
//               </p>
//             </div>
//             <div className="text-center">
//               <div className="bg-emerald-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <span className="text-emerald-700 text-xl">🏥</span>
//               </div>
//               <h3 className="font-medium mb-2">Charity</h3>
//               <p className="text-sm text-gray-600">
//                 Help those in need through our relief initiatives
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
