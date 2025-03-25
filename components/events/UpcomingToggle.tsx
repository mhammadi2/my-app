// components/events/UpcomingToggle.tsx
'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface UpcomingToggleProps {
  isUpcoming?: boolean
}

export default function UpcomingToggle({ isUpcoming = false }: UpcomingToggleProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleToggleChange = (checked: boolean) => {
    // Create a new URLSearchParams instance for modification
    const params = new URLSearchParams(searchParams.toString())
    
    if (checked) {
      params.set('upcoming', 'true')
    } else {
      params.delete('upcoming')
    }
    
    // Reset to page 1 when filter changes
    params.set('page', '1')
    
    // Navigate to the new URL
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="upcoming-toggle" 
        checked={isUpcoming}
        onCheckedChange={handleToggleChange}
      />
      <Label htmlFor="upcoming-toggle">Show upcoming events only</Label>
    </div>
  )
}
