'use client'

import type { Session } from "next-auth"
import { usePathname, useRouter } from "next/navigation"
import UserAvatar from "./user-avatar"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { ImageIcon, Link2Icon } from "lucide-react"


interface MiniCreatePostProps {
  session: Session | null
}

export default function MiniCreatePost({ session }: MiniCreatePostProps) {
  const router = useRouter()
  const pathname = usePathname()
  const path = pathname + '/submit'
  
  return (
    <div className="overflow-hidden rounded-md bg-background border border-border shadow">
      <div className="h-full px-6 py-4 flex justify-between gap-6">
        <div className='relative'>
          <UserAvatar
            user={{
              name: session?.user.name || null,
              image: session?.user.image || null,
            }}
          />

          <span className='absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-500 outline outline-2 outline-white' />
        </div>
        <Input
          onClick={() => router.push(path)}
          readOnly
          placeholder='Create post'
        />
        <Button
          onClick={() => router.push(path)}
          variant='ghost'>
          <ImageIcon className='text-zinc-600' />
        </Button>
        <Button
          onClick={() => router.push(path)}
          variant='ghost'>
          <Link2Icon className='text-zinc-600' />
        </Button>
      </div>
    </div>
  )
}
