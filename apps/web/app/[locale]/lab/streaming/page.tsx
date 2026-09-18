import type { Metadata } from "next";
import {
  StreamDemo,
  type StreamSearchParams,
} from "../../(playground)/stream/demo";
import { ChapterShell, chapterMetadata } from "../chapter";
import { requireChapter } from "../syllabus";

const chapter = requireChapter("streaming");

export const metadata: Metadata = chapterMetadata(chapter);

interface PageProps {
  searchParams: StreamSearchParams;
}

export default function StreamingChapterPage({ searchParams }: PageProps) {
  return (
    <ChapterShell chapter={chapter}>
      <StreamDemo headingAs="h1" searchParams={searchParams} />
    </ChapterShell>
  );
}
