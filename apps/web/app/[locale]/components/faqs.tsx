import { Container } from "./container";
import { Heading, Subheading } from "./text";

const courseFrequentlyAskedQuestions = [
  {
    question: "Do I need to know how to code already?",
    answer:
      "No, but you\u2019ll learn how software works so you can direct AI effectively. hasToggle starts from the fundamentals and builds up to production-level web apps. The goal isn\u2019t to memorize syntax \u2014 it\u2019s to understand how things fit together so you can orchestrate AI to build what you envision.",
  },
  {
    question: "Is this just another prompt engineering course?",
    answer:
      "No. You learn to build real web apps by orchestrating AI agents, not just writing prompts. hasToggle teaches architecture, debugging, code review, and shipping \u2014 the skills that matter when AI is doing the typing.",
  },
  {
    question: "What if AI gets it wrong?",
    answer:
      "That\u2019s exactly why you need to understand the fundamentals. AI is powerful but not infallible. We teach you to review, debug, and guide AI so you catch mistakes before they ship. Understanding how code works is what separates builders from prompt-typists.",
  },
  {
    question: "What tech stack will I learn?",
    answer:
      "Next.js, React, TypeScript, and modern AI tools \u2014 the same stack used to build hasToggle itself. You\u2019ll learn fullstack web development with the tools that professional teams actually use in production.",
  },
  {
    question: "What\u2019s in the weekly digest?",
    answer:
      "One misconception about AI or web development, busted with an explanation of what\u2019s actually true. Each edition is short, practical, and designed to sharpen your mental model of how modern web development really works.",
  },
];

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
            {courseFrequentlyAskedQuestions.map((faq) => (
              <dl key={faq.question}>
                <dt className="font-semibold text-base">{faq.question}</dt>
                <dd className="mt-4 text-gray-600 text-sm/6">{faq.answer}</dd>
              </dl>
            ))}
          </div>
        </section>
      </Container>
    </section>
  );
}
