'use client'

import { DropdownMenu } from "@radix-ui/react-dropdown-menu"
import { User } from "next-auth"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import Link from "next/link"
import { signOut } from "next-auth/react"
import Image from "next/image"
import UserAvatar from "./user-avatar"

interface UserAccountNavProps {
  user: User
}

export default function UserAccountNav({ user }: UserAccountNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar 
          user={user} 
          className='h-8 w-8' 
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className='gap-3 p-2'>
          <div className='space-y-1 leading-none'>
            {user.name && <p className='font-medium'>{user.name}</p>}
            {user.email && (
              <p className='w-11/12 truncate text-sm text-muted-foreground'>
                {user.email} 
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href={'/'}>Feed</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={'/r/create'}>Create Community</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={'/settings'}>Setting</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className='cursor-pointer'
          onSelect={(event) => {
            event.preventDefault()
            signOut({
              callbackUrl: `/sign-in`,
            })
          }}>
          Sign out
          
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
