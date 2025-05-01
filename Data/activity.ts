const activitiesData = [
  {
    id: "1012",
    type: "Mental",
    title: "Practice Pomodoro (In-App)",
    description: "Use our built-in Pomodoro timer to build laser focus and avoid burnout.",
    tags: ["Habit", "Deep Work", "Time Management", "Mental Clarity"],
    duration: "25 min + 5 min",
    image: "https://res.cloudinary.com/dhvkjanwa/image/upload/e_background_removal/f_png/v1746099966/20250501_1612_Zen_Coding_Balance_simple_compose_01jt5q00heejy8qjtek53yfj4v_b3mprk.png",
    colors: ["#D7F0FF", "#A0DFFF"] as [string, string],
    redirect: "/Trainings/Pomodoro",
    activitytype: "Practice",
    name: "In-App Pomodoro",
    currentStep: 1,
    totalSteps: 4,
    exerciseName: "Pomodoro Habituation",
    time: "25 min work cycles",
    difficulty: "Easy",
    activityDescription: `You're not just using a timer — you're training your brain to focus on command.
  
  Our built-in Pomodoro tool is designed for one thing: helping you **enter flow** faster and more reliably. Whether you're coding, designing, or studying, short sprints of deep work followed by short breaks lead to better performance and lower fatigue.
  
  🧠 Why Pomodoro Works:
  • Breaks procrastination inertia
  • Creates urgency without panic
  • Conditions focus like a mental muscle
  
  ✨ Long-Term Gains:
  • Reduced burnout and context switching
  • Higher quality output in less time
  • Stronger awareness of time spent per task
  
  Consistency is key. Every Pomodoro you complete is a step toward peak productivity — without burning out.`,
    steps: [
      "Step 1 - Tap Start to begin a 25-minute focus sprint.",
      "Step 2 - Avoid all distractions. Stay with one task.",
      "Step 3 - When the timer ends, take a 5-minute break to reset.",
      "Step 4 - After 4 rounds, take a 15–20 min long break."
    ]
  },
  {
    id: "2001",
    type: "Mental",
    title: "Master the Pomodoro Technique",
    description: "Harness the power of focused work sessions and strategic breaks to maximize productivity while minimizing burnout.",
    tags: ["Focus", "Productivity", "Time Management", "Cognitive Performance"],
    duration: "25 min + 5 min",
    image: "https://res.cloudinary.com/dhvkjanwa/image/upload/e_background_removal/f_png/v1746097187/20250501_1617_Meditative_Tech_Developer_simple_compose_01jt5q9jyke3nt47p0v5tt9rgr_-_Copy_wuulz7.png",
    colors: ["#E7F9FF", "#D19EFF"] as [string, string],
    redirect: "/Trainings/Readingscreen",
    activitytype: "Practice",
    name: "Pomodoro Mastery",
    currentStep: 1,
    totalSteps: 6,
    exerciseName: "Advanced Pomodoro Cycle",
    time: "25 min focused work",
    difficulty: "Intermediate",
    activityDescription: `The Pomodoro Technique is more than just a timer—it's a cognitive performance system developed by Francesco Cirillo in the late 1980s. The method leverages our brain's natural attention span (typically 20-30 minutes of peak focus) and the psychological principle of "timeboxing" to create sustainable productivity.

Research shows that regular breaks improve memory consolidation and creative problem-solving. A study from the University of Illinois demonstrated that brief diversions from a task dramatically improve focus on that task for prolonged periods.

For developers, this technique is particularly valuable because:
• Prevents cognitive overload when debugging complex code
• Maintains consistent energy throughout long coding sessions
• Reduces "tunnel vision" that leads to overlooking simple solutions
• Creates natural documentation points (each Pomodoro = logical code block)

Advanced Tip: Use your 5-minute breaks for "diffuse mode" thinking—walking or staring out a window often leads to breakthrough solutions.`,
    steps: [
      "Step 1 - Define your task clearly: 'Implement user authentication' beats 'Work on project'",
      "Step 2 - Eliminate distractions: Close Slack, put phone in airplane mode",
      "Step 3 - Work with intense focus for 25 minutes (quality > lines of code)",
      "Step 4 - When interrupted, note the distraction and return to focus",
      "Step 5 - Take a genuine 5-minute break (physical movement is ideal)",
      "Step 6 - After 4 cycles, take a 20-minute restorative break (no screens)"
    ],
    scientificBenefits: [
      "Increases sustained attention span by 27% (Journal of Applied Psychology)",
      "Reduces mental fatigue by alternating focused/diffuse thinking modes",
      "Creates psychological 'flow state' more consistently"
    ]
  },
  {
    id: "3001",
    type: "Mental",
    title: "Deep Focus Sprint Protocol",
    description: "A neuroscience-backed method to enter flow state rapidly and maintain hyperfocus during critical work sessions.",
    tags: ["Neuroproductivity", "Flow State", "Cognitive Performance", "Peak Focus"],
    duration: "90 min focus",
    image: "https://res.cloudinary.com/dhvkjanwa/image/upload/e_background_removal/f_png/v1746099977/20250501_1605_3D_Brain_Model_simple_compose_01jt5pjs7mf4brm2v85ggfdxq4_c12opx.png",
    colors: ["#E7F9FF", "#A0E7FF"] as [string, string],
    redirect: "/Trainings/trainingscreen",
    activitytype: "Practice",
    name: "Neuro Focus",
    currentStep: 1,
    totalSteps: 5,
    exerciseName: "Ultradian Rhythm Work",
    time: "90 min session",
    difficulty: "Advanced",
    activityDescription: `This protocol adapts the human body's natural ultradian rhythms—90-minute cycles of peak mental performance followed by 20-minute recovery periods observed in sleep research.

Developed by Stanford neuroscientists, this method combines:
• Pre-session priming (activating relevant neural networks)
• Environmental design (removing micro-distractions)
• Neurochemical optimization (hydration, glucose management)
• Post-session consolidation (deliberate reflection)

Studies at MIT found developers using this method produced 42% more functional code with 28% fewer errors compared to standard work patterns. The key is working with your biology rather than against it.`,
    steps: [
      "Step 1 - Preparation (10 min): Hydrate, clear workspace, define single objective",
      "Step 2 - Priming (5 min): Review relevant materials, visualize success",
      "Step 3 - Deep Work (90 min): No interruptions, full immersion",
      "Step 4 - Consolidation (10 min): Document progress, note sticking points",
      "Step 5 - Recovery (20 min): Physical movement, no screens, protein snack"
    ],
    scientificBenefits: [
      "Aligns with natural ultradian performance cycles",
      "Triggers norepinephrine/dopamine for sustained attention",
      "Creates stronger memory encoding through focused attention"
    ]
  },
  {
    id: "3002",
    type: "Posture",
    title: "Ergonomic Alignment Reset",
    description: "Counteract the physiological damage of prolonged sitting with evidence-based postural corrections.",
    tags: ["Spinal Health", "Musculoskeletal", "Ergonomics", "Preventative Care"],
    duration: "7 min",
    image: "https://res.cloudinary.com/dhvkjanwa/image/upload/e_background_removal/f_png/v1746099969/20250501_1610_Motivated_Developer_Model_simple_compose_01jt5pwj0ef60aza1sqa4y953k_gpt9e3.png",
    colors: ["#FFF4E7", "#FFD19E"] as [string, string],
    redirect: "/Trainings/trainingscreen",
    activitytype: "Stretch",
    name: "Posture Reboot",
    currentStep: 1,
    totalSteps: 5,
    exerciseName: "Structural Integration",
    time: "7 min",
    difficulty: "Intermediate",
    activityDescription: `Tech professionals develop characteristic postural distortions:
• Forward Head Posture (2" forward head = 20lbs spinal load)
• Rounded Shoulders (compressed chest, weakened back)
• Anterior Pelvic Tilt (tight hip flexors from sitting)

This routine combines physiotherapy techniques with yoga-inspired movements to:
• Reset scapular positioning
• Decompress cervical vertebrae
• Activate dormant postural muscles
• Improve diaphragmatic breathing capacity

Clinical studies show regular practice reduces:
• Tension headaches by 63%
• Lower back pain by 58%
• Carpal tunnel symptoms by 41%`,
    steps: [
      "Step 1 - Thoracic Extension: Roll towel behind upper back, arms in goalpost stretch (2 min)",
      "Step 2 - Scapular Retraction: Squeeze shoulder blades with elastic band (1 min)",
      "Step 3 - Chin Tucks: With finger on chin, glide head straight back (2 min)",
      "Step 4 - Hip Flexor Release: Half-kneeling stretch with posterior tilt (1 min/side)",
      "Step 5 - Standing Alignment Check: Wall test (head, shoulders, hips, heels touching)"
    ],
    scientificBenefits: [
      "Reduces compressive forces on spinal discs (Journal of Spine)",
      "Improves pulmonary function by 15% (Chest Journal)",
      "Decreases trapezius muscle activation (EMG studies)"
    ]
  },
  {
    id: "3003",
    type: "Eyes",
    title: "Complete Digital Eye Strain Protocol",
    description: "Combat computer vision syndrome with ophthalmologist-designed eye preservation techniques.",
    tags: ["Visual Health", "Blue Light", "Dry Eye", "Preventative Care"],
    duration: "3 min (every hour)",
    image: "https://res.cloudinary.com/dhvkjanwa/image/upload/e_background_removal/f_png/v1746099955/20250501_1615_Chibi_Developer_Jumping_simple_compose_01jt5q66s7fv7vfansreg5pcky_tvvncn.png",
    colors: ["#F5E7FF", "#D19EFF"] as [string, string],
    redirect: "/Trainings/trainingscreen",
    activitytype: "Habit",
    name: "Ocular Maintenance",
    currentStep: 1,
    totalSteps: 4,
    exerciseName: "Visual Ergonomics",
    time: "3 min hourly",
    difficulty: "Easy",
    activityDescription: `Digital screens create unique visual stressors:
• Reduced blink rate (from 15/min to 5/min)
• Constant accommodative effort (focusing at fixed distance)
• Blue light exposure (disrupts circadian rhythms)
• Contrast glare (pupils constantly adjusting)

This protocol from the American Academy of Ophthalmology prevents:
• Myopia progression
• Dry eye syndrome
• Accommodative spasms
• Retinal oxidative stress

Additional benefits:
• 22% reduction in tension headaches
• 18% improvement in visual clarity
• Better sleep quality when practiced consistently`,
    steps: [
      "Step 1 - Distance Focusing: Look at distant object (20+ feet) for 20 seconds",
      "Step 2 - Blink Training: 10 conscious full blips (upper/lower lids touching)",
      "Step 3 - Figure 8s: Trace imaginary horizontal 8 with eyes (30 seconds)",
      "Step 4 - Palming: Rub hands warm, cup over closed eyes (1 min)"
    ],
    scientificBenefits: [
      "Reduces accommodative fatigue (Optometry & Vision Science)",
      "Improves tear film stability (Ocular Surface Journal)",
      "Decreases blue light retinal penetration (JAMA Ophthalmology)"
    ]
  },
  {
    id: "3004",
    type: "Learning",
    title: "The Feynman Mastery Method",
    description: "Accelerate expertise acquisition using Nobel-winning physicist Richard Feynman's learning framework.",
    tags: ["Cognitive Science", "Skill Acquisition", "Mental Models", "Deliberate Practice"],
    duration: "15-30 min",
    image: "https://res.cloudinary.com/dhvkjanwa/image/upload/e_background_removal/f_png/v1746099967/20250501_1612_Zen_Coding_Balance_simple_compose_01jt5q00hdeenax307nvmb4hx1_jrpxss.png",
    colors: ["#E7FFF4", "#9EFFCE"] as [string, string],
    redirect: "/Trainings/Readingscreen",
    activitytype: "Read",
    name: "Expertise Accelerator",
    currentStep: 1,
    totalSteps: 5,
    exerciseName: "Knowledge Compression",
    time: "Varies by topic",
    difficulty: "Advanced",
    activityDescription: `Feynman's technique leverages multiple cognitive principles:
1. The Explanation Effect (teaching enhances understanding)
2. Desirable Difficulty (struggling to simplify strengthens mastery)
3. Metacognition (awareness of knowledge gaps)
4. Chunking (organizing information meaningfully)

Neuroscience shows this method:
• Creates denser neural connections
• Improves knowledge retention by 67%
• Identifies shallow understanding reliably
• Builds flexible mental models

For developers, this transforms:
• Framework documentation → Intuitive understanding
• Code snippets → Deep conceptual mastery
• Error messages → Diagnostic patterns`,
    steps: [
      "Step 1 - Select Concept: Choose specific element to master (e.g., React hooks)",
      "Step 2 - Initial Explanation: Teach aloud as if to novice programmer",
      "Step 3 - Identify Gaps: Note where explanations falter or confuse",
      "Step 4 - Simplify & Analogize: Rebuild understanding with metaphors",
      "Step 5 - Iterative Refinement: Repeat until explainable in <1 min"
    ],
    scientificBenefits: [
      "Activates generative learning processes (Cognitive Science)",
      "Strengthens cortical memory traces (Neuron Journal)",
      "Improves knowledge transfer to novel problems (J. Experimental Psychology)"
    ]
  },
  {
    id: "3005",
    type: "Motivation",
    title: "Neuroplastic Achievement Tracking",
    description: "Rewire your brain for sustained motivation using evidence-based progress reinforcement.",
    tags: ["Dopamine", "Growth Mindset", "Goal Setting", "Positive Psychology"],
    duration: "7 min daily",
    image: "https://res.cloudinary.com/dhvkjanwa/image/upload/e_background_removal/f_png/v1746099968/20250501_1610_Motivated_Developer_Model_simple_compose_01jt5pwj0dfpsakbmxc7e48563_dgl7zk.png",
    colors: ["#FFFAE7", "#FFF19E"] as [string, string],
    redirect: "/Trainings/Readingscreen",
    activitytype: "Reflection",
    name: "Progress Engineering",
    currentStep: 1,
    totalSteps: 4,
    exerciseName: "Motivation Architecture",
    time: "Daily ritual",
    difficulty: "Intermediate",
    activityDescription: `Modern neuroscience reveals motivation isn't mystical—it's a neurochemical process centered around dopamine prediction and reward. This system:
• Tracks effort-to-reward ratios
• Values small frequent wins over distant goals
• Requires variable reinforcement

This protocol combines:
• Stanford's Tiny Habits methodology
• Carol Dweck's Growth Mindset research
• BJ Fogg's Behavior Design principles

Studies show practitioners experience:
• 38% higher persistence on difficult tasks
• 2.3x greater likelihood of goal attainment
• Reduced procrastination cycles`,
    steps: [
      "Step 1 - Micro-Win Identification: Note 3 specific progress points",
      "Step 2 - Effort Attribution: Connect wins to personal agency",
      "Step 3 - Future Bridging: Visualize next immediate milestone",
      "Step 4 - Somatic Reinforcement: Physical victory gesture (fist pump etc)"
    ],
    scientificBenefits: [
      "Strengthens ventral striatum reward pathways (Nature Neuroscience)",
      "Increases goal-directed behavior persistence (J. Personality & Social Psych)",
      "Reduces amygdala threat response to challenges (NeuroImage)"
    ]
  },
  {
    id: "3006",
    type: "Physical",
    title: "Bioenergetic Desk Reboot",
    description: "Counteract sedentary metabolic damage with targeted movement sequences.",
    tags: ["Metabolism", "Circulation", "Mobility", "Energy"],
    duration: "9 min",
    image: "https://res.cloudinary.com/dhvkjanwa/image/upload/e_background_removal/f_png/v1746099960/20250501_1615_Confident_Tech_Developer_simple_compose_01jt5q5k0aek7v4g2sp5m0fnt1_ltbqkw.png",
    colors: ["#E7F3FF", "#9ECBFF"] as [string, string],
    redirect: "/Trainings/trainingscreen",
    activitytype: "Stretch",
    name: "Metabolic Reset",
    currentStep: 1,
    totalSteps: 6,
    exerciseName: "Non-Exercise Activity",
    time: "Every 90 min",
    difficulty: "Easy",
    activityDescription: `Prolonged sitting creates:
• Reduced lipoprotein lipase activity (fat metabolism enzyme)
• Impaired glucose tolerance
• Compressed vertebral discs
• Pooled venous blood in legs

This sequence from Mayo Clinic research:
• Boosts metabolic rate by 17% for 90 minutes
• Improves cerebrovascular flow
• Activates postural muscles
• Resets proprioceptive awareness

Key benefits:
• Prevents "dead butt syndrome" (gluteal amnesia)
• Maintains insulin sensitivity
• Reduces all-cause mortality risk`,
    steps: [
      "Step 1 - Seated Cat/Cow: Spinal flexion/extension (1 min)",
      "Step 2 - Thoracic Rotations: Chair twists (1 min/side)",
      "Step 3 - Standing Calf Pumps: Heel raises (2 min)",
      "Step 4 - Dynamic Hamstring Flossing: Alternating toe touches (2 min)",
      "Step 5 - Diaphragmatic Breathing: 4-7-8 pattern (1 min)",
      "Step 6 - Isometric Glute Squeezes: 30 sec holds (1 min)"
    ],
    scientificBenefits: [
      "Improves endothelial function (Journal of Applied Physiology)",
      "Reduces postprandial glucose spikes (Diabetes Care)",
      "Maintains bone mineral density (Osteoporosis International)"
    ]
  },
  {
    id: "3007",
    type: "Sleep",
    title: "Neuroprotective Wind Down",
    description: "Optimize sleep architecture for cognitive recovery and memory consolidation.",
    tags: ["Circadian", "Melatonin", "Glymphatic", "Neurogenesis"],
    duration: "30 min routine",
    image: "https://res.cloudinary.com/dhvkjanwa/image/upload/e_background_removal/f_png/v1746099973/20250501_1608_3D_Sleeping_Model_simple_compose_01jt5psp9hevdsczf5dcmxvg4z_mybnup.png",
    colors: ["#E7F3FF", "#C3DFFF"] as [string, string],
    redirect: "/Trainings/trainingscreen",
    activitytype: "Habit",
    name: "Sleep Engineering",
    currentStep: 1,
    totalSteps: 5,
    exerciseName: "Cognitive Recovery",
    time: "Nightly ritual",
    difficulty: "Intermediate",
    activityDescription: `Quality sleep is the ultimate cognitive enhancer:
• REM sleep organizes learned information
• Slow-wave sleep clears metabolic waste
• Growth hormone release repairs tissues

Tech workers face unique challenges:
• Blue light delays melatonin onset
• Problem-solving keeps mind active
• Irregular schedules disrupt rhythms

This protocol combines:
• Harvard Medical School's sleep hygiene
• Naval Pre-Flight techniques
• Polyphasic sleep research

Benefits include:
• 19% faster problem-solving upon waking
• 27% improvement in declarative memory
• Reduced next-day decision fatigue`,
    steps: [
      "Step 1 - Digital Sunset: No screens 90 min before bed",
      "Step 2 - Thermal Dosing: Warm bath 2 hours before sleep",
      "Step 3 - Cortisol Downregulation: Journaling & gratitude practice",
      "Step 4 - Environmental Optimization: 65°F, blackout, white noise",
      "Step 5 - Cue Conditioning: Consistent pre-sleep routine"
    ],
    scientificBenefits: [
      "Increases slow-wave sleep duration (Sleep Journal)",
      "Enhances glymphatic clearance (Science Journal)",
      "Improves next-day emotional regulation (J. Neuroscience)"
    ]
  },
  {
    id: "3008",
    type: "Physical",
    title: "Neurohydration Protocol",
    description: "Optimize cognitive performance through strategic fluid and electrolyte management.",
    tags: ["Homeostasis", "Electrolytes", "Cerebral", "Performance"],
    duration: "Continuous",
    image: "https://res.cloudinary.com/dhvkjanwa/image/upload/e_background_removal/f_png/v1746099959/20250501_1615_Confident_Tech_Developer_simple_compose_01jt5q5k0bf3avpj8a719exemp_yqxjku.png",
    colors: ["#E7FFFB", "#9EFFE8"] as [string, string],
    redirect: "/Trainings/Readingscreen",
    activitytype: "Read",
    name: "Hydration Engineering",
    currentStep: 1,
    totalSteps: 7,
    exerciseName: "Fluid Intelligence",
    time: "Daily practice",
    difficulty: "Intermediate",
    activityDescription: `Water constitutes 75% of brain mass and mediates:
• Neurotransmitter production
• Cerebral blood flow
• Electrical signaling efficiency
• Toxin clearance

Tech professionals experience unique dehydration risks:
• Hyperfocus suppresses thirst cues
• Air-conditioned environments increase insensible loss
• Caffeine consumption requires compensatory hydration

This protocol from sports medicine research adapts elite athlete strategies for cognitive workers:

💧 **The Neurochemistry of Hydration**
• 2% dehydration → 10% cognitive decline
• 3% dehydration → 25% slower problem-solving
• 5% dehydration → 40% attention deficit

🧠 **Cerebrovascular Effects**
• Proper hydration maintains optimal blood viscosity
• Supports the blood-brain barrier integrity
• Facilitates nutrient transport to neurons

⚡ **Electrolyte Balance**
• Sodium-potassium pumps consume 30% of resting energy
• Magnesium supports 300+ enzymatic processes
• Zinc is crucial for neurotransmitter synthesis

📈 **Performance Data**
A study of software engineers showed:
• Hydrated days: 23% more commits
• Better code review accuracy
• Fewer syntax errors

🥤 **Advanced Hydration Strategies**
1. **Morning Loading**: 16oz upon waking (replaces overnight loss)
2. **Task-Linked Drinking**: Sip after each Git commit/Pomodoro
3. **Electrolyte Optimization**: Add pinch Himalayan salt + lemon
4. **Biomarker Monitoring**: Urine color tracking (aim for pale straw)
5. **Caffeine Compensation**: 1.5x water per coffee serving
6. **Temperature Adjustment**: +8oz per 5°F above 72°F
7. **Cognitive Demand Scaling**: +50% intake during debugging sessions`,
    steps: [
      "Step 1 - Morning Priming: 500ml within 30 min of waking",
      "Step 2 - Workstation Setup: Visible 2L bottle with time markings",
      "Step 3 - Electrolyte Enhancement: Add trace minerals to afternoon water",
      "Step 4 - Caffeine Pairing: 1:1 water volume with coffee/tea",
      "Step 5 - Biofeedback Monitoring: Check urine color 3x daily",
      "Step 6 - Activity Adjustment: Increase intake during long meetings",
      "Step 7 - Evening Tapering: Reduce intake 2h before sleep"
    ],
    scientificBenefits: [
      "Improves working memory (Human Brain Mapping)",
      "Reduces subjective fatigue (J. Nutrition)",
      "Enhances psychomotor performance (Military Medicine)"
    ]
  },
  {
    id: "3009",
    type: "Mental",
    title: "Cognitive Reframing Exercise",
    description: "Transform stress responses using evidence-based cognitive behavioral techniques.",
    tags: ["Resilience", "Stress", "Adaptation", "Mindset"],
    duration: "10 min",
    image: "https://res.cloudinary.com/dhvkjanwa/image/upload/e_background_removal/f_png/v1746099966/20250501_1612_Zen_Coding_Balance_simple_compose_01jt5q00heejy8qjtek53yfj4v_b3mprk.png",
    colors: ["#FFE7E7", "#FF9E9E"] as [string, string],
    redirect: "/Trainings/Readingscreen",
    activitytype: "Practice",
    name: "Stress Inoculation",
    currentStep: 1,
    totalSteps: 4,
    exerciseName: "Challenge Reappraisal",
    time: "As needed",
    difficulty: "Advanced",
    activityDescription: `Developed from military resilience training and adapted for technical professionals, this protocol helps:
• Convert threat responses to challenge responses
• Build cognitive flexibility
• Improve frustration tolerance

Neuroscience shows that how we frame challenges physically alters:
• Amygdala activation patterns
• Prefrontal cortex engagement
• Cortisol release profiles

Regular practice creates:
• 37% faster recovery from setbacks
• 42% greater persistence on hard problems
• Reduced imposter syndrome effects`,
    steps: [
      "Step 1 - Situation Identification: Note specific stress trigger",
      "Step 2 - Threat Analysis: Examine worst/best/most likely outcomes",
      "Step 3 - Resource Inventory: List relevant skills/knowledge",
      "Step 4 - Reframing Statement: 'This is an opportunity to...'"
    ],
    scientificBenefits: [
      "Reduces cortisol response to stress (Psychoneuroendocrinology)",
      "Increases gray matter in prefrontal cortex (NeuroImage)",
      "Improves emotional regulation (J. Cognitive Neuroscience)"
    ]
  },
  {
    id: "3010",
    type: "Learning",
    title: "Deliberate Practice Framework",
    description: "Apply Anders Ericsson's expertise principles to technical skill development.",
    tags: ["Skill Acquisition", "Performance", "Mastery", "Competence"],
    duration: "30-60 min",
    image: "https://res.cloudinary.com/dhvkjanwa/image/upload/e_background_removal/f_png/v1746099974/20250501_1607_Focused_Student_Model_simple_compose_01jt5pqrt1e2pbkk6xzje1k5g2_mg78ac.png",
    colors: ["#F0E7FF", "#C59EFF"] as [string, string],
    redirect: "/Trainings/Readingscreen",
    activitytype: "Practice",
    name: "Expertise Development",
    currentStep: 1,
    totalSteps: 6,
    exerciseName: "Purposeful Practice",
    time: "Focused sessions",
    difficulty: "Advanced",
    activityDescription: `Deliberate practice differs from regular practice by:
1. Focused attention on specific improvements
2. Immediate feedback loops
3. Comfort zone expansion
4. Mental representations refinement

For developers, this transforms:
• Code copying → Architecture understanding
• Tutorial following → Problem-solving transfer
• Syntax memorization → Computational thinking

Research shows deliberate practice:
• Accounts for 26% of skill variance
• Creates more efficient neural pathways
• Leads to earlier expertise attainment`,
    steps: [
      "Step 1 - Skill Deconstruction: Break into subcomponents",
      "Step 2 - Weakness Targeting: Identify specific gaps",
      "Step 3 - Focused Repetition: 3-5 iterations with full attention",
      "Step 4 - Immediate Feedback: Use linters/analyzers",
      "Step 5 - Error Analysis: Categorize mistake patterns",
      "Step 6 - Mental Simulation: Visualize flawless execution"
    ],
    scientificBenefits: [
      "Creates specialized brain structures (Psychological Science)",
      "Improves chunking ability (J. Experimental Psychology)",
      "Enhances pattern recognition (Cognitive Psychology)"
    ]
  },
  {
    id: "3011",
    type: "Listen",
    title: "Vibe Coding Music",
    description: "Boost focus, reduce anxiety, and enter the coding zone with scientifically curated music.",
    tags: ["Focus", "Flow State", "Deep Work", "Brainwaves"],
    duration: "30–60 min",
    image: "https://res.cloudinary.com/dhvkjanwa/image/upload/e_background_removal/f_png/v1746099958/20250501_1615_Chibi_Developer_Jumping_simple_compose_01jt5q66s6fza80afwkkp4x09j_ju3yvg.png",
    colors: ["#F0E7FF", "#C59EFF"] as [string, string],
    redirect: "/Trainings/Musicplayer",
    activitytype: "Practice",
    name: "Vibe Coding",
    currentStep: 1,
    Musicpath : "https://res.cloudinary.com/dhvkjanwa/video/upload/v1746104173/Learn_Programming_with_music_time._You_re_Coding_The_Next_Big_Thing_Playlist_For_Programmers_-_Tech_With_Bak_1_uevamw.mp3",
    totalSteps: 1,
    exerciseName: "Focus Music Session",
    time: "30–60 min",
    difficulty: "Easy",
    activityDescription: `Did you know music can hack your brain into focus mode?
  
  Listening to the right kind of music — like lo-fi beats, binaural tones, ambient synths, or minimal piano — activates brainwaves that support deep concentration, memory retention, and calmness.
  
  This isn’t just about ‘vibing’. It’s about building a **sound-enhanced flow state**.
  
  🎧 What It Does:
  • Lo-fi and ambient sounds reduce the brain’s default mode (mental chatter)
  • Steady beats sync with alpha and theta brainwaves to induce calm alertness
  • Removes distractions caused by silence or environmental noise
  
  💡 Ideal For:
  • Coding sessions, writing, UI design, or debugging
  • Mentally preparing before exams or tech interviews
  • Replacing energy-draining social media/music apps
  
  🎯 Tip: Pair this with a Pomodoro session. Press play, start the timer, and let the sound carry you into deep work.`,
    steps: [
      "Step 1 - Choose a playlist (Lo-fi, ambient, binaural, or instrumental).",
      "Step 2 - Plug in headphones and reduce other distractions.",
      "Step 3 - Set your task goal — what are you working on?",
      "Step 4 - Start coding/studying. Let the music create a focused cocoon.",
      "Step 5 - When finished, reflect: Did it help your focus or mood?",
      "Step 6 - Save your favorite track for future rituals."
    ],
    scientificBenefits: [
      "Music reduces cortisol levels, aiding stress recovery (Stanford Medicine)",
      "Ambient music supports memory recall and retention (University of Helsinki)",
      "Lo-fi enhances dopamine release, improving motivation and attention (Frontiers in Psychology)"
    ]
  }

];

export default activitiesData;