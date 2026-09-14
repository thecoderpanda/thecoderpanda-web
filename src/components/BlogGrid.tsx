"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";

type GridPost = {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  readingTime: number;
  cover: string;
  formattedDate: string;
};

const PAGE_SIZE = 12;

export function BlogGrid({ posts }: { posts: GridPost[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);

  const visible = useMemo(() => {
    const start = (current - 1) * PAGE_SIZE;
    return posts.slice(start, start + PAGE_SIZE);
  }, [posts, current]);

  function goto(p: number) {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const pageNumbers = useMemo(() => {
    const window: (number | "…")[] = [];
    const push = (n: number | "…") => {
      if (window[window.length - 1] !== n) window.push(n);
    };
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= current - 1 && i <= current + 1)
      ) {
        push(i);
      } else if (i < current - 1 || i > current + 1) {
        push("…");
      }
    }
    return window;
  }, [current, totalPages]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((post, i) => (
          <AnimatedSection key={post.slug} delay={i * 0.03}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block h-full rounded-2xl border border-[#e8e5e0] bg-white overflow-hidden hover:border-[#c0bdb8] hover:shadow-[0_6px_24px_-12px_rgba(0,0,0,0.15)] transition-all duration-200"
            >
              <div className="aspect-[16/9] overflow-hidden bg-[#f0ede8]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.cover}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-2.5 mb-3 text-[11px] tracking-widest uppercase text-[#9a9a9a]">
                  <span>{post.formattedDate}</span>
                  <span>·</span>
                  <span>{post.readingTime} min</span>
                </div>
                <h2 className="blog-title text-xl text-[#111] group-hover:text-[#333] transition-colors mb-2 leading-snug line-clamp-3">
                  {post.title}
                </h2>
                {post.subtitle && (
                  <p className="text-sm text-[#6b6b6b] leading-relaxed line-clamp-3">
                    {post.subtitle}
                  </p>
                )}
              </div>
            </Link>
          </AnimatedSection>
        ))}
      </div>

      {totalPages > 1 && (
        <nav
          className="mt-14 flex items-center justify-center gap-1.5"
          aria-label="Pagination"
        >
          <button
            type="button"
            onClick={() => goto(current - 1)}
            disabled={current === 1}
            className="px-3 py-2 rounded-full text-sm text-[#4a4a4a] hover:text-[#1a1a1a] hover:bg-[#f0ede8] disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          >
            ← Prev
          </button>
          {pageNumbers.map((n, idx) =>
            n === "…" ? (
              <span
                key={`e-${idx}`}
                className="px-2 text-sm text-[#9a9a9a]"
              >
                …
              </span>
            ) : (
              <button
                key={n}
                type="button"
                onClick={() => goto(n)}
                aria-current={n === current ? "page" : undefined}
                className={
                  "min-w-9 h-9 px-3 rounded-full text-sm transition-colors " +
                  (n === current
                    ? "bg-[#1a1a1a] text-[#faf9f7]"
                    : "text-[#4a4a4a] hover:text-[#1a1a1a] hover:bg-[#f0ede8]")
                }
              >
                {n}
              </button>
            )
          )}
          <button
            type="button"
            onClick={() => goto(current + 1)}
            disabled={current === totalPages}
            className="px-3 py-2 rounded-full text-sm text-[#4a4a4a] hover:text-[#1a1a1a] hover:bg-[#f0ede8] disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          >
            Next →
          </button>
        </nav>
      )}
    </>
  );
}
