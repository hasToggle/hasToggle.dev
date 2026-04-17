import { Container } from "./container";
import { Expandable } from "./expandable";
import { MetaAside } from "./meta-aside";
import { Heading, Subheading } from "./text";

const faqs: {
  answer: string;
  meta?: string;
  question: string;
}[] = [
  {
    question: "Does AI really get things wrong?",
    answer:
      "It does. Frequently. With absolute confidence. That\u2019s exactly why you need to understand the fundamentals. AI is powerful but not infallible. We teach you to review, debug, and guide AI so you catch mistakes before they ship. Understanding how code works is what separates builders from prompt-typists.",
    meta: "It does. Frequently. With absolute confidence. That\u2019s lesson one.",
  },
  {
    question: "What do I actually get?",
    answer:
      "A short email every Monday. One misconception about AI or web development \u2014 what it is, why it\u2019s wrong, and what\u2019s actually true. Some editions come with interactive demos like the ones on this page. All of them are designed to leave you sharper than you were before you opened them. It\u2019s free, it takes five minutes, and it\u2019s the most useful thing in your inbox that you actually open on purpose.",
  },
  {
    question: "Is this free?",
    answer:
      "The weekly digest is free. Completely, permanently, no-asterisk free. We\u2019re building something bigger \u2014 a live cohort where you build production web apps with AI, guided by the same thinking that runs through everything on this page. That\u2019s coming, and it won\u2019t be free. But the digest stands on its own. You don\u2019t need to buy anything to get value here.",
    meta: "See? We told you what we\u2019re selling. Most landing pages hide that part.",
  },
  {
    question: "Who is this for?",
    answer:
      "You write code \u2014 professionally, seriously, or getting there. You use AI and you\u2019re good at it, but sometimes you ship something and you can\u2019t quite explain why it works. Or it doesn\u2019t work and you can\u2019t quite explain why. You know enough to build things but you suspect there are gaps you haven\u2019t found yet. You\u2019re right. There are. Everyone has them. This is a place where finding them feels like progress, not failure.",
  },
  {
    question: "Why Claude specifically?",
    answer:
      "Because it\u2019s what we use, and we teach from experience, not theory. Claude is the AI we build with every day. But nothing here is locked to one tool. The thinking skills \u2014 knowing what to ask, catching wrong defaults, seeing through surface simplicity \u2014 those work whether you\u2019re using Claude, Cursor, Copilot, or whatever ships next Tuesday. We teach with Claude. You\u2019ll carry it everywhere.",
  },
];

const whoBio = {
  short:
    "Eric. He studied how people think, then how computers think, then how to explain one to the other. A Master\u2019s in Education made it official. But classrooms move in semesters and tech moves in weeks, so he became a developer and found his way back to teaching on his own terms.",
  origin:
    "He spent three years as a junior dev shipping internal tools on a server-side JavaScript engine from 2007 with no modern syntax. Then went independent as a senior engineer and lead coach on immersive three-month web dev bootcamps \u2014 the kind where students quit their jobs, rearrange their lives, and you owe them a working career at the end of it. Cohort after cohort, full-time, \u201Cwhat\u2019s a variable\u201D to shipping production Next.js apps in ninety days. When over a hundred students kept struggling with React state, he didn\u2019t explain it again \u2014 he built an interactive tool that shows what actually happens under the hood. That tool was the first hasToggle demo. The rest followed from the same instinct: if the explanation isn\u2019t landing, build something that makes it impossible to misunderstand.",
  meta: "He also hacked his dorm\u2019s laundry machines for two years. Some people question systems professionally. Some start early.",
};

export function FrequentlyAskedQuestions() {
  return (
    <section
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-32"
      id="faq"
    >
      <Container>
        <section className="scroll-mt-8" id="faqs">
          <Subheading className="text-center">
            Frequently asked questions
          </Subheading>
          <Heading as="div" className="mt-2 text-center">
            Your questions answered.
          </Heading>
          <div className="mx-auto mt-16 mb-32 max-w-xl space-y-12">
            {faqs.map((faq) => (
              <dl key={faq.question}>
                <dt className="font-semibold text-base">{faq.question}</dt>
                <dd className="mt-4 text-gray-600 text-sm/6">{faq.answer}</dd>
                {faq.meta && (
                  <dd className="mt-2">
                    <MetaAside>{faq.meta}</MetaAside>
                  </dd>
                )}
              </dl>
            ))}

            {/* Who makes this — special treatment */}
            <dl>
              <dt className="font-semibold text-base">Who makes this?</dt>
              <dd className="mt-4 text-gray-600 text-sm/6">{whoBio.short}</dd>
              <dd>
                <Expandable label="How hasToggle started">
                  <p>{whoBio.origin}</p>
                </Expandable>
              </dd>
              <dd className="mt-2">
                <MetaAside>{whoBio.meta}</MetaAside>
              </dd>
            </dl>
          </div>
        </section>
      </Container>
    </section>
  );
}
