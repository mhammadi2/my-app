// app/events/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  Edit,
  Trash2,
  ArrowLeft,
  Ticket,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
// import { useToast } from '@/components/ui/use-toast' // Fixed import
import { EditEventModal } from '@/components/events/EditEventModal'
import { EventRegistration } from '@/components/events/EventRegistration'

interface Event {
  id: string
  title: string
  description: string
  imageUrl: string
  location: string
  date: string
  startTime: string
  endTime: string
  category: string
  capacity: number
  registeredAttendees: number
  organizerId: string
  organizer: {
    id: string
    name: string
    image?: string
  }
}

export default function EventPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  // const { toast } = useToast() // Fixed usage
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Check if current user is the event organizer
  const isOrganizer = session?.user?.id === event?.organizerId
  // Check if the event has passed
  const isPastEvent = event ? new Date(event.date) < new Date() : false
  // Check if the event is full
  const isFull = event ? event.registeredAttendees >= event.capacity : false

  useEffect(() => {
    fetchEventDetails()
  }, [params.id])

  const fetchEventDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/events/${params.id}`)

      if (!response.ok) {
        throw new Error('Failed to fetch event details')
      }

      const data = await response.json()
      setEvent(data)
    } catch (error) {
      console.error('Error fetching event:', error)
      toast({
        title: 'Error',
        description: 'Could not load event details.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEvent = async () => {
    try {
      setIsDeleting(true)

      const response = await fetch(`/api/events/${params.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete event')
      }

      toast({
        title: 'Event Deleted',
        description: 'The event has been successfully removed.',
      })

      // Redirect back to events page
      router.push('/events')
    } catch (error) {
      console.error('Error deleting event:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete event. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEventUpdate = (updatedEvent: Event) => {
    setEvent(updatedEvent)
    setEditModalOpen(false)
    toast({
      title: 'Event Updated',
      description: 'Your event has been successfully updated.',
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: event?.title || 'Event',
          text: `Check out this event: ${event?.title}`,
          url: window.location.href,
        })
        .catch((error) => console.log('Error sharing:', error))
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          toast({
            title: 'Link Copied',
            description: 'Event link copied to clipboard',
          })
        })
        .catch((err) => console.error('Could not copy text: ', err))
    }
  }

  if (loading) {
    return (
      <div className='container mx-auto py-8 px-4'>
        <div className='animate-pulse'>
          <div className='h-8 bg-gray-200 rounded w-3/4 mb-4'></div>
          <div className='h-6 bg-gray-200 rounded w-1/2 mb-8'></div>
          <div className='h-96 bg-gray-200 rounded mb-6'></div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='md:col-span-2'>
              <div className='h-4 bg-gray-200 rounded w-full mb-4'></div>
              <div className='h-4 bg-gray-200 rounded w-full mb-4'></div>
              <div className='h-4 bg-gray-200 rounded w-5/6 mb-4'></div>
            </div>
            <div>
              <div className='h-40 bg-gray-200 rounded mb-4'></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className='container mx-auto py-16 px-4 text-center'>
        <h1 className='text-2xl font-bold mb-4'>Event Not Found</h1>
        <p className='mb-8'>
          The event you're looking for might have been removed or doesn't exist.
        </p>
        <Button asChild>
          <Link href='/events'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Events
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className='container mx-auto py-8 px-4'>
      <div className='mb-6'>
        <Link
          href='/events'
          className='inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Events
        </Link>
      </div>

      <div className='flex flex-col md:flex-row justify-between items-start gap-4 mb-6'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>{event.title}</h1>
          <div className='flex items-center mt-2'>
            <Badge variant='outline' className='mr-2'>
              {event.category}
            </Badge>
            {isPastEvent && <Badge variant='secondary'>Past Event</Badge>}
          </div>
        </div>

        {isOrganizer && (
          <div className='flex space-x-2'>
            <Button
              variant='outline'
              onClick={() => setEditModalOpen(true)}
              className='flex items-center'
            >
              <Edit className='mr-2 h-4 w-4' />
              Edit
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant='destructive'
                  className='flex items-center'
                  disabled={isDeleting}
                >
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the event and remove all data associated with it.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteEvent}
                    className='bg-red-500 hover:bg-red-600'
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Event'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        <div className='md:col-span-2 space-y-8'>
          <div className='relative w-full h-[400px] rounded-lg overflow-hidden'>
            <Image
              src={event.imageUrl || '/images/event-placeholder.jpg'}
              alt={event.title}
              fill
              className='object-cover'
              priority
            />
          </div>

          <div>
            <h2 className='text-xl font-semibold mb-4'>About This Event</h2>
            <div className='prose max-w-none'>
              {event.description.split('').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div>
            <h2 className='text-xl font-semibold mb-4'>Organizer</h2>
            <div className='flex items-center'>
              <div className='relative w-12 h-12 rounded-full overflow-hidden mr-4'>
                <Image
                  src={event.organizer.image || '/images/user-placeholder.jpg'}
                  alt={event.organizer.name}
                  fill
                  className='object-cover'
                />
              </div>
              <div>
                <p className='font-medium'>{event.organizer.name}</p>
                <p className='text-sm text-muted-foreground'>Event Organizer</p>
              </div>
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>Information about the event</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-start'>
                <Calendar className='h-5 w-5 mr-3 mt-0.5 text-muted-foreground' />
                <div>
                  <p className='font-medium'>Date</p>
                  <p className='text-muted-foreground'>
                    {format(new Date(event.date), 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
              </div>

              <div className='flex items-start'>
                <Clock className='h-5 w-5 mr-3 mt-0.5 text-muted-foreground' />
                <div>
                  <p className='font-medium'>Time</p>
                  <p className='text-muted-foreground'>
                    {event.startTime} - {event.endTime}
                  </p>
                </div>
              </div>

              <div className='flex items-start'>
                <MapPin className='h-5 w-5 mr-3 mt-0.5 text-muted-foreground' />
                <div>
                  <p className='font-medium'>Location</p>
                  <p className='text-muted-foreground'>{event.location}</p>
                </div>
              </div>

              <div className='flex items-start'>
                <Users className='h-5 w-5 mr-3 mt-0.5 text-muted-foreground' />
                <div>
                  <p className='font-medium'>Capacity</p>
                  <p className='text-muted-foreground'>
                    {event.registeredAttendees} / {event.capacity} registered
                  </p>
                  <div className='w-full bg-gray-200 rounded-full h-2.5 mt-2'>
                    <div
                      className='bg-primary h-2.5 rounded-full'
                      style={{
                        width: `${
                          (event.registeredAttendees / event.capacity) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex flex-col items-stretch gap-3'>
              {!isOrganizer && !isPastEvent ? (
                <EventRegistration
                  eventId={event.id}
                  isFull={isFull}
                  onRegistered={() => {
                    // Refresh event details to update attendance count
                    fetchEventDetails()
                  }}
                />
              ) : isPastEvent ? (
                <Button disabled className='w-full'>
                  <Calendar className='mr-2 h-4 w-4' />
                  Event Has Ended
                </Button>
              ) : (
                <Button asChild variant='outline' className='w-full'>
                  <Link href={`/events/${event.id}/manage`}>
                    <Users className='mr-2 h-4 w-4' />
                    Manage Attendees
                  </Link>
                </Button>
              )}

              <Button
                onClick={handleShare}
                variant='outline'
                className='w-full'
              >
                <Share2 className='mr-2 h-4 w-4' />
                Share Event
              </Button>
            </CardFooter>
          </Card>

          {!isPastEvent && (
            <Button asChild variant='outline' className='w-full'>
              <Link href={`/events/${event.id}/tickets`}>
                <Ticket className='mr-2 h-4 w-4' />
                View Ticket Options
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Edit Event Modal */}
      <EditEventModal
        event={event}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdateEvent={handleEventUpdate}
      />
    </div>
  )
}
