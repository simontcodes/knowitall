import React from "react";
import keyword_extractor from "keyword-extractor";
import { Input } from "postcss";

type Props = {
	answer: string;
	setBlankAnswer: React.Dispatch<React.SetStateAction<string>>;
};

const BLANKS = "_____";

//Fisher-Yates shuffle algorithm
function shuffleArray(array: string[]) {
	const shuffledArray = [...array];
	for (let i = shuffledArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
	}
	return shuffledArray;
}

const BlankAnswerInput = ({ answer, setBlankAnswer }: Props) => {
	const keywords = React.useMemo(() => {
		const words = keyword_extractor.extract(answer, {
			language: "english",
			remove_digits: true,
			return_changed_case: false,
			remove_duplicates: false,
		});

		const shuffled = shuffleArray(words);
		return shuffled.slice(0, 2);
	}, [answer]);

	const answerWithBlanks = React.useMemo(() => {
		const answerWithBlanks = keywords.reduce((acc, keyword) => {
			return acc.replace(keyword, BLANKS);
		}, answer); // <-- Provide 'answer' as the initial value
		setBlankAnswer(answerWithBlanks);
		return answerWithBlanks;
	}, [keywords, answer]);

	console.log(answerWithBlanks);

	return (
		<div className=" flex justify-start w-full mt-4">
			<h1 className=" text-xl font-semibold">
				{answerWithBlanks.split(BLANKS).map((part, index, array) => {
					return (
						<>
							{part}
							{/* this conditional is there so we dont put another input after the end of the sentence */}
							{index < array.length - 1 && (
								<input
									className="text-center border-b-2 border-black dark:border-white w-28 focus:border-2 focus:border-b-4 focus:outline-none"
									id="user-blank-input"
								/>
							)}
						</>
					);
				})}
			</h1>
		</div>
	);
};

export default BlankAnswerInput;
