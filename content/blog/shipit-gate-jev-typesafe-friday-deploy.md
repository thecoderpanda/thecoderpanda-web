---
title: "I Gave Jev the Deploy Button (and Built shipit-gate)"
subtitle: "A weekend experiment with TypeSafe AI's new System One model, packaged as the world's most opinionated CLI."
date: 2026-09-20T18:00:00.000Z
slug: shipit-gate-jev-typesafe-friday-deploy
---

![shipit-gate — the AI deploy gate, powered by Jev](https://raw.githubusercontent.com/thecoderpanda/shipit-gate/main/docs/assets/hero.png)

# I Gave Jev the Deploy Button (and Built shipit-gate)

> **TL;DR:** TypeSafe AI shipped [**Jev**](https://typesafe.ai) — a "System One" model that returns *typed, calibrated decisions* instead of text. No JSON parsing. No prompt-engineering yoga. Just: `should_block: true, deploy_confidence: 0.21, rollback_risk: 0.82`. I spent a weekend seeing if I could hand it the deploy button. The result is [**shipit-gate**](https://github.com/thecoderpanda/shipit-gate), an open-source CLI that asks Jev whether it's safe to ship, blocks scary Friday deploys, and exits non-zero when it isn't. `npm i -g shipit-gate` and go. It's ~600 lines of TypeScript, one HTTP call, no LLM cosplay.

## The moment I saw Jev

Every AI SDK for the last three years has shipped the same tired trick: "define a JSON schema, we'll ask the LLM to fill it, cross our fingers, and hope it doesn't put a `<thinking>` tag in the middle of your enum."

I have spent, cumulatively, *weeks* of my life writing retry loops around bad JSON.

Then I saw the TypeSafe docs and did a double-take. Their **System One** models don't generate text. You give them state, you give them a typed question (a `noul` — probability of yes; a `choice` — one of a fixed set; a `score` — position on an ordered scale), and you get back a *number* with calibrated confidence. That's it. No parsing. No hallucinated fields. No "sometimes the model returns `\`\`\`json`".

**Jev** is their flagship System One model. It's fast (~200ms), cheap (~$0.0001/call), and it thinks about your input like a slightly grumpy senior engineer instead of a hallucination generator.

I read the docs at 11pm on a Friday. By Sunday afternoon, I had shipped a CLI.

## The idea, in one sentence

> Every SRE team has an unwritten "no Friday deploys" rule. Everyone breaks it. Let's give them a machine that never forgets.

## Meet `shipit-gate`

`shipit-gate` is a tiny CLI. You run it before your deploy. It:

1. **Collects signals** from your git working tree — branch, HEAD sha, dirty files, recent commits, diff stats, whether the diff touches auth/payments/migrations/infra/config, whether tests pass, what time it is, whether you're pushing on a Friday at 5:47pm like a maniac.
2. **Hands them to Jev** as a single typed request with six questions: `should_block`, `deploy_success`, `rollback_needed`, `blast_radius`, `reason_category`, `human_summary`.
3. **Gates your deploy** — exits `1` if Jev says wait, exits `0` if Jev says ship.

That's the whole thing. Here's what it looks like when you try to deploy a migration + payments change on a Friday afternoon:

![shipit-gate CLI — blocked vs cleared](https://raw.githubusercontent.com/thecoderpanda/shipit-gate/main/docs/assets/demo.png)

```
$ shipit check

→ collecting deploy signals...
→ asking jev...

────────────────────────────────────────────────────────────
  🛑 BLOCKED  — Jev has evaluated your deploy
────────────────────────────────────────────────────────────

  Verdict:  Migration + late hour — high rollback risk, wait for business hours.

  Signals
    time         Friday 17:42 America/Los_Angeles
    branch       feat/new-billing @ 4a9b21c (dirty)
    diff         37 files, +2140 -318
    risky areas  migrations, payments
    tests        pass

  Jev decision
    deploy_confidence  ████░░░░░░░░░░░░░░░░  0.21
    rollback_risk      ████████████████░░░░  0.82
    blast_radius       critical
    reason_category    timing

  Why blocked
    Jev's read: Migration + late hour — high rollback risk, wait for business hours.
    category: timing (day/hour makes this risky)   confidence: 0.87

    What Jev saw:
      • Friday 17:00 — late-week deploy window
      • Working tree dirty (4 uncommitted files)
      • Diff touches sensitive areas: migrations, payments
      • Large diff: 37 files, +2140 -318
      • Jev estimates 82% chance of needing a rollback within 24h
      • Blast radius = critical (auth/payments/data or core user flow)

    Gates tripped by your policy:
      • Jev says block
      • rollback_risk 0.82 > 0.70
      • blast_radius = critical
```

Exit code `1`. Your CI job fails. Your deploy is blocked. Your on-call gets to keep their Friday night.

## What Jev actually does under the hood

This is the part that surprised me.

I did *not* write "you are a helpful deploy engineer, please respond in valid JSON with the following fields." I wrote six questions, each with typed criteria, and Jev returned six typed answers with per-answer confidence. Here's an abbreviated version of one:

```ts
{
  should_block: {
    type: 'noul',
    instructions: 'Should this deploy be BLOCKED right now? ...',
    criteria: {
      true:  'Block: the risk of an incident is meaningful and this deploy should wait.',
      false: 'Allow: the risk is acceptable and this deploy should proceed.',
    },
  },
  blast_radius: {
    type: 'choice',
    instructions: 'If this deploy breaks, how much is affected?',
    criteria: {
      low:      'Isolated impact: internal tools, off-path code.',
      medium:   'One user-facing feature is degraded for many users.',
      high:     'A core user flow is degraded for many users.',
      critical: 'Auth, payments, data-loss, or a full outage.',
    },
  },
  // ... four more
}
```

And it comes back like:

```json
{
  "answers": {
    "should_block": { "type": "noul", "noul": 0.87 },
    "blast_radius": { "type": "choice", "choice": "critical", "confidence": 0.79, "probabilities": { ... } }
  }
}
```

That is *ordinary data*. My code branches on `>= 0.5`. I never have to trust that the model formatted a boolean correctly, because a `noul` is a **number**. It cannot be malformed. It cannot be `"yes"` sometimes and `"true"` other times and `"absolutely!"` at 3am when the model is feeling chatty.

If you have ever written `JSON.parse(response.text)` inside a try/catch for a production feature, this is going to feel like taking off ski boots.

## Why I open-sourced it

Two reasons.

**One:** The whole thing is a 200-line proof that you can build "AI in the loop" software without the AI being the loop. Jev decides. My code runs the workflow. There is no agent, no reasoning trace, no "let me think step by step" — just a request and a typed response. I want other people to feel how *calm* this feels compared to prompt engineering.

**Two:** Every team that has ever paged someone on a weekend has the receipts to prove this is useful. And "the intern's `git push` on Friday afternoon" is a bug we've been trying to fix with policy for twenty years. Turns out you can fix it with a CLI and a probability.

## What's in the repo

- `shipit check` — the main command
- `shipit init` — writes a `.shipitrc.json` starter config
- `--mock=safe|risky|blocked` — offline demo mode, no API key needed
- Pre-push git hook template
- GitHub Action snippet
- Three-scenario `./demo/run.sh` that spins up throwaway repos and runs the CLI against them
- MIT license, zero dependencies you haven't already installed

Repo: [**github.com/thecoderpanda/shipit-gate**](https://github.com/thecoderpanda/shipit-gate)  
npm: `npm i -g shipit-gate`

## Things I want to try next

- **`shipit history`** — track how often `--force` overrides preceded an actual incident. I bet the graph is depressing.
- **Slack notifications** — post the blocked verdict + reasoning to `#deploys` so the whole team sees when Jev disagreed with you.
- **Datadog / Sentry context** — feed recent incidents in as additional signal ("last time we shipped this file, it broke").
- **Composite Jev scores across services** — one gate for the monorepo, per-service policies. This is where the "typed answers as reusable features" pattern from the TypeSafe docs starts to really pay off.

If any of that sounds fun, the repo is wide open. PRs welcome. Add a signal, tighten a question, break my thresholds.

## The real point

I have been building with LLMs since GPT-3. Every year the models get better and the *interface* stays the same: I write a prompt, I parse a string, I pray.

TypeSafe is the first thing in a while that made me stop and go *"oh — this is what it should have looked like the whole time."* Typed inputs. Typed outputs. Calibrated probabilities. Code owns the workflow. The model owns the judgment. Nothing hallucinates a curly brace at 3am.

If you write software that has to make a decision based on a fuzzy input — routing, ranking, extraction, verification, guardrails — go read [their docs](https://docs.typesafe.ai). Then build a little thing over a weekend. That's how I ended up here.

I'll be over here, watching my CI logs, waiting for Jev to save me from myself.

— The Coder Panda

*P.S. I'm mildly convinced someone at TypeSafe named it "Jev" specifically because it makes you sound extremely serious when you tell your CTO "Jev says no."*
