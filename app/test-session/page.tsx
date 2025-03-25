// app/test-session/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

export default function TestSessionPage() {
  const { data: session, status } = useSession()
  const [apiSession, setApiSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchApiSession() {
      try {
        setLoading(true)
        const response = await fetch('/api/test-session')
        const data = await response.json()
        setApiSession(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchApiSession()
  }, [])

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-6'>Session Test Page</h1>

      <div className='mb-8 p-4 border rounded-lg bg-slate-50'>
        <h2 className='text-xl font-semibold mb-2'>
          Client-Side Session (useSession)
        </h2>
        <p>
          Status: <span className='font-mono'>{status}</span>
        </p>
        {status === 'authenticated' ? (
          <pre className='bg-gray-100 p-3 rounded mt-2 overflow-auto'>
            {JSON.stringify(session, null, 2)}
          </pre>
        ) : status === 'loading' ? (
          <p>Loading session...</p>
        ) : (
          <p className='text-orange-600'>Not authenticated</p>
        )}
      </div>

      <div className='p-4 border rounded-lg bg-slate-50'>
        <h2 className='text-xl font-semibold mb-2'>
          Server-Side Session (getServerSession)
        </h2>
        {loading ? (
          <p>Loading API session data...</p>
        ) : error ? (
          <p className='text-red-600'>Error: {error}</p>
        ) : (
          <pre className='bg-gray-100 p-3 rounded mt-2 overflow-auto'>
            {JSON.stringify(apiSession, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}
