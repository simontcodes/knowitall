import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import WordCloud from "../WordCloud";

type Props = {};

const PopularTopicsCard = (props: Props) => {
  return (
    <Card className=" col-span-4">
      <CardHeader>
        <CardTitle className=" text-2xl font-bold">Trendy Topics</CardTitle>
        <CardDescription>Click on a topic to start quizing</CardDescription>
      </CardHeader>

      <CardContent className=" pl-2">
        {" "}
        <WordCloud />{" "}
      </CardContent>
    </Card>
  );
};

export default PopularTopicsCard;
