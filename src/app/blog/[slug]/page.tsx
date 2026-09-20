import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug, formatDate } from "@/lib/blog";
import { renderMarkdown } from "@/lib/markdown";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ShareButtons } from "@/components/ShareButtons";
import { NewsletterWidget } from "@/components/NewsletterWidget";
import { PostEnhancer } from "@/components/PostEnhancer";

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
    openGraph: {
      title: post.title,
      description: post.subtitle,
      images: [post.cover],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.subtitle,
      images: [post.cover],
    },
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

  const normalize = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const titleKey = normalize(post.title);
  const bodyWithoutDuplicateTitle = post.content.replace(
    /^(#\s+)(.+)$/m,
    (match, _hash: string, heading: string) => {
      return normalize(heading) === titleKey ? "" : match;
    },
  );
  const html = renderMarkdown(bodyWithoutDuplicateTitle);

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <main className="max-w-2xl mx-auto px-6 pb-20">
        <AnimatedSection>
          <div className="pt-8 pb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-[#9a9a9a] hover:text-[#1a1a1a] transition-colors duration-200 mb-8"
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

            <div className="flex items-center gap-3 mb-5 text-xs tracking-widest uppercase text-[#9a9a9a]">
              <span>{formatDate(post.date)}</span>
              <span>·</span>
              <span>{post.readingTime} min read</span>
            </div>

            <h1 className="blog-title text-4xl sm:text-5xl text-[#111] leading-[1.1] mb-5">
              {post.title}
            </h1>
            {post.subtitle && (
              <p className="blog-lead text-xl text-[#3a3a3a] leading-relaxed">
                {post.subtitle}
              </p>
            )}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.05}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover}
            alt=""
            className="w-full rounded-xl border border-[#e8e5e0] mb-2"
            loading="eager"
          />
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <article
            className="prose prose-stone max-w-none pt-8 blog-prose"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <PostEnhancer />
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <ShareButtons title={post.title} slug={post.slug} />
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <NewsletterWidget />
        </AnimatedSection>

        <AnimatedSection delay={0.25}>
          <p className="text-xs text-[#9a9a9a] italic leading-relaxed text-center mt-10 pt-6 border-t border-[#e8e5e0]">
            Opinions are strictly mine. They don&apos;t represent my employer in
            any capacity.
          </p>
        </AnimatedSection>
      </main>
    </div>
  );
}
