import fs from "fs";
import path from "path";
import matter from "gray-matter";

const blogDir = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  readingTime: number;
  cover: string;
}

export interface BlogPostWithContent extends BlogPost {
  content: string;
}

function wordsToReadingTime(words: number): number {
  return Math.max(1, Math.round(words / 220));
}

function loadRaw(slug: string) {
  const filePath = path.join(blogDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  return matter(raw);
}

function toIsoDate(d: unknown): string {
  if (!d) return "";
  if (d instanceof Date) return d.toISOString();
  const s = String(d).trim();
  const parsed = new Date(s);
  if (!isNaN(parsed.getTime())) return parsed.toISOString();
  return s;
}

function coverFor(slug: string, explicit?: unknown): string {
  if (typeof explicit === "string" && explicit.length > 0) return explicit;
  return `/blog-covers/${slug}.svg`;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(blogDir)) return [];

  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".md"));

  const posts = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(blogDir, file), "utf8");
    const { data, content } = matter(raw);
    const words = content.trim().split(/\s+/).length;
    const resolvedSlug = data.slug ?? slug;

    return {
      slug: resolvedSlug,
      title: data.title ?? slug,
      subtitle: data.subtitle ?? "",
      date: toIsoDate(data.date),
      readingTime: wordsToReadingTime(words),
      cover: coverFor(resolvedSlug, data.cover),
    };
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPostWithContent | null {
  const direct = loadRaw(slug);
  if (direct) {
    const { data, content } = direct;
    const words = content.trim().split(/\s+/).length;
    const resolvedSlug = data.slug ?? slug;
    return {
      slug: resolvedSlug,
      title: data.title ?? slug,
      subtitle: data.subtitle ?? "",
      date: toIsoDate(data.date),
      readingTime: wordsToReadingTime(words),
      cover: coverFor(resolvedSlug, data.cover),
      content,
    };
  }

  // Fallback: match by frontmatter slug if filename differs
  if (!fs.existsSync(blogDir)) return null;
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".md"));
  for (const file of files) {
    const raw = fs.readFileSync(path.join(blogDir, file), "utf8");
    const { data, content } = matter(raw);
    if (data.slug === slug) {
      const words = content.trim().split(/\s+/).length;
      return {
        slug,
        title: data.title ?? slug,
        subtitle: data.subtitle ?? "",
        date: toIsoDate(data.date),
        readingTime: wordsToReadingTime(words),
        cover: coverFor(slug, data.cover),
        content,
      };
    }
  }
  return null;
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
