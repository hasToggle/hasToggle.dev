import type { Metadata } from "next";
import { BoundaryDemo } from "../../(playground)/boundary/demo";
import { ChapterShell, chapterMetadata } from "../chapter";
import { requireChapter } from "../syllabus";

const chapter = requireChapter("boundary");

export const metadata: Metadata = chapterMetadata(chapter);

export default function BoundaryChapterPage() {
  return (
    <ChapterShell chapter={chapter}>
      <BoundaryDemo headingAs="h1" />
    </ChapterShell>
  );
}
