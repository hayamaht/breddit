'use client'

import '@/styles/editor.css'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { PostCreationRequest, PostValidator } from '@/lib/validators/post'

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

  async function onSubmit(data:FormData) {
    
  }
  
  return (
    <div className='w-full p-4 bg-background/5 rounded-lg border-2 border-border'>
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className='w-fit'
      >
        <div className='prose prose-stone dark:prose-invert'>
          {/* <TextareaAutosize
            ref={(e) => {
              titleRef(e)
              // @ts-ignore
              _titleRef.current = e
            }}
            {...rest}
            placeholder='Title'
            className='w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none'
          /> */}
          <div id='editor' className='min-h-[500px]' />
          <p className='text-sm text-gray-500'>
            Use{' '}
            <kbd className='rounded-md border bg-muted px-1 text-xs uppercase'>
              Tab
            </kbd>{' '}
            to open the command menu.
          </p>        
        </div>
      </form>
    </div>
  )
}
