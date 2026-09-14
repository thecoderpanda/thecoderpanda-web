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

export const metadata = {
  title: "Products — thecoderpanda",
  description:
    "Things I've built, contributed to, or helped grow. Each one taught me something the next one benefited from.",
};

export default function ProductsPage() {
  const products = getAllProducts();

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <main className="max-w-6xl mx-auto px-6">
        <section className="pt-16 pb-14">
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
                className="blog-title text-5xl sm:text-6xl text-[#111] leading-[1.05] mb-5"
              >
                Products
              </h1>,
              <p
                key="desc"
                className="blog-lead text-lg text-[#4a4a4a] leading-relaxed max-w-md"
              >
                Things I&apos;ve built, contributed to, or helped grow. Each
                one taught me something the next one benefited from.
              </p>,
            ]}
          </AnimatedHero>
        </section>

        <section className="pb-16 border-t border-[#e8e5e0] pt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => {
              const status = statusConfig[product.status];
              return (
                <AnimatedSection key={product.slug} delay={i * 0.05}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="group block h-full rounded-2xl border border-[#e8e5e0] bg-white overflow-hidden hover:border-[#c0bdb8] hover:shadow-[0_6px_24px_-12px_rgba(0,0,0,0.15)] transition-all duration-200"
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-[#f0ede8]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.cover}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5 sm:p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full tracking-wide uppercase ${status.color}`}
                        >
                          {status.label}
                        </span>
                        {product.year && (
                          <span className="text-[11px] text-[#9a9a9a] tracking-widest uppercase">
                            {product.year}
                          </span>
                        )}
                      </div>
                      <h2 className="blog-title text-xl text-[#111] group-hover:text-[#333] transition-colors mb-2 leading-snug line-clamp-2">
                        {product.title}
                      </h2>
                      <p className="text-sm text-[#6b6b6b] leading-relaxed line-clamp-3">
                        {product.description}
                      </p>
                      {product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {product.tags.slice(0, 3).map((tag) => (
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
