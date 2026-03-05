import fs from "node:fs";
import path from "node:path";
import { evaluate } from "@mdx-js/mdx";
import rehypeShiki from "@shikijs/rehype";
import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import type { MDXContent } from "mdx/types";
// biome-ignore lint/performance/noNamespaceImport: required by @mdx-js/mdx evaluate()
import * as runtime from "react/jsx-runtime";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

const BLOG_DIR = path.join(process.cwd(), "content/blog");
const LEGAL_DIR = path.join(process.cwd(), "content/legal");

const MDX_EXT_RE = /\.mdx$/;
const HEADING_RE = /^(#{2,3})\s+(.+)$/gm;
const WHITESPACE_RE = /\s+/g;

export interface TocEntry {
  depth: number;
  id: string;
  title: string;
}

interface BlogFrontmatter {
  authors: {
    name: string;
    avatar: string;
    xUrl: string;
  }[];
  categories: string[];
  date: string;
  description: string;
  image: string;
  imageAlt: string;
  title: string;
}

interface LegalFrontmatter {
  description: string;
  title: string;
}

export interface BlogPostMeta {
  authors: BlogFrontmatter["authors"];
  categories: string[];
  date: string;
  description: string;
  image: string;
  imageAlt: string;
  slug: string;
  title: string;
}

export interface BlogPost extends BlogPostMeta {
  content: MDXContent;
  readingTime: number;
  toc: TocEntry[];
}

export interface LegalPageMeta {
  description: string;
  slug: string;
  title: string;
}

export interface LegalPage extends LegalPageMeta {
  content: MDXContent;
  readingTime: number;
  toc: TocEntry[];
}

function getMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(MDX_EXT_RE, ""));
}

function extractToc(raw: string): TocEntry[] {
  const slugger = new GithubSlugger();
  const toc: TocEntry[] = [];

  for (const match of raw.matchAll(HEADING_RE)) {
    const title = match[2].trim();
    toc.push({
      id: slugger.slug(title),
      title,
      depth: match[1].length,
    });
  }

  return toc;
}

function computeReadingTime(content: string): number {
  const words = content.split(WHITESPACE_RE).filter(Boolean).length;
  return Math.ceil(words / 200);
}

async function compileMdx(raw: string): Promise<MDXContent> {
  const { default: Content } = await evaluate(raw, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypeShiki, { theme: "vesper" }]],
  });

  return Content;
}

export function getBlogSlugs(): string[] {
  return getMdxFiles(BLOG_DIR);
}

export function getLegalSlugs(): string[] {
  return getMdxFiles(LEGAL_DIR);
}

export function getBlogPosts(): BlogPostMeta[] {
  const slugs = getBlogSlugs();

  return slugs
    .map((slug) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), "utf-8");
      const { data } = matter(raw);
      const fm = data as BlogFrontmatter;

      return {
        slug,
        title: fm.title,
        description: fm.description,
        date: fm.date,
        image: fm.image,
        imageAlt: fm.imageAlt ?? "",
        authors: fm.authors ?? [],
        categories: fm.categories ?? [],
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content: mdxSource } = matter(raw);
  const fm = data as BlogFrontmatter;
  const content = await compileMdx(mdxSource);
  const toc = extractToc(mdxSource);
  const readingTime = computeReadingTime(mdxSource);

  return {
    slug,
    title: fm.title,
    description: fm.description,
    date: fm.date,
    image: fm.image,
    imageAlt: fm.imageAlt ?? "",
    authors: fm.authors ?? [],
    categories: fm.categories ?? [],
    content,
    toc,
    readingTime,
  };
}

export function getLegalPages(): LegalPageMeta[] {
  const slugs = getLegalSlugs();

  return slugs.map((slug) => {
    const raw = fs.readFileSync(path.join(LEGAL_DIR, `${slug}.mdx`), "utf-8");
    const { data } = matter(raw);
    const fm = data as LegalFrontmatter;

    return {
      slug,
      title: fm.title,
      description: fm.description,
    };
  });
}

export async function getLegalPage(slug: string): Promise<LegalPage | null> {
  const filePath = path.join(LEGAL_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content: mdxSource } = matter(raw);
  const fm = data as LegalFrontmatter;
  const content = await compileMdx(mdxSource);
  const toc = extractToc(mdxSource);
  const readingTime = computeReadingTime(mdxSource);

  return {
    slug,
    title: fm.title,
    description: fm.description,
    content,
    toc,
    readingTime,
  };
}
