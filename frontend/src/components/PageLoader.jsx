import { LoaderIcon } from 'lucide-react'
import React from 'react'

function PageLoader() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
        <LoaderIcon className='animate-spin text-primary' />
    </div>
  )
}

export default PageLoader