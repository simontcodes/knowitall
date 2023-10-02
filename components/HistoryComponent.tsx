import { prisma } from "@/lib/db";
import { Clock, CopyCheck, Edit2 } from "lucide-react";
import Link from "next/link";
import React from "react";

type HistoryComponentProps = {
	limit: number; //we only want 10 games
	userId: string;
};

const HistoryComponent = async ({ limit, userId }: HistoryComponentProps) => {
	const games = await prisma.game.findMany({
		where: {
			userId: userId,
		},
		take: limit, //this is how many rows of the table we want to bring
		orderBy: {
			timeStarted: "desc",
		},
	});

	return (
		<div className=" space-y-8">
			{games.map((game) => {
				return (
					<div className=" flex items-center justify-between" key={game.id}>
						<div className="flex items-center">
							{game.gameType === "mcq" ? <CopyCheck /> : <Edit2 />}
              <div className=" ml-4 space-y-1">
                <Link href={`/statistics/${game.id}`} className=" text-base font-medium leading-none underline">
                  {game.topic}
                </Link>
                <p className=" flex items-center px-2 py-1 text-sm text-white rounded-lg w-fit bg-slate-800">
                  <Clock className=" w-4 h-4 mr-1" />
                  {new Date(game.timeStarted).toLocaleDateString()}
                </p>
                <p className=" text-sm text-muted-foreground">
                  {game.gameType === "mcq" ? "MCQ" : "Open Ended"}
                </p>
              </div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default HistoryComponent;
