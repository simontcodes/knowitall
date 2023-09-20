import { getAuthSession } from "@/lib/nextauth";
import React from "react";
import { redirect } from "next/navigation";
import QuizMeCard from "@/components/dashboard/QuizMeCard";
import HistoryCard from "@/components/dashboard/HistoryCard";
import PopularTopicsCard from "@/components/dashboard/PopularTopicsCard";
import RecentActivities from "@/components/dashboard/RecentActivities";

type Props = {};

export const metadata = {
  title: "Dashboard | Know It All",
};

const Dashboard = async (props: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    //means its not logged in and cannot access this route
    return redirect("/");
  }
  return (
    <main className="p-8 mx-auto max-w-7xl">
      <div className=" flex items-center">
        <h2 className="mr-2 text-3xl font-bold tracking-tight"></h2>
      </div>

      <div className="grid gap-4 mt-4 md:grid-cols-2">
        <QuizMeCard />
        <HistoryCard />
      </div>

      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
        <PopularTopicsCard />
        <RecentActivities />
      </div>
    </main>
  );
};

export default Dashboard;
