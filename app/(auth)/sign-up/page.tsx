import SignUp from '@/components/SignUp'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='w-screen h-screen flex items-center justify-center bg-[#1E1E1E]'>
        <Link
          href="/"
          className="flex cursor-pointer items-center pb-10 max-lg:justify-center absolute left-10 top-10"
        >
          <Image
            src="/icons/wave-white.svg"
            alt="logo"
            width={40}
            height={40}
            className="mr-2"
          />
          <h1 className="text-24 font-extrabold text-white max-lg:hidden">
            Hatsugen
          </h1>
        </Link>
        <SignUp />
    </div>
  )
}

export default page