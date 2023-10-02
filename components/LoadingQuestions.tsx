import Image from 'next/image'
import React from 'react'
import { Progress } from './ui/progress'

type LoadingQuestionsProps = {
  finished: boolean
}

const loadingTexts = ["Preparing a brain-teasing challenge...",
"Brewing up some mind-bending queries...",
"Loading your daily dose of trivia...",
"Creating a quiz that will test your knowledge...",
"Gathering questions to challenge your wits..."]

const LoadingQuestions = ({finished}: LoadingQuestionsProps) => {
  const[progress, setProgress] = React.useState(0)
  const[loadingText, setLoadingText] = React.useState(loadingTexts[0])

  React.useEffect(()=>{
    const interval = setInterval(()=>{
      const randomIndex = Math.floor(Math.random() * loadingTexts.length)
      setLoadingText(loadingTexts[randomIndex])
    }, 3000)
    return () => clearInterval(interval)
  },[])

  React.useEffect(()=>{
    //each 100 miliseconds the bar will go up 0.5
    const interval = setInterval(()=>{
      setProgress(prev => {
        if(finished) return 100
        //to get the bar back to 0
        if(prev === 100){
          return 0
        }
        //to randomly move faster
        if(Math.random() < 0.1) {
          return prev + 2
        }
        return prev + 0.5
      })
    },100)
    return () => clearInterval(interval)
  },[finished])
  return (
    <div className=' absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] md:w-[60vw] flex flex-col items-center'>
      <Image src={'/loading.gif'}
      width={400}
      height={400}
      alt='loading animation'
      >

      </Image>
     
      <a href="https://storyset.com/people">People illustrations by Storyset</a>
      <Progress value={progress} className=' w-full mt-4'/>
      <h1 className=' mt-2 text-xl'>{loadingText}</h1>
    </div>
  )
}

export default LoadingQuestions