import type { Letter, Question } from "@/data/questions";

export type Lang = "en" | "ar";
type T = Record<Lang, string>;

export type Level = {
  cefr: string;
  name: T;
  desc: T;
};

/** The four CEFR levels the test covers. */
export const LEVELS: Level[] = [
  {
    cefr: "A1",
    name: { en: "Beginner", ar: "مبتدئ" },
    desc: {
      en: "You can understand and use very basic expressions.",
      ar: "يمكنك فهم واستخدام العبارات الأساسية جداً.",
    },
  },
  {
    cefr: "A2",
    name: { en: "Elementary", ar: "ابتدائي" },
    desc: {
      en: "You can handle simple everyday situations and short conversations.",
      ar: "يمكنك التعامل مع المواقف اليومية البسيطة والمحادثات القصيرة.",
    },
  },
  {
    cefr: "B1",
    name: { en: "Intermediate", ar: "متوسط" },
    desc: {
      en: "You can deal with most situations and express opinions on familiar topics.",
      ar: "يمكنك التعامل مع معظم المواقف والتعبير عن آرائك في المواضيع المألوفة.",
    },
  },
  {
    cefr: "B2",
    name: { en: "Upper-Intermediate", ar: "فوق المتوسط" },
    desc: {
      en: "You can communicate fluently on a wide range of topics.",
      ar: "يمكنك التواصل بطلاقة في مجموعة واسعة من المواضيع.",
    },
  },
];

/** Shown when the learner doesn't pass the A1 section. */
export const BELOW_A1: Level = {
  cefr: "<A1",
  name: { en: "Absolute Beginner", ar: "مبتدئ تماماً" },
  desc: {
    en: "You are at the very start of your German journey. A beginner course is the perfect place to begin.",
    ar: "أنت في بداية رحلتك مع اللغة الألمانية. دورة المبتدئين هي المكان المثالي للبدء.",
  },
};

/** Question ranges (0-based, inclusive) and minimum correct answers per section. */
export const SECTIONS = [
  { cefr: "A1", from: 0, to: 11, min: 8 },
  { cefr: "A2", from: 12, to: 23, min: 8 },
  { cefr: "B1", from: 24, to: 36, min: 9 },
  { cefr: "B2", from: 37, to: 49, min: 9 },
] as const;

export type SectionResult = {
  cefr: string;
  score: number;
  total: number;
  min: number;
  passed: boolean;
};

export function getSectionResults(
  answers: (Letter | null)[],
  questions: Question[]
): SectionResult[] {
  return SECTIONS.map((s) => {
    let score = 0;
    for (let i = s.from; i <= s.to; i++) if (answers[i] === questions[i].a) score++;
    return {
      cefr: s.cefr,
      score,
      total: s.to - s.from + 1,
      min: s.min,
      passed: score >= s.min,
    };
  });
}

/**
 * Progressive placement: a learner must pass every preceding section.
 * Returns the index in LEVELS of the placed level, or -1 for "below A1".
 */
export function getPlacementIndex(sections: SectionResult[]): number {
  let idx = -1;
  for (const s of sections) {
    if (!s.passed) break;
    idx++;
  }
  return idx;
}

export const getLevelByIndex = (i: number): Level => (i < 0 ? BELOW_A1 : LEVELS[i]);