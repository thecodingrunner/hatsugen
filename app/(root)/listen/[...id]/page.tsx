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
    <div>
        {audiobook && (
            <AudioPlayer audioUrl={audiobook.audioUrl} thumbnailUrl={audiobook.thumbnailUrl} title={audiobook.title} />
        )}
    </div>
  )
}

export default page