import { notFound } from "next/navigation";
import Link from "next/link";
import { marked } from "marked";
import { getAllPosts, getPostBySlug, formatDate } from "@/lib/blog";
import { AnimatedSection } from "@/components/AnimatedSection";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — thecoderpanda`,
    description: post.subtitle,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const html = await marked(post.content, { breaks: true, gfm: true });

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <main className="max-w-2xl mx-auto px-6 pb-20">
        <AnimatedSection>
          <div className="pt-10 pb-10 border-b border-[#e8e5e0]">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-[#9a9a9a] hover:text-[#1a1a1a] transition-colors duration-200 mb-10"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 8H3M7 4L3 8l4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              All Posts
            </Link>

            <div className="flex items-center gap-3 mb-4 text-xs text-[#9a9a9a]">
              <span>{formatDate(post.date)}</span>
              <span>·</span>
              <span>{post.readingTime} min read</span>
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-[#1a1a1a] leading-tight mb-4">
              {post.title}
            </h1>
            {post.subtitle && (
              <p className="text-lg text-[#4a4a4a] leading-relaxed">
                {post.subtitle}
              </p>
            )}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <article
            className="prose prose-stone prose-lg max-w-none pt-10 blog-prose"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </AnimatedSection>
      </main>
    </div>
  );
}
