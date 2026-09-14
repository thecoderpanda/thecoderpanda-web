import { getAllPosts, formatDate } from "@/lib/blog";
import { AnimatedHero } from "@/components/AnimatedHero";
import { NewsletterWidget } from "@/components/NewsletterWidget";
import { BlogGrid } from "@/components/BlogGrid";

export const metadata = {
  title: "Blog — thecoderpanda",
  description:
    "Notes on developer relations, AI tooling, and building things worth using.",
};

export default function BlogPage() {
  const posts = getAllPosts().map((p) => ({
    ...p,
    formattedDate: formatDate(p.date),
  }));

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <main className="max-w-6xl mx-auto px-6">
        <section className="pt-16 pb-14">
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

        <section className="pb-10 border-t border-[#e8e5e0] pt-10">
          <BlogGrid posts={posts} />

          {posts.length === 0 && (
            <p className="text-base text-[#9a9a9a] py-12 text-center">
              Nothing here yet.
            </p>
          )}
        </section>

        <section className="pb-16 max-w-2xl mx-auto">
          <NewsletterWidget />
        </section>
      </main>
    </div>
  );
}
