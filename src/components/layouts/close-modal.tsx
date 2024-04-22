'use client';

import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button';
import { XIcon } from 'lucide-react';

export default function CloseModal() {
  const router = useRouter()
  
  return (
    <Button variant={'secondary'} 
      className='h-6 w-6 p-0 rounded-md' 
      onClick={() => router.back()}
    >
      <XIcon aria-label='close modal' className='h-4 w-4' />
    </Button>
  )
}
