'use client'

import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { useMutation } from "@tanstack/react-query"
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit"
import { startTransition, useState } from "react"
import { toast } from "sonner"
import { set } from "zod"

interface SubscribeLeaveToggleProps {
  isSubscribed: boolean
  subredditId: string
  subredditName: string
}

export default function SubscribeLeaveToggle({
  isSubscribed,
  subredditId,
  subredditName
}: SubscribeLeaveToggleProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const { mutate: subscribe, isPending: isSubLoading } = useMutation({
    mutationFn: async () => {
      setLoading(true)
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      }
      const res = await fetch('/api/subreddit/subscribe', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      return res.text()
    },
    onError: (err) => {
      console.error(`%>> Error: ${err}`)
      toast.error('There was a problem.', {
        description: 'Something went wrong. Please try again.',
      })
    },
    onSuccess: () => {
      startTransition(() => {
        setLoading(false)
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh()
      })
      toast.success('Subscribed!', {
        description: `You are now subscribed to r/${subredditName}`,
      })
    }
  })

  const { mutate: unsubscribe, isPending: isUnsubLoading } = useMutation({
    mutationFn: async () => {
      setLoading(true)
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      }
      const res = await fetch('/api/subreddit/unsubscribe', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      return res.text()
    },
    onError: (err) => {
      console.error(`%>> Error: ${err}`)
      toast.error('There was a problem.', {
        description: err.message
      })
    },
    onSuccess: () => {
      startTransition(() => {
        setLoading(false)
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh()
      })
      toast.success('Unsubscribed!', {
        description: `You are now unsubscribed from/${subredditName}`,
      })
    }
  })
  
  return isSubscribed ? (
    <Button
      variant={'red'}
      className='w-full mt-1 mb-4'
      isLoading={isUnsubLoading}
      disabled={isUnsubLoading || loading}
      onClick={() => unsubscribe()}
    >
      Leave community
    </Button>
  ) : (
    <Button
      variant={'red'}
      className='w-full mt-1 mb-4'
      isLoading={isSubLoading}
      disabled={isSubLoading || loading}
      onClick={() => subscribe()}>
      Join to post
    </Button>
  )
}
