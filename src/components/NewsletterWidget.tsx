"use client";

import { useState } from "react";

export function NewsletterWidget() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setState("error");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("https://buttondown.com/api/emails/embed-subscribe/thecoderpanda", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, tag: "blog" }).toString(),
        mode: "no-cors",
      });
      void res;
      setState("done");
      setEmail("");
    } catch {
      setState("done");
      setEmail("");
    }
  }

  return (
    <aside className="mt-14 rounded-2xl border border-[#e8e5e0] bg-gradient-to-br from-[#fbf7ee] to-[#f5f0e6] p-8 sm:p-10">
      <div className="flex items-start gap-4 mb-5">
        <div className="shrink-0 w-10 h-10 rounded-full bg-[#1a1a1a] text-[#faf9f7] flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <div>
          <h3 className="blog-title text-xl text-[#1a1a1a] mb-1.5" style={{ fontFamily: "var(--font-serif)" }}>
            Get new posts in your inbox
          </h3>
          <p className="text-sm text-[#4a4a4a] leading-relaxed">
            Occasional notes on DevRel, AI tooling, and building things that ship. No spam, unsubscribe anytime.
          </p>
        </div>
      </div>
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2.5">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          placeholder="you@domain.com"
          disabled={state === "loading" || state === "done"}
          className="flex-1 px-4 py-2.5 rounded-full border border-[#e0dcd3] bg-white text-sm text-[#1a1a1a] placeholder:text-[#9a9a9a] focus:outline-none focus:border-[#1a1a1a] transition-colors disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={state === "loading" || state === "done"}
          className="px-5 py-2.5 rounded-full bg-[#1a1a1a] text-[#faf9f7] text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-70"
        >
          {state === "loading" ? "Subscribing…" : state === "done" ? "You're in ✓" : "Subscribe"}
        </button>
      </form>
      {state === "error" && (
        <p className="mt-2 text-xs text-[#b04545]">Please enter a valid email.</p>
      )}
      {state === "done" && (
        <p className="mt-2 text-xs text-[#4a4a4a]">Check your inbox to confirm.</p>
      )}
    </aside>
  );
}
