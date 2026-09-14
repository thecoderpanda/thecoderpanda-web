---
title: DevPulse
description: Open-source developer engagement tracker — because DevRel teams deserve real metrics, not spreadsheet theatre.
status: active
tags: [Open Source, DevRel, TypeScript, Next.js, Self-hosted]
url: https://github.com/thecoderpanda/devpulse
github: https://github.com/thecoderpanda/devpulse
year: "2026"
---

## The Problem

DevRel teams today measure success with:

- Manual spreadsheets pulled once a quarter
- Vanity metrics (followers, stars) with no context
- Fragmented dashboards across 6+ tools (GitHub Insights, Discord Analytics, YouTube Studio, Dev.to stats, Google Analytics, plus a Notion doc no one updates)
- No way to attribute *which* DevRel activity moved *which* metric

The result: a whole discipline of storytelling around numbers nobody trusts.

DevPulse fixes this.

## What It Is

A **self-hostable dashboard** that turns raw signals from **GitHub, Discord, Discourse, YouTube, Dev.to, and RSS feeds** into actionable DevRel metrics. Own your data, extend with plugins, prove your impact.

| Surface | What it does |
|---|---|
| **Repo Health** | Stars, forks, PRs, issue response time, contributor growth, first-time contributors, bus factor |
| **Community Pulse** | Discord/Discourse message volume, active members, response time |
| **Content Reach** | Dev.to, YouTube, blog RSS: views, engagement, referrals |
| **Activity Ledger** | Log talks, workshops, streams; correlate with metric deltas |
| **Contributor CRM** | Track top contributors with identities unified across channels |
| **Weekly Digest** | Auto-generated markdown report to email/Slack |

## Quickstart

```bash
git clone https://github.com/thecoderpanda/devpulse.git
cd devpulse
cp .env.example .env
docker compose up -d
```

Open `http://localhost:3000`. API on `4000`. That's it.

## Architecture

```
apps/
├── web/         Next.js 14 dashboard (App Router + Tailwind)
├── api/         Fastify + Zod REST API
└── worker/      BullMQ worker + croner schedulers

packages/
├── db/                    Prisma schema + client
├── digest/                Handlebars weekly digest generator
├── integrations/core/     Source contract + registry
└── integrations/*/        github, discord, discourse, devto, youtube, rss
```

Every source is a plugin implementing a tiny `Source` contract. Ship a new integration in ~100 LOC.

## Hosting

DevPulse is 100% self-hostable. Pick whichever fits your team — there is no paid tier.

- **Local**: Docker Compose or `pnpm dev` on a 1 vCPU box
- **Free cloud stack**: Vercel (`web`) + Fly.io (`api` + `worker`) + Neon (Postgres) + Upstash (Redis) — total cost **\$0/month** for small teams
- **Homelab**: Runs on a Raspberry Pi

## Principles

- **Honest metrics over vanity metrics** — deltas + context, not just raw numbers
- **Self-hostable by default** — your DevRel data never leaves your infra
- **Pluggable** — every source is a small package, add a new one in an afternoon
- **Boring stack** — TypeScript, Postgres, Redis, Docker. No magic.

## Roadmap

- **Slack, Mastodon, Bluesky** integrations
- **MCP server** — expose DevPulse metrics to Claude / ChatGPT / any MCP client
- **Claude Skills / OpenAI Skills** — packaged skills so LLMs can query and act on DevRel data
- **Power BI custom connector** — for BI teams already living in Power BI
- **Data warehouse exporters** — Snowflake, BigQuery, Redshift, DuckDB
- **Grafana + Datadog + Prometheus** export
- **Attribution model** — link activities → metric deltas automatically
- **Public embed widgets** — "stars this week", "PRs merged", etc. as SVG endpoints

## Status

**Live and open source.** MIT-licensed, source at [github.com/thecoderpanda/devpulse](https://github.com/thecoderpanda/devpulse). Good-first-issues are labelled — PRs welcome.

---

Licensed under MIT. Star the repo, open an issue, ship an integration.
