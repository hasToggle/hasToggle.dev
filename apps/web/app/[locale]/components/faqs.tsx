import { Container } from "./container";
import { Heading, Subheading } from "./text";

const courseFrequentlyAskedQuestions = [
  {
    question: "Who is this for?",
    answer:
      "hasToggle is for anyone ready to dive into web development, whether you\u2019re just starting out or already a junior developer looking to level up your skills. If you\u2019re non-technical and want to break into coding, we\u2019ll help you build a strong foundation. If you\u2019ve already started your journey, welcome\u2014there\u2019s plenty here to help you grow.",
  },
  {
    question: "What if I already know some programming?",
    answer:
      "That\u2019s awesome! Prior programming experience will give you an edge as you dive into web development. Your existing knowledge will help you grasp concepts more deeply, and you\u2019ll find new ways to think about coding while refining your skills and building exciting projects.",
  },
  {
    question: "Are we going to build real-world web apps?",
    answer:
      "Absolutely! We\u2019ll start by building static sites with just HTML and CSS. Then, we\u2019ll layer in JavaScript to make them dynamic. By the end, you\u2019ll use modern tools like React and Next.js to create fully functional web applications that reflect real-world use cases.",
  },
  {
    question: "Is this about frontend or backend development?",
    answer:
      "Both! This course covers fullstack development. We begin with frontend basics like HTML, CSS, and JavaScript. Then, we dive into React.js and rebuild our apps with modern tools. Later, we add backend functionality using Node.js and transition to Next.js, a framework for building fullstack web applications.",
  },
  {
    question: "What will I learn in this course?",
    answer:
      "This course has over 40 carefully crafted modules, covering everything from the fundamentals of HTML, CSS, and JavaScript to advanced topics like React, Next.js, and fullstack application development.",
  },
  {
    question: "Are we going to use AI?",
    answer:
      "Yes! Once we\u2019ve covered the basics, you\u2019ll learn how to use AI as a coding assistant. We\u2019ll explore how AI can generate code, debug problems, and help you when you\u2019re stuck. But don\u2019t worry \u2014 we focus on understanding the fundamentals first because AI works best when you know what to ask for.",
  },
  {
    question: "Do I have to do any exercises?",
    answer:
      "It\u2019s up to you! hasToggle is designed to adapt to your preferred level of engagement. Whether you prefer to simply watch the videos and follow along, or get hands-on with interactive exercises for a deeper dive, the choice is yours. Learn your way, at your pace.",
  },
  {
    question: "What if I don\u2019t like the email course?",
    answer:
      "This course is for you, and we want you to feel it\u2019s worth your time and energy. If you\u2019re not happy with our content, just send us an email or use the unsubscribe link in any of our emails.",
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
