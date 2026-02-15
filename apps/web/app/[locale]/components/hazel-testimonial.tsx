import Image from "next/image";
import { Container } from "./container";

export function Testimonial() {
  return (
    <div className="mx-2 mt-40 mb-24 rounded-4xl bg-[url(/dot-texture.svg)] bg-gray-900 pt-72 pb-24 lg:pt-36">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[384px_1fr_1fr]">
          <div className="-mt-96 lg:-mt-52">
            <div className="-m-2 rounded-4xl bg-white/15 shadow-[inset_0_0_2px_1px_#ffffff4d] ring-1 ring-black/5 max-lg:mx-auto max-lg:max-w-xs">
              <div className="rounded-4xl p-2 shadow-black/5 shadow-md">
                <div className="overflow-hidden rounded-3xl shadow-2xl outline outline-black/10 -outline-offset-1">
                  <Image
                    alt=""
                    className="aspect-3/4 w-full object-cover"
                    height={512}
                    src="/testimonials/squirrel_coconut.png"
                    width={384}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex max-lg:mt-16 lg:col-span-2 lg:px-16">
            <figure className="mx-auto flex max-w-xl flex-col gap-16 max-lg:text-center">
              <blockquote>
                <p className="relative text-3xl text-white tracking-tight before:absolute before:-translate-x-full before:content-['“'] after:absolute after:content-['”'] lg:text-4xl">
                  With hasToggle, I am more confident than ever when tackling
                  tough challenges like cracking open a coconut.
                </p>
              </blockquote>
              <figcaption className="mt-auto">
                <p className="font-medium text-sm/6 text-white">Hazel</p>
                <p className="font-medium text-sm/6">
                  <span className="bg-linear-to-r from-28% from-[#fff1be] via-70% via-[#ee87cb] to-[#b060ff] bg-clip-text text-transparent">
                    Junior React developer, hasToggle
                  </span>
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </Container>
    </div>
  );
}
