import React from "react";
import { NormalIcon, HappyIcon, AngerIcon, SadIcon } from '@/assets/icons/emotionemojis';
import Humanicon from "@/assets/icons/humanicon";
import CardData from "@/types/Carddata.types";

const cardsData: CardData[] = [
  {
    id: '906',
    icon: <HappyIcon height={32} width={32} />,
    bgColor: "#1F1F1F",
    type: "Calm",
    iconBgColor: "#FFB700",
    issueText: "Want More Joy?",
    description: "Build joy through gratitude and purpose.",
  },
  {
    id: '901',
    icon: <AngerIcon height={32} width={32} />,
    bgColor: "#1F1F1F",
    type: "Anger",
    iconBgColor: "#FF4A4A",
    issueText: "Feeling Angry?",
    description: "Learn how to use anger constructively.",
  },
  {
    id: '903',
    icon: <NormalIcon height={32} width={32} />,
    bgColor: "#1F1F1F",
    type: "Blame",
    iconBgColor: "#FF7F50",
    issueText: "Caught in Blame?",
    description: "Shift blame into personal power.",
  },
  {
    id: '904',
    icon: <SadIcon height={32} width={32} />,
    bgColor: "#1F1F1F",
    type: "Sorrow",
    iconBgColor: "#6789FF",
    issueText: "Feeling Low?",
    description: "Explore how sorrow leads to healing.",
  },
  {
    id: '905',
    icon: <Humanicon height={32} width={32} />,
    bgColor: "#1F1F1F",
    type: "Confusion",
    iconBgColor: "#00C6AE",
    issueText: "Mentally Foggy?",
    description: "Turn confusion into clarity.",
  },
  {
    id: '906',
    icon: <HappyIcon height={32} width={32} />,
    bgColor: "#1F1F1F",
    type: "Happiness",
    iconBgColor: "#FFB700",
    issueText: "Want More Joy?",
    description: "Build joy through gratitude and purpose.",
  },
];

export default cardsData;
