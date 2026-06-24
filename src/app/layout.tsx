import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shantanu Vishwanadha — thecoderpanda",
  description:
    "Developer Relations. Community Builder. Connecting developers with AI products that matter.",
  openGraph: {
    title: "Shantanu Vishwanadha — thecoderpanda",
    description:
      "Developer Relations. Community Builder. Connecting developers with AI products that matter.",
    url: "https://thecoderpanda.com",
    siteName: "thecoderpanda",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Shantanu Vishwanadha — thecoderpanda",
    description:
      "Developer Relations. Community Builder. Connecting developers with AI products that matter.",
  },
};

const navLinks = [
  { label: "Products", href: "/products", external: false },
  {
    label: "Writing",
    href: "https://thecoderpanda.substack.com",
    external: true,
  },
  {
    label: "GitHub",
    href: "https://github.com/thecoderpanda",
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/thecoderpanda",
    external: true,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@thecoderpanda",
    external: true,
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full bg-[#faf9f7] text-[#1a1a1a] antialiased">
        <nav className="max-w-2xl mx-auto px-6 py-7 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium tracking-tight text-[#1a1a1a] hover:opacity-70 transition-opacity duration-200"
          >
            thecoderpanda
          </Link>
          <div className="flex items-center gap-5">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors duration-200"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors duration-200"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </nav>
        {children}
        <footer className="max-w-2xl mx-auto px-6 py-10 border-t border-[#e8e5e0] mt-8">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#9a9a9a]">
              © {new Date().getFullYear()} Shantanu Vishwanadha
            </span>
            <div className="flex items-center gap-5">
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#9a9a9a] hover:text-[#1a1a1a] transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm text-[#9a9a9a] hover:text-[#1a1a1a] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
