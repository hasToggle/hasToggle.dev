import type { Metadata } from "next";
import { MutationDemo } from "../../(playground)/mutation/demo";
import { ChapterShell, chapterMetadata } from "../chapter";
import { requireChapter } from "../syllabus";

const chapter = requireChapter("server-actions");

export const metadata: Metadata = chapterMetadata(chapter);

export default function ServerActionsChapterPage() {
  return (
    <ChapterShell
      chapter={chapter}
      commitsHref="https://github.com/hasToggle/hasToggle.dev/commits/main/apps/web/app/%5Blocale%5D/(playground)/mutation"
    >
      <MutationDemo headingAs="h1" />
    </ChapterShell>
  );
}
