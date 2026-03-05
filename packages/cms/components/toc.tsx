import type { TocEntry } from "../lib/mdx";

interface TableOfContentsProperties {
  readonly entries: TocEntry[];
}

export const TableOfContents = ({ entries }: TableOfContentsProperties) => (
  <div>
    <ul className="flex list-none flex-col gap-2 text-sm">
      {entries.map((entry) => (
        <li className={entry.depth > 2 ? "pl-3" : undefined} key={entry.id}>
          <a
            className="line-clamp-3 flex rounded-sm text-foreground text-sm underline decoration-foreground/0 transition-colors hover:decoration-foreground/50"
            href={`#${entry.id}`}
          >
            {entry.title}
          </a>
        </li>
      ))}
    </ul>
  </div>
);
