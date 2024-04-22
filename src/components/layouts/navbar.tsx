import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ModeToggle } from './mode-toggle'

export default async function Navbar() {
  // const session = await getAuthSession()

  return (
    <div className='fixed top-0 inset-x-0 h-fit bg-primary z-50 
      border-b-2 border-primary/5 py-2 shadow'
    >
      <div className='container flex items-center justify-between gap-2 '>
        <Link href='/' className='flex gap-1 items-center'>
          {/* <Icons.logo className='w-8 h-8 sm:w-6 sm:h-6' /> */}
          <p className='hidden text-white font-brand text-sm font-bold md:block'>Breddit</p>
        </Link>

        {/* TODO: add search bar */}
        {/* <SearchBar /> */}

        <div className='flex items-center space-x-2'>
          <ModeToggle />
          {/* {session ? (
            <UserAccountNav user={session.user} />
          ) : ( */}
            <Link href='/sign-in' className={cn(
              'bg-orange-700',
              // buttonVariants({ size: 'sm', variant: 'primary' })
            )}>
              Sign In
            </Link>
          {/* )} */}
        </div>
      </div>
    </div>
  )
}
