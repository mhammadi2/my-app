// components/donation/DonationForm.tsx
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
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSession } from 'next-auth/react'
import { DollarSign, ArrowRight, Gift } from 'lucide-react'

// Form schema for validation
const formSchema = z.object({
  amount: z.coerce
    .number()
    .min(1, { message: 'Minimum donation amount is $1' }),
  donationType: z.string().default('general'),
  isRecurring: z.boolean().default(false),
  anonymous: z.boolean().default(false),
  message: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface DonationFormProps {
  onSubmit: (data: FormValues) => Promise<void>
  processing: boolean
}

const predefinedAmounts = [25, 50, 100, 250, 500, 1000]
const donationTypes = [
  { value: 'general', label: 'General Support' },
  { value: 'education', label: 'Education Programs' },
  { value: 'community', label: 'Community Services' },
  { value: 'facilities', label: 'Facility Maintenance' },
  { value: 'outreach', label: 'Outreach Programs' },
]

export function DonationForm({ onSubmit, processing }: DonationFormProps) {
  const { data: session } = useSession()
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(50)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 50,
      donationType: 'general',
      isRecurring: false,
      anonymous: false,
      message: '',
    },
  })

  const handleAmountSelection = (value: number | 'custom') => {
    setSelectedAmount(value)
    if (value !== 'custom') {
      form.setValue('amount', value)
    }
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value)) {
      form.setValue('amount', value)
    }
  }

  const handleSubmit = async (data: FormValues) => {
    try {
      await onSubmit(data)
    } catch (err) {
      console.error('Donation error:', err)
    }
  }

  return (
    <div>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold mb-2'>Make Your Donation</h2>
        <p className='text-gray-600'>
          Your generosity helps us serve our community
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name='donationType'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Donation Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className='h-12'>
                      <SelectValue placeholder='Select donation type' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {donationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select where you would like your donation to be directed
                </FormDescription>
              </FormItem>
            )}
          />

          <div className='space-y-3'>
            <FormLabel>Donation Amount</FormLabel>
            <div className='grid grid-cols-3 gap-2'>
              {predefinedAmounts.map((amount) => (
                <Button
                  key={amount}
                  type='button'
                  variant={selectedAmount === amount ? 'default' : 'outline'}
                  onClick={() => handleAmountSelection(amount)}
                  className='relative h-12 hover:bg-sky-100 hover:text-sky-700 hover:border-sky-200'
                >
                  <DollarSign className='w-4 h-4 absolute left-2' />
                  <span>{amount}</span>
                </Button>
              ))}
            </div>

            <div className='flex items-center gap-2'>
              <Button
                type='button'
                variant={selectedAmount === 'custom' ? 'default' : 'outline'}
                onClick={() => handleAmountSelection('custom')}
                className='h-12 hover:bg-sky-100 hover:text-sky-700 hover:border-sky-200'
              >
                Custom Amount
              </Button>

              {selectedAmount === 'custom' && (
                <FormField
                  control={form.control}
                  name='amount'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormControl>
                        <div className='relative'>
                          <DollarSign className='w-4 h-4 absolute left-3 top-3 text-muted-foreground' />
                          <Input
                            type='number'
                            min={1}
                            step='any'
                            className='pl-9 h-12'
                            placeholder='Enter amount'
                            onChange={(e) => {
                              field.onChange(parseFloat(e.target.value) || 0)
                              handleCustomAmountChange(e)
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          <FormField
            control={form.control}
            name='isRecurring'
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-amber-50 border-amber-200'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className='data-[state=checked]:bg-amber-500 data-[state=checked]:text-white'
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <div className='flex items-center'>
                    <FormLabel className='font-medium'>
                      Make this a monthly donation
                    </FormLabel>
                    <Gift className='ml-2 h-4 w-4 text-amber-500' />
                  </div>
                  <FormDescription>
                    Your support will automatically continue each month
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {session?.user && (
            <FormField
              control={form.control}
              name='anonymous'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Make this donation anonymous</FormLabel>
                    <FormDescription>
                      Your name will not be displayed in public donation
                      listings
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          )}

          {!session?.user && (
            <div className='space-y-4 border-t pt-4'>
              <h3 className='text-sm font-medium text-gray-500'>
                Your Information
              </h3>

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Your name'
                        {...field}
                        className='h-12'
                      />
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
                        placeholder='Your email'
                        {...field}
                        className='h-12'
                      />
                    </FormControl>
                    <FormDescription>
                      We'll send your donation receipt to this email
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <FormField
            control={form.control}
            name='message'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Add a message with your donation'
                    {...field}
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            className='w-full h-12 text-base font-medium'
            disabled={processing}
          >
            {processing ? (
              <span className='flex items-center'>
                <span className='mr-2 h-5 w-5 animate-spin rounded-full border-4 border-white border-t-transparent'></span>
                Processing...
              </span>
            ) : (
              <span className='flex items-center'>
                Continue to Payment
                <ArrowRight className='ml-2 h-5 w-5' />
              </span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
