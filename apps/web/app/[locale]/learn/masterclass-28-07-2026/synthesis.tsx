import { Heading, Subheading } from "../../components/text";

export function Synthesis() {
  return (
    <section className="fade-in animate-in py-10 duration-300 sm:py-16">
      <Subheading>Where this leaves you</Subheading>
      <Heading as="h2" className="mt-3 text-4xl sm:text-5xl">
        The machine didn&apos;t change. The job did.
      </Heading>
      <div className="mt-8 max-w-2xl space-y-5 text-foreground/75 text-lg leading-8">
        <p>
          Seven years, one machine. It could only continue your sentence, until
          people taught it what an answer looks like. It moved into the editor.
          It picked up tools and a loop that runs for hours. Now it&apos;s
          moving into the products themselves. Underneath every one of those: a
          pattern, continued until it looks finished.
        </p>
        <p>
          You saw it stop that way twice, seven years apart — the base model
          that answered a question with a question, and the agent that typed{" "}
          <em>done</em>
          {" while the job wasn't."}
        </p>
        <p>
          What moved is your side. You stopped writing syntax and started
          writing what the work has to satisfy: the design, the plan, the tests
          that read the code so you don&apos;t. Those hold only from outside the
          loop. Inside it, a rule is a request.
        </p>
        <p className="font-display text-2xl text-foreground italic">
          AI produces the artifact. You hold the meaning.
        </p>
      </div>
    </section>
  );
}
