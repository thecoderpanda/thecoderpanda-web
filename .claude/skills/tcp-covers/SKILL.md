---
name: tcp-covers
description: >
  Generate branded SVG cover images and Markdown scaffolding for
  thecoderpanda.com blog posts and product pages. Every cover uses the same
  structure (kicker + serif title + byline + tcp monogram badge) with a
  deterministic palette + background pattern picked from the slug hash so the
  visual identity stays consistent while every asset stays unique. Also
  scaffolds the frontmatter + content skeleton for a new blog post or product
  entry so covers and page copy come out of the same command. Use whenever the
  user says "generate blog cover", "generate product cover", "make covers for
  the new posts", "scaffold a new blog post", "add a new product page", or
  refers to featured images for thecoderpanda.
user-invokable: true
argument-hint: "[covers|new] [blog|product] [slug]"
license: MIT
metadata:
  author: thecoderpanda
  version: "1.0.0"
  site-root-default: "~/ZenflowProjects/thecoderpanda-website"
---

# tcp-covers — featured images + content scaffolding for thecoderpanda.com

Reusable tools for thecoderpanda.com:

1. **Cover generation** — deterministic branded SVG covers for every blog
   post and every product page.
2. **Content scaffolding** — a Markdown skeleton with the right frontmatter
   fields so new posts / products drop straight into the site.

## The site convention (context)

- Repo root default: `~/ZenflowProjects/thecoderpanda-website`
- Blog posts:      `content/blog/<slug>.md`   → cover `public/blog-covers/<slug>.svg`
- Product pages:   `content/products/<slug>.md` → cover `public/product-covers/<slug>.svg`
- The `./src/lib/blog.ts` and `./src/lib/products.ts` loaders already resolve
  `/blog-covers/<slug>.svg` and `/product-covers/<slug>.svg` by default, and
  respect an explicit `cover:` field in frontmatter if you want a custom image.

## Cover design system (do not drift)

Every cover is a 1600×840 SVG, structurally identical:

- Accent bar (top-left)
- Kicker line: `THECODERPANDA · BLOG` or `THECODERPANDA · PRODUCT` (uppercased, tracked)
- Serif title (Fraunces, auto-wrapped, font size scales with line count)
- Byline: `Shantanu Vishwanadha · thecoderpanda.com`
- Monogram badge (bottom-right): `tcp` in a circle, with a year/tag below

What varies per slug (deterministic from `sha256(slug)`):

- 1 of 12 palettes (mix of dark + light themes)
- 1 of 6 background patterns (dots, grid, diagonals, wave, circles, triangles)

This is not an AI-image generator — it's a template renderer. That is
intentional: every cover looks like it belongs to the same publication.

## Command 1 — generate covers

```
python ~/.claude/skills/tcp-covers/scripts/gen_covers.py \
  --root ~/ZenflowProjects/thecoderpanda-website \
  --kind both
```

Options:

| Flag         | Meaning                                                       |
|--------------|---------------------------------------------------------------|
| `--root`     | Repo root of the site. Required.                              |
| `--kind`     | `blog`, `products`, or `both` (default `both`).               |
| `--slug`     | Only regenerate this one slug.                                |
| `--force`    | Overwrite covers that already exist.                          |

The script skips any post whose frontmatter has an explicit `cover:` field
(so a hand-picked image is never trampled), and skips any target that
already exists unless `--force` is passed. It also creates the output
directories if they do not exist.

Per-post overrides (optional frontmatter fields):

- `cover: /images/custom.png`   — use this exact path, skip generation
- `cover_tag: "2026"`           — text shown in the monogram badge
- `cover_kind: blog | product`  — override the kicker line

## Command 2 — scaffold a new post or product

Use this when the user says "add a new blog post about X" or "add a new
product page called Y". It writes the Markdown skeleton with the right
frontmatter for the loader, then runs the cover generator for that one slug.

Steps:

1. Ask for `title` (required), `subtitle` / `description`, `tags`, `year`,
   and `url` / `github` (products only) if the user has not supplied them.
2. Slugify the title → `<slug>`.
3. Write the file:

**Blog** (`content/blog/<slug>.md`):

```md
---
title: "<Title>"
subtitle: "<One-line hook that shows on the blog list card>"
date: <YYYY-MM-DD>
tags: [<tag1>, <tag2>]
---

## <First H2>

<opening paragraph>

## <Next H2>

<body>

---

*<optional closing line>*
```

**Product** (`content/products/<slug>.md`):

```md
---
title: "<Product Name>"
description: "<One-sentence description used on cards and OG meta>"
status: building   # or active | archived
tags: [<tag1>, <tag2>]
url: <optional live URL>
github: <optional repo URL>
year: "<YYYY>"
---

## The Problem

<what's broken in the world today>

## What It Is

<crisp product description + bullet features>

## Who It's For

<target user>

## Status

<current state — private beta, public, archived, etc.>
```

4. Run the cover generator for that single slug:

```
python ~/.claude/skills/tcp-covers/scripts/gen_covers.py \
  --root ~/ZenflowProjects/thecoderpanda-website \
  --kind blog --slug <slug>
```

5. Report the new file path + the cover path. Ask before committing.

## Command 3 — regenerate a single cover

```
python ~/.claude/skills/tcp-covers/scripts/gen_covers.py \
  --root ~/ZenflowProjects/thecoderpanda-website \
  --kind blog --slug <slug> --force
```

Use when the user retitles a post or wants a different palette (the
palette is deterministic from the slug, so changing the slug also changes
the palette + pattern).

## Editorial defaults (voice)

When drafting content into the scaffold, match the existing site voice:

- Conversational but precise. No corporate throat-clearing.
- Concrete numbers over adjectives ("178 posts" beats "many posts").
- Short paragraphs. Use `>` for standout lines the reader should remember.
- Use tables for comparisons and package lists.
- End with a light closing line or a "Status" section, not "Conclusion".

## Do not

- Do not raise the SVG size or change the layout — every cover must feel
  like the same brand.
- Do not add photographic imagery to the cover — keep it typographic.
- Do not commit changes without asking the user first.
- Do not overwrite an existing cover unless the user says so (`--force`).
