'use client'
import { toast } from "sonner"
import { cn } from '@/lib/utils'
import { HTMLAttributes, useState } from 'react'
import { Button } from '../ui/button'
import { Icons } from '../layouts/icons'

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {}

export default function UserAuthForm({ 
  className, ...props 
}: UserAuthFormProps) {
  const [isLoadingGoogle, setIsLoadingGoogle] = useState<boolean>(false)
  const [isLoadingGithub, setIsLoadingGithub] = useState<boolean>(false)

  const loginWith = async (provider: 'google' | 'github') => {
    const setLoading = provider === 'google' ? setIsLoadingGoogle : setIsLoadingGithub

    toast(`Logging in with ${provider}...`)

    setLoading(true)
    try {
      // TODO: use next-auth signIn()
      // await signIn(provider)
    } catch (error) {
      toast.error('Error', {
        description: `There was an error logging in with ${provider}`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn('space-y-2', className)} {...props}>
      <Button
        isLoading={isLoadingGoogle}
        type='button'
        size='sm'
        className='w-full'
        onClick={() => loginWith('google')}
        disabled={isLoadingGoogle}>
        {isLoadingGoogle ? null : <Icons.google className='h-4 w-4 mr-2' />}
        Google
      </Button>
      <Button
        isLoading={isLoadingGithub}
        type='button'
        size='sm'
        className='w-full'
        onClick={() => loginWith('github')}
        disabled={isLoadingGithub}>
        {isLoadingGithub ? null : <Icons.github className='h-4 w-4 mr-2' />}
        Github
      </Button>
    </div>
    
  )
}
