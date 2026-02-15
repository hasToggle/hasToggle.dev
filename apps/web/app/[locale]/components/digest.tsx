"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Container } from "./container";

interface SignUpSuccess {
  message: string;
}

interface SignUpError {
  error: {
    message: string;
    name: string;
  };
}

type SignUpResponse = SignUpSuccess | SignUpError;

const buttonCopy = {
  idle: "Add me",
  loading: <Spinner />,
  success: "Check your inbox!",
};

export function Digest() {
  const [loading, setLoading] = useState<"idle" | "loading" | "success">(
    "idle"
  );
  const [error, setError] = useState<SignUpError | null>(null);

  const handleSignUp = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const emailInput = form.elements.namedItem("email") as HTMLInputElement;
    setLoading("loading");
    try {
      const res = await fetch("/api/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailInput.value,
        }),
      });
      const data: SignUpResponse = await res.json();
      if ("error" in data) {
        setError(data);
        setLoading("idle");
      } else {
        setLoading("success");
        form.reset();
      }
    } catch (_error) {
      setError({
        error: {
          message: "A network error occurred. Please try again.",
          name: "NetworkError",
        },
      });
      setLoading("idle");
    }
  };

  return (
    <section aria-label="Digest sign-up" id="digest">
      <Container className="relative py-20" size="xs">
        <form className="lg:pl-16" onSubmit={handleSignUp}>
          <h3 className="font-medium text-base text-gray-800 tracking-tight">
            Be the first to collect hazelnuts!
          </h3>
          <div className="mt-4 sm:relative sm:flex sm:items-center sm:px-1 sm:py-0.5">
            <div className="relative sm:static sm:flex-auto">
              <input
                aria-label="Email address"
                className="peer relative z-10 w-full appearance-none rounded-md bg-transparent px-4 py-2 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none sm:py-3"
                id="email"
                name="email"
                placeholder="Email address"
                required
                type="email"
              />
              <div className="absolute inset-0 rounded-md border border-gray-400 peer-focus:border-blue-500 peer-focus:bg-white/5 peer-focus:ring-1 peer-focus:ring-blue-500 sm:rounded-lg" />
            </div>
            <button
              className="mt-4 inline-flex w-full items-center justify-center overflow-hidden rounded-md border border-transparent bg-white px-4 py-2 font-semibold text-base text-ht-blue-700 tracking-tight shadow-[0_0_0.2em_0em_rgba(56,189,248,0.2)] ring-1 ring-black/10 hover:text-ht-blue-800 hover:shadow-[0_0_0.5em_0em_rgba(56,189,248,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-70 sm:relative sm:z-10 sm:mt-0 sm:w-48 sm:flex-none"
              disabled={loading !== "idle"}
              type="submit"
            >
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 25 }}
                  initial={{ opacity: 0, y: -25 }}
                  key={loading}
                  transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                >
                  {buttonCopy[loading]}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </form>
        <div className="mt-4">
          {loading === "success" && (
            <p className="font-medium text-base text-ht-blue-700">
              A confirmation email has been sent to you.
            </p>
          )}
          {error && (
            <p className="text-ht-red-700 text-sm">
              Error: {error.error.message}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin"
      height="28"
      viewBox="0 0 50 50"
      width="28"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Loading...</title>
      <path
        d="M41.9 23.9c-.3-6.1-4-11.8-9.5-14.4c-6-2.7-13.3-1.6-18.3 2.6c-4.8 4-7 10.5-5.6 16.6c1.3 6 6 10.9 11.9 12.5c7.1 2 13.6-1.4 17.6-7.2c-3.6 4.8-9.1 8-15.2 6.9s-11.1-5.7-12.5-11.7c-1.5-6.4 1.5-13.1 7.2-16.4c5.9-3.4 14.2-2.1 18.1 3.7c1 1.4 1.7 3.1 2 4.8c.3 1.4.2 2.9.4 4.3c.2 1.3 1.3 3 2.8 2.1c1.3-.8 1.2-2.5 1.1-3.8c0-.4.1.7 0 0"
        fill="#0093e2"
      />
    </svg>
  );
}
