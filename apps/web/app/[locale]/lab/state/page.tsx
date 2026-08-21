import type { Metadata } from "next";
import { StateDemo } from "../../(playground)/state/demo";
import { ChapterShell, chapterMetadata } from "../chapter";
import { requireChapter } from "../syllabus";

const chapter = requireChapter("state");

export const metadata: Metadata = chapterMetadata(chapter);

export default function StateChapterPage() {
  return (
    <ChapterShell
      chapter={chapter}
      commitsHref="https://github.com/hasToggle/hasToggle.dev/commits/main/apps/web/app/%5Blocale%5D/(playground)/state"
    >
      <StateDemo headingAs="h1" />
    </ChapterShell>
  );
}
