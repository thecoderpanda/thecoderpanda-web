import Link from "next/link";
import { getAllProducts, Product } from "@/lib/products";
import { AnimatedSection } from "@/components/AnimatedSection";
import { AnimatedHero } from "@/components/AnimatedHero";

const statusConfig: Record<
  Product["status"],
  { label: string; color: string }
> = {
  active: { label: "Active", color: "text-emerald-700 bg-emerald-50" },
  building: { label: "Building", color: "text-amber-700 bg-amber-50" },
  archived: { label: "Archived", color: "text-[#9a9a9a] bg-[#f0ede8]" },
};

export default function ProductsPage() {
  const products = getAllProducts();

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <main className="max-w-2xl mx-auto px-6">
        <section className="pt-16 pb-16">
          <AnimatedHero>
            {[
              <p
                key="label"
                className="text-sm text-[#9a9a9a] tracking-widest uppercase mb-6"
              >
                Work
              </p>,
              <h1
                key="title"
                className="text-5xl font-semibold tracking-tight text-[#1a1a1a] leading-[1.1] mb-5"
              >
                Products
              </h1>,
              <p
                key="desc"
                className="text-lg text-[#4a4a4a] leading-relaxed max-w-md"
              >
                Things I&apos;ve built, contributed to, or helped grow. Each
                one taught me something the next one benefited from.
              </p>,
            ]}
          </AnimatedHero>
        </section>

        <section className="pb-16 border-t border-[#e8e5e0] pt-12">
          <div className="space-y-px">
            {products.map((product, i) => {
              const status = statusConfig[product.status];
              return (
                <AnimatedSection key={product.slug} delay={i * 0.06}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="group flex items-start justify-between gap-6 py-6 border-b border-[#e8e5e0] hover:bg-[#f5f3f0] -mx-4 px-4 transition-colors duration-200 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-base font-medium text-[#1a1a1a] group-hover:text-[#333] transition-colors">
                          {product.title}
                        </h2>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full tracking-wide uppercase ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-[#6b6b6b] leading-relaxed line-clamp-2">
                        {product.description}
                      </p>
                      {product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {product.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[11px] text-[#9a9a9a] bg-[#f0ede8] px-2 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="shrink-0 mt-1 text-[#c0bdb8] group-hover:text-[#1a1a1a] transition-colors duration-200">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 8h10M9 4l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>

          {products.length === 0 && (
            <p className="text-base text-[#9a9a9a] py-12 text-center">
              Nothing here yet.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
