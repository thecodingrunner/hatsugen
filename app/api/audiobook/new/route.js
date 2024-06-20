import connectToDB from '../../../../utils/database'
import Audiobook from "@/models/audiobook";

export const POST = async (request) => {
  const { text, audioUrl, filepath, voiceType, thumbnailFilepath, thumbnailUrl } = await request.json();
  console.log(text, audioUrl, filepath, voiceType);
  try {
    connectToDB()

    const newAudiobook = new Audiobook({ text, audioUrl, filepath, voiceType, thumbnailFilepath, thumbnailUrl });

    await newAudiobook.save();

    return new Response(JSON.stringify({ newAudiobook }), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
