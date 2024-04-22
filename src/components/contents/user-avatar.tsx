import { AvatarProps } from '@radix-ui/react-avatar'
import { User } from 'next-auth'
import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { Avatar, AvatarFallback } from '../ui/avatar'
import Image from 'next/image'
import { Icons } from '../layouts/icons'

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, 'image' | 'name'>
}

export default function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar {...props}>
            {user.image ? (
              <Image
                fill
                sizes='100%'
                src={user.image}
                alt='profile picture'
                referrerPolicy='no-referrer'
              />
            ) : (
              <AvatarFallback>
                <span className='sr-only'>{user?.name}</span>
                <Icons.user className='h-4 w-4' />
              </AvatarFallback>
            )}
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>
          <p>{user.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
