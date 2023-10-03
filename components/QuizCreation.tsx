"use client";
import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { useForm } from "react-hook-form";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "../components/ui/input";
import { BookOpen, CopyCheck, Loader2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoadingQuestions from "./LoadingQuestions";

type QuizCreationProps = {
	topicParam: string
};

type Input = z.infer<typeof quizCreationSchema>;

const QuizCreation = ({topicParam}: QuizCreationProps) => {
	const router = useRouter();
	const [showLoader, setShowLoader] = React.useState(false);
	//this state is passed to the loading component
	const [finished, setFinished] = React.useState(false);
	const { mutate: getQuestions, isLoading } = useMutation({
		mutationFn: async ({ amount, topic, type }: Input) => {
			const response = await axios.post(`${process.env.API_URL}/api/game`, {
				amount,
				topic,
				type,
			});
			return response.data;
		},
	});

	const form = useForm<Input>({
		resolver: zodResolver(quizCreationSchema),
		defaultValues: {
			amount: 3,
			topic: topicParam,
			type: "open_ended",
		},
	});

	function onSubmit(input: Input) {
		setShowLoader(true);
		getQuestions(
			{
				amount: input.amount,
				topic: input.topic,
				type: input.type,
			},
			{
				onSuccess: ({ gameId }) => {
					setFinished(true);
					setTimeout(() => {
						if (form.getValues("type") == "open_ended") {
							router.push(`play/open_ended/${gameId}`);
						} else {
							router.push(`play/mcq/${gameId}`);
						}
					}, 1000);
				},
				onError: () => {
					setShowLoader(false);
				},
			}
		);
	}

	form.watch();

	if (showLoader) {
		return <LoadingQuestions finished={finished} />;
	}

	return (
		<div className=" absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
			<Card>
				<CardHeader>
					<CardTitle className=" text-2xl font-bold">Quiz Creation</CardTitle>
					<CardDescription>Choose a Topic</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="topic"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Topic</FormLabel>
										<FormControl>
											<Input placeholder="Enter a topic" {...field} />
										</FormControl>
										<FormDescription>Please provide a topic</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="amount"
								render={({ field }) => (
									<FormItem>
										<FormLabel>How many questions would you like?</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter the number of questions"
												{...field}
												type="number"
												min={1}
												max={10}
												onChange={(e) => {
													form.setValue("amount", parseInt(e.target.value));
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex justify-between">
								<Button
									type="button"
									onClick={() => {
										form.setValue("type", "mcq");
									}}
									className=" w-1/2 rounded-none rounded-l-lg"
									variant={
										form.getValues("type") === "mcq" ? "default" : "secondary"
									}
								>
									<CopyCheck className=" w-4 h-4 mr-2" /> Multiple Choice
								</Button>
								<Separator orientation="vertical" />
								<Button
									type="button"
									onClick={() => {
										form.setValue("type", "open_ended");
									}}
									className=" w-1/2 rounded-none rounded-r-lg"
									variant={
										form.getValues("type") === "open_ended"
											? "default"
											: "secondary"
									}
								>
									<BookOpen className=" w-4 h-4 mr-2" /> Open Ended
								</Button>
							</div>
							<Button disabled={isLoading} type="submit">
								{isLoading && (
									<Loader2 className=" w-4 h-4 mr-2 animate-spin" />
								)}
								Submit
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

export default QuizCreation;
