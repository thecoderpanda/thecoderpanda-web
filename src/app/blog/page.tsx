import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/blog";
import { AnimatedSection } from "@/components/AnimatedSection";
import { AnimatedHero } from "@/components/AnimatedHero";

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
                className="text-5xl font-semibold tracking-tight text-[#1a1a1a] leading-[1.1] mb-5"
              >
                Blog
              </h1>,
              <p
                key="desc"
                className="text-lg text-[#4a4a4a] leading-relaxed max-w-md"
              >
                Notes on developer relations, AI tooling, and building things
                worth using.
              </p>,
            ]}
          </AnimatedHero>
        </section>

        <section className="pb-16 border-t border-[#e8e5e0] pt-12">
          <div className="space-y-px">
            {posts.map((post, i) => (
              <AnimatedSection key={post.slug} delay={i * 0.06}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex items-start justify-between gap-6 py-6 border-b border-[#e8e5e0] hover:bg-[#f5f3f0] -mx-4 px-4 transition-colors duration-200 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 text-xs text-[#9a9a9a]">
                      <span>{formatDate(post.date)}</span>
                      <span>·</span>
                      <span>{post.readingTime} min read</span>
                    </div>
                    <h2 className="text-base font-medium text-[#1a1a1a] group-hover:text-[#333] transition-colors mb-2">
                      {post.title}
                    </h2>
                    {post.subtitle && (
                      <p className="text-sm text-[#6b6b6b] leading-relaxed line-clamp-2">
                        {post.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 mt-1 text-[#c0bdb8] group-hover:text-[#1a1a1a] transition-colors duration-200">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
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
      </main>
    </div>
  );
}
