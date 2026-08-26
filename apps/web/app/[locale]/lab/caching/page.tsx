import type { Metadata } from "next";
import { ShellDemo } from "../../(playground)/shell/demo";
import { ChapterShell, chapterMetadata } from "../chapter";
import { requireChapter } from "../syllabus";

const chapter = requireChapter("caching");

export const metadata: Metadata = chapterMetadata(chapter);

export default function CachingChapterPage() {
  return (
    <ChapterShell
      chapter={chapter}
      commitsHref="https://github.com/hasToggle/hasToggle.dev/commits/main/apps/web/app/%5Blocale%5D/(playground)/shell"
    >
      <ShellDemo headingAs="h1" />
    </ChapterShell>
  );
}
