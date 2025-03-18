'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
// import { getServerSession } from "next-auth/next";
import { Button } from '@/components/ui/button'
import { MainNav } from '@/components/layout/main-nav'
// import { authOptions } from "@/lib/auth";
// If you're using next-auth 4.22+ with the new useSession approach, remove getServerSession, etc.

export function Header() {
  // Access session data on the client side
  const { data: session } = useSession()
  // const session = await getServerSession(authOptions);

  // Local state to handle mobile nav toggle
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  function toggleMobileNav() {
    setIsMobileNavOpen((prev) => !prev)
  }

  return (
    <header className='sticky top-0 z-50 bg-white border-b shadow-sm'>
      {/* Primary Header Container */}
      <div className='container mx-auto flex items-center justify-between h-16 px-8'>
        {/* Logo or Brand Name */}
        <Link href='/' className='font-bold text-2xl text-emerald-600 px-6'>
          AIIT
        </Link>

        {/* Desktop Navigation */}
        {/* Hidden on mobile: only appears from md: breakpoint onwards */}
        <div className='hidden md:flex'>
          <MainNav isOpen={false} />
        </div>

        {/* Auth/User Buttons on Desktop */}
        {/* Hidden on mobile: only appears from md: breakpoint onwards */}
        <div className='ml-auto hidden md:flex items-center space-x-4'>
          {session ? (
            <>
              {session?.user?.role === 'ADMIN' && (
                <Button asChild variant='ghost'>
                  <Link href='/admin/dashboard'>Dashboard</Link>
                </Button>
              )}
              <Button asChild variant='ghost'>
                {/* <Link href="/api/auth/signout">Logout</Link> */}
                <Link href='/api/auth/signout?callbackUrl=/'>Logout</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant='ghost'>
                {/* <Link href="/login">Login</Link> */}
                <Link href='/api/auth/signin'>Login</Link>
              </Button>
              <Button asChild>
                <Link href='/register'>Register</Link>
              </Button>
            </>
          )}
        </div>

        {/* Hamburger Icon (mobile only) */}
        <button
          className='md:hidden p-2 text-gray-600 ml-2'
          onClick={toggleMobileNav}
          aria-label='Toggle Menu'
        >
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            strokeWidth={2}
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M4 6h16M4 12h16m-7 6h7'
            />
          </svg>
        </button>
      </div>

      {/* Mobile Slide-Down Menu */}
      {isMobileNavOpen && (
        <div className='md:hidden bg-white border-b shadow-sm p-4 flex flex-col space-y-4'>
          <MainNav isOpen={true} />

          {/* Auth/User Buttons on Mobile */}
          <div className='flex items-center space-x-4'>
            {session ? (
              <>
                {session?.user?.role === 'ADMIN' && (
                  <Button asChild variant='ghost'>
                    <Link href='/admin/dashboard'>Dashboard</Link>
                  </Button>
                )}
                <Button asChild variant='ghost'>
                  <Link href='/api/auth/signout'>Logout</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant='ghost'>
                  <Link href='/login'>Login</Link>
                </Button>
                <Button asChild>
                  <Link href='/register'>Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
