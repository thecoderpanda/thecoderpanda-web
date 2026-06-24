import { notFound } from "next/navigation";
import Link from "next/link";
import { marked } from "marked";
import { getAllProducts, getProductBySlug, Product } from "@/lib/products";
import { AnimatedSection } from "@/components/AnimatedSection";

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
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
  };
}

const statusConfig: Record<
  Product["status"],
  { label: string; color: string }
> = {
  active: { label: "Active", color: "text-emerald-700 bg-emerald-50" },
  building: { label: "Building", color: "text-amber-700 bg-amber-50" },
  archived: { label: "Archived", color: "text-[#9a9a9a] bg-[#f0ede8]" },
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const html = await marked(product.content, { breaks: true });
  const status = statusConfig[product.status];

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <main className="max-w-2xl mx-auto px-6 pb-20">
        <AnimatedSection>
          <div className="pt-10 pb-12 border-b border-[#e8e5e0]">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm text-[#9a9a9a] hover:text-[#1a1a1a] transition-colors duration-200 mb-10"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 8H3M7 4L3 8l4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              All Products
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full tracking-wide uppercase ${status.color}`}
              >
                {status.label}
              </span>
              {product.year && (
                <span className="text-xs text-[#9a9a9a]">{product.year}</span>
              )}
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-[#1a1a1a] leading-tight mb-4">
              {product.title}
            </h1>
            <p className="text-lg text-[#4a4a4a] leading-relaxed">
              {product.description}
            </p>

            {(product.url || product.github) && (
              <div className="flex items-center gap-4 mt-7">
                {product.url && (
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#1a1a1a] text-[#faf9f7] text-sm font-medium px-4 py-2 rounded-full hover:bg-[#333] transition-colors duration-200"
                  >
                    Visit
                  </a>
                )}
                {product.github && (
                  <a
                    href={product.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[#4a4a4a] hover:text-[#1a1a1a] transition-colors duration-200 border border-[#e0ddd8] px-4 py-2 rounded-full hover:border-[#1a1a1a]"
                  >
                    GitHub
                  </a>
                )}
              </div>
            )}

            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-[#9a9a9a] bg-[#f0ede8] px-2.5 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <article
            className="prose prose-stone max-w-none pt-10"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </AnimatedSection>
      </main>
    </div>
  );
}
