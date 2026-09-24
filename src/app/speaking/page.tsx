import Link from "next/link";
import { AnimatedHero } from "@/components/AnimatedHero";

export const metadata = {
  title: "Speaking — Shantanu Vishwanadha",
  description: "Talks and workshops on developer communities, developer tools, and bringing technical ideas to life.",
};

const experience = [
  {
    title: "GDG Nagpur meetups",
    description: "I presented introductions to Google technologies and shared what I was learning with the community through technical presentations and workshops.",
  },
  {
    title: "Web3 education sessions",
    description: "At Covalent, I hosted small sessions to learn what people already knew about Web3, then helped develop a meetup program for community leaders in India and beyond.",
  },
];

const topics = [
  {
    title: "AI tools in everyday development",
    description: "What coding agents can help with, where they get in the way, and how to build a workflow around them.",
  },
  {
    title: "Developer communities that last",
    description: "The practical work of running meetups, supporting organizers, and giving people a reason to return.",
  },
  {
    title: "Making developer products easier to adopt",
    description: "From examples and technical content to the feedback that should make its way back to the product team.",
  },
];

export default function SpeakingPage() {
  return (
    <main className="portfolio speaking-page">
      <header className="portfolio-container speaking-page__intro">
        <AnimatedHero>
          {[
            <p key="eyebrow" className="portfolio-kicker">Speaking &amp; workshops</p>,
            <h1 key="title">Speaking</h1>,
            <p key="description">I like making technical ideas useful to the people in the room. I&apos;ve presented at developer meetups, run workshops, and helped community leaders teach what they know.</p>,
            <div key="actions" className="speaking-page__actions">
              <a className="portfolio-button portfolio-button--dark" href="https://linkedin.com/in/thecoderpanda" target="_blank" rel="noopener noreferrer">Invite me on LinkedIn <span aria-hidden="true">↗</span></a>
              <a className="portfolio-text-link" href="https://cal.com/thecoderpanda/30min" target="_blank" rel="noopener noreferrer">Schedule a call <span aria-hidden="true">↗</span></a>
            </div>,
          ]}
        </AnimatedHero>
      </header>

      <section className="portfolio-container speaking-page__section" aria-labelledby="speaking-experience-title">
        <div className="speaking-page__heading"><span className="portfolio-kicker">What I&apos;ve done</span><h2 id="speaking-experience-title">Past speaking &amp; teaching</h2></div>
        <div className="speaking-page__list">
          {experience.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.description}</p></article>)}
        </div>
      </section>

      <section className="portfolio-container speaking-page__section" aria-labelledby="speaking-topics-title">
        <div className="speaking-page__heading"><span className="portfolio-kicker">What I&apos;d love to cover next</span><h2 id="speaking-topics-title">Topics for your event</h2></div>
        <div className="speaking-page__list">
          {topics.map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.description}</p></article>)}
        </div>
      </section>

      <section className="portfolio-container speaking-page__contact" aria-labelledby="speaking-contact-title">
        <div><span className="portfolio-kicker">Get in touch</span><h2 id="speaking-contact-title">Have a talk or workshop in mind?</h2><p>Tell me about your audience and what they&apos;re working on.</p></div>
        <a className="portfolio-button portfolio-button--dark" href="https://linkedin.com/in/thecoderpanda" target="_blank" rel="noopener noreferrer">Invite me on LinkedIn <span aria-hidden="true">↗</span></a>
      </section>
      <div className="portfolio-container speaking-page__other">Looking for DevRel help? <Link href="/consulting">Explore consulting ↗</Link></div>
    </main>
  );
}
