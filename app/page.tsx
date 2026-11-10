"use client";
import { useRef, useState } from "react";
import type { ChangeEvent, CSSProperties, FormEvent, InputHTMLAttributes } from "react";
import { questions } from "@/data/questions";
import type { Letter } from "@/data/questions";
import {
  getLevelByIndex,
  getPlacementIndex,
  getSectionResults,
  LEVELS,
} from "@/lib/levels";
import type { Lang } from "@/lib/levels";

const LETTERS: Letter[] = ["a", "b", "c", "d"];
type Stage = "register" | "test" | "result";

type User = {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  phone: string;
};
type Errors = Partial<Record<keyof User, string>>;

const EMPTY_USER: User = { firstName: "", lastName: "", email: "", age: "", phone: "" };

const card =
  "anim-fade-up mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-10";

/* ---------- UI strings ---------- */
const UI = {
  en: {
    badge: "CEFR Assessment",
    title: "Find out your real German level.",
    intro: "A short placement test to measure your German and recommend the right course for you.",
    f1: ["questions", "Grammar, vocabulary & reading"],
    f2: ["About 25–30 minutes", "Go at your own pace"],
    f3: ["Instant result", "Your CEFR level, A1 to B2"],
    details: "Your details",
    fill: "Fill in the form below to begin the test.",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    age: "Age",
    phone: "Phone (optional)",
    required: "Required",
    badEmail: "Enter a valid email",
    badAge: "Enter a valid age",
    start: "Start the test",
    question: "Question",
    of: "of",
    answered: "answered",
    prev: "← Previous",
    next: "Next →",
    finish: "Finish",
    left: (n: number) => `Please answer all questions to finish (${n} left).`,
    goTo: (n: number) => `Go to question ${n}`,
    result: "Your result",
    well: (n: string) => `Well done, ${n}.`,
    here: "Here is your German level.",
    correct: "correct",
    sections: "Section scores",
    need: "needed",
    contact: "Our team will contact you to recommend the best course for your level.",
    note: "This is an initial estimate. A short speaking test will confirm your final level.",
    again: "Take the test again",
    error: "Your result could not be saved. Please try again.",
  },
  ar: {
    badge: "تقييم المستوى (CEFR)",
    title: "اكتشف مستواك الحقيقي في اللغة الألمانية.",
    intro: "اختبار قصير لقياس مستواك في الألمانية وترشيح الدورة المناسبة لك.",
    f1: ["سؤالاً", "قواعد ومفردات وفهم المقروء"],
    f2: ["حوالي 25–30 دقيقة", "خذ وقتك كما تريد"],
    f3: ["نتيجة فورية", "مستواك من A1 إلى B2"],
    details: "بياناتك",
    fill: "املأ النموذج أدناه لبدء الاختبار.",
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    email: "البريد الإلكتروني",
    age: "العمر",
    phone: "الهاتف (اختياري)",
    required: "مطلوب",
    badEmail: "أدخل بريداً إلكترونياً صحيحاً",
    badAge: "أدخل عمراً صحيحاً",
    start: "ابدأ الاختبار",
    question: "السؤال",
    of: "من",
    answered: "تمت الإجابة",
    prev: "السابق →",
    next: "← التالي",
    finish: "إنهاء",
    left: (n: number) => `يرجى الإجابة عن جميع الأسئلة للإنهاء (متبقّي ${n}).`,
    goTo: (n: number) => `انتقل إلى السؤال ${n}`,
    result: "نتيجتك",
    well: (n: string) => `أحسنت يا ${n}.`,
    here: "هذا هو مستواك في اللغة الألمانية.",
    correct: "صحيحة",
    sections: "درجات الأقسام",
    need: "المطلوب",
    contact: "سيتواصل معك فريقنا لترشيح أنسب دورة لمستواك.",
    note: "هذا تقدير أولي. سيؤكد اختبار محادثة قصير مستواك النهائي.",
    again: "أعد الاختبار",
    error: "تعذّر حفظ نتيجتك. يرجى المحاولة مرة أخرى.",
  },
} as const;

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [stage, setStage] = useState<Stage>("register");
  const [user, setUser] = useState<User>(EMPTY_USER);
  const [errors, setErrors] = useState<Errors>({});
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(Letter | null)[]>(
    Array(questions.length).fill(null)
  );

  const t = UI[lang];
  const rtl = lang === "ar";
  const total = questions.length;
  const score = answers.filter((a, i) => a === questions[i].a).length;
  const sections = getSectionResults(answers, questions);
  const levelIndex = getPlacementIndex(sections);
  const level = getLevelByIndex(levelIndex);

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const validate = (): boolean => {
    const e: Errors = {};
    if (!user.firstName.trim()) e.firstName = t.required;
    if (!user.lastName.trim()) e.lastName = t.required;
    if (!/^\S+@\S+\.\S+$/.test(user.email)) e.email = t.badEmail;
    const age = Number(user.age);
    if (!age || age < 5 || age > 100) e.age = t.badAge;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const start = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      setStage("test");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const choose = (letter: Letter) => {
    const copy = [...answers];
    copy[current] = letter;
    setAnswers(copy);
  };

  const submittedRef = useRef(false);

  // Save in the background (with retries) so the student never waits.
  const saveResult = async () => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user, answers, test: "german", lang }),
          keepalive: true,
        });
        const result = await response.json();
        if (response.ok && result.ok) return;
      } catch (err) {
        console.error("Submit attempt failed:", err);
      }
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    }
    console.error("Result could not be saved after 3 attempts", { user, answers });
  };

  const finish = () => {
    if (submittedRef.current) return; // ignore double clicks
    submittedRef.current = true;
    setStage("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
    void saveResult();
  };

  const restart = () => {
    submittedRef.current = false;
    setAnswers(Array(questions.length).fill(null));
    setCurrent(0);
    setUser(EMPTY_USER);
    setErrors({});
    setStage("register");
  };

  const langToggle = (
    <div dir="ltr" className="flex w-fit overflow-hidden rounded-full text-xs font-bold ring-1 ring-aqua/40">
      {(["en", "ar"] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`px-3 py-1.5 uppercase transition ${
            lang === l ? "bg-navy text-white" : "bg-white text-slate-500 hover:bg-aqua-soft"
          }`}
        >
          {l === "en" ? "EN" : "عربي"}
        </button>
      ))}
    </div>
  );

  /* ---------- REGISTER ---------- */
  if (stage === "register") {
    return (
      <div
        dir={rtl ? "rtl" : "ltr"}
        className="anim-fade-up grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 md:grid-cols-5"
      >
        {/* Left panel */}
        <div className="relative overflow-hidden border-b border-slate-100 bg-slate-50/70 p-8 sm:p-10 md:col-span-2 md:border-b-0 md:border-e">
          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between gap-2">
              <span className="w-fit rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-aqua-dark shadow-sm ring-1 ring-aqua/30">
                {t.badge}
              </span>
              {langToggle}
            </div>
            <h2 className="mt-5 font-heading text-3xl font-extrabold leading-tight text-navy sm:text-[2rem]">
              {t.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{t.intro}</p>

            <ul className="mt-8 space-y-4 text-sm">
              {[
                [`${total} ${t.f1[0]}`, t.f1[1]],
                [t.f2[0], t.f2[1]],
                [t.f3[0], t.f3[1]],
              ].map(([title, sub]) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-aqua text-white">
                    <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor">
                      <path d="M7.7 13.3 4.4 10l-1.4 1.4 4.7 4.7L17 6.8l-1.4-1.4z" />
                    </svg>
                  </span>
                  <span>
                    <span className="block font-semibold text-navy">{title}</span>
                    <span className="text-slate-500">{sub}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div dir="ltr" className="mt-auto flex flex-wrap gap-1.5 pt-10">
              {LEVELS.map((l) => (
                <span
                  key={l.cefr}
                  className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-navy ring-1 ring-aqua/30"
                >
                  {l.cefr}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={start} noValidate className="p-8 sm:p-10 md:col-span-3">
          <h3 className="font-heading text-2xl font-extrabold text-navy">{t.details}</h3>
          <p className="mt-1 text-sm text-slate-500">{t.fill}</p>

          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t.firstName} name="firstName" value={user.firstName} onChange={onChange} error={errors.firstName} />
            <Field label={t.lastName} name="lastName" value={user.lastName} onChange={onChange} error={errors.lastName} />
            <Field label={t.email} name="email" type="email" value={user.email} onChange={onChange} error={errors.email} full />
            <Field label={t.age} name="age" type="number" value={user.age} onChange={onChange} error={errors.age} />
            <Field label={t.phone} name="phone" type="tel" value={user.phone} onChange={onChange} />
          </div>

          <button
            type="submit"
            className="group mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-navy to-aqua-dark py-3.5 font-semibold text-white shadow-lg shadow-aqua/30 transition hover:brightness-110"
          >
            {t.start}
            <span className={`transition ${rtl ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}>
              {rtl ? "←" : "→"}
            </span>
          </button>
        </form>
      </div>
    );
  }

  /* ---------- TEST ---------- */
  if (stage === "test") {
    const q = questions[current];
    const isMeta = q.qAr !== undefined; // English/Arabic prompt (not German text)
    const promptText = rtl && q.qAr ? q.qAr : q.q;
    const opts = rtl && q.oAr ? q.oAr : q.o;
    const optsRtl = rtl && !!q.oAr;
    const parts = isMeta ? [promptText] : q.q.split("___");
    const isLast = current === total - 1;
    const answered = answers.filter(Boolean).length;

    return (
      <div dir={rtl ? "rtl" : "ltr"} className={card}>
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2.5 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>
              {t.question} <span className="text-navy">{current + 1}</span> {t.of} {total}
            </span>
            <span className="flex items-center gap-3">
              <span>
                {answered} {t.answered}
              </span>
              {langToggle}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-aqua-soft">
            <div
              className="h-full rounded-full bg-gradient-to-r from-navy to-aqua transition-all duration-500"
              style={{ width: `${((current + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div key={current} className="anim-slide-in">
          {q.p && (
            <blockquote
              dir="ltr"
              className="mb-5 rounded-xl border-s-4 border-aqua bg-aqua-mist px-5 py-4 text-left text-base italic leading-relaxed text-slate-700"
            >
              „{q.p}“
            </blockquote>
          )}

          <p
            dir={isMeta ? (rtl ? "rtl" : "ltr") : "ltr"}
            className={`mb-7 font-heading text-xl font-bold leading-relaxed text-navy sm:text-2xl ${
              isMeta ? "" : "text-left"
            }`}
          >
            {parts.map((p, i) => (
              <span key={i}>
                {p}
                {i < parts.length - 1 && (
                  <span className="mx-1 inline-block w-14 translate-y-0.5 border-b-[3px] border-aqua" />
                )}
              </span>
            ))}
          </p>

          <div className="space-y-3">
            {opts.map((opt, i) => {
              const selected = answers[current] === LETTERS[i];
              return (
                <button
                  key={i}
                  onClick={() => choose(LETTERS[i])}
                  dir={optsRtl ? "rtl" : "ltr"}
                  className={`flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-start transition ${
                    selected
                      ? "border-aqua bg-aqua-soft ring-2 ring-aqua/25"
                      : "border-slate-200 bg-white hover:border-aqua/60 hover:bg-aqua-mist"
                  }`}
                >
                  <span
                    dir="ltr"
                    className={`grid h-8 w-8 flex-none place-items-center rounded-lg text-sm font-bold uppercase transition ${
                      selected ? "bg-navy text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {LETTERS[i]}
                  </span>
                  <span className="flex-1 text-base font-medium text-slate-800">{opt}</span>
                  {selected && (
                    <svg viewBox="0 0 20 20" className="h-5 w-5 text-aqua-dark" fill="currentColor">
                      <path d="M7.7 13.3 4.4 10l-1.4 1.4 4.7 4.7L17 6.8l-1.4-1.4z" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
          <button
            disabled={current === 0}
            onClick={() => setCurrent(current - 1)}
            className="rounded-xl px-4 py-3 font-semibold text-slate-600 transition hover:bg-aqua-soft disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
          >
            {t.prev}
          </button>

          {isLast ? (
            <button
              disabled={answered < total}
              onClick={finish}
              className="rounded-xl bg-aqua-dark px-8 py-3 font-semibold text-white shadow-lg shadow-aqua/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t.finish}
            </button>
          ) : (
            <button
              disabled={!answers[current]}
              onClick={() => setCurrent(current + 1)}
              className="rounded-xl bg-gradient-to-r from-navy to-aqua-dark px-8 py-3 font-semibold text-white shadow-lg shadow-aqua/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-30"
            >
              {t.next}
            </button>
          )}
        </div>

        {isLast && answered < total && (
          <p className="mt-3 text-sm text-rose-600">{t.left(total - answered)}</p>
        )}

        {/* Question navigator */}
        <div dir="ltr" className="mt-6 flex flex-wrap justify-center gap-1.5">
          {answers.map((a, i) => (
            <button
              key={i}
              aria-label={t.goTo(i + 1)}
              onClick={() => setCurrent(i)}
              className={`h-2 w-2 rounded-full transition ${
                i === current
                  ? "scale-150 bg-aqua"
                  : a
                  ? "bg-navy"
                  : "bg-slate-200 hover:bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  /* ---------- RESULT ---------- */
  const offset = 339.3 * (1 - score / total);

  return (
    <div dir={rtl ? "rtl" : "ltr"} className={`${card} text-center`}>
      <div className="flex justify-center">
        {langToggle}
      </div>
      <span className="mt-4 inline-block rounded-full bg-aqua-soft px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-aqua-dark">
        {t.result}
      </span>
      <h2 className="mt-3 font-heading text-3xl font-extrabold text-navy sm:text-4xl">
        {t.well(user.firstName)}
      </h2>
      <p className="mt-1 text-slate-500">{t.here}</p>

      <div className="relative mx-auto my-8 h-56 w-56">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#12305a" />
              <stop offset="100%" stopColor="#22c1e6" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="54" fill="none" stroke="#e8f8fd" strokeWidth="8" />
          <circle
            className="ring-fg"
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            style={{ ["--offset" as string]: offset } as CSSProperties}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span dir="ltr" className="font-heading text-6xl font-extrabold leading-none text-navy">
            {level.cefr}
          </span>
          <span className="mt-2 text-sm font-semibold text-slate-500">
            <span dir="ltr">
              {score} / {total}
            </span>{" "}
            {t.correct}
          </span>
        </div>
      </div>

      <p className="font-heading text-2xl font-bold text-navy">{level.name[lang]}</p>
      <p className="mx-auto mt-2 max-w-md text-slate-500">{level.desc[lang]}</p>

      {/* Scale */}
      <div dir="ltr" className="mt-9 grid grid-cols-4 gap-2">
        {LEVELS.map((l, i) => {
          const active = i === levelIndex;
          const passed = i < levelIndex;
          return (
            <div key={l.cefr}>
              <div
                className={`h-2 rounded-full ${
                  active
                    ? "bg-gradient-to-r from-navy to-aqua"
                    : passed
                    ? "bg-navy"
                    : "bg-slate-200"
                }`}
              />
              <p className={`mt-2 text-sm font-bold ${active ? "text-navy" : "text-slate-400"}`}>
                {l.cefr}
              </p>
            </div>
          );
        })}
      </div>

      {/* Section scores */}
      <div className="mt-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
          {t.sections}
        </p>
        <div dir="ltr" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {sections.map((s) => (
            <div
              key={s.cefr}
              className={`rounded-xl border px-3 py-3 ${
                s.passed ? "border-aqua/40 bg-aqua-soft" : "border-slate-200 bg-slate-50"
              }`}
            >
              <p className="text-xs font-bold text-navy">{s.cefr}</p>
              <p className="font-heading text-lg font-extrabold text-navy">
                {s.score}/{s.total}
              </p>
              <p className="text-[11px] text-slate-500">
                {t.need}: {s.min}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-aqua/30 bg-aqua-soft px-5 py-4 text-sm text-navy">
        {t.contact}
      </div>
      <p className="mt-3 text-xs text-slate-400">{t.note}</p>

      <button
        onClick={restart}
        className="mt-6 rounded-xl bg-gradient-to-r from-navy to-aqua-dark px-8 py-3 font-semibold text-white shadow-lg shadow-aqua/25 transition hover:brightness-110"
      >
        {t.again}
      </button>
    </div>
  );
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  error?: string;
  full?: boolean;
};

function Field({ label, error, full, ...props }: FieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <label htmlFor={props.name} className="text-sm font-semibold text-navy">
        {label}
      </label>
      <input
        id={props.name}
        {...props}
        className={`rounded-xl border bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
          error
            ? "border-rose-400 focus:ring-rose-100"
            : "border-slate-300 focus:border-aqua focus:ring-aqua/20"
        }`}
      />
      {error && <span className="text-xs font-medium text-rose-600">{error}</span>}
    </div>
  );
}