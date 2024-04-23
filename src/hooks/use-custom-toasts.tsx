import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from "sonner"

export const useCustomToasts = () => {
  const loginToast = () => {
    toast('Login request', {
      description: 'You must be logged in to do that.',
      action: (
        <Link
          onClick={() => toast.dismiss()}
          href='/sign-in'
          className={buttonVariants({ variant: 'outline' })}>
          Login
        </Link>
      ),
    })
  }
  return { loginToast }
}