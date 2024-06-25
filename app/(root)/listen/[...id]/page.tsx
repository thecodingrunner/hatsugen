"use client"
import AudioPlayer from '@/components/AudioPlayer'
import { Audiobook } from '@/types'
import React, { useEffect, useState } from 'react'
import { object } from 'zod'

const page = ({ params }: { params: { id: string } }) => {
    const [audiobook, setAudiobook] = useState<Audiobook>()

    const id = params.id
    console.log(id)

    useEffect(() => {
        async function getAudiobook() {
          const response = await fetch(`/api/${id}`, {
            method: "GET",
          });
          console.log(response)
          const audiobook = await response.json()
          // setAudiobooks(audiobooks)
          console.log(audiobook)
          setAudiobook(audiobook[0])
        }
        getAudiobook()
      }, [])

  return (
    <div className='bg-white rounded-xl'>
        {audiobook && (
          <>
            <div className='h-[84vh] overflow-y-auto p-10'>
                <h1 className='text-4xl mb-4 text-center'>{audiobook.title}</h1>
                <div className='flex justify-center my-10'>
                    <img src={audiobook.thumbnailUrl} width={500} height={500} />
                </div>
                <p className='text-2xl pb-10'>{audiobook.text}</p>
            </div>
            <AudioPlayer audioUrl={audiobook.audioUrl} thumbnailUrl={audiobook.thumbnailUrl} title={audiobook.title} text={audiobook.text} />
          </>
        )}
    </div>
  )
}

export default page