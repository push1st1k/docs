import React, { useState } from 'react'

import Image from 'next/image'

export default function ImageBlock(props) {
  const { alt, src } = props
  const [imageURL] = useState(src)

  if (!props.height || !props.width) {
    return (
      <span className='block mt-3'>
        <img src={imageURL} alt={alt} className='max-h-[600px] mx-auto'></img>
        {alt && <span className='block mt-1 mb-4 text-sm text-center text-secondary'>{alt}</span>}
      </span>
    )
  }

  return (
    <span className='block mt-3'>
      <Image {...props} className='max-h-[600px] mx-auto' layout='responsive' />
      {alt && <span className='block mt-1 mb-4 text-sm text-center text-secondary'>{alt}</span>}
    </span>
  )
}
