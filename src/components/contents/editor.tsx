'use client'

import '@/styles/editor.css'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import EditorJS from '@editorjs/editorjs'
import { useForm } from 'react-hook-form'
import TextareaAutosize from 'react-textarea-autosize'
import { PostCreationRequest, PostValidator } from '@/lib/validators/post'
import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '../ui/button'

type FormData = z.infer<typeof PostValidator>

export default function Editor({ 
  subredditId 
}: {
  subredditId: string
}) {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId,
      title: '',
      content: null,
    },
  })
  const ref = useRef<EditorJS>()
  const _titleRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const pathname = usePathname()

  const { mutate: createPost } = useMutation({
    mutationFn: async ({
      title,
      content,
      subredditId,
    }: PostCreationRequest) => {
      setIsLoading(true)
      const payload: PostCreationRequest = { title, content, subredditId }
      const req = await fetch('/api/subreddit/post/create', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      // return req.json()
    },
    onError: () => {
      toast('Something went wrong.', {
        description: 'Your post was not published. Please try again.',
      })
    },
    onSuccess: () => {
      setIsLoading(false)
      // turn pathname /r/my-community/submit into /r/my-community
      const newPathname = pathname.split('/').slice(0, -1).join('/')
      router.push(newPathname)

      router.refresh()

      toast.success('Success', {
        description: 'Your post has been published.',
      })
    },
  })
  
  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default
    const Header = (await import('@editorjs/header')).default
    const Embed = (await import('@editorjs/embed')).default
    const Table = (await import('@editorjs/table')).default
    const List = (await import('@editorjs/list')).default
    const Code = (await import('@editorjs/code')).default
    const LinkTool = (await import('@editorjs/link')).default
    const InlineCode = (await import('@editorjs/inline-code')).default
    const ImageTool = (await import('@editorjs/image')).default

    if (!ref.current) {
      const editor = new EditorJS({
        holder: 'editor',
        onReady() {
          ref.current = editor
        },
        placeholder: 'Type here to write your post...',
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              // TODO: add /api/link
              endpoint: '/api/link',
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  // TODO: add upload image
                  // ---
                  // // upload to uploadthing
                  // const [res] = await uploadFiles([file], 'imageUploader')

                  // return {
                  //   success: 1,
                  //   file: {
                  //     url: res.fileUrl,
                  //   },
                  // }
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      })
    }
  }, [])

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        value
        toast.error('Something went wrong.', {
          description: (value as { message: string }).message,
        })
      }
    }
  }, [errors])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMounted(true)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      await initializeEditor()

      setTimeout(() => {
        _titleRef?.current?.focus()
      }, 0)
    }

    if (isMounted) {
      init()

      return () => {
        ref.current?.destroy()
        ref.current = undefined
      }
    }
  }, [isMounted, initializeEditor])

  async function onSubmit(data: FormData) {
    setIsLoading(true)
    const blocks = await ref.current?.save()

    const payload: PostCreationRequest = {
      title: data.title,
      content: blocks,
      subredditId,
    }

    createPost(payload)
  }

  if (!isMounted) {
    return null
  }

  const { ref: titleRef, ...rest } = register('title')

  return (
    <form 
      id='subreddit-post-form'
      onSubmit={handleSubmit(onSubmit)}
      className='w-fit space-y-2'
    >
      <div className='w-full p-4 bg-background/5 rounded-lg border-2 border-border '>
        <div className='prose prose-stone dark:prose-invert'>
          <TextareaAutosize
            ref={(e) => {
              titleRef(e)
              // @ts-ignore
              _titleRef.current = e
            }}
            {...rest}
            placeholder='Title'
            disabled={isLoading}
            className='w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none'
          />
          <div id='editor' className='min-h-[500px]' />
          <p className='text-sm text-gray-500'>
            Use{' '}
            <kbd className='rounded-md border bg-muted px-1 text-xs uppercase'>
              Tab
            </kbd>{' '}
            to open the command menu.
          </p>        
        </div>
      </div>
      
      <Button 
        type='submit' 
        className='w-full' 
        form='subreddit-post-form'
        disabled={isLoading}
        isLoading={isLoading}
      >
        Post
      </Button>
    </form>
  )
}
