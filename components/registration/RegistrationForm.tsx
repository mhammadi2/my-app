// components/registration/RegistrationForm.tsx
'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { useElements, useStripe, PaymentElement } from '@stripe/react-stripe-js'

// Form schema for validation
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Valid email is required' }),
  phone: z.string().optional(),
  ticketCount: z.number().min(1).max(10),
})

type FormValues = z.infer<typeof formSchema>

interface RegistrationFormProps {
  event: {
    id: string
    title: string
    registrationFee: number
    maxTicketsPerPerson?: number | null
  }
  clientSecret: string | null
  onSubmit: (data: FormValues) => Promise<void>
}

export function RegistrationForm({
  event,
  clientSecret,
  onSubmit,
}: RegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const stripe = useStripe()
  const elements = useElements()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      ticketCount: 1,
    },
  })

  const handleSubmit = async (data: FormValues) => {
    if (!stripe || !elements || !clientSecret) {
      return
    }

    setIsSubmitting(true)

    try {
      // First process the form data
      await onSubmit(data)

      // Then process the payment
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/events/${event.id}/confirmation`,
        },
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch (err) {
      console.error('Payment error:', err)
      alert('Payment failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalPrice = form.watch('ticketCount') * event.registrationFee

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle>Register for {event.title}</CardTitle>
        <CardDescription>
          Registration fee: ${event.registrationFee.toFixed(2)} per person
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Your name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='your.email@example.com'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder='(123) 456-7890' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='ticketCount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Tickets</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min={1}
                      max={event.maxTicketsPerPerson || 10}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 1)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='py-2'>
              <div className='text-sm text-muted-foreground mb-2'>
                Total: ${totalPrice.toFixed(2)}
              </div>

              {clientSecret && (
                <div className='mt-4'>
                  <PaymentElement />
                </div>
              )}
            </div>

            <Button
              type='submit'
              className='w-full'
              disabled={isSubmitting || !clientSecret}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Processing...
                </>
              ) : (
                'Complete Registration'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
