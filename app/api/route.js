import Audiobook from "@/models/audiobook"
import connectToDB from "@/utils/database"

export const GET = async (req, res) => {
    try {
        await connectToDB()

        const audiobooks = await Audiobook.find()
        
        if (!audiobooks) {
            console.log('no audiobooks found')
            return new Response({ status: 500 }) 
        }
        console.log(audiobooks)

        return new Response(JSON.stringify(audiobooks), { status: 200 })
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
}