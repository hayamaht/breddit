'use client'

import { useOnClickOutside } from "@/hooks/use-onclick-outside"
import { usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import debounce from 'lodash.debounce'
import { useQuery } from "@tanstack/react-query"
import { Prisma, Subreddit } from "@prisma/client"
import axios from "axios"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { UsersIcon } from "lucide-react"
import Link from "next/link"

export default function SearchBar() {
  const [input, setInput] = useState<string>('')
  const pathname = usePathname()
  const commandRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useOnClickOutside(commandRef, () => {
    setInput('')
  })

  const request = debounce(async () => {
    refetch()
  }, 300)

  const debounceRequest = useCallback(() => {
    request()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const {
    isFetching,
    data: queryResults,
    refetch,
    isFetched,
  } = useQuery({
    queryFn: async () => {
      if (!input) return []
      const { data } = await axios.get(`/api/search?q=${input}`)
      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType
      })[]
    },
    queryKey: ['search-query'],
    enabled: false,
  })

  useEffect(() => {
    setInput('')
  }, [pathname])
  
  return (
    <Command
      ref={commandRef}
      className='max-w-sm bg-secondary border z-50'>
      <CommandInput
        isLoading={isFetching}
        onValueChange={(text) => {
          setInput(text)
          debounceRequest()
        }}
        value={input}
        className='outline-none border-none focus:border-none focus:outline-none ring-0'
        placeholder='Search communities...'
      />

      {input.length > 0 && (
        <CommandList className='absolute bg-secondary top-full inset-x-0 shadow rounded-md'>
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading='Communities'>
              {queryResults?.map((subreddit) => (
                <CommandItem
                  onSelect={(e) => {
                    router.push(`/r/${e}`)
                    router.refresh()
                  }}
                  key={subreddit.id}
                  value={subreddit.name}>
                  <UsersIcon className='mr-2 h-4 w-4' />
                  {/* <a href={`/r/${subreddit.name}`}>r/{subreddit.name}</a> */}
                  <Link href={`/r/${subreddit.name}`}>r/{subreddit.name}</Link>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      )}
    </Command>
  )
}
