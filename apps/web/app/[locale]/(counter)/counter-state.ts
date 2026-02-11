import type { Reducer } from "react";

export type DesktopState = {
  count: number;
  internalCount: number;
  disabled: boolean;
  info: string;
  title: string;
  aside: string;
  label: string;
  animateRerendering: boolean;
  image: string;
};

export type DesktopAction = {
  type: "updating" | "updated";
};

export const initialDesktopState: DesktopState = {
  count: 0,
  internalCount: 0,
  disabled: true,
  info: "Hazel is a professional squirrel and junior React developer. She can collect hazelnuts for you.",
  title: "About hazelnuts \u{1F330}",
  aside:
    "Winter is coming. Hazel needs to save some hazelnuts for the cold months.",
  label: "Become a React dev",
  animateRerendering: false,
  image: "/testimonials/squirrel_waving.png",
};

export const desktopCounterReducer: Reducer<DesktopState, DesktopAction> = (
  state,
  action
) => {
  switch (action.type) {
    case "updating":
      return {
        ...state,
        internalCount: state.internalCount + 1,
        info: "Hazel has got a fine nose. She can smell something\u2019s happening.",
        label: "React",
        disabled: false,
        title: "Hazel is ready!",
        aside: "Click the button to have Hazel get another hazelnut.",
        image: "/testimonials/squirrel_waiting.png",
      };
    case "updated":
      return {
        ...state,
        count: state.count + 1,
        info: "That\u2019s the spirit! You and Hazel are a great team.",
        label: "React",
        animateRerendering: true,
        disabled: true,
        title: "Well done!",
        aside: "You are now a React dev.",
        image: "/testimonials/squirrel_happy.png",
      };
    default:
      throw new Error("Unknown action type.");
  }
};

export type MobileState = {
  count: number;
  label: string;
  incrementDisabled: boolean;
  decrementDisabled: boolean;
  title: string;
  paragraph: string;
  cta: string;
  image: string;
};
export type MobileAction = {
  type: "decrement" | "increment";
};

export const initialMobileState: MobileState = {
  count: 0,
  label: "Become a React dev",
  incrementDisabled: false,
  decrementDisabled: true,
  title: "Let\u2019s go hazelnuts \u{1F330}",
  paragraph:
    "See Hazel over there on the left? She is a professional squirrel and a junior React developer.",
  cta: "Give her a hazelnut and watch what happens.",
  image: "/testimonials/squirrel_waving.png",
};

export const mobileCounterReducer: Reducer<MobileState, MobileAction> = (
  state,
  action
) => {
  switch (action.type) {
    case "decrement":
      return {
        ...state,
        count: state.count - 1,
        label: "Become a Badass",
        title:
          state.count - 1 <= 0
            ? "Hazel is out of nuts."
            : "Hazel looks at you.",
        paragraph:
          state.count - 1 <= 0
            ? "Did you just take the last hazelnut? Hazel is not happy. Maybe you should cheer her up with another hazelnut."
            : "Hazel gave away one of her nuts. But winter is coming and she needs to save some for the cold months.",
        cta: "As an aspiring React dev yourself, you shouldn\u2019t take any more of her hazelnuts.",
        decrementDisabled: state.count - 1 <= 0,
        incrementDisabled: false,
        image:
          state.count - 1 <= 0
            ? "/testimonials/squirrel_arms_crossed.png"
            : "/testimonials/squirrel_reluctant.png",
      };
    case "increment":
      return {
        ...state,
        count: state.count + 1,
        label: "Become a React Dev",
        title: "Hazel is happy!",
        paragraph:
          "Keep it coming, and Hazel will be very happy by the end of the day.",
        cta: "I wouldn\u2019t try taking her hazelnuts, though.",
        incrementDisabled: false,
        decrementDisabled: state.count + 1 <= 0,
        image: "/testimonials/squirrel_happy.png",
      };
    default:
      throw new Error("Unknown action type.");
  }
};
