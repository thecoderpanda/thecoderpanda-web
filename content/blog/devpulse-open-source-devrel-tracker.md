---
title: "Introducing DevPulse: An Open-Source Developer Engagement Tracker"
subtitle: "Because DevRel teams deserve real metrics, not spreadsheet theatre."
date: 2026-09-14T12:00:00.000Z
slug: devpulse-open-source-devrel-tracker
---

![DevPulse cover — open-source developer engagement tracker](https://raw.githubusercontent.com/thecoderpanda/devpulse/main/docs/assets/cover.svg)

# Introducing DevPulse: An Open-Source Developer Engagement Tracker

> **TL;DR:** DevRel is measured with quarterly spreadsheets, disconnected dashboards, and follower counts. I got tired of it and built **[DevPulse](https://github.com/thecoderpanda/devpulse)** — an MIT-licensed, self-hostable dashboard that pulls signals from GitHub, Discord, Discourse, YouTube, Dev.to, and RSS, unifies contributor identities across them, logs your team's activities, and ships a weekly digest. Runs for **\$0/month** on the right free-tier stack. Star the repo, open an issue, ship an integration.

Every DevRel team I have spoken to in the last two years has the same measurement problem. I have watched developer advocates open six browser tabs, three spreadsheets, and a Notion doc just to answer the question *"how did we do this week?"* — and even then the answer is usually a shrug and a follower count.

We can do better than this.

---

## The problem, honestly

DevRel work is real work. Talks, workshops, PR reviews, community moderation, docs, videos, blog posts, office hours. Every one of those actions moves *something* — repo stars, PR throughput, Discord activity, blog referrals. But nobody can point at a specific action and say *"that moved this."*

Here is what most teams actually do:

- **Quarterly spreadsheet theatre.** Someone spends a Friday copy-pasting numbers from six dashboards into a Google Sheet. By Monday it's stale.
- **Vanity metrics with no context.** "12,000 stars" tells you nothing. Twelve thousand stars up 3% week-over-week after a Show HN and a keynote *does*.
- **Fragmented tooling.** GitHub Insights for repo stats, Discord Analytics for community, YouTube Studio for video, Dev.to stats for content, Google Analytics for the docs site, and a Notion page for talks. Nothing joins.
- **Zero attribution.** Did that Bangalore meetup talk cause the spike in new contributors two weeks later? Nobody knows. Nobody can know, because nobody is capturing the activities on the same timeline as the metrics.

The end result: DevRel budgets get cut in the first bad quarter because the discipline cannot prove its own impact.

---

## What DevPulse actually is

DevPulse is a self-hostable dashboard that plugs into your existing tools and gives you one screen. It is:

- **Open source (MIT)**. Fork it, extend it, self-host it. No paid tier. No lock-in.
- **Plugin-based.** Every source is a ~100 LOC package implementing a tiny `Source` contract. Adding a new integration is an afternoon of work, not a fork of the codebase.
- **Boring stack.** TypeScript, Next.js 14, Fastify, Prisma, Postgres, Redis, BullMQ, Docker. Nothing exotic to operate.
- **Runs anywhere.** Docker Compose on a laptop. Fly.io + Neon + Upstash for \$0/month. Or a Raspberry Pi in your homelab.

Six integrations ship in v0.1.0: **GitHub, Discord, Discourse, YouTube, Dev.to, and RSS.**

![DevPulse dashboard](https://raw.githubusercontent.com/thecoderpanda/devpulse/main/docs/assets/dashboard.svg)

---

## The four ideas that make it useful

Most "DevRel dashboards" are just chart aggregators. DevPulse has four opinions that I think matter more than the charts.

### 1. Metrics + Events on the same timeline

Under the hood there are two primitives:

- **`Metric`** — a value at a point in time (`github.stars: 12847 at 2026-09-13T09:00Z`)
- **`Event`** — something discrete that happened (`pr.merged`, `discord.message`, `youtube.video.published`)

Both live in Postgres with the same time index. That lets us answer: *"in the week after we shipped the docs rewrite, how many first-time contributors did we get, and how did PR response time move?"* Not with a vibe. With a query.

### 2. The Activity Ledger

DevRel work is the missing input in every dashboard I have ever seen. So DevPulse has a first-class `Activity` model:

- `talk`, `workshop`, `stream`, `blog`, `pr_review`, `office_hours`, `other`
- Title, date, owner, URL, tags, notes

You log the meetup talk on the day you gave it. It shows up on the same timeline as your stars, your PRs, and your Discord messages. When the numbers move, the activity is right there for context. Attribution is on the roadmap — the ledger is the prerequisite.

### 3. Contributor CRM with identity unification

The same human shows up as `@ada` on GitHub, `Ada#1234` on Discord, `ada_l` on Discourse, and `ada@example.com` in your email. Every DevRel tool treats those as four different people. DevPulse treats them as one.

The `Contributor` model has a `ContributorIdentity[]` — many external handles, one human. You can merge identities, add notes ("gave a talk at KubeCon, offered to speak at ours"), and see cross-platform activity for that person.

![DevPulse contributor CRM](https://raw.githubusercontent.com/thecoderpanda/devpulse/main/docs/assets/contributors.svg)

### 4. The Weekly Digest

Every Monday at 09:00 (local time to the project), a worker builds a markdown digest of the last 7 days: top metrics with week-over-week deltas, event counts by type, top contributors, and the activities your team logged. It gets stored in the database and rendered as markdown — so you can email it, drop it in Slack, or paste it into a PR description.

That single markdown file is the artifact your leadership actually wanted all along.

![DevPulse weekly digest](https://raw.githubusercontent.com/thecoderpanda/devpulse/main/docs/assets/digest.svg)

---

## Hosting: local and free

I built DevPulse on the assumption that DevRel teams should not have to file a procurement ticket to measure their own work. Two paths:

**Local** — a single command:

```bash
docker compose up -d          # postgres + redis + api + worker + web
```

**Free cloud** — combine free tiers:

- **Vercel** → `apps/web` (Next.js dashboard)
- **Fly.io** → `apps/api` + `apps/worker`
- **Neon** → serverless Postgres
- **Upstash** → serverless Redis

Total cost: **\$0/month** for small-to-mid DevRel teams. Full guide in the [README](https://github.com/thecoderpanda/devpulse#hosting).

If your org already has infra, DevPulse is a boring Node monorepo — it will fit in whatever you already run.

---

## What's next

v0.1.0 is a functional MVP. The direction I'm heading:

- **Slack, Mastodon, Bluesky** integrations
- **MCP server** — expose DevPulse metrics to Claude / ChatGPT / any MCP client. *"How did our repo do this week?"* answered from your assistant of choice.
- **Claude Skills / OpenAI Skills** — packaged skills so LLMs can not just query DevPulse but act on it (log an activity, generate a digest, draft a shoutout).
- **Power BI custom connector** — a `.mez` for BI teams already living in Power BI dashboards.
- **Data warehouse sinks** — Snowflake, BigQuery, Redshift, DuckDB. For orgs with a real warehouse, DevPulse becomes a source, not a silo.
- **Attribution model** — the hard, valuable one. Given an activity on day D, attribute a share of the metric deltas in `[D-1, D+7]` back to it, with decay.
- **Public embed widgets** — "stars this week" as an SVG endpoint you can drop in a README.

Every one of these is a good-first-issue for someone. See the [open issues](https://github.com/thecoderpanda/devpulse/issues).

---

## Why I'm building this in the open

Because DevRel — the discipline — needs a shared, honest measurement layer. If every company builds their own internal tracker in a Google Sheet, we all lose. If we build one together, in the open, with a shared vocabulary of `Metric`, `Event`, `Activity`, and `Contributor`, then teams can benchmark, share templates, and stop arguing about whether stars matter.

DevRel is one of the hottest jobs in tech, but it is still measured like it's 2015. That is fixable, and it's fixable in public.

---

## Try it

- **GitHub**: [github.com/thecoderpanda/devpulse](https://github.com/thecoderpanda/devpulse)
- **Quickstart**: `docker compose up -d`
- **Contribute**: `good first issue` and `help wanted` labels are stocked
- **License**: MIT

Star it if it's useful. Open an issue if it isn't. Ship an integration if you want to see one that isn't there yet.

DevRel teams deserve real metrics. Let's build them.
