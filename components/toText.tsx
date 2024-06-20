// import { promises as fs } from 'fs';
// import OpenAI from 'openai';
// import React from 'react'

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export default async function toText(podcastFile: string) {
//     const transcription = await openai.audio.transcriptions.create({
//       file: fs.readFile(podcastFile),
//       model: "whisper-1",
//       response_format: "text",
//     });

//     console.log(transcription.text)

//     return transcription.text
// }