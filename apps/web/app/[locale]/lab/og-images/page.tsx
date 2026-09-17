import type { Metadata } from "next";
import { ImageDemo } from "../../(playground)/image/demo";
import { ChapterShell, chapterMetadata } from "../chapter";
import { requireChapter } from "../syllabus";

const chapter = requireChapter("og-images");

export const metadata: Metadata = chapterMetadata(chapter);

export default function OgImagesChapterPage() {
  return (
    <ChapterShell chapter={chapter}>
      <ImageDemo headingAs="h1" />
    </ChapterShell>
  );
}
