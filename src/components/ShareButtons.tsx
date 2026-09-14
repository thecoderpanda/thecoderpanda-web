"use client";

import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = `https://thecoderpanda.com/blog/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const twitter = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=thecoderpanda`;
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const hn = `https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`;
  const reddit = `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // no-op
    }
  };

  const btn =
    "inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#e8e5e0] bg-white text-sm text-[#4a4a4a] hover:text-[#1a1a1a] hover:border-[#c0bdb8] transition-colors duration-200";

  return (
    <div className="mt-14 pt-10 border-t border-[#e8e5e0]">
      <p className="text-xs tracking-widest uppercase text-[#9a9a9a] mb-4">
        Share this post
      </p>
      <div className="flex flex-wrap gap-2.5">
        <a className={btn} href={twitter} target="_blank" rel="noopener noreferrer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
          </svg>
          X / Twitter
        </a>
        <a className={btn} href={linkedin} target="_blank" rel="noopener noreferrer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.024-3.037-1.85-3.037-1.853 0-2.136 1.446-2.136 2.94v5.666H9.353V9h3.414v1.561h.049c.475-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.558V9h3.556v11.452z" />
          </svg>
          LinkedIn
        </a>
        <a className={btn} href={hn} target="_blank" rel="noopener noreferrer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M0 0v24h24V0H0zm12.984 13.44v5.472h-1.968V13.44L7.2 5.088h2.208l2.592 5.664 2.592-5.664H16.8l-3.816 8.352z" />
          </svg>
          Hacker News
        </a>
        <a className={btn} href={reddit} target="_blank" rel="noopener noreferrer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.657-3.06 4.812-6.83 4.812-3.774 0-6.833-2.155-6.833-4.812 0-.176.015-.35.041-.518-.577-.28-.99-.897-.99-1.614 0-.968.786-1.754 1.754-1.754.478 0 .903.182 1.207.49 1.207-.855 2.855-1.418 4.68-1.486l.9-4.209a.316.316 0 0 1 .385-.242l2.923.617a1.25 1.25 0 0 1 1.11-.674zM8.5 12.5A1.5 1.5 0 1 0 8.5 15.5 1.5 1.5 0 0 0 8.5 12.5zM15.5 12.5A1.5 1.5 0 1 0 15.5 15.5 1.5 1.5 0 0 0 15.5 12.5zM8.9 17.104a.7.7 0 0 1 .992-.093c.605.503 1.443.795 2.108.795.664 0 1.502-.292 2.107-.795a.7.7 0 0 1 .899 1.075c-.917.762-2.05 1.13-3.006 1.13-.956 0-2.089-.368-3.006-1.13a.7.7 0 0 1-.094-.982z" />
          </svg>
          Reddit
        </a>
        <button className={btn} onClick={handleCopy} type="button">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
