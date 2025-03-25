// components/public/EventsFilter.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function EventsFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [category, setCategory] = useState(
    searchParams.get('category') || 'all'
  ) // Changed default to 'all'
  const [upcoming, setUpcoming] = useState(
    searchParams.get('upcoming') !== 'false'
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (category && category !== 'all') params.set('category', category) // Only add if not 'all'
    params.set('upcoming', upcoming.toString())

    router.push(`/events?${params.toString()}`)
  }

  function handleReset() {
    setLocation('')
    setCategory('all') // Reset to 'all' instead of empty string
    setUpcoming(true)
    router.push('/events')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='mb-8 p-4 border rounded-lg bg-card'
    >
      <div className='grid gap-4 md:grid-cols-3'>
        <div>
          <Label htmlFor='location' className='mb-2 block'>
            Location
          </Label>
          <Input
            id='location'
            placeholder='Enter city or venue'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor='category' className='mb-2 block'>
            Category
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id='category'>
              <SelectValue placeholder='Select category' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All categories</SelectItem>{' '}
              {/* Changed from empty string to 'all' */}
              <SelectItem value='lecture'>Lectures</SelectItem>
              <SelectItem value='workshop'>Workshops</SelectItem>
              <SelectItem value='gathering'>Community Gatherings</SelectItem>
              <SelectItem value='charity'>Charity Events</SelectItem>
              <SelectItem value='other'>Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-end'>
          <div className='flex items-center space-x-2 mb-[6px]'>
            <Switch
              id='upcoming'
              checked={upcoming}
              onCheckedChange={setUpcoming}
            />
            <Label htmlFor='upcoming'>Show upcoming events only</Label>
          </div>
        </div>
      </div>

      <div className='flex justify-between mt-4'>
        <Button type='button' variant='outline' onClick={handleReset}>
          Reset Filters
        </Button>
        <Button type='submit'>Apply Filters</Button>
      </div>
    </form>
  )
}
