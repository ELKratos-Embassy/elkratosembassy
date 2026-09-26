import type { QuestionMode } from "@/lib/fruit-games-config";

export interface BankQuestion {
  order: number;
  text: string;
  mode: QuestionMode;
  points: number;
  timerSeconds: number;
  doublePoints: boolean;
  options: string[];
  answerIndex: number | null;
  section: string;
}

function round(
  order: number,
  section: string,
  text: string,
  options: string[],
  answerIndex: number,
  points = 10,
  doublePoints = false
): BankQuestion {
  return {
    order,
    section,
    text,
    mode: "buzzer",
    points,
    timerSeconds: 60,
    doublePoints,
    options,
    answerIndex,
  };
}

// Drawn from the 2026 Fruit of the Spirit sermons. One section is one fruit.
export const FRUIT_GAME_BANK: BankQuestion[] = [
  {
    order: 1,
    section: "The table",
    text: "Name one thing that makes the dish your alliance cooked today distinctly yours.",
    mode: "food",
    points: 10,
    timerSeconds: 60,
    doublePoints: false,
    options: [],
    answerIndex: null,
  },
  round(2, "The vine", "Galatians 5:22–23 names the fruit of the Spirit. How many are listed?", ["Seven", "Eight", "Nine", "Twelve"], 2),
  round(3, "The vine", "The series says the fruit is not nine separate things. It is what?", ["Nine competitions", "One life, fully surrendered", "A checklist of good behaviour", "A mood you keep all week"], 1),
  round(4, "The vine", "You do not produce fruit by chasing fruit. You produce it by doing what?", ["Staying connected to the Vine", "Keeping a stricter checklist", "Comparing yourself with others", "Attending every programme"], 0),
  round(5, "Love", "Complete the opening line: “Love is not what you feel. Love is…”", ["what you promise on Sunday", "what you do when the feeling fades", "what you feel more deeply", "what you say in public"], 1),
  round(6, "Love", "In this series, “Love never fails” means what?", ["Love never hurts", "Love never quits", "Love never corrects", "Love never sets a boundary"], 1),
  round(7, "Love", "Complete the capsule: “Feelings are the paint. Love is…”", ["the audience", "the foundation", "the mood", "the reward"], 1, 15),
  round(8, "Joy", "Complete the opening line: “Happiness depends on what happens. Joy depends on…”", ["how hard you try", "who God is", "whether the week was easy", "how people treat you"], 1),
  round(9, "Joy", "Which scripture says, “The joy of the Lord is your strength”?", ["Philippians 4:4", "James 1:2", "Nehemiah 8:10", "Habakkuk 3:17"], 2, 15),
  round(10, "Joy", "Paul wrote “Rejoice in the Lord always” from where?", ["A palace", "A prison", "The temple courts", "A quiet hillside"], 1),
  round(11, "Peace", "Complete the opening line: “Peace is not the absence of the storm. Peace is…”", ["the end of every problem", "the presence of God in the storm", "a quiet room and a full night of sleep", "knowing how the story ends"], 1, 15),
  round(12, "Peace", "John 14:27 says Jesus does not give peace the way who gives it?", ["The church", "The world", "The prophets", "Your family"], 1),
  round(13, "Peace", "Isaiah 26:3 keeps a person in perfect peace when their mind is what?", ["Busy", "Steadfast", "Empty", "Certain of the outcome"], 1),
  round(14, "Patience", "Complete the opening line: “Patience is not waiting. Patience is…”", ["pretending you are not in a hurry", "what you do while you wait", "never asking God for anything", "letting other people decide for you"], 1, 15),
  round(15, "Patience", "Galatians 6:9 says we reap a harvest if we do what?", ["Work harder than everyone else", "Do not give up", "See the result this week", "Stop and start again later"], 1),
  round(16, "Patience", "In the series, impatience says “I will make it happen.” Patience says what?", ["I will force the door", "God is already working", "I will wait and do nothing", "Someone else should finish it"], 1),
  round(17, "Kindness", "How does the series define kindness?", ["Weakness wearing a smile", "Strength that has chosen to stoop", "Agreeing with everyone", "A personality some people are born with"], 1, 15),
  round(18, "Kindness", "Luke 6:35 says God is kind to whom?", ["Only the grateful", "The ungrateful and wicked", "Only those who ask well", "Only his closest friends"], 1),
  round(19, "Kindness", "Complete the line: “The kindness that costs nothing…”", ["changes everything", "changes nothing", "is the only real kindness", "is what God prefers"], 1),
  round(20, "Goodness", "Complete the distinction: “Kindness is what you do for people. Goodness is…”", ["what you post about it afterwards", "what you are when no one is watching", "what you feel in the moment", "what the crowd applauds"], 1, 20, true),
  round(21, "Goodness", "Complete the line: “Kindness is love made gentle. Goodness is…”", ["love made loud", "love made honest", "love made popular", "love made private"], 1, 20, true),
  round(22, "Goodness", "Which statement matches the series?", ["You can be good without ever being kind", "You can be kind without being good", "Kindness and goodness are the same word", "Goodness is only what people see"], 1, 20, true),
  round(23, "Faithfulness", "Complete the opening line: “Talent will get you noticed. Faithfulness will…”", ["make you popular faster", "keep you standing when the talented have fallen", "replace the need to show up", "matter only if you are gifted"], 1, 20, true),
  round(24, "Faithfulness", "Matthew 25:21 praises the servant who was faithful with what?", ["A crowd", "A few things", "A perfect record", "A public platform"], 1, 20, true),
  round(25, "Gentleness", "Complete the opening line: “Gentleness is not the absence of strength. It is…”", ["staying quiet so nobody is offended", "strength that has learned where to aim", "never correcting anyone", "letting other people win every argument"], 1, 20, true),
  round(26, "Gentleness", "The series says the Greek word for gentleness pictures what?", ["A broken weapon", "A tamed horse, power under control", "A person who never speaks", "A soft voice with no conviction"], 1, 20, true),
  round(27, "Self-control", "In this series, what is self-control to the other fruits?", ["The least important fruit", "The guardian of the garden", "A personality trait, not a fruit", "Something you need only in public"], 1, 20, true),
  round(28, "Self-control", "Proverbs 25:28 compares a person without self-control to what?", ["A locked gate", "A city whose walls are broken", "A full storehouse", "A finished race"], 1, 20, true),
  round(29, "Self-control", "Complete the opening line: “You can be gifted and ungoverned. But you cannot be…”", ["kind and ungoverned", "great and ungoverned", "faithful and ungoverned", "gentle and ungoverned"], 1, 20, true),
];
