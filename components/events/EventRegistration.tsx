// components/events/EventRegistration.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2, LogIn } from 'lucide-react'
// import { toast } from '@/components/ui/sonner'

interface EventRegistrationProps {
  eventId: string
  isFull: boolean
  onRegistered: () => void
}

export function EventRegistration({
  eventId,
  isFull,
  onRegistered,
}: EventRegistrationProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isRegistering, setIsRegistering] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  const handleRegister = async () => {
    if (status !== 'authenticated') {
      router.push(`/login?callbackUrl=/events/${eventId}`)
      return
    }

    try {
      setIsRegistering(true)

      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: eventId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to register')
      }

      setIsRegistered(true)
      onRegistered()

      toast({
        title: 'Registration Successful',
        description: "You've successfully registered for this event.",
      })
    } catch (error) {
      console.error('Registration error:', error)
      toast({
        title: 'Registration Failed',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to register for event',
        variant: 'destructive',
      })
    } finally {
      setIsRegistering(false)
    }
  }

  if (isFull) {
    return (
      <Button disabled className='w-full'>
        Event is Full
      </Button>
    )
  }

  if (isRegistered) {
    return (
      <Button disabled className='w-full bg-green-600 hover:bg-green-600'>
        Registered ✓
      </Button>
    )
  }

  return (
    <Button
      onClick={handleRegister}
      disabled={isRegistering}
      className='w-full'
    >
      {isRegistering ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Registering...
        </>
      ) : status === 'authenticated' ? (
        'Register for Event'
      ) : (
        <>
          <LogIn className='mr-2 h-4 w-4' />
          Sign in to Register
        </>
      )}
    </Button>
  )
}
