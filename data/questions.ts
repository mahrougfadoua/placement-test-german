export type Letter = "a" | "b" | "c" | "d";

export type Question = {
  /** Question text. German with "___" for a blank, or an English prompt for meta questions. */
  q: string;
  /** Arabic version of the prompt (only for meta questions). */
  qAr?: string;
  /** German reading passage shown above the question. */
  p?: string;
  /** Options (German, or English for meta questions). */
  o: string[];
  /** Arabic options (only for meta questions). */
  oAr?: string[];
  /** Correct answer. */
  a: Letter;
};

export const questions: Question[] = [
  /* ---------------- A1 (1–12) ---------------- */
  { q: "Ich ___ Anna.", o: ["heiße", "heißt", "heißen", "heiß"], a: "a" },
  { q: "Woher ___ du?", o: ["kommen", "kommst", "kommt", "komme"], a: "b" },
  { q: "What is the correct article for „Buch“?", qAr: "ما أداة التعريف الصحيحة لكلمة „Buch“؟", o: ["der", "die", "das", "den"], a: "c" },
  { q: "Wir ___ in Algerien.", o: ["wohne", "wohnt", "wohnen", "wohnst"], a: "c" },
  { q: "Das ist ___ Schwester.", o: ["mein", "meine", "meinen", "meiner"], a: "b" },
  { q: "What does „Montag“ mean?", qAr: "ماذا تعني كلمة „Montag“؟", o: ["Sunday", "Monday", "Tuesday", "Friday"], oAr: ["الأحد", "الاثنين", "الثلاثاء", "الجمعة"], a: "b" },
  { q: "Ich trinke ___ Kaffee.", o: ["ein", "einen", "eine", "einem"], a: "b" },
  { q: "Choose the correct sentence.", qAr: "اختر الجملة الصحيحة.", o: ["Heute ich lerne Deutsch.", "Heute lerne ich Deutsch.", "Ich heute Deutsch lerne.", "Lerne heute ich Deutsch."], a: "b" },
  { q: "___ du einen Bruder?", o: ["Hast", "Hat", "Haben", "Bist"], a: "a" },
  { q: "What does „Entschuldigung“ mean?", qAr: "ماذا تعني كلمة „Entschuldigung“؟", o: ["Good night", "Excuse me / Sorry", "See you tomorrow", "Congratulations"], oAr: ["تصبح على خير", "عذراً / آسف", "أراك غداً", "تهانينا"], a: "b" },
  { q: "Am Wochenende ___ ich Fußball.", o: ["spiele", "spielt", "spielen", "spielst"], a: "a" },
  {
    p: "Lena ist 19 Jahre alt. Sie wohnt in Berlin und studiert Medizin. Am Abend liest sie gern.",
    q: "What does Lena study?", qAr: "ماذا تدرس لينا؟",
    o: ["German", "Medicine", "History", "Engineering"], oAr: ["الألمانية", "الطب", "التاريخ", "الهندسة"], a: "b",
  },

  /* ---------------- A2 (13–24) ---------------- */
  { q: "Gestern ___ ich meine Freundin besucht.", o: ["habe", "bin", "hat", "war"], a: "a" },
  { q: "Wir sind um 8 Uhr ___ Hause gegangen.", o: ["zu", "nach", "bei", "in"], a: "b" },
  { q: "Ich interessiere mich ___ Musik.", o: ["an", "für", "mit", "über"], a: "b" },
  { q: "What does „die Verspätung“ mean?", qAr: "ماذا تعني كلمة „die Verspätung“؟", o: ["Appointment", "Delay", "Invitation", "Direction"], oAr: ["موعد", "تأخير", "دعوة", "اتجاه"], a: "b" },
  { q: "Ich bleibe zu Hause, ___ ich krank bin.", o: ["denn", "aber", "weil", "oder"], a: "c" },
  { q: "Kannst du mir bitte ___ Buch geben?", o: ["der", "den", "dem", "das"], a: "d" },
  {
    q: "Choose the correct sentence.", qAr: "اختر الجملة الصحيحة.",
    o: ["Ich weiß nicht, wo ist der Bahnhof.", "Ich weiß nicht, wo der Bahnhof ist.", "Ich weiß nicht, wo der Bahnhof.", "Ich weiß nicht, wo ist Bahnhof der."], a: "b",
  },
  { q: "Wenn ich Zeit ___, besuche ich dich.", o: ["habe", "hatte", "haben", "hätte"], a: "a" },
  { q: "What is a „Quittung“?", qAr: "ما معنى „Quittung“؟", o: ["A receipt", "A suitcase", "A prescription", "A timetable"], oAr: ["إيصال", "حقيبة سفر", "وصفة طبية", "جدول مواعيد"], a: "a" },
  { q: "Meine Wohnung ist ___ als deine.", o: ["groß", "größer", "am größten", "mehr groß"], a: "b" },
  { q: "Ich muss heute länger ___, weil ich viel Arbeit habe.", o: ["arbeiten", "arbeite", "gearbeitet", "arbeitet"], a: "a" },
  {
    p: "Markus fährt jeden Morgen mit dem Bus zur Arbeit. Heute ist der Bus ausgefallen, deshalb nimmt er ein Taxi.",
    q: "Why does Markus take a taxi today?", qAr: "لماذا يستقل ماركوس سيارة أجرة اليوم؟",
    o: ["He missed his alarm.", "The bus is not running.", "He has no bus ticket.", "He is going on holiday."],
    oAr: ["لأنه لم يستيقظ على صوت المنبّه.", "لأن الحافلة لا تعمل.", "لأنه لا يملك تذكرة حافلة.", "لأنه ذاهب في عطلة."], a: "b",
  },

  /* ---------------- B1 (25–37) ---------------- */
  { q: "Obwohl es stark regnete, ___ wir spazieren gegangen.", o: ["sind", "haben", "waren", "werden"], a: "a" },
  { q: "Wenn ich mehr Geld hätte, ___ ich eine längere Reise machen.", o: ["werde", "würde", "werde ich", "wurde"], a: "b" },
  { q: "What does „sich um eine Stelle bewerben“ mean?", qAr: "ماذا تعني العبارة „sich um eine Stelle bewerben“؟", o: ["To resign from a job", "To apply for a position", "To get promoted", "To attend a meeting"], oAr: ["الاستقالة من وظيفة", "التقدّم لوظيفة", "الحصول على ترقية", "حضور اجتماع"], a: "b" },
  { q: "Das ist die Kollegin, ___ mir gestern geholfen hat.", o: ["die", "der", "den", "deren"], a: "a" },
  {
    q: "Choose the correct sentence.", qAr: "اختر الجملة الصحيحة.",
    o: ["Nachdem ich gegessen hatte, ging ich spazieren.", "Nachdem ich hatte gegessen, ich ging spazieren.", "Nachdem gegessen ich hatte, ging spazieren ich.", "Nachdem ich gegessen, ich spazieren ging."], a: "a",
  },
  { q: "Er sagte, dass er am nächsten Tag nicht ___ könne.", o: ["kommen", "kommt", "gekommen", "kam"], a: "a" },
  { q: "What does „eine Entscheidung treffen“ mean?", qAr: "ماذا تعني العبارة „eine Entscheidung treffen“؟", o: ["To ask a question", "To make a decision", "To change an appointment", "To keep a promise"], oAr: ["طرح سؤال", "اتخاذ قرار", "تغيير موعد", "الوفاء بوعد"], a: "b" },
  { q: "Trotz ___ Wetters fand das Konzert statt.", o: ["schlechtes", "schlechtem", "schlechten", "schlechter"], a: "c" },
  { q: "Ich freue mich darauf, dich bald ___.", o: ["sehen", "zu sehen", "gesehen", "sehe"], a: "b" },
  {
    p: "Viele Unternehmen ermöglichen ihren Angestellten inzwischen, teilweise von zu Hause aus zu arbeiten. Das spart den Arbeitsweg, erfordert aber eine gute Selbstorganisation.",
    q: "What challenge of working from home is mentioned?", qAr: "ما التحدّي المذكور في العمل من المنزل؟",
    o: ["Higher travel costs", "The need for good self-organization", "Fewer holidays", "Longer office hours"],
    oAr: ["ارتفاع تكاليف التنقّل", "الحاجة إلى تنظيم ذاتي جيّد", "قلّة الإجازات", "ساعات عمل أطول في المكتب"], a: "b",
  },
  { q: "Je regelmäßiger man übt, ___ sicherer wird man.", o: ["desto", "obwohl", "damit", "während"], a: "a" },
  { q: "Der Bericht muss bis Freitag ___ werden.", o: ["schreiben", "geschrieben", "schrieb", "geschriebenes"], a: "b" },
  { q: "What does „eine Herausforderung meistern“ mean?", qAr: "ماذا تعني العبارة „eine Herausforderung meistern“؟", o: ["To avoid a task", "To overcome a challenge", "To postpone a decision", "To explain a rule"], oAr: ["تجنّب مهمة", "التغلّب على تحدٍّ", "تأجيل قرار", "شرح قاعدة"], a: "b" },

  /* ---------------- B2 (38–50) ---------------- */
  { q: "Hätte ich früher davon erfahren, ___ ich dir Bescheid gesagt.", o: ["habe", "hatte", "hätte", "würde"], a: "c" },
  { q: "Die Ergebnisse, ___ Aussagekraft häufig diskutiert wird, sind noch vorläufig.", o: ["deren", "dessen", "denen", "die"], a: "a" },
  {
    q: "What does „etwas in Betracht ziehen“ mean?", qAr: "ماذا تعني العبارة „etwas in Betracht ziehen“؟",
    o: ["To reject something immediately", "To take something into consideration", "To forget something deliberately", "To criticize something publicly"],
    oAr: ["رفض شيء فوراً", "أخذ شيء بعين الاعتبار", "نسيان شيء عن قصد", "انتقاد شيء علناً"], a: "b",
  },
  { q: "Die Maßnahme wurde eingeführt, ___ die Sicherheit zu erhöhen.", o: ["indem", "um", "obwohl", "während"], a: "b" },
  {
    q: "Choose the most natural formal sentence.", qAr: "اختر الجملة الرسمية الأكثر طبيعية.",
    o: ["Wegen dem Streik viele Züge fallen aus.", "Aufgrund des Streiks fallen zahlreiche Züge aus.", "Weil des Streiks fallen Züge aus.", "Aufgrund der Streik zahlreiche Züge ausfallen."], a: "b",
  },
  { q: "Er tat so, als ___ er von nichts gewusst.", o: ["hat", "hätte", "habe", "hatte"], a: "b" },
  {
    q: "What does „die Rahmenbedingungen“ mean?", qAr: "ماذا تعني كلمة „die Rahmenbedingungen“؟",
    o: ["The general conditions or framework", "The final results", "Personal opinions", "Legal penalties"],
    oAr: ["الشروط العامة أو الإطار العام", "النتائج النهائية", "الآراء الشخصية", "العقوبات القانونية"], a: "a",
  },
  { q: "Die Kosten und der Zeitaufwand ___ berücksichtigt werden.", o: ["muss", "müssen", "soll", "dürfen"], a: "b" },
  {
    p: "Die Digitalisierung eröffnet zwar neue Möglichkeiten für den Zugang zu Bildung, doch profitieren nicht alle gleichermaßen davon. Insbesondere fehlende technische Ausstattung und mangelnde Medienkompetenz können bestehende Ungleichheiten verstärken.",
    q: "What is the main concern expressed in the text?", qAr: "ما الشاغل الرئيسي الذي يعبّر عنه النص؟",
    o: ["Digital learning is always less effective.", "Digitalization may deepen existing inequalities.", "Schools should stop using technology.", "Technical equipment is no longer necessary."],
    oAr: ["التعلّم الرقمي أقل فعالية دائماً.", "قد تؤدي الرقمنة إلى تعميق أوجه عدم المساواة القائمة.", "ينبغي للمدارس التوقف عن استخدام التكنولوجيا.", "لم تعد المعدات التقنية ضرورية."], a: "b",
  },
  { q: "Nachdem der Vertrag ___ worden war, konnten die Arbeiten beginnen.", o: ["unterzeichnen", "unterzeichnet", "unterzeichnete", "unterzeichnend"], a: "b" },
  { q: "Die Ergebnisse sind nicht eindeutig; sie müssen daher mit Vorsicht ___.", o: ["interpretiert werden", "verhindert werden", "abgeschafft werden", "vorgeworfen werden"], a: "a" },
  { q: "Es ist unerlässlich, dass alle Beteiligten rechtzeitig informiert ___.", o: ["werden", "wird", "wurden", "worden"], a: "a" },
  {
    p: "Befürworter flexibler Arbeitszeiten betonen die bessere Vereinbarkeit von Beruf und Privatleben. Kritiker weisen hingegen darauf hin, dass die Grenzen zwischen Arbeitszeit und Freizeit dadurch zunehmend verschwimmen können.",
    q: "Which contrast does the text present?", qAr: "ما التباين الذي يعرضه النص؟",
    o: ["Higher salaries versus lower taxes", "Flexibility and work-life balance versus blurred boundaries", "Office work versus international travel", "Training opportunities versus job security"],
    oAr: ["رواتب أعلى مقابل ضرائب أقل", "المرونة والتوازن بين العمل والحياة مقابل تلاشي الحدود", "العمل المكتبي مقابل السفر الدولي", "فرص التدريب مقابل الأمان الوظيفي"], a: "b",
  },
];