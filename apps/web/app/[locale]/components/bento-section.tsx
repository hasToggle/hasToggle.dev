import Image from "next/image";
import { CodeBlock } from "./code-block";
import { Container } from "./container";
import { KeyboardAnimated } from "./keyboard-animated";
import { Heading, Subheading } from "./text";

export function BentoSection() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <Container>
        <Subheading>This is for you</Subheading>
        <Heading as="h3" className="mt-2 max-w-3xl">
          From non-technical to junior dev
        </Heading>

        <div className="mx-auto max-w-2xl lg:max-w-7xl">
          <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(0.5rem+1px)] lg:rounded-l-[calc(2rem+1px)]">
                <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                  <p className="mt-2 font-medium text-gray-950 text-lg tracking-tight max-lg:text-center">
                    No coding experience
                  </p>
                  <p className="mt-2 max-w-lg text-gray-600 text-sm/6 max-lg:text-center">
                    New to coding? You're at the right place! Learn to code from
                    scratch with beginner-friendly lectures sent directly to
                    your inbox. You'll learn essential concepts like HTML, CSS,
                    and JavaScript without any prior experience. With hands-on
                    exercises worth your time, you'll gain the confidence and
                    skills to build modern web applications.
                  </p>
                </div>
                <KeyboardAnimated />
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]" />
            </div>
            <div className="relative max-lg:row-start-1">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(0.5rem+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                  <p className="mt-2 font-medium text-gray-950 text-lg tracking-tight max-lg:text-center">
                    Step-by-step tutorials
                  </p>
                  <p className="mt-2 max-w-lg text-gray-600 text-sm/6 max-lg:text-center">
                    Learn at your own pace. Follow easy-to-understand tutorials.
                  </p>
                </div>
                <div className="flex flex-1 items-end justify-center max-lg:pt-10 max-lg:pb-12">
                  <Image
                    alt="todo list, digital illustration"
                    className="w-full rounded-md max-lg:max-w-xs"
                    height={400}
                    src="/todo_list.png"
                    width={400}
                  />
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem]" />
            </div>
            <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
              <div className="absolute inset-px rounded-lg bg-white" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(0.5rem+1px)]">
                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                  <p className="mt-2 font-medium text-gray-950 text-lg tracking-tight max-lg:text-center">
                    Full-stack developer
                  </p>
                  <p className="mt-2 max-w-lg text-gray-600 text-sm/6 max-lg:text-center">
                    Master both frontend and backend, and build full-stack web
                    applications.
                  </p>
                </div>
                <div className="relative flex flex-1 items-end [container-type:inline-size] max-lg:pt-6 lg:pb-0">
                  <Image
                    alt="female developer by night, digital illustration"
                    className="w-full object-cover object-center"
                    height={152}
                    src="/female_dev.png"
                    width={400}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-b from-15% from-white"
                  />
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5" />
            </div>
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(0.5rem+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0">
                  <p className="mt-2 font-medium text-gray-950 text-lg tracking-tight max-lg:text-center">
                    Understanding React fundamentals
                  </p>
                  <p className="mt-2 max-w-lg text-gray-600 text-sm/6 max-lg:text-center">
                    Learn the core of modern web development using React to
                    build dynamic user interfaces.
                  </p>
                </div>
                <div className="relative min-h-[30rem] w-full grow">
                  <div className="absolute top-8 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl bg-gray-950 shadow-2xl">
                    <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                      <div className="-mb-px flex font-medium text-gray-400 text-sm/6">
                        <div className="border-r border-r-white/10 border-b border-b-white/20 bg-white/5 px-4 py-2">
                          page.jsx
                        </div>
                        <div className="border-gray-600/10 border-r px-4 py-2 text-white">
                          hazelnut-counter.jsx
                        </div>
                      </div>
                    </div>
                    <div className="px-6 pt-6 pb-8">
                      <CodeBlock />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
