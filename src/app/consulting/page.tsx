import Link from "next/link";
import { AnimatedHero } from "@/components/AnimatedHero";

export const metadata = {
  title: "DevRel consulting — Shantanu Vishwanadha",
  description: "Developer relations consulting for AI and developer-tool teams: technical content, developer programs, and product feedback.",
};

const services = [
  {
    title: "DevRel strategy & technical content",
    description: "Work out what developers need to learn, then make the documentation, examples, and technical content that helps them get started.",
  },
  {
    title: "Developer programs & community",
    description: "Plan and run workshops, events, and community programs that give developers a reason to take part and keep coming back.",
  },
  {
    title: "Product feedback & launch support",
    description: "Bring developer questions and friction back to the product team, and help explain new features when they're ready to ship.",
  },
];

export default function ConsultingPage() {
  return (
    <main className="portfolio consulting-page">
      <header className="portfolio-container consulting-page__intro">
        <AnimatedHero>
          {[
            <p key="eyebrow" className="portfolio-kicker">DevRel consulting</p>,
            <h1 key="title">Help developers use what you build.</h1>,
            <p key="description">I work with AI and developer-tool teams on the practical parts of developer relations: clear technical content, useful programs, and feedback that reaches the product team.</p>,
            <div key="actions" className="consulting-page__actions">
              <a className="portfolio-button portfolio-button--dark" href="https://cal.com/thecoderpanda/30min" target="_blank" rel="noopener noreferrer">Schedule a 30-minute call <span aria-hidden="true">↗</span></a>
              <Link className="portfolio-text-link" href="/products">See products <span aria-hidden="true">↗</span></Link>
            </div>,
          ]}
        </AnimatedHero>
      </header>

      <section className="portfolio-container consulting-page__services" aria-labelledby="services-title">
        <div className="consulting-page__section-heading"><span className="portfolio-kicker">The work</span><h2 id="services-title">Where I can help</h2></div>
        <div className="consulting-page__service-list">
          {services.map((service, index) => (
            <article key={service.title} className="consulting-page__service">
              <span className="portfolio-kicker">0{index + 1}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="portfolio-container consulting-page__context" aria-labelledby="context-title">
        <div><span className="portfolio-kicker">Who it&apos;s for</span><h2 id="context-title">Teams building for developers.</h2><p>Especially AI and developer-tool teams that need help making a product easier to adopt, learning from its users, or building a developer program.</p></div>
        <div className="consulting-page__experience"><span className="portfolio-kicker">Experience</span><p>I&apos;ve helped launch 10+ products globally and grow developer communities reaching 30,000+ members.</p><p>From 2019 to 2024, I organized GDG Nagpur with a volunteer team that grew from five people to a community of 1,500+ developers.</p><Link href="/products">Explore selected products ↗</Link></div>
      </section>

      <section className="portfolio-container consulting-page__contact" aria-labelledby="consulting-contact-title">
        <div><span className="portfolio-kicker">Let&apos;s talk</span><h2 id="consulting-contact-title">Tell me what you&apos;re working on.</h2><p>We can use a short call to see whether I can help.</p></div>
        <a className="portfolio-button portfolio-button--dark" href="https://cal.com/thecoderpanda/30min" target="_blank" rel="noopener noreferrer">Schedule a 30-minute call <span aria-hidden="true">↗</span></a>
      </section>
      <div className="portfolio-container consulting-page__other">Looking for a speaker instead? <Link href="/speaking">See speaking topics ↗</Link></div>
    </main>
  );
}
