import type { Metadata } from "next";
import { ShellDemo } from "../../(playground)/shell/demo";
import { ChapterShell, chapterMetadata } from "../chapter";
import { requireChapter } from "../syllabus";

const chapter = requireChapter("caching");

export const metadata: Metadata = chapterMetadata(chapter);

export default function CachingChapterPage() {
  return (
    <ChapterShell chapter={chapter}>
      <ShellDemo headingAs="h1" />
    </ChapterShell>
  );
}
