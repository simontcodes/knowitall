import MCQ from "@/components/MCQ";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
	params: {
		gameId: string;
	};
};

const McqPage = async ({ params: { gameId } }: Props) => {
	const session = await getAuthSession();
	//route protection
	if (!session?.user) {
		return redirect("/");
	}

	//get the game and its questions from db
	const game = await prisma.game.findUnique({
		where: {
			id: gameId,
		},
		include: {
			questions: {
				select: {
					id: true,
					question: true,
					options: true,
					// select is being use to leave out the answer field so the front end doesnt know the asnwer to the question
				},
			},
		},
	});

	if (!game || game.gameType !== "mcq") {
		return redirect("/quiz");
	}

	return <MCQ game={game} />;
};

export default McqPage;
