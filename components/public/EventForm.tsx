'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-hot-toast'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

// Import your validation schema
import { eventSchema } from '@/ValidationSchemas/event'
import { Event } from '@prisma/client'

// Event categories
const EVENT_CATEGORIES = [
  { value: 'conference', label: 'Conference' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'networking', label: 'Networking' },
  { value: 'music', label: 'Music' },
  { value: 'sports', label: 'Sports' },
  { value: 'other', label: 'Other' },
]

// Event statuses
const EVENT_STATUSES = [
  { value: 'UPCOMING', label: 'Upcoming' },
  { value: 'INPROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

// Infers the TypeScript type from your Zod schema
type EventFormData = z.infer<typeof eventSchema>

interface Props {
  event?: Event
}

const EventForm = ({ event }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Initialize form with proper type handling for default values
  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || '',
      description: event?.description || '',
      date: event?.date ? new Date(event.date) : new Date(),
      location: event?.location || '',
      startTime: event?.startTime || '18:00',
      endTime: event?.endTime || '21:00',
      category: event?.category || 'other',
      capacity: event?.capacity || 100,
      status: event?.status || 'UPCOMING',
    },
  })

  async function onSubmit(values: EventFormData) {
    console.log('Form submitted with values:', values)

    try {
      setIsSubmitting(true)
      setError('')

      // Make sure date is properly formatted
      const formData = {
        ...values,
        date:
          values.date instanceof Date
            ? values.date.toISOString()
            : new Date(values.date as any).toISOString(),
        // Ensure capacity is a number
        capacity:
          typeof values.capacity === 'string'
            ? parseInt(values.capacity)
            : values.capacity,
      }

      console.log('Sending to API:', formData)

      if (event?.id) {
        // If editing an existing event
        await axios.patch(`/api/events/${event.id}`, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        toast.success('Event updated successfully!')
      } else {
        // If creating a new event - FIXED THIS PART
        try {
          const response = await axios.post('/api/events', formData, {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true, // Important for cookies/session
          })

          console.log('API Response:', response.data)
          toast.success('Event created successfully!')
        } catch (apiError) {
          console.error(
            'API Error Details:',
            apiError.response?.data || apiError.message
          )
          throw apiError // Re-throw to be caught by outer catch
        }
      }

      router.push('/events')
      router.refresh()
    } catch (err: any) {
      console.error('Form submission error:', err)

      // Detailed error logging
      if (err.response) {
        console.error('Response status:', err.response.status)
        console.error('Response data:', err.response.data)
        setError(
          err.response.data?.message || `Server error: ${err.response.status}`
        )
      } else if (err.request) {
        console.error('Request error - no response received:', err.request)
        setError(
          'No response received from server. Please check your connection.'
        )
      } else {
        console.error('Error details:', err.message)
        setError(err.message || 'Failed to save event')
      }

      toast.error('Failed to save event')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add a manual API test function
  const testApiConnection = async () => {
    try {
      const response = await axios.get('/api/test-session')
      console.log('API connection test result:', response.data)
      toast.success('API connection successful')
    } catch (err) {
      console.error('API connection test failed:', err)
      toast.error('API connection failed')
    }
  }

  return (
    <div className='rounded-md border w-full p-4'>
      {error && (
        <div className='bg-red-50 text-red-600 p-3 rounded-md mb-4'>
          {error}
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6 w-full'
          noValidate
        >
          {/* Event Title Field */}
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input placeholder='Event Title...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <SimpleMDE placeholder='Description...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date and Location in a grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Date picker */}
            <FormField
              control={form.control}
              name='date'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type='button'
                          variant='outline'
                          className={`w-full pl-3 text-left font-normal ${
                            !field.value && 'text-muted-foreground'
                          }`}
                        >
                          {field.value ? (
                            format(new Date(field.value), 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={
                          field.value instanceof Date
                            ? field.value
                            : new Date(field.value as any)
                        }
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Field */}
            <FormField
              control={form.control}
              name='location'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder='Event Location...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Time and Category in a grid */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {/* Start Time Field */}
            <FormField
              control={form.control}
              name='startTime'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type='time' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Time Field */}
            <FormField
              control={form.control}
              name='endTime'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type='time' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Event Category Field */}
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select category' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EVENT_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Capacity and Status in a grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Capacity Field */}
            <FormField
              control={form.control}
              name='capacity'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min='1'
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status Field */}
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EVENT_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Test API Button - for debugging only */}
          {process.env.NODE_ENV === 'development' && (
            <Button
              type='button'
              variant='outline'
              onClick={testApiConnection}
              className='mb-4'
            >
              Test API Connection
            </Button>
          )}

          {/* Submit Button */}
          <Button type='submit' className='w-full' disabled={isSubmitting}>
            {isSubmitting
              ? 'Saving...'
              : event?.id
              ? 'Update Event'
              : 'Create Event'}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default EventForm
