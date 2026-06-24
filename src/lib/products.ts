import fs from "fs";
import path from "path";
import matter from "gray-matter";

const productsDir = path.join(process.cwd(), "content/products");

export interface Product {
  slug: string;
  title: string;
  description: string;
  status: "active" | "building" | "archived";
  tags: string[];
  url?: string;
  github?: string;
  year?: string;
}

export interface ProductWithContent extends Product {
  content: string;
}

export function getAllProducts(): Product[] {
  if (!fs.existsSync(productsDir)) return [];

  const files = fs
    .readdirSync(productsDir)
    .filter((f) => f.endsWith(".md"))
    .sort();

  return files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(productsDir, file), "utf8");
    const { data } = matter(raw);

    return {
      slug,
      title: data.title ?? slug,
      description: data.description ?? "",
      status: data.status ?? "active",
      tags: data.tags ?? [],
      url: data.url,
      github: data.github,
      year: data.year,
    };
  });
}

export function getProductBySlug(slug: string): ProductWithContent | null {
  const filePath = path.join(productsDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    status: data.status ?? "active",
    tags: data.tags ?? [],
    url: data.url,
    github: data.github,
    year: data.year,
    content,
  };
}
