import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { AnimatedSection } from "@/components/AnimatedSection";
import { getAllProducts, getProductBySlug, type Product } from "@/lib/products";

const statusLabels: Record<Product["status"], string> = {
  active: "Active",
  building: "In development",
  archived: "Archived",
};

export async function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return {
    title: `${product.title} — thecoderpanda`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [{ url: product.cover }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const html = await marked(product.content, { breaks: true });
  const products = getAllProducts();
  const nextProduct = products[(products.findIndex((item) => item.slug === slug) + 1) % products.length];

  return (
    <main className="portfolio product-detail">
      <div className="portfolio-container">
        <nav className="product-detail__breadcrumb" aria-label="Breadcrumb">
          <Link href="/products">← All products</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{product.title}</span>
        </nav>

        <header className="product-detail__intro">
          <div className="product-detail__heading">
            <span className="portfolio-kicker">PRODUCT / {product.year || "YEAR NOT LISTED"}</span>
            <h1>{product.title}</h1>
            <p>{product.description}</p>
            <div className="product-detail__actions">
              {product.url && (
                <a href={product.url} target="_blank" rel="noopener noreferrer" className="portfolio-button portfolio-button--dark">
                  {product.url === product.github ? "View on GitHub" : "Visit product"} <span aria-hidden="true">↗</span>
                </a>
              )}
              {product.github && product.github !== product.url && (
                <a href={product.github} target="_blank" rel="noopener noreferrer" className="portfolio-text-link">View code <span aria-hidden="true">↗</span></a>
              )}
            </div>
          </div>
          <div className="product-detail__facts">
            <div><span>STATUS</span><strong className="product-detail__status">{statusLabels[product.status]}</strong></div>
            {product.year && <div><span>YEAR</span><strong>{product.year}</strong></div>}
            {product.tags.length > 0 && <div><span>AREAS</span><ul>{product.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></div>}
          </div>
        </header>

        <div className="product-detail__cover">
          <Image src={product.cover} alt="" width={1600} height={840} sizes="(max-width: 700px) 100vw, (max-width: 1440px) 90vw, 1440px" priority />
          <span>THECODERPANDA / {product.title.toUpperCase()}</span>
        </div>

        <div className="product-detail__content">
          <div className="product-detail__sidebar">
            <span className="portfolio-kicker">THE PROJECT / 01</span>
            <p>{product.title}</p>
            <Link href="/products">← Back to the index</Link>
          </div>
          <AnimatedSection className="product-detail__article">
            <article className="prose product-prose" aria-label={`About ${product.title}`} dangerouslySetInnerHTML={{ __html: html }} />
          </AnimatedSection>
        </div>

        <aside className="product-detail__next" aria-label="Continue exploring">
          <span className="portfolio-kicker">KEEP EXPLORING</span>
          <Link href={`/products/${nextProduct.slug}`}>
            <span>Next product</span>
            <strong>{nextProduct.title}</strong>
            <span aria-hidden="true">↗</span>
          </Link>
        </aside>

        <aside className="product-detail__contact" aria-label="Get in touch">
          <p>Working on a developer-facing product?</p>
          <div>
            <Link href="/consulting">DevRel consulting ↗</Link>
            <Link href="/speaking">Speaking &amp; workshops ↗</Link>
            <a href="https://cal.com/thecoderpanda/30min" target="_blank" rel="noopener noreferrer">Schedule a 30-minute call ↗</a>
          </div>
        </aside>
      </div>
    </main>
  );
}
