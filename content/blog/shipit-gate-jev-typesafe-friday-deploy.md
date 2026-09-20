---
title: "I Built a Tiny Robot That Yells At Me For Shipping On Fridays"
subtitle: "A very chill weekend hobby project with TypeSafe AI's new Jev model. No agents. No prompts. Just vibes and a boolean."
date: 2026-09-20T18:00:00.000Z
slug: shipit-gate-jev-typesafe-friday-deploy
cover: /blog-covers/shipit-gate-jev-typesafe-friday-deploy.png
---

![shipit-gate — the AI deploy gate, powered by Jev](https://raw.githubusercontent.com/thecoderpanda/shipit-gate/main/docs/assets/hero.png)

# I Built a Tiny Robot That Yells At Me For Shipping On Fridays

Hey. So, I had a Saturday. And I saw this thing on X about **TypeSafe AI** and **Jev** trending, and I thought "cool, another AI thing". Then I actually read the docs and went "wait, hold on, this is different."

So I did what any normal person does with a free afternoon: **I built a tiny CLI that stops me from deploying on Friday nights.**

It's called [`shipit-gate`](https://github.com/thecoderpanda/shipit-gate). It's a hobby project. It's on npm. It's silly. It also kind of works. Let me explain.

---

## First — what even is TypeSafe AI? What is Jev?

Okay, in the simplest possible English:

**Every AI SDK you've used goes like this:**

> "Hey LLM, please answer my question. And please, please, PLEASE return valid JSON. I'm begging you. Here's the schema. Don't add a `<thinking>` tag. Don't wrap it in markdown. Just… JSON. Please."

And then you write a `try/catch` around `JSON.parse` and hope for the best.

**TypeSafe flips this on its head.** Their models — called **System One** models — don't generate text at all. You give them:

1. Some **state** (whatever context matters — a git diff, a support ticket, a form input, whatever)
2. Some **typed questions** — like "is this urgent?" or "which category?" or "how risky, 1–10?"

And you get back **typed answers with confidence scores**. Not text. Not JSON-flavored text. Actual numbers and enums that your code can just… use.

![How Jev works — you send state and typed questions, Jev returns typed answers with confidence](https://raw.githubusercontent.com/thecoderpanda/shipit-gate/main/docs/assets/how-jev-works.png)

**Jev** is their flagship System One model. The three question types you'll use most:

- **`noul`** — probability of yes. Ask "is this a bug?" get back `0.83`.
- **`choice`** — pick one from a defined list. Ask "which severity?" get back `"high"` with a confidence.
- **`score`** — where does this sit on a 0–10 scale. Ask "how spicy is this take?" get back `7.2`.

That's it. That's the whole vibe. It's fast (~200ms), it's cheap (fraction of a cent), and you never write `JSON.parse` again.

If you've ever built anything with LLMs, that last sentence should give you a small dopamine hit.

---

## Okay so… what does shipit-gate actually do?

It's a CLI. You run it before you deploy. It looks at your git tree and asks Jev one question: **"bro, is it safe to ship this?"**

![shipit-gate in 3 steps — read git tree, ask Jev, ship or wait](https://raw.githubusercontent.com/thecoderpanda/shipit-gate/main/docs/assets/how-it-works.png)

Here's what it collects and hands to Jev, all in one call:

- What time is it, what day, what timezone
- What branch, is the tree dirty, how many uncommitted files
- How big is the diff, does it touch auth / payments / migrations / infra
- Did tests pass
- Are you *sure* about this

Jev thinks for ~200ms and comes back with:

- `should_block`: true/false
- `deploy_confidence`: 0–1
- `rollback_risk`: 0–1
- `blast_radius`: `low` / `medium` / `high` / `critical`
- A one-liner summary you can put in Slack

If it says block, the CLI exits `1`. Your CI job fails. Your deploy stops. You go get a coffee.

Here's what it looks like when I tried to ship a migration + billing change on a Friday afternoon (guilty):

![shipit-gate demo — BLOCKED vs CLEARED FOR TAKEOFF](https://raw.githubusercontent.com/thecoderpanda/shipit-gate/main/docs/assets/demo.png)

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
```

I love it. It's like having a slightly grumpy senior engineer who never sleeps and doesn't drink.

![not on a Friday, bro](https://raw.githubusercontent.com/thecoderpanda/shipit-gate/main/docs/assets/friday-bot.png)

---

## The part where I geek out about the code

Okay stay with me, this is the fun part.

I did NOT write "you are a helpful deploy engineer, please respond in valid JSON with the following fields, take a deep breath and think step by step."

I wrote **six typed questions**. Here's the shape:

```ts
{
  should_block: {
    type: 'noul',
    instructions: 'Should this deploy be BLOCKED right now?',
    criteria: {
      true:  'Block: risk of an incident is meaningful, deploy should wait.',
      false: 'Allow: risk is acceptable, deploy should proceed.',
    },
  },
  blast_radius: {
    type: 'choice',
    instructions: 'If this deploy breaks, how much is affected?',
    criteria: {
      low:      'Isolated impact: internal tools, off-path code.',
      medium:   'One user-facing feature is degraded.',
      high:     'A core user flow is degraded.',
      critical: 'Auth, payments, data-loss, or a full outage.',
    },
  },
  // ...four more
}
```

And Jev sends back:

```json
{
  "answers": {
    "should_block": { "type": "noul", "noul": 0.87 },
    "blast_radius": {
      "type": "choice",
      "choice": "critical",
      "confidence": 0.79,
      "probabilities": { "low": 0.02, "medium": 0.07, "high": 0.12, "critical": 0.79 }
    }
  }
}
```

That's **normal data**. My code does `if (decision.should_block) exit(1)`. There is no parsing. There is no praying. A `noul` is a **number** — it cannot be malformed, it cannot be `"yes"` sometimes and `"true"` other times.

If you've written prompt-and-parse code, this is going to feel like taking off ski boots at the end of a long day.

---

## Try it (no API key needed, promise)

```bash
git clone https://github.com/thecoderpanda/shipit-gate.git
cd shipit-gate && npm install && npm run build
./demo/run.sh
```

That runs three back-to-back scenarios — a safe deploy ✅, a risky one 🟡, and a blocked one 🛑 — with a mocked Jev response so you don't need to sign up for anything.

Or if you want the real thing:

```bash
npm i -g shipit-gate
export TYPESAFE_API_KEY=sk_...
shipit check
```

---

## Stuff I want to try next

This is a hobby project, so the roadmap is basically "whatever sounds fun on the next Saturday":

- **`shipit history`** — track how many times `--force` overrides preceded an actual incident. I have a feeling the graph will be embarrassing.
- **Slack ping** — post the blocked verdict + reasoning to `#deploys`. Peer pressure as a service.
- **Sentry / Datadog signals** — "last time we shipped this file it broke" is a *huge* signal.
- **Per-service policies** — one gate for the whole monorepo, different thresholds per service.

If any of that sounds fun, the repo is wide open. PRs welcome. Add a signal, tighten a question, break my thresholds, whatever.

---

## The real takeaway

I've been building with LLMs for a while and every year the models get better and the *interface* stays exactly the same: I write a prompt, I parse a string, I pray.

TypeSafe is the first thing in a while that made me stop and go *"oh — this is what it should have looked like the whole time."*

Typed inputs. Typed outputs. Calibrated probabilities. My code owns the loop. The model owns the judgment. Nothing hallucinates a curly brace at 3am.

If you've got a Saturday and a fuzzy problem — routing, ranking, extraction, guardrails, anything where a human would go "hmm, depends" — go read [the TypeSafe docs](https://docs.typesafe.ai) and build a little thing. That's how I ended up here.

**Repo:** [github.com/thecoderpanda/shipit-gate](https://github.com/thecoderpanda/shipit-gate)  
**npm:** `npm i -g shipit-gate`  
**License:** MIT, do whatever

I'll be over here, watching my CI logs, letting Jev save me from myself.

— The Coder Panda

*P.S. Yes, I named it "shipit" because I'm not immune to the joke.*

*P.P.S. If you're at TypeSafe reading this — the docs are great, the API is calm, Jev goes hard. Ship more.*
