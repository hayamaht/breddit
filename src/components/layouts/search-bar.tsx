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
      console.log(`query: ${input}`)
      if (!input) return []
      const { data } = await axios.get(`/api/search?q=${input}`)
      console.log(data)
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
    <Command ref={commandRef} className="relative max-w-lg bg-secondary">
      <CommandInput
        isLoading={isFetching}
        onValueChange={(text) => {
          setInput(text)
          debounceRequest()
        }}
        value={input}
        placeholder='Search'
        className='outline-none border-none focus:border-none focus:outline-none ring-0'
      />

      {input.length > 0 && (
        <CommandList>
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
          {!queryResults || queryResults.length === 0 ? null : (
            <CommandGroup heading='Communities'>
              {queryResults?.map((subreddit) => (
                <CommandItem
                  key={subreddit.id}
                  value={subreddit.name}>
                  <UsersIcon className='mr-2 h-4 w-4' />
                  <a href={`/r/${subreddit.name}`}>r/{subreddit.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      )}
    </Command>
  )
}
