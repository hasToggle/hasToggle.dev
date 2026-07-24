export function RhythmFigure({ src }: { src?: string }) {
  if (!src) {
    return null;
  }
  return (
    <figure className="mt-10 max-w-2xl">
      {/* biome-ignore lint/performance/noImgElement: static local asset, no optimization pipeline needed */}
      <img
        alt="A week of work: long flat stretches labeled thinking and planning, then narrow bands where twenty parallel sessions land at once"
        className="w-full rounded-lg border border-foreground/10"
        src={src}
      />
      <figcaption className="mt-2 font-mono text-muted-foreground text-xs">
        A normal week. Aesop had opinions about this race — he never considered
        the turtle might employ the rabbits. The mechanism is in room III.
      </figcaption>
    </figure>
  );
}
