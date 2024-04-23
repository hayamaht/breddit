'use client'

import CustomCodeRenderer from '@/components/renderers/custom-code'
import CustomImageRenderer from '@/components/renderers/custom-image'
import dynamic from 'next/dynamic'

const Output = dynamic(
  async () => (await import('editorjs-react-renderer')).default,
  { ssr: false }
)

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
}

const style = {
  paragraph: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
}

export default function EditorOutput({
  content,
}: {
  content: any
}) {
  return (
    <Output
      style={style}
      className='text-sm'
      renderers={renderers}
      data={content}
    />
  )
}
