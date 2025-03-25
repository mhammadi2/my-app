// components/shared/ImageUpload.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FileUploader } from 'react-drag-drop-files'
import { Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  onUploadStart?: () => void
  onUploadEnd?: () => void
}

export function ImageUpload({
  value,
  onChange,
  onUploadStart,
  onUploadEnd,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileTypes = ['JPG', 'PNG', 'JPEG', 'WEBP']

  const uploadImage = async (file: File) => {
    if (!file) return

    setIsUploading(true)
    onUploadStart?.()

    // Create a form data object
    const formData = new FormData()
    formData.append('file', file)

    try {
      // Replace with your actual image upload endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Image upload failed')
      }

      const data = await response.json()
      onChange(data.url)
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setIsUploading(false)
      onUploadEnd?.()
    }
  }

  const handleChange = (file: File) => {
    uploadImage(file)
  }

  const removeImage = () => {
    onChange('')
  }

  return (
    <div className='space-y-4'>
      {value ? (
        <div className='relative rounded-md overflow-hidden w-full h-[200px]'>
          <Image
            src={value}
            alt='Uploaded image'
            fill
            className='object-cover'
          />
          <Button
            type='button'
            onClick={removeImage}
            variant='destructive'
            size='icon'
            className='absolute top-2 right-2'
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      ) : (
        <FileUploader
          handleChange={handleChange}
          name='file'
          types={fileTypes}
          disabled={isUploading}
        >
          <div className='border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-gray-400 cursor-pointer'>
            {isUploading ? (
              <div className='flex flex-col items-center'>
                <Loader2 className='h-8 w-8 animate-spin text-primary mb-2' />
                <p className='text-sm text-muted-foreground'>Uploading...</p>
              </div>
            ) : (
              <div className='flex flex-col items-center'>
                <Upload className='h-8 w-8 text-muted-foreground mb-2' />
                <p className='text-sm font-medium mb-1'>
                  Drag & drop an image or click to browse
                </p>
                <p className='text-xs text-muted-foreground'>
                  JPG, PNG, JPEG up to 10MB
                </p>
              </div>
            )}
          </div>
        </FileUploader>
      )}
    </div>
  )
}
