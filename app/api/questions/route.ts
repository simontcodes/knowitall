import { NextResponse } from "next/server"
import { quizCreationSchema } from "@/schemas/form/quiz"
import { ZodError } from "zod"
import { strict_output } from "@/lib/gpt"

export const GET = async (req: Request, res: Response) => {
    return NextResponse.json({
        message: "hello"
    })
}


// POST /api/questions

export const POST = async (req: Request, res: Response) => {
    try {
        const body = await req.json()

        console.log(body)
    const {amount, topic, type} = quizCreationSchema.parse(body)
    let questions: any
    if (type === "open_ended") {
        questions = await strict_output("You are a helpful AI that is able to generate a pair of question and answers, the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array",
        new Array(amount).fill(`You Are to generate a random hard open-ended question about ${topic}`)
     , {
            question: 'question',
            answer: 'answer with a max of 15 words'
        })
    } else if(type === 'mcq') {
        questions = await strict_output(
            "You are a helpful AI that is able to generate mcq quiestions and answers, the length of each answer should not exceed 15 words",
            new Array(amount).fill(`You are to generate a random mcq question about ${topic}`),
            {
                question: 'question',
                answer: 'answer with max length of 15 words' ,
                option1: '1st option with max lenght of 15 words',
                option2: '2nd option with max lenght of 15 words',
                option3: '3rd option with max lenght of 15 words',
            }
        )
    }
    return NextResponse.json({
        Questions: questions
    }, {
        status: 200
    })
        
    } catch (error) {
        console.log(error)
        if(error instanceof ZodError) {
            return NextResponse.json({
                error: error.issues
            },
            {
                status: 400.
            })
        }
    }
    
}