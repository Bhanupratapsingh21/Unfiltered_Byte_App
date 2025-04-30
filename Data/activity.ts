const activitiesData = [
  {
    id: "2001",
    type: "Mental",
    title: "Lets Do Pomodoro In Our App",
    description: "Use the Pomodoro technique to stay sharp and avoid burnout while coding.",
    tags: ["Focus", "Productivity", "Pomodoro", "Breaks"],
    duration: "25 min",
    image: "https://res.cloudinary.com/dhvkjanwa/image/upload/v1746019000/ActivityCard_lmjfhm.png",
    colors: ["#1E1E2E", "#2A2A40"] as [string, string],
    redirect: "/Trainings/Pomodoro",
    activitytype: "Practice",
    name: "Pomodoro",
    currentStep: 1,
    totalSteps: 4,
    exerciseName: "Pomodoro Cycle",
    time: "25 min",
    difficulty: "Easy",
    activityDescription: `Improve focus and prevent mental fatigue with the Pomodoro technique—25 minutes of focused work followed by a 5-minute break.`,
    steps: [
      "Step 1 - Set a timer for 25 minutes.",
      "Step 2 - Work with full focus (no distractions).",
      "Step 3 - Take a 5-minute break (walk/stretch).",
      "Step 4 - Repeat 4 cycles, then take a longer 15-20 min break."
    ]

  },
  {
    id: "3001",
    type: "Mental",
    title: "Pomodoro Focus Sprint",
    description: "Use the Pomodoro technique to stay sharp and avoid burnout while coding.",
    tags: ["Focus", "Productivity", "Pomodoro", "Breaks"],
    duration: "25 min",
    image: "https://res.cloudinary.com/dhvkjanwa/image/upload/v1746019000/ActivityCard_lmjfhm.png",
    colors: ["#E7F9FF", "#A0E7FF"] as [string, string],
    redirect: "/Trainings/trainingscreen",
    activitytype: "Practice",

    name: "Focus Sprint",
    currentStep: 1,
    totalSteps: 4,
    exerciseName: "Pomodoro Cycle",
    time: "25 min",
    difficulty: "Easy",
    activityDescription: `Improve focus and prevent mental fatigue with the Pomodoro technique—25 minutes of focused work followed by a 5-minute break.`,
    steps: [
      "Step 1 - Set a timer for 25 minutes.",
      "Step 2 - Work with full focus (no distractions).",
      "Step 3 - Take a 5-minute break (walk/stretch).",
      "Step 4 - Repeat 4 cycles, then take a longer 15-20 min break."
    ]

  },
  {
    id: "3002",
    type: "Posture",
    title: "Desk Posture Reset",
    description: "Prevent back and neck pain with simple desk posture realignment.",
    tags: ["Posture", "Neck", "Back", "Ergonomics"],
    duration: "5 min",
    image: "https://res.cloudinary.com/dhvkjanwa/image/upload/v1746019000/ActivityCard_lmjfhm.png",
    colors: ["#FFF4E7", "#FFD19E"] as [string, string],
    redirect: "/Trainings/trainingscreen",
    activitytype: "Stretch",

    name: "Posture Check",
    currentStep: 1,
    totalSteps: 3,
    exerciseName: "Ergo Reset",
    time: "5 min",
    difficulty: "Easy",
    activityDescription: `Prolonged sitting harms spinal alignment. Use this routine to restore posture and reduce tech-neck.`,
    steps: [
      "Step 1 - Sit upright with shoulders relaxed, feet flat.",
      "Step 2 - Stretch arms overhead and roll shoulders back.",
      "Step 3 - Chin tucks: Gently push head back and hold for 10 seconds, repeat 5 times."
    ]

  },
  {
    id: "3003",
    type: "Eyes",
    title: "20-20-20 Rule for Eye Strain",
    description: "Reduce eye fatigue by using the 20-20-20 rule during screen time.",
    tags: ["Eye Care", "Screen Time", "Vision", "Health"],
    duration: "1 min (every 20)",
    image: "https://res.cloudinary.com/dhvkjanwa/image/upload/v1746019000/ActivityCard_lmjfhm.png",
    colors: ["#F5E7FF", "#D19EFF"] as [string, string],
    redirect: "/Trainings/trainingscreen",
    activitytype: "Habit",

    name: "Eye Health",
    currentStep: 1,
    totalSteps: 1,
    exerciseName: "20-20-20 Rule",
    time: "1 min every 20 min",
    difficulty: "Easy",
    activityDescription: `Eye strain from screens is common. Follow this to refresh your eyes.`,
    steps: [
      "Step 1 - Every 20 minutes, look at something 20 feet away for 20 seconds."
    ]

  },
  {
    id: "3004",
    type: "Learning",
    title: "Learn Fast with Feynman Technique",
    description: "Accelerate understanding by teaching what you learn to yourself.",
    tags: ["Learning", "Study", "Feynman", "Teaching"],
    duration: "10 min",
    image: "https://res.cloudinary.com/dhvkjanwa/image/upload/v1746019000/ActivityCard_lmjfhm.png",
    colors: ["#E7FFF4", "#9EFFCE"] as [string, string],
    redirect: "/Trainings/Readingscreen",
    activitytype: "Read",

    name: "Learn Smarter",
    currentStep: 1,
    totalSteps: 1,
    exerciseName: "Feynman Technique",
    time: "10 min",
    difficulty: "Medium",
    activityDescription: `Learning is faster when you simplify and explain concepts as if teaching a beginner.`,
    steps: [
      "Step 1 - Choose a topic you’re learning.",
      "Step 2 - Write it in your own words as if teaching a 12-year-old.",
      "Step 3 - Identify gaps, review, and re-explain simply."
    ]

  },
  {
    id: "3005",
    type: "Motivation",
    title: "Reignite Passion with Developer Wins",
    description: "Reflect on your progress and small wins to boost self-motivation.",
    tags: ["Motivation", "Reflection", "Gratitude", "Growth"],
    duration: "5 min",
    image: "https://res.cloudinary.com/dhvkjanwa/image/upload/v1746019000/ActivityCard_lmjfhm.png",
    colors: ["#FFFAE7", "#FFF19E"] as [string, string],
    redirect: "/Trainings/Readingscreen",
    activitytype: "Reflection",

    name: "Daily Dev Wins",
    currentStep: 1,
    totalSteps: 1,
    exerciseName: "Micro-Achievement Tracker",
    time: "5 min",
    difficulty: "Easy",
    activityDescription: `Motivation isn't constant. Rewiring your brain to notice progress improves momentum.`,
    steps: [
      "Step 1 - Write 3 wins you achieved today (even small ones).",
      "Step 2 - Reflect on how they show growth.",
      "Step 3 - Say out loud: 'I’m making progress.'"
    ]

  },
  {
    id: "3006",
    type: "Physical",
    title: "Desk Stretches to Reboot Energy",
    description: "Boost circulation and energy with quick desk-friendly stretches.",
    tags: ["Energy", "Stretching", "Health", "Focus"],
    duration: "7 min",
    image: "https://res.cloudinary.com/dhvkjanwa/image/upload/v1746019000/ActivityCard_lmjfhm.png",
    colors: ["#E7F3FF", "#9ECBFF"] as [string, string],
    redirect: "/Trainings/trainingscreen",
    activitytype: "Stretch",

    name: "Desk Movement",
    currentStep: 1,
    totalSteps: 3,
    exerciseName: "Quick Reboot",
    time: "7 min",
    difficulty: "Easy",
    activityDescription: `Sitting long hours reduces blood flow and brain oxygen. These stretches re-energize body and mind.`,
    steps: [
      "Step 1 - Shoulder rolls & arm stretches (2 min).",
      "Step 2 - Seated spinal twist (2 min each side).",
      "Step 3 - Neck rolls & toe raises (3 min)."
    ]

  },
  {
    id: "3007",
    type: "Sleep",
    title: "Tech-Free Wind Down",
    description: "Improve sleep quality by reducing blue light and stimulation.",
    tags: ["Sleep", "Recovery", "Digital Detox", "Calm"],
    duration: "15 min",
    image: "https://res.cloudinary.com/dhvkjanwa/image/upload/v1746019000/ActivityCard_lmjfhm.png",
    colors: ["#E7F3FF", "#C3DFFF"] as [string, string],
    redirect: "/Trainings/trainingscreen",
    activitytype: "Habit",
    name: "Digital Detox",
    currentStep: 1,
    totalSteps: 2,
    exerciseName: "Wind Down Ritual",
    time: "15 min",
    difficulty: "Easy",
    activityDescription: `Reduce screen use 30 min before bed to help melatonin production and better REM sleep.`,
    steps: [
      "Step 1 - Switch to night mode and stop coding/socials 30 min before bed.",
      "Step 2 - Journal or listen to calming music instead."
    ]

  },
  {
    id: "3008",
    type: "Physical",
    title: "Hydration Reminder: Code & Sip",
    description: "Boost cognitive performance and energy by staying hydrated throughout your coding sessions.",
    tags: ["Hydration", "Health", "Focus", "Routine"],
    duration: "5 min (repeat hourly)",
    image: "https://res.cloudinary.com/dhvkjanwa/image/upload/v1746019000/ActivityCard_lmjfhm.png",
    colors: ["#E7FFFB", "#9EFFE8"] as [string, string],
    redirect: "/Trainings/Readingscreen",
    activitytype: "Read",

    name: "Stay Hydrated",
    currentStep: 1,
    totalSteps: 1,
    exerciseName: "Hydration Boost",
    time: "5 min",
    difficulty: "Easy",
    activityDescription: `Water is the unsung hero behind your productivity.
  
  When you code or study intensely, your brain cells fire rapidly—requiring oxygen, nutrients, and hydration to maintain peak performance. Even mild dehydration can reduce focus, memory, and decision-making ability, which is a serious deal-breaker for developers and tech students.
  
  Most people don't realize that dehydration doesn't always feel like thirst. It sneaks in as **mental fog**, **mild headaches**, **fatigue**, and even **bad moods**. Especially when deep into code or gaming, you can easily go hours without drinking water, silently affecting your energy and output.
  
  💡 **Why Water Matters for Coders**:
  • It regulates body temperature, preventing burnout and fatigue.
  • It keeps joints lubricated, important if you type a lot.
  • It prevents eye dryness from screen time.
  • It flushes out toxins and balances your mood.
  
  Want to function like a high-performance machine? Then treat your brain like hardware—keep it cool and fluid.
  
  🧠 Studies show a hydrated brain is faster at task-switching and problem-solving. Whether you're debugging a tricky issue or learning a new framework, water plays a silent role in how well you perform.
  
  🥤 **Pro Tip**: Set a physical bottle at your desk and mark levels (e.g., 10am, 1pm, 3pm, etc.). Gamify it with reminders or pair every ‘Push to GitHub’ with a ‘Sip to Live’.`,
    steps: [
      "Step 1 - Fill a 1L or 2L water bottle and keep it within arm’s reach.",
      "Step 2 - Use the 45/15 rule: Every 45 min of work, take a 15-second sip break.",
      "Step 3 - Track your intake: Use an app or mark levels on the bottle itself.",
      "Step 4 - Replace 1 coffee/energy drink per day with lemon or fruit-infused water to prevent dehydration.",
      "Step 5 - End your day with a hydration reflection: Did you feel more alert? Any fewer headaches?"
    ]

  }

];

export default activitiesData