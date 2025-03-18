'use client'
import dynamic from 'next/dynamic'
import React from 'react'

const EventForm = dynamic(() => import('@/components/public/EventForm'), {
  ssr: false,
})

const NewEvent = () => {
  return <EventForm />
}

export default NewEvent
