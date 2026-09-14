#!/usr/bin/env python3
"""Generate branded SVG cover images for thecoderpanda content.

Same structure across every cover (kicker + serif title + byline + monogram badge),
varied colors and background pattern chosen deterministically from the slug hash so
the visual identity stays consistent and each post/product gets its own look.

Works for two content types:
  - blog:      reads   {root}/content/blog/*.md      -> writes  {root}/public/blog-covers/*.svg
  - products:  reads   {root}/content/products/*.md  -> writes  {root}/public/product-covers/*.svg

Usage:
  python gen_covers.py --root /path/to/site --kind blog
  python gen_covers.py --root /path/to/site --kind products
  python gen_covers.py --root /path/to/site --kind both     # default
  python gen_covers.py --root /path/to/site --kind blog --slug 2026-predictions   # single
  python gen_covers.py --root /path/to/site --kind blog --force                    # regen all

Frontmatter overrides (per-file, all optional):
  cover:      /path/to/custom.png     # use this exact path, skip generation
  cover_tag:  "2026"                   # override the year badge text
  cover_kind: blog | product           # override the kicker line
"""

import argparse
import hashlib
import re
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "--quiet", "pyyaml"])
    import yaml  # noqa

# ------------------------------------------------------------- Design tokens ---

PALETTES = [
    # (bg, accent, text, muted)
    ("#0f1a2b", "#f0b86c", "#faf9f7", "#7f8fa6"),   # midnight + amber
    ("#1c2b1e", "#c8e6a0", "#faf9f7", "#9fb096"),   # forest + lime
    ("#2a1a2e", "#f2a6c2", "#faf9f7", "#a897a9"),   # plum + pink
    ("#1a2a2e", "#7fdbca", "#faf9f7", "#8ba8a8"),   # teal + mint
    ("#2e2016", "#e8a87c", "#faf9f7", "#b39a86"),   # cocoa + peach
    ("#0e1e2e", "#8fb8e0", "#faf9f7", "#8ea0b0"),   # navy + sky
    ("#241a2b", "#c9a3ff", "#faf9f7", "#a498b0"),   # violet + lavender
    ("#2b1a1a", "#f27a7a", "#faf9f7", "#b39090"),   # oxblood + coral
    ("#161f1f", "#f2e46c", "#faf9f7", "#909f95"),   # slate + citrus
    ("#faf9f7", "#1a1a1a", "#1a1a1a", "#7a7a7a"),   # cream + ink  (light)
    ("#f0ede8", "#b0413e", "#1a1a1a", "#6a6a6a"),   # stone + brick (light)
    ("#eef2f5", "#0e5c8f", "#0e1e2e", "#5a7188"),   # ice + ocean  (light)
]

PATTERNS = ["dots", "grid", "diagonals", "wave", "circles", "triangles"]

FM_RE = re.compile(r"^---\n(.*?)\n---\n", re.DOTALL)

BRAND = "thecoderpanda"
BYLINE = "Shantanu Vishwanadha · thecoderpanda.com"
MONOGRAM = "tcp"


# ------------------------------------------------------------- Utilities ------

def hash_bytes(slug: str, n: int):
    return list(hashlib.sha256(slug.encode()).digest()[:n])


def pick(slug: str):
    hs = hash_bytes(slug, 4)
    return PALETTES[hs[0] % len(PALETTES)], PATTERNS[hs[1] % len(PATTERNS)]


def escape_xml(s: str) -> str:
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def wrap_title(title: str, max_chars: int = 20, max_lines: int = 4):
    words, lines, cur = title.split(), [], ""
    for w in words:
        cand = (cur + " " + w).strip()
        if len(cand) <= max_chars:
            cur = cand
        else:
            if cur:
                lines.append(cur)
            if len(w) > max_chars:
                for i in range(0, len(w), max_chars):
                    lines.append(w[i:i + max_chars])
                cur = ""
            else:
                cur = w
        if len(lines) >= max_lines:
            break
    if cur and len(lines) < max_lines:
        lines.append(cur)
    if len(lines) == max_lines and cur and lines[-1] != cur:
        lines[-1] = lines[-1][: max_chars - 1] + "…"
    return lines[:max_lines]


def pattern_svg(kind: str, accent: str, muted: str) -> str:
    if kind == "dots":
        return f'<pattern id="pat" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="1.6" fill="{accent}" opacity="0.18"/></pattern>'
    if kind == "grid":
        return f'<pattern id="pat" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="{muted}" stroke-width="0.6" opacity="0.35"/></pattern>'
    if kind == "diagonals":
        return f'<pattern id="pat" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="14" stroke="{accent}" stroke-width="1.4" opacity="0.14"/></pattern>'
    if kind == "wave":
        return f'<pattern id="pat" x="0" y="0" width="60" height="30" patternUnits="userSpaceOnUse"><path d="M0 15 Q 15 0, 30 15 T 60 15" fill="none" stroke="{accent}" stroke-width="1.4" opacity="0.2"/></pattern>'
    if kind == "circles":
        return f'<pattern id="pat" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse"><circle cx="40" cy="40" r="26" fill="none" stroke="{accent}" stroke-width="1" opacity="0.14"/><circle cx="40" cy="40" r="14" fill="none" stroke="{muted}" stroke-width="0.8" opacity="0.25"/></pattern>'
    if kind == "triangles":
        return f'<pattern id="pat" x="0" y="0" width="30" height="26" patternUnits="userSpaceOnUse"><polygon points="15,4 26,22 4,22" fill="none" stroke="{accent}" stroke-width="1" opacity="0.16"/></pattern>'
    return ""


# ------------------------------------------------------------- SVG builder ----

def make_svg(slug: str, title: str, tag: str, kicker: str) -> str:
    (bg, accent, text, muted), pattern = pick(slug)
    W, H = 1600, 840
    lines = wrap_title(title, 20, 4)
    if len(lines) <= 2:
        fs, lh = 96, 108
    elif len(lines) == 3:
        fs, lh = 82, 94
    else:
        fs, lh = 68, 80

    tspans = "".join(
        f'<tspan x="90" dy="{0 if i == 0 else lh}">{escape_xml(line)}</tspan>'
        for i, line in enumerate(lines)
    )
    title_y = (H - lh * len(lines)) // 2 + fs * 0.8
    year_text = (
        f'<text x="80" y="130" text-anchor="middle" font-family="Inter, system-ui, sans-serif" '
        f'font-size="18" fill="{muted}" letter-spacing="4">{escape_xml(tag)}</text>'
        if tag else ""
    )

    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="{escape_xml(title)}">
  <defs>
    {pattern_svg(pattern, accent, muted)}
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="{accent}" stop-opacity="0.08"/>
      <stop offset="1" stop-color="{accent}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="{W}" height="{H}" fill="{bg}"/>
  <rect width="{W}" height="{H}" fill="url(#pat)"/>
  <rect width="{W}" height="{H}" fill="url(#fade)"/>

  <rect x="90" y="90" width="70" height="6" rx="3" fill="{accent}"/>

  <text x="90" y="140" font-family="'Inter', 'Geist', system-ui, sans-serif"
        font-size="26" letter-spacing="6" fill="{muted}" font-weight="600">
    {escape_xml(kicker.upper())}
  </text>

  <text font-family="'Fraunces', 'Iowan Old Style', Georgia, serif"
        font-size="{fs}" font-weight="600" fill="{text}"
        y="{title_y}" style="letter-spacing:-0.02em;">
    {tspans}
  </text>

  <text x="90" y="{H - 90}" font-family="'Inter', 'Geist', system-ui, sans-serif"
        font-size="26" fill="{muted}" font-weight="500">
    {BYLINE}
  </text>

  <g transform="translate({W - 220}, {H - 220})">
    <circle cx="80" cy="80" r="80" fill="none" stroke="{accent}" stroke-width="2" opacity="0.65"/>
    <text x="80" y="88" text-anchor="middle"
          font-family="'Fraunces', Georgia, serif" font-size="48" font-weight="600"
          fill="{text}" style="letter-spacing:-0.03em;">{MONOGRAM}</text>
    {year_text}
  </g>
</svg>
'''


# ------------------------------------------------------------- Post loader ----

def load_frontmatter(p: Path):
    txt = p.read_text(encoding="utf-8")
    m = FM_RE.match(txt)
    fm = yaml.safe_load(m.group(1)) if m else {}
    fm = fm or {}
    slug = fm.get("slug") or p.stem
    title = fm.get("title") or p.stem.replace("-", " ").title()
    date = fm.get("date") or fm.get("year") or ""
    tag = fm.get("cover_tag")
    if tag is None:
        s = str(date)
        tag = s[:4] if len(s) >= 4 else ""
    explicit_cover = fm.get("cover")
    kind_override = fm.get("cover_kind")
    return {
        "slug": slug,
        "title": title,
        "tag": tag,
        "explicit_cover": explicit_cover,
        "kind_override": kind_override,
    }


# ------------------------------------------------------------- Orchestrator ---

KIND_CONFIG = {
    "blog": {
        "content_dir": "content/blog",
        "out_dir": "public/blog-covers",
        "kicker": f"{BRAND} · blog",
    },
    "products": {
        "content_dir": "content/products",
        "out_dir": "public/product-covers",
        "kicker": f"{BRAND} · product",
    },
}


def generate_for_kind(root: Path, kind: str, only_slug: str | None, force: bool):
    cfg = KIND_CONFIG[kind]
    content_dir = root / cfg["content_dir"]
    out_dir = root / cfg["out_dir"]
    if not content_dir.exists():
        print(f"[{kind}] skipped: {content_dir} not found")
        return
    out_dir.mkdir(parents=True, exist_ok=True)

    written = skipped = 0
    for p in sorted(content_dir.glob("*.md")):
        info = load_frontmatter(p)
        if info["explicit_cover"]:
            skipped += 1
            continue
        if only_slug and info["slug"] != only_slug and p.stem != only_slug:
            continue
        target = out_dir / f"{info['slug']}.svg"
        if target.exists() and not force:
            skipped += 1
            continue
        kicker = info["kind_override"] or cfg["kicker"]
        svg = make_svg(info["slug"], info["title"], info["tag"], kicker)
        target.write_text(svg, encoding="utf-8")
        written += 1
        print(f"[{kind}] wrote {target.relative_to(root)}")

    print(f"[{kind}] done — {written} written, {skipped} skipped")


def main():
    ap = argparse.ArgumentParser(description="Generate SVG covers for thecoderpanda.")
    ap.add_argument("--root", required=True, help="Repo root of the site.")
    ap.add_argument("--kind", choices=["blog", "products", "both"], default="both")
    ap.add_argument("--slug", default=None, help="Only regenerate this slug.")
    ap.add_argument("--force", action="store_true", help="Overwrite existing covers.")
    args = ap.parse_args()
    root = Path(args.root).expanduser().resolve()
    if not root.exists():
        sys.exit(f"root {root} does not exist")

    kinds = ["blog", "products"] if args.kind == "both" else [args.kind]
    for k in kinds:
        generate_for_kind(root, k, args.slug, args.force)


if __name__ == "__main__":
    main()
