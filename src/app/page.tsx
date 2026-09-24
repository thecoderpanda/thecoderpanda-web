import Image from "next/image";
import Link from "next/link";
import { AnimatedHero } from "@/components/AnimatedHero";
import { getAllProducts } from "@/lib/products";

export default function Home() {
  const products = getAllProducts().filter((product) =>
    ["fde-agent-starter", "polyground", "potli"].includes(product.slug),
  );

  return (
    <main className="portfolio home-page">
      <section className="portfolio-container home-page__intro" aria-labelledby="home-title">
        <AnimatedHero>
          {[
            <p key="eyebrow" className="portfolio-kicker">Developer relations · Bengaluru, India</p>,
            <h1 key="title" id="home-title">Shantanu Vishwanadha<span className="home-page__period">.</span></h1>,
            <p key="intro" className="home-page__lead">I help AI and developer-tool teams make their products easier to understand, use, and improve through developer relations.</p>,
            <div key="actions" className="home-page__actions">
              <Link className="portfolio-button portfolio-button--dark" href="/consulting">Explore consulting <span aria-hidden="true">↗</span></Link>
              <Link className="portfolio-text-link" href="/products">See products <span aria-hidden="true">↗</span></Link>
            </div>,
          ]}
        </AnimatedHero>
      </section>

      <section className="portfolio-container home-page__proof" aria-label="Experience">
        <div className="home-page__proof-grid">
          <p><strong>10+</strong> products launched globally</p>
          <p><strong>30,000+</strong> members in developer communities I&apos;ve helped grow</p>
          <p><strong>3</strong> companies founded</p>
          <p><strong>1,500+</strong> developers in the GDG Nagpur community</p>
          <p><strong>20+</strong> community events organized</p>
        </div>
        <Link href="/consulting">How I work with teams <span aria-hidden="true">↗</span></Link>
      </section>

      <section className="portfolio-container home-page__companies" aria-labelledby="companies-title">
        <div className="home-page__section-heading">
          <div><span className="portfolio-kicker">Experience</span><h2 id="companies-title">Teams and ecosystems I&apos;ve worked with</h2></div>
          <Link className="portfolio-text-link" href="/consulting">Explore consulting <span aria-hidden="true">↗</span></Link>
        </div>
        <ul className="home-page__company-list">
          {['Google', 'Caterpillar', 'Algorand', 'Covalent', 'Eros International', 'Lumos Labs', 'Powerloom', 'Zencoder'].map((name) => <li key={name}>{name}</li>)}
        </ul>
      </section>

      <section className="portfolio-container home-page__work" aria-labelledby="work-title">
        <div className="home-page__section-heading">
          <div><span className="portfolio-kicker">Things I&apos;ve worked on</span><h2 id="work-title">Selected products</h2></div>
          <Link className="portfolio-text-link" href="/products">All products <span aria-hidden="true">↗</span></Link>
        </div>
        {products.length ? (
          <div className="home-page__projects">
            {products.map((product) => (
              <Link key={product.slug} className="home-page__project" href={`/products/${product.slug}`}>
                <div className="home-page__project-image"><Image src={product.cover} alt="" width={1600} height={840} sizes="(max-width: 700px) 100vw, 33vw" /></div>
                <div className="home-page__project-title"><h3>{product.title}</h3><span aria-hidden="true">↗</span></div>
                <p>{product.description}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="home-page__empty">More work is on the way. <Link href="/products">Browse the product index ↗</Link></p>
        )}
      </section>

      <section className="portfolio-container home-page__more" aria-label="Speaking and blog">
        <div><span className="portfolio-kicker">Speaking</span><p>Talks and workshops on developer tools, communities, and the people using them.</p><Link href="/speaking">Speaking topics and experience ↗</Link></div>
        <div><span className="portfolio-kicker">Blog</span><p>Notes on developer tools, products, and the work behind them.</p><Link href="/blog">Read the blog ↗</Link></div>
      </section>

      <section className="portfolio-container home-page__contact" aria-labelledby="contact-title">
        <div><span className="portfolio-kicker">Get in touch</span><h2 id="contact-title">Working on a developer product?</h2></div>
        <a className="portfolio-button portfolio-button--dark" href="https://cal.com/thecoderpanda/30min" target="_blank" rel="noopener noreferrer">Schedule a 30-minute call <span aria-hidden="true">↗</span></a>
      </section>
    </main>
  );
}
