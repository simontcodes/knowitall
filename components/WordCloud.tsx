"use client";

import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React from "react";
import D3WordCloud from "react-d3-cloud";

type WordCloudProps = {
  formattedTopics: {text:string, value:number}[]
};


const fontSizeMapper = (word: { value: number }) => {
  return Math.log2(word.value) * 5 + 16;
};

const WordCloud = ({formattedTopics}: WordCloudProps) => {
  const theme = useTheme();
  const router = useRouter()
  return (
    <>
      <D3WordCloud
        height={550}
        font="Times"
        fontSize={fontSizeMapper}
        rotate={0}
        padding={10}
        fill={theme.theme == "dark" ? "white" : "black"}
        data={formattedTopics}
        onWordClick={(event, word) => {
          router.push(`/quiz?topic=${word.text}`)
        }}
      />
    </>
  );
};

export default WordCloud;
