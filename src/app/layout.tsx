import type { Metadata } from "next";
import { Geist, Fraunces, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "Shantanu Vishwanadha works with AI and developer-tool teams on developer programs, technical content, and communities.";

export const metadata: Metadata = {
  metadataBase: new URL("https://thecoderpanda.com"),
  title: "Shantanu Vishwanadha — Developer Relations",
  description,
  openGraph: {
    title: "Shantanu Vishwanadha — Developer Relations",
    description,
    url: "https://thecoderpanda.com",
    siteName: "thecoderpanda",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Shantanu Vishwanadha — Developer Relations",
    description,
  },
};

const navLinks = [
  { label: "Products", href: "/products" },
  { label: "Consulting", href: "/consulting" },
  { label: "Speaking", href: "/speaking" },
  { label: "Blog", href: "/blog" },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/thecoderpanda" },
  { label: "LinkedIn", href: "https://linkedin.com/in/thecoderpanda" },
  { label: "Twitter / X", href: "https://twitter.com/thecoderpanda" },
  { label: "Substack", href: "https://thecoderpanda.substack.com" },
  { label: "YouTube", href: "https://youtube.com/@thecoderpanda" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${fraunces.variable} ${inter.variable} h-full`}>
      <body className="min-h-full bg-[#faf9f7] text-[#1a1a1a] antialiased">
        <a className="site-skip" href="#main-content">Skip to content</a>
        <header className="site-header">
          <nav className="site-header__inner" aria-label="Main navigation">
            <Link href="/" className="site-header__brand" aria-label="Shantanu Vishwanadha, home"><span className="site-header__monogram" aria-hidden="true">S<span>V</span></span><span>SHANTANU VISHWANADHA<small>DEVELOPER RELATIONS</small></span></Link>
            <div className="site-header__links">
              {navLinks.map((link) => <Link key={link.label} href={link.href}>{link.label}</Link>)}
            </div>
            <a className="site-header__action" href="https://cal.com/thecoderpanda/30min" target="_blank" rel="noopener noreferrer">Schedule a call <span aria-hidden="true">↗</span></a>
          </nav>
        </header>
        <div id="main-content">{children}</div>
        <footer className="site-footer">
          <div className="site-footer__inner">
            <div className="site-footer__top"><div><Link href="/" className="site-footer__brand">SV<span aria-hidden="true">.</span></Link><p>Developer relations, products, and communities.<br />Based in Bengaluru, India.</p></div><div className="site-footer__navigation"><div><span>EXPLORE</span>{navLinks.map((link) => <Link key={link.label} href={link.href}>{link.label}</Link>)}</div><div><span>ELSEWHERE</span>{socialLinks.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>)}</div></div></div>
            <div className="site-footer__bottom"><span>© {new Date().getFullYear()} Shantanu Vishwanadha</span><span>BUILT WITH INTENTION / THECODERPANDA</span><Link href="#main-content">Back to top ↑</Link></div>
          </div>
        </footer>
      </body>
    </html>
  );
}
