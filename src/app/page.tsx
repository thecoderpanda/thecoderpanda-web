import Link from "next/link";
import { AnimatedSection } from "@/components/AnimatedSection";
import { AnimatedHero } from "@/components/AnimatedHero";

const companies = [
  { name: "Google" },
  { name: "Caterpillar" },
  { name: "Algorand" },
  { name: "Covalent" },
  { name: "Eros International" },
  { name: "Lumos Labs" },
  { name: "Powerloom" },
  { name: "Zencoder", current: true },
];

const devrelWork = [
  "Building developer ecosystems around AI and enterprise products",
  "Designing enterprise developer programs that scale",
  "Creating SDKs, integration guides, and technical documentation",
  "Gathering developer feedback that actually shapes product direction",
  "Running AI-focused hackathons, workshops, and engineering events",
  "Speaking about AI tooling, developer productivity, and platform strategy",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <main className="max-w-2xl mx-auto px-6">
        <section className="pt-20 pb-24">
          <AnimatedHero>
            {[
              <div key="identity" className="flex items-center gap-3.5 mb-1">
                <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center shrink-0">
                  <span className="text-[#faf9f7] text-[11px] font-semibold tracking-wider">
                    SV
                  </span>
                </div>
                <h1 className="text-[2.1rem] font-semibold tracking-tight text-[#1a1a1a] leading-tight">
                  Shantanu Vishwanadha
                </h1>
              </div>,

              <p key="role" className="text-sm text-[#9a9a9a] ml-[3.375rem]">
                Developer Relations · AI Tooling · Community
              </p>,

              <p
                key="tagline"
                className="text-[1.1rem] text-[#4a4a4a] leading-[1.75] max-w-[22rem] mt-7"
              >
                I help developers fall in love with AI products — and AI
                products listen to developers.
              </p>,

              <div key="socials" className="flex items-center gap-1.5 mt-7">
                <a
                  href="https://github.com/thecoderpanda"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#e8e5e0] text-[#6b6b6b] hover:text-[#1a1a1a] hover:border-[#c8c5c0] hover:bg-[#f0ede8] transition-all duration-200"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/in/thecoderpanda"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#e8e5e0] text-[#6b6b6b] hover:text-[#1a1a1a] hover:border-[#c8c5c0] hover:bg-[#f0ede8] transition-all duration-200"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com/thecoderpanda"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X"
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#e8e5e0] text-[#6b6b6b] hover:text-[#1a1a1a] hover:border-[#c8c5c0] hover:bg-[#f0ede8] transition-all duration-200"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://thecoderpanda.substack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Substack"
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#e8e5e0] text-[#6b6b6b] hover:text-[#1a1a1a] hover:border-[#c8c5c0] hover:bg-[#f0ede8] transition-all duration-200"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com/@thecoderpanda"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#e8e5e0] text-[#6b6b6b] hover:text-[#1a1a1a] hover:border-[#c8c5c0] hover:bg-[#f0ede8] transition-all duration-200"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <div className="w-px h-5 bg-[#e8e5e0] mx-2" />
                <a
                  href="https://cal.com/thecoderpanda/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#1a1a1a] text-[#faf9f7] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#333] transition-colors duration-200"
                >
                  Book a chat
                </a>
              </div>,
            ]}
          </AnimatedHero>
        </section>

        <AnimatedSection>
          <section className="py-16 border-t border-[#e8e5e0]">
            <p className="text-[#1a1a1a] leading-[1.9] text-base">
              For the past four years, I&apos;ve been at the intersection of
              engineering and community. I&apos;ve connected with investors and
              engineers across the world, launched over{" "}
              <span className="font-medium">10 products globally</span>, and
              helped grow developer communities to more than{" "}
              <span className="font-medium">30,000 members</span>.
            </p>
            <p className="mt-5 text-[#1a1a1a] leading-[1.9] text-base">
              I&apos;ve founded three companies and spent years doing the hard,
              unglamorous work of building trust between developers and the
              tools they use. These days, I&apos;m focused on{" "}
              <span className="font-medium">AI coding tools</span> and{" "}
              <span className="font-medium">enterprise developer ecosystems</span>{" "}
              — helping engineers actually get value out of AI, not just the
              hype around it.
            </p>
            <p className="mt-5 text-[#1a1a1a] leading-[1.9] text-base">
              I&apos;m fluent in JavaScript, Python, Rust, and Go — enough to
              build, enough to break things, and enough to understand what
              developers actually need.
            </p>
          </section>
        </AnimatedSection>

        <AnimatedSection delay={0.05}>
          <section className="py-16 border-t border-[#e8e5e0]">
            <h2 className="text-xs font-medium tracking-widest uppercase text-[#9a9a9a] mb-8">
              Companies I&apos;ve worked with
            </h2>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {companies.map((c) => (
                <span
                  key={c.name}
                  className={`text-base transition-colors duration-200 ${
                    c.current
                      ? "text-[#1a1a1a] font-medium"
                      : "text-[#4a4a4a] hover:text-[#1a1a1a]"
                  }`}
                >
                  {c.name}
                  {c.current && (
                    <span className="ml-2 text-xs text-[#9a9a9a] font-normal">
                      now
                    </span>
                  )}
                </span>
              ))}
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection delay={0.05}>
          <section className="py-16 border-t border-[#e8e5e0]">
            <h2 className="text-xs font-medium tracking-widest uppercase text-[#9a9a9a] mb-8">
              What I&apos;m building
            </h2>
            <div className="space-y-6">
              <p className="text-base text-[#1a1a1a] leading-relaxed">
                An{" "}
                <span className="font-medium">
                  open-source developer engagement tracker
                </span>{" "}
                — because DevRel teams deserve real metrics, not spreadsheet
                theatre.
              </p>
              <p className="text-base text-[#1a1a1a] leading-relaxed">
                Helping{" "}
                <span className="font-medium">AI-first companies</span> build
                enterprise developer programs that actually reach and retain
                engineering teams at scale.
              </p>
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection delay={0.05}>
          <section className="py-16 border-t border-[#e8e5e0]">
            <h2 className="text-xs font-medium tracking-widest uppercase text-[#9a9a9a] mb-8">
              What DevRel looks like with me
            </h2>
            <ul className="space-y-3">
              {devrelWork.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-[9px] shrink-0 w-1 h-1 rounded-full bg-[#c0bdb8]" />
                  <span className="text-base text-[#4a4a4a] leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </AnimatedSection>

        <AnimatedSection delay={0.05}>
          <section className="py-16 border-t border-[#e8e5e0]">
            <h2 className="text-xs font-medium tracking-widest uppercase text-[#9a9a9a] mb-8">
              Outside of work
            </h2>
            <p className="text-base text-[#4a4a4a] leading-[1.9]">
              You&apos;ll find me laughing at Reddit memes, playing cricket, or
              taking a long walk and pretending I&apos;m being productive.
              Sometimes all three.
            </p>
            <p className="mt-4 text-base text-[#4a4a4a] leading-[1.9]">
              I organized{" "}
              <span className="text-[#1a1a1a] font-medium">GDG Nagpur</span>{" "}
              from 2019 to 2024 — starting with a team of five volunteers and
              growing it into a community of 1,500+ developers. We hosted 20+
              events including Nagpur&apos;s first national-level hackathon.
            </p>
          </section>
        </AnimatedSection>

        <AnimatedSection delay={0.05}>
          <section className="py-16 border-t border-[#e8e5e0]">
            <h2 className="text-3xl font-semibold tracking-tight text-[#1a1a1a] mb-4">
              Let&apos;s talk.
            </h2>
            <p className="text-base text-[#4a4a4a] leading-relaxed mb-8 max-w-sm">
              Working on something in the AI space? Want to build a developer
              program, or just have a conversation worth having — reach out.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="https://cal.com/thecoderpanda/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#1a1a1a] text-[#faf9f7] text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#333] transition-colors duration-200"
              >
                Book a 30-min chat
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-sm text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors duration-200 border border-[#e0ddd8] px-5 py-2.5 rounded-full hover:border-[#1a1a1a]"
              >
                See what I&apos;ve built
              </Link>
            </div>
          </section>
        </AnimatedSection>
      </main>
    </div>
  );
}
