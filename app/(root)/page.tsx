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
    <div className='mt-9 flex flex-col gap-9 max-h-screen'>
      <section className='flex flex-col gap-5'>
        <h1 className='text-20 font-bold text-white-1'>Trending Podcasts</h1>
        <div className="grid grid-cols-3 gap-10">
          {audiobooks.map(({_id, thumbnailUrl, title}: Audiobook) => (
            <div className='p-4 bg-[#1E1E1E] flex flex-col gap-2' key={_id}>
              <img src={thumbnailUrl} width={300} height={300} alt='thumbnail' />
              <Link href={`/listen/${_id}`} className='text-lg text-[#D9D9D9]'>{title}</Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home