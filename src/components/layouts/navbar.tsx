import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ModeToggle } from './mode-toggle'
import { Icons } from './icons'
import UserAccountNav from '../contents/user-account-nav'
import { getAuthSession } from '@/lib/auth'
import SearchBar from './search-bar'

export default async function Navbar() {
  const session = await getAuthSession()

  return (
    <div className='fixed top-0 inset-x-0 h-fit bg-primary z-10 
      border-b-2 border-primary/5 py-2 shadow'
    >
      <div className='container max-w-7xl flex items-center justify-between gap-2 '>
        <Link href='/' className={cn(
          'flex items-center space-x-2',
          buttonVariants({ variant: 'ghost2' })
        )}>
          <Icons.logo className='w-8 h-8 sm:w-6 sm:h-6' />
          <p className='hidden text-white font-brand text-sm font-bold md:block'>Breddit</p>
        </Link>

        {/* <SearchBar /> */}

        <div className='flex items-center space-x-2'>
          <ModeToggle />
          {session ? (
            <UserAccountNav user={session.user} />
          ) : (
            <Link href='/sign-in' className={cn(
              'bg-orange-700',
              buttonVariants({ size: 'sm', variant: 'primary' })
            )}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
