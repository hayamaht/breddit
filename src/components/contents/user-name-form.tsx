'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { UsernameValidator } from '@/lib/validators/username'
import { z } from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, 'id' | 'username'>
}

export default function UserNameForm({ 
  user, className, ...props 
}: UserNameFormProps) {
  const router = useRouter()
  const form = useForm<z.infer<typeof UsernameValidator>>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      name: user?.username || '',
    },
  })

  const { mutate: updateUsername, isPending } = useMutation({
    mutationFn: async ({name}: any) => {
      const payload = { name }

      const { data } = await axios.patch(`/api/username/`, payload)
      return data
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          toast.error('Username already taken.', {
            description: 'Please choose another username.',
          })
        }
      }

      toast.error('Something went wrong.', {
        description: 'Your username was not updated. Please try again.',
      })
    },
    onSuccess: () => {
      toast('Successful', {
        description: 'Your username has been updated.',
      })
      router.refresh()
    },
  })


  function onSubmit(values: z.infer<typeof UsernameValidator>) {
    updateUsername(values.name)
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
        <FormField 
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" 
          isLoading={isPending}
          disabled={isPending}
          className="mt-4"
        >Save</Button>

      </form>
    </Form>
  )
}
