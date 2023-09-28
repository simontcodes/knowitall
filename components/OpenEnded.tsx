"use client";
import { formatTimeDelta } from "@/lib/utils";
import { Game, Question } from "@prisma/client";
import { differenceInSeconds } from "date-fns";
import { ChevronRight, Loader2, Timer } from "lucide-react";
import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { z } from "zod";
import { checkAnswerSchema } from "@/schemas/form/quiz";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import BlankAnswerInput from "./BlankAnswerInput";

type Props = {
	game: Game & { questions: Pick<Question, "id" | "question" | "answer">[] };
};

const OpenEnded = ({ game }: Props) => {
	const { toast } = useToast();
	const [questionIndex, setQuestionIndex] = React.useState(0);
	const [hasEnded, setHasEnded] = React.useState(false);
	const [now, setNow] = React.useState<Date>(new Date());
    const [blankAnswer, setBlankAnswer] = React.useState<string>("")

	//checks for the time every second
	React.useEffect(() => {
		const interval = setInterval(() => {
			if (!hasEnded) {
				setNow(new Date());
			}
		}, 1000);
		return () => {
			//clears interval to avoid memory leaks
			clearInterval(interval);
		};
	}, [hasEnded]);

	const currentQuestion = React.useMemo(() => {
		return game.questions[questionIndex];
	}, [questionIndex, game.questions]);

	const { mutate: checkAnswer, isLoading: isChecking } = useMutation({
		mutationFn: async () => {
            let filledAnswer = blankAnswer
            document.querySelectorAll("#user-blank-input").forEach((input) =>{
                filledAnswer = filledAnswer.replace("_____", input.value)
                input.value = ""
                
            })
            console.log(filledAnswer)
			const payload: z.infer<typeof checkAnswerSchema> = {
				questionId: currentQuestion.id,
				userAnswer: filledAnswer,
			};
			const response = await axios.post("/api/check-answer", payload);
			return response.data;
		},
	});

	const handleNext = React.useCallback(() => {
		if (isChecking) return;
		checkAnswer(undefined, {
			onSuccess: ({ percentageSimilar }) => {
				toast: ({
					title: `Your answer is ${percentageSimilar}% to the correct answer`,
					description: "answer are matched based on similarity comparisons",
				});

				setQuestionIndex((prevIndex) => {
					if (prevIndex === game.questions.length - 1) {
						setHasEnded(true);
						return prevIndex + 1; // Keep the index the same
					}
					return prevIndex + 1; // Increment the index
				});
			},
		});
	}, [checkAnswer, toast, isChecking, game.questions.length]);

	React.useEffect(() => {
		const eventListener = (e: KeyboardEvent) => {
			const key = e.key;
			if (key === "Enter") {
				handleNext();
			}
		};
		document.addEventListener("keydown", eventListener);
		return () => {
			// Clean up the event listener when the component unmounts
			document.removeEventListener("keydown", eventListener);
		};
	}, [handleNext]);

	return (
		<div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw]">
			<div className=" flex flex-row justify-between">
				<div className="flex flex-col">
					{/* Topic */}
					<p>
						<span className=" text-slate-400 mr-2">Topic</span>
						<span className=" px-2 py-1 text-white rounded-lg bg-slate-800">
							{game.topic}
						</span>
					</p>
					<div className="flex self-start mt-3 text-slate-400">
						<Timer className="mr-2" />
						{formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
					</div>
				</div>
				{/* <MCQCounter
					correctAnswers={correctAnswers}
					wrongAnswers={wrongAnswers}
				/> */}
			</div>

			{/* Question */}
			<Card className="w-full mt-4">
				<CardHeader className=" flex flex-row items-center">
					<CardTitle className=" mr-5 text-center divide-y divide-zinc-600/50">
						<div>{questionIndex + 1}</div>
						<div className="text-base text-slate-400">
							{game.questions.length}
						</div>
					</CardTitle>
					<CardDescription className="flex-grow text-lg">
						{currentQuestion?.question}
					</CardDescription>
				</CardHeader>
			</Card>
			<div className="flex flex-col items-center justify-center w-full mt-4">
                <BlankAnswerInput setBlankAnswer={setBlankAnswer} answer={currentQuestion.answer}/>
				<Button className=" mt-2" onClick={handleNext} disabled={isChecking}>
					{isChecking && <Loader2 className=" w-4 h-4 mr-2 animate-spin" />}
					Next <ChevronRight className=" w-4 h-4 ml-2" />
				</Button>
			</div>
		</div>
	);
};

export default OpenEnded;
