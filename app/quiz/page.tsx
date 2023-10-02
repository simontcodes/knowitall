import QuizCreation from "@/components/QuizCreation";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";

type QuizPageProps = {
  searchParams:{
    topic?: string
  }
};

export const metadata = {
  title: "Quiz | Know It All",
};

const QuizPage = async ({searchParams}: QuizPageProps) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  return <QuizCreation topicParam={searchParams.topic ?? ""} />;
};

export default QuizPage;
