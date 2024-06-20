import OpenAI from "openai";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebaseConfig";

// Ensure the OpenAI instance is created with the correct API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (request) => {
  try {
    // Parse the request JSON
    const req = await request.json();
    const prompt = req.thumbnailPrompt;
    console.log(prompt);

    // Function to generate and upload the thumbnail
    async function generateAndUploadThumbnail(prompt) {
      // Generate the image using OpenAI
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      });

      const thumbnailUrl = response.data[0].url;
      console.log(thumbnailUrl);

      // Fetch the image as a buffer
      const responseBuffer = await fetch(thumbnailUrl);
      const buffer = Buffer.from(await responseBuffer.arrayBuffer());

      // Generate a unique filename
      const filename = `${Date.now()}-thumbnail.jpg`;

      // Create a reference to the file location in Firebase Storage
      const storageRef = ref(storage, `thumbnails/${filename}`);

      // Upload the file
      await uploadBytes(storageRef, buffer);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);

      return { downloadURL, filename };
    }

    // Generate and upload the thumbnail
    const urls = await generateAndUploadThumbnail(prompt);
    console.log('Thumbnail generated and uploaded, URL:', urls.downloadURL);

    // Return the URL in the response
    return new Response(JSON.stringify({ thumbnailUrl: urls.downloadURL, filepath: `thumbnails/${urls.filename}` }), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};