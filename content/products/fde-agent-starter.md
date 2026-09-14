---
title: FDE Agent Starter
description: Batteries-included template for shipping a forward-deployed AI agent — evals in CI, Langfuse traces, one-command Fly.io deploy, and a bundle of Agent Skills.
status: active
tags: [Open Source, AI Agents, Vercel AI SDK, Langfuse, Agent Skills, TypeScript]
url: https://github.com/thecoderpanda/fde-starter-kit
github: https://github.com/thecoderpanda/fde-starter-kit
year: "2026"
---

## The Problem

Every forward-deployed AI engagement rebuilds the same scaffolding.

Day 1: chat UI. Day 3: someone asks "how do we know it won't get worse tomorrow?" and the *real* work starts — evals, traces, a deploy pipeline, a way to add tools without regressing the ones you already have, a way to A/B two prompts without arguing about vibes.

I have rebuilt that scaffolding at least four times. So I packaged it.

## What It Is

An opinionated open-source template for shipping a production AI agent, not a demo.

| Layer | What ships |
|---|---|
| **UI** | Next.js App Router + Vercel AI SDK chat (`useChat` + streaming `/api/chat`) |
| **Tools** | Typed with Zod: `web_search`, `sql_query`, `read_file` (patterns, not just utilities) |
| **Evals** | JSONL golden cases + typed assertions + CI gate on every PR + nightly cron |
| **Traces** | Langfuse wrapper — silent no-op without keys, full span per tool call with keys |
| **Deploy** | Multi-stage Dockerfile (non-root, ~140 MB) + `fly.toml` with `/api/health` |
| **Providers** | OpenAI · Anthropic · Gemini · DeepSeek · OpenRouter, auto-detected, env-driven model IDs |
| **Skills** | 5 Agent-Skills runbooks: `agent-eval`, `prompt-diff`, `trace-debug`, `deploy-agent`, `add-tool` |

## Quickstart

```bash
git clone https://github.com/thecoderpanda/fde-starter-kit fde-agent
cd fde-agent
npm install
cp .env.example .env    # add one provider key
npm run dev             # http://localhost:3000
npm run eval            # run the golden set
```

Five commands to a working agent with evals, traces (optional), and a deploy path.

## Principles

- **Opinionated defaults, permissive escape hatches** — one framework, one deploy target, one eval format. Rip out any piece as you outgrow it.
- **The scaffolding is the product** — evals, traces, CI, and deploy are shipped by default, not homework.
- **Multi-provider from day one** — three-tier model precedence (`AGENT_MODEL` → `AGENT_MODEL_<PROVIDER>` → fallback) means swapping models is an env change.
- **Skills over docs** — five self-contained runbooks encode the FDE workflow so your coding agent can do the FDE tasks with you.
- **MIT, forever** — clone it, fork it, ship it, sell what you build on top.

## Roadmap

- [ ] `evals` — parallel runner with a rate-limited queue
- [ ] `agent` — LangGraph-style branching for multi-step workflows
- [ ] `skills` — cost-report skill (per-provider spend from eval runs)
- [ ] `deploy` — Cloud Run + Render config alongside Fly.io
- [ ] `observability` — OpenTelemetry exporter next to Langfuse

## Status

**Live.** Public on GitHub, CI green, five skills shipped in the `./skills/` bundle. Actively iterating on the eval harness and skill set — issues and PRs welcome, especially new skills.

---

Licensed under MIT. [Star the repo](https://github.com/thecoderpanda/fde-starter-kit) to follow along.
