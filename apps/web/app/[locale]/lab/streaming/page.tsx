import type { Metadata } from "next";
import { StreamDemo } from "../../(playground)/stream/demo";
import { ChapterShell, chapterMetadata } from "../chapter";
import { requireChapter } from "../syllabus";

const chapter = requireChapter("streaming");

export const metadata: Metadata = chapterMetadata(chapter);

interface PageProps {
  searchParams: Promise<{ stream?: string }>;
}

export default function StreamingChapterPage({ searchParams }: PageProps) {
  return (
    <ChapterShell
      chapter={chapter}
      commitsHref="https://github.com/hasToggle/hasToggle.dev/commits/main/apps/web/app/%5Blocale%5D/(playground)/stream"
    >
      <StreamDemo headingAs="h1" searchParams={searchParams} />
    </ChapterShell>
  );
}
