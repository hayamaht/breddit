'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CreatePostPage() {
  const router = useRouter()
  const [input, setInput] = useState<string>('')

  
  return (
    <div className='container flex items-center h-full max-w-xl'>
      <div className='relative bg-background w-full h-fit p-4 rounded-lg space-y-6'>
        <div className='flex justify-between items-center'>
          <h1 className='text-xl font-semibold'>Create a Community</h1>
        </div>

        <hr className='bg-primary h-px' />

        <div>
          <p className='text-lg font-medium'>Name</p>
          <p className='text-xs pb-2'>
            Community names including capitalization cannot be changed.
          </p>
          <div className='relative'>
            <p className='absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400'>
              r/
            </p>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className='pl-6'
            />
          </div>
        </div>

        <div className='flex justify-end gap-4'>
          <Button
            // disabled={isLoading}
            variant='default'
            onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            // isLoading={isLoading}
            disabled={input.length === 0}
            // onClick={() => createCommunity()}
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  )
}
