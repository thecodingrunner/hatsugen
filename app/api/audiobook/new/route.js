import connectToDB from '../../../../utils/database'
import Audiobook from "@/models/audiobook";

export const POST = async (request) => {
  const { title, text, audioUrl, filepath, voiceType, thumbnailFilepath, thumbnailUrl } = await request.json();

  try {
    connectToDB()

    const newAudiobook = new Audiobook({ title, text, audioUrl, filepath, voiceType, thumbnailFilepath, thumbnailUrl });

    await newAudiobook.save();

    return new Response(JSON.stringify({ newAudiobook }), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
