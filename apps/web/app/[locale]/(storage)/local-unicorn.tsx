"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Switch } from "@repo/design-system/components/ui/switch";
import { cn } from "@repo/design-system/lib/utils";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

export default function LocalMenagerie() {
  return (
    <>
      <div className="lg:hidden">
        <LocalMenagerieMobile />
      </div>
      <div className="hidden lg:block">
        <LocalMenagerieDesktop />
      </div>
    </>
  );
}

function AnimalRow({
  label,
  value,
  activeClass,
  summonLabel,
  summonedLabel,
  dismissLabel,
  onSummon,
  onDismiss,
}: {
  label: string;
  value: string;
  activeClass: string;
  summonLabel: string;
  summonedLabel: string;
  dismissLabel: string;
  onSummon: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="flex items-center gap-4 text-gray-200">
      <span
        className={cn("min-w-[200px] transition-colors", value && activeClass)}
      >
        {label}: {value && <span className="animate-pulse">{value}</span>}
      </span>
      <Button
        className={cn(
          "transition-colors dark:border-gray-200 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100",
          !value && "text-gray-700 dark:text-gray-700"
        )}
        disabled={!!value}
        onClick={onSummon}
        size="sm"
        variant={value ? "secondary" : "outline"}
      >
        {value ? summonedLabel : summonLabel}
      </Button>
      <Button
        className={cn(!value && "opacity-50")}
        disabled={!value}
        onClick={onDismiss}
        size="sm"
        variant="ghost"
      >
        {dismissLabel}
      </Button>
    </div>
  );
}

export function LocalMenagerieDesktop() {
  const [unicorn, setUnicorn, removeUnicorn] = useLocalStorage("unicorn", "");
  const [horse, setHorse, removeHorse] = useLocalStorage("horse", "");
  const [duck, setDuck, removeDuck] = useLocalStorage("duck", "");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="ml-10 w-full max-w-4xl space-y-6 rounded-b-2xl bg-gray-700/20 px-6 py-6 pr-14 shadow-sm ring-1 ring-white/10">
        <h2 className="max-w-xl text-gray-400 text-sm">
          Need to store a horse? Or a unicorn? Web development has got you
          covered! Try this: reload the page to see these animals persist across
          page refreshes.
        </h2>

        <div className="space-y-4">
          <div className="flex items-center gap-4 text-gray-200" />
          <div className="flex items-center gap-4 text-gray-200" />
          <div className="flex items-center gap-4 text-gray-200" />
        </div>

        <p className="mt-4 text-gray-400 text-xs italic">
          Disclaimer: All creatures are virtual and well-cared for. The debug
          duck has a PhD in Rubber Duck Debugging and is professionally trained
          to handle your code confessions.
        </p>
      </div>
    );
  }

  return (
    <div className="ml-10 w-full max-w-4xl space-y-6 rounded-b-2xl bg-gray-700/20 px-6 py-6 pr-14 shadow-sm ring-1 ring-white/10">
      <h2 className="max-w-xl text-gray-400 text-sm">
        Need to store a horse? Or a unicorn? Web development has got you
        covered! Try this: reload the page to see these animals persist across
        page refreshes.
      </h2>

      <div className="space-y-4">
        <AnimalRow
          activeClass="font-medium text-purple-300"
          dismissLabel="Dismiss Unicorn"
          label="Magical Unicorn"
          onDismiss={() => removeUnicorn()}
          onSummon={() => setUnicorn("\u{1F984}")}
          summonedLabel={"\u2728 Summoned!"}
          summonLabel="Summon Unicorn"
          value={unicorn}
        />
        <AnimalRow
          activeClass="font-medium text-amber-300"
          dismissLabel="Release Horse"
          label="Regular Horse"
          onDismiss={() => removeHorse()}
          onSummon={() => setHorse("\u{1F40E}")}
          summonedLabel={"\u{1F31F} Stabled!"}
          summonLabel="Stable Horse"
          value={horse}
        />
        <AnimalRow
          activeClass="font-medium text-cyan-300"
          dismissLabel="Debug Complete"
          label="Debug Duck"
          onDismiss={() => removeDuck()}
          onSummon={() => setDuck("\u{1F986}")}
          summonedLabel={"\u{1F527} Deployed!"}
          summonLabel="Deploy Duck"
          value={duck}
        />
      </div>

      <p className="mt-4 text-gray-400 text-xs italic">
        Disclaimer: All creatures are virtual and well-cared for. The debug duck
        has a PhD in Rubber Duck Debugging and is professionally trained to
        handle your code confessions.
      </p>
    </div>
  );
}

export function LocalMenagerieMobile() {
  const [unicorn, setUnicorn, removeUnicorn] = useLocalStorage("unicorn", "");
  const [horse, setHorse, removeHorse] = useLocalStorage("horse", "");
  const [duck, setDuck, removeDuck] = useLocalStorage("duck", "");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleCreature = (creature: string) => {
    if (creature === "unicorn") {
      if (unicorn) {
        removeUnicorn();
      } else {
        setUnicorn("\u{1F984}");
      }
    } else if (creature === "horse") {
      if (horse) {
        removeHorse();
      } else {
        setHorse("\u{1F40E}");
      }
    } else if (creature === "duck") {
      if (duck) {
        removeDuck();
      } else {
        setDuck("\u{1F986}");
      }
    }
  };

  if (!isClient) {
    return (
      <div className="ml-10 w-full max-w-4xl space-y-6 rounded-b-2xl bg-gray-700/20 px-6 py-6 pr-14 shadow-sm ring-1 ring-white/10">
        <h2 className="max-w-xl text-gray-400 text-sm">
          Need to store a horse? Or a unicorn? Web development has got you
          covered! Try this: reload the page to see these animals persist across
          page refreshes.
        </h2>

        <div className="space-y-4">
          <div className="flex items-center gap-4 text-gray-200" />
          <div className="flex items-center gap-4 text-gray-200" />
          <div className="flex items-center gap-4 text-gray-200" />
        </div>

        <p className="mt-4 text-gray-400 text-xs italic">
          Disclaimer: All creatures are virtual and well-cared for. The debug
          duck has a PhD in Rubber Duck Debugging and is professionally trained
          to handle your code confessions.
        </p>
      </div>
    );
  }

  return (
    <div className="ml-10 w-full max-w-4xl space-y-6 rounded-b-2xl bg-gray-700/20 px-6 py-6 pr-14 shadow-sm ring-1 ring-white/10">
      <h2 className="max-w-xl text-gray-400 text-sm">
        Need to store a horse? Or a unicorn? Try the switches and reload the
        page to see these animals persist across page refreshes.
      </h2>

      <div className="flex justify-center">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between gap-4 text-gray-200">
            <span
              className={cn(
                "min-w-[100px] transition-colors sm:min-w-[200px]",
                unicorn && "font-medium text-purple-300"
              )}
            >
              Magical Unicorn:{" "}
              {unicorn && <span className="animate-pulse">{unicorn}</span>}
            </span>
            <span className="flex items-center sm:gap-3">
              <Switch
                checked={!!unicorn}
                onCheckedChange={() => toggleCreature("unicorn")}
              />
            </span>
          </div>

          <div className="flex justify-between gap-4 text-gray-200">
            <span
              className={cn(
                "min-w-[100px] transition-colors sm:min-w-[200px]",
                horse && "font-medium text-amber-300"
              )}
            >
              Regular Horse:{" "}
              {horse && <span className="animate-pulse">{horse}</span>}
            </span>
            <span className="flex items-center sm:gap-3">
              <Switch
                checked={!!horse}
                onCheckedChange={() => toggleCreature("horse")}
              />
            </span>
          </div>

          <div className="flex justify-between gap-4 text-gray-200">
            <span
              className={cn(
                "min-w-[100px] transition-colors sm:min-w-[200px]",
                duck && "font-medium text-cyan-300"
              )}
            >
              Debug Duck:{" "}
              {duck && <span className="animate-pulse">{duck}</span>}
            </span>
            <span className="flex items-center sm:gap-3">
              <Switch
                checked={!!duck}
                onCheckedChange={() => toggleCreature("duck")}
              />
            </span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-gray-400 text-xs italic">
        Disclaimer: All creatures are virtual and well-cared for. The debug duck
        has a PhD in Rubber Duck Debugging and is professionally trained to
        handle your code confessions.
      </p>
    </div>
  );
}
