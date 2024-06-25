"use client";

import { Audiobook } from '@/types';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { array } from 'zod';

const Home = () => {
  const [audiobooks, setAudiobooks] = useState<any>([])

  useEffect(() => {
    async function getAudiobooks() {
      const response = await fetch(`/api`, {
        method: "GET",
      });
      console.log(response)
      const audiobooks = await response.json()
      // setAudiobooks(audiobooks)
      console.log(audiobooks)
      setAudiobooks(audiobooks)
    }
    getAudiobooks()
  }, [])

  return (
    <div className='flex flex-col gap-9 max-h-screen bg-[#D9D9D9] p-6 rounded-xl overflow-y-auto'>
      <section className='flex flex-col gap-5'>
        <h1 className='text-3xl font-bold text-white-1'>Your Audiobooks</h1>
        <div className="grid grid-cols-3 gap-10">
          {audiobooks && (
            audiobooks.map(({_id, thumbnailUrl, title, text}: Audiobook) => (
            <div className='bg-transparent flex flex-col gap-2' key={_id}>
              <div className='rounded-lg overflow-hidden w-full h-full'>
                <img src={thumbnailUrl} alt='thumbnail' className='object-cover' />
              </div>
              <Link href={`/listen/${_id}`} className='text-[#1E1E1E]'>
                <h2 className='text-lg'>{title}</h2>
                <p className='text-sm'>{text.slice(0,30)}...</p>
              </Link>
            </div>
          ))
          )}
        </div>
      </section>
    </div>
  )
}

export default Home