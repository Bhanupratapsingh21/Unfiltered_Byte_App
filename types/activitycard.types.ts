import { ImageSourcePropType } from "react-native";


// Define the main activity structure
export interface ActivityType {
    id: string;
    type: string;
    title: string;
    description: string;
    tags: string[];
    duration: string;
    image: string;
    colors: [string, string];
    redirect: string;
    activitytype?: string;
    name: string;
    currentStep: number;
    totalSteps: number;
    exerciseName: string;
    time: string;
    distance: string;
    difficulty: string;
    activityDescription: string;
    steps: string[];
    imagepath?: string;
    Musicpath?: string;
};


