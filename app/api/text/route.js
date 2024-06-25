import OpenAI from "openai";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebaseConfig";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (request) => {
  const initialAudioUrl = await request.json();
  console.log(initialAudioUrl)

  async function main() {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(initialAudioUrl),
      model: "whisper-1",
    });
  
    console.log(transcription.text);
  }
  main();

//   try {
//     async function generateAndUploadAudio(text, voice) {
//       const mp3 = await openai.audio.speech.create({
//         model: "tts-1",
//         voice: voice,
//         input: text,
//       });
//       const buffer = Buffer.from(await mp3.arrayBuffer());

//       // Generate a unique filename
//       const filename = `${Date.now()}-audio.mp3`;

//       // Create a reference to the file location in Firebase Storage
//       const storageRef = ref(storage, `audios/${filename}`);

//       // Upload the file
//       await uploadBytes(storageRef, buffer);

//       // Get the download URL
//       const downloadURL = await getDownloadURL(storageRef);

//       return { downloadURL, filename };
//     }

//     const urls = await generateAndUploadAudio(text, voice);
//     const audioUrl = urls.downloadURL;
//     console.log("Audio uploaded, URL:", audioUrl);

//     return new Response(
//       JSON.stringify({ audioUrl, filepath: `audios/${urls.filename}` }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error:", error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//     });
//   }
};
