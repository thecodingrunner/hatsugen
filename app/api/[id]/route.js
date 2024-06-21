import Audiobook from "@/models/audiobook"
import connectToDB from "@/utils/database"

export const GET = async (request, { params }) => {
    try {
        await connectToDB()

        const audiobook = await Audiobook.find({ _id: params.id })
        
        if (!audiobook) {
            console.log('no audiobook found')
            return new Response({ status: 500 }) 
        }
        console.log(audiobook)

        return new Response(JSON.stringify(audiobook), { status: 200 })
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
}