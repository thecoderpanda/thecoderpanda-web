import Image from "next/image";
import Link from "next/link";
import { AnimatedHero } from "@/components/AnimatedHero";
import { AnimatedSection } from "@/components/AnimatedSection";
import { getAllProducts, type Product } from "@/lib/products";

const statusLabels: Record<Product["status"], string> = {
  active: "Active",
  building: "In development",
  archived: "Archived",
};

export const metadata = {
  title: "Products — Shantanu Vishwanadha",
  description: "Products Shantanu Vishwanadha has built, contributed to, or helped grow.",
};

export default function ProductsPage() {
  const products = getAllProducts();

  return (
    <main className="portfolio products-page">
      <div className="portfolio-container">
        <header className="products-page__intro">
          <AnimatedHero>
            {[
              <p key="eyebrow" className="portfolio-kicker">INDEX / {String(products.length).padStart(2, "0")} PROJECTS</p>,
              <h1 key="title">Selected <em>work.</em></h1>,
              <p key="description">Products I&apos;ve built, contributed to, or helped grow. From developer tooling to everyday problems worth solving.</p>,
            ]}
          </AnimatedHero>
          <div className="products-page__intro-bottom">
            <span>THECODERPANDA / PRODUCT INDEX</span>
            <span>EXPLORE BELOW ↓</span>
          </div>
        </header>

        <section className="products-page__listing" aria-labelledby="products-list-title">
          <div className="products-page__listing-heading">
            <h2 id="products-list-title" className="portfolio-kicker">01 / ALL PRODUCTS</h2>
            <span className="portfolio-kicker">{String(products.length).padStart(2, "0")} ENTRIES</span>
          </div>
          {products.length ? (
            <div className="products-page__grid">
              {products.map((product, index) => (
                <AnimatedSection key={product.slug} className="products-page__item" delay={(index % 3) * 0.06}>
                  <Link href={`/products/${product.slug}`} className="products-page__card">
                    <div className="products-page__card-top">
                      <span>{String(index + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}</span>
                      <span>{product.year || "YEAR NOT LISTED"}</span>
                    </div>
                    <div className="products-page__cover">
                      <Image src={product.cover} alt="" width={1600} height={840} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 60vw" />
                    </div>
                    <div className="products-page__card-main">
                      <span className="products-page__status">{statusLabels[product.status]}</span>
                      <h3>{product.title}</h3>
                      <p>{product.description}</p>
                      <div className="products-page__card-bottom">
                        <span>{product.tags.slice(0, 2).join(" / ")}</span>
                        <span aria-hidden="true">↗</span>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <div className="products-page__empty">
              <p>No products are listed yet.</p>
              <Link href="/">Back to the homepage ↗</Link>
            </div>
          )}
        </section>

        <aside className="products-page__next" aria-label="Get in touch">
          <div>
            <span className="portfolio-kicker">NEXT / COLLABORATE</span>
            <h2>Working on a developer product?</h2>
          </div>
          <div className="products-page__next-links">
            <Link href="/consulting">Explore DevRel consulting ↗</Link>
            <Link href="/speaking">Speaking &amp; workshops ↗</Link>
            <a href="https://cal.com/thecoderpanda/30min" target="_blank" rel="noopener noreferrer">Schedule a 30-minute call ↗</a>
          </div>
        </aside>
      </div>
    </main>
  );
}
