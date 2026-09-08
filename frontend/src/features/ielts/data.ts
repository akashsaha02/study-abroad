/* Sample mock-test content kept for the no-account demo. Scoring lives in @abroadly/shared/ielts. */

export {
  listeningBand,
  readingBand,
  roundToBand,
  overallBand,
  bandDescriptor,
} from "@abroadly/shared/ielts";

export interface MockQuestion {
  id: string;
  number: number;
  prompt: string;
  type: "text" | "choice";
  options?: string[];
}

export const READING_PASSAGE = {
  title: "The Rise of Urban Vertical Farming",
  paragraphs: [
    "As the world's population becomes increasingly concentrated in cities, the challenge of feeding urban populations sustainably has never been more pressing. Traditional agriculture, dependent on vast tracts of arable land and long supply chains, struggles to meet the demands of dense metropolitan areas. Into this gap has stepped a novel solution: vertical farming, the practice of growing crops in stacked layers within controlled indoor environments.",
    "Vertical farms rely on technologies such as hydroponics, where plants grow in nutrient-rich water rather than soil, and precisely tuned LED lighting that mimics the wavelengths most useful for photosynthesis. Because these systems are enclosed, they are largely immune to the vagaries of weather, pests, and seasonal change. A single vertical farm can therefore produce harvests year-round, often using a fraction of the water required by conventional fields.",
    "Critics, however, point to the significant energy costs involved. Artificial lighting and climate control consume large amounts of electricity, and unless that power comes from renewable sources, the environmental benefits may be undercut. Proponents counter that rapid advances in energy efficiency, coupled with the elimination of transportation emissions, tilt the balance firmly in favour of vertical systems.",
    "Perhaps the most compelling argument concerns resilience. By situating food production within cities themselves, vertical farming shortens supply chains dramatically, reducing the risk of disruption from extreme weather or geopolitical instability. For many urban planners, this local resilience—not merely efficiency—represents the true promise of the vertical farm.",
  ],
};

export const READING_QUESTIONS: MockQuestion[] = [
  {
    id: "r1",
    number: 1,
    prompt: "Vertical farms grow plants in nutrient-rich water using a technique called ______.",
    type: "text",
  },
  {
    id: "r2",
    number: 2,
    prompt:
      "According to the passage, what is the main criticism of vertical farming?",
    type: "choice",
    options: [
      "It cannot grow crops year-round",
      "It requires large amounts of electricity",
      "It is vulnerable to pests",
      "It needs vast tracts of land",
    ],
  },
  {
    id: "r3",
    number: 3,
    prompt: "The type of lighting used in vertical farms is described as ______ lighting.",
    type: "text",
  },
  {
    id: "r4",
    number: 4,
    prompt:
      "Which benefit do urban planners consider the 'true promise' of vertical farming?",
    type: "choice",
    options: [
      "Higher profits",
      "Energy efficiency",
      "Local resilience",
      "Larger harvests",
    ],
  },
  {
    id: "r5",
    number: 5,
    prompt:
      "Vertical farms are largely immune to weather, pests and ______ change.",
    type: "text",
  },
];

export const LISTENING_QUESTIONS: MockQuestion[] = [
  {
    id: "l1",
    number: 1,
    prompt: "The orientation session will be held in Room ______.",
    type: "text",
  },
  {
    id: "l2",
    number: 2,
    prompt: "Students should bring their ______ card to collect keys.",
    type: "text",
  },
  {
    id: "l3",
    number: 3,
    prompt: "The library is open until ______ pm on weekdays.",
    type: "text",
  },
  {
    id: "l4",
    number: 4,
    prompt: "What service is free for all new students?",
    type: "choice",
    options: ["Gym membership", "Airport pickup", "Health insurance", "Bike hire"],
  },
  {
    id: "l5",
    number: 5,
    prompt: "The welcome dinner takes place on ______.",
    type: "text",
  },
];

export const WRITING_TASK = {
  title: "Writing Task 2",
  minWords: 250,
  prompt:
    "Some people believe that universities should focus on providing academic skills, while others think they should prepare students for the workplace. Discuss both views and give your own opinion. Write at least 250 words.",
};
