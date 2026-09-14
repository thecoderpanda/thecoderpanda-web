import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/blog";
import { AnimatedSection } from "@/components/AnimatedSection";
import { AnimatedHero } from "@/components/AnimatedHero";
import { NewsletterWidget } from "@/components/NewsletterWidget";

export const metadata = {
  title: "Blog — thecoderpanda",
  description:
    "Notes on developer relations, AI tooling, and building things worth using.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <main className="max-w-2xl mx-auto px-6">
        <section className="pt-16 pb-16">
          <AnimatedHero>
            {[
              <p
                key="label"
                className="text-sm text-[#9a9a9a] tracking-widest uppercase mb-6"
              >
                Writing
              </p>,
              <h1
                key="title"
                className="blog-title text-5xl sm:text-6xl text-[#111] leading-[1.05] mb-5"
              >
                Blog
              </h1>,
              <p
                key="desc"
                className="blog-lead text-lg text-[#4a4a4a] leading-relaxed max-w-md"
              >
                Notes on developer relations, AI tooling, and building things
                worth using.
              </p>,
            ]}
          </AnimatedHero>
        </section>

        <section className="pb-8 border-t border-[#e8e5e0] pt-10">
          <div className="space-y-px">
            {posts.map((post, i) => (
              <AnimatedSection key={post.slug} delay={i * 0.04}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex items-start gap-5 py-6 border-b border-[#e8e5e0] hover:bg-[#f5f3f0] -mx-4 px-4 transition-colors duration-200 rounded-lg"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.cover}
                    alt=""
                    className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border border-[#e8e5e0]"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 text-xs tracking-wider uppercase text-[#9a9a9a]">
                      <span>{formatDate(post.date)}</span>
                      <span>·</span>
                      <span>{post.readingTime} min</span>
                    </div>
                    <h2 className="blog-title text-lg sm:text-xl text-[#111] group-hover:text-[#333] transition-colors mb-1.5 leading-snug">
                      {post.title}
                    </h2>
                    {post.subtitle && (
                      <p className="text-sm text-[#6b6b6b] leading-relaxed line-clamp-2">
                        {post.subtitle}
                      </p>
                    )}
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          {posts.length === 0 && (
            <p className="text-base text-[#9a9a9a] py-12 text-center">
              Nothing here yet.
            </p>
          )}
        </section>

        <section className="pb-16">
          <NewsletterWidget />
        </section>
      </main>
    </div>
  );
}
