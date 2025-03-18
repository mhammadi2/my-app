'use client'
import React, { useState } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { eventSchema } from '@/ValidationSchemas/event'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Event } from '@prisma/client'

type EventFormData = z.infer<typeof eventSchema>

interface Props {
  event?: Event
}

const EventForm = ({ event }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  })

  async function onSubmit(values: z.infer<typeof eventSchema>) {
    try {
      setIsSubmitting(true)
      setError('')

      if (event) {
        await axios.patch('/api/events/' + event.id, values)
      } else {
        await axios.post('/api/events', values)
      }
      setIsSubmitting(false)
      router.push('/events')
      router.refresh()
    } catch (error) {
      console.log(error)
      setError('Unknown Error Occured.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className='rounded-md border w-full p-4'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 w-full'
        >
          <FormField
            control={form.control}
            name='title'
            defaultValue={event?.title}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input placeholder='Event Title...' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Controller
            name='description'
            defaultValue={event?.description}
            control={form.control}
            render={({ field }) => (
              <SimpleMDE placeholder='Description' {...field} />
            )}
          />
          {/* <div className='flex w-full space-x-4'>
            <FormField
              control={form.control}
              name='status'
              defaultValue={event?.status}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder='Status...'
                          defaultValue={ticket?.status}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='OPEN'>Open</SelectItem>
                      <SelectItem value='STARTED'>Started</SelectItem>
                      <SelectItem value='CLOSED'>Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='priority'
              defaultValue={ticket?.priority}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder='Priority...'
                          defaultValue={ticket?.priority}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='LOW'>Low</SelectItem>
                      <SelectItem value='MEDIUM'>Medium</SelectItem>
                      <SelectItem value='HIGH'>High</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div> */}
          <Button type='submit' disabled={isSubmitting}>
            {event ? 'Update event' : 'Create Event'}
          </Button>
        </form>
      </Form>
      <p className='text-destructive'>{error}</p>
    </div>
  )
}

export default EventForm
