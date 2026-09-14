---
title: "Why I Built OpenQuant India"
subtitle: "An open-source Python stack for people who write code, care about Indian markets, and are tired of backtests that only tell them the happy half of the story."
date: 2026-08-14T09:00:00.000Z
slug: why-i-built-openquant-india
---

# Why I Built OpenQuant India

> **TL;DR:** I built **[OpenQuant India](https://github.com/thecoderpanda/openquant)** because the free tools for backtesting Indian equities quietly leave out the parts that actually decide whether a strategy is any good — taxes, fees, slippage, dead companies, corporate actions. It's open source, Apache-2.0, seven small Python packages. No promises. No signals. Just infrastructure that tries to be honest.

## The moment this became personal

A friend of mine ran a backtest last year. It looked incredible on paper. He talked about it for weeks. Eventually he put a small amount of real money behind it, and within a couple of months the story was very different from what his screen had told him.

He's not careless. He's a good engineer. He did what most people who write code and care about the market do — he grabbed a free tool, wrote a strategy, looked at the output, and trusted it.

That's the problem. Not him. The tool.

Almost every free backtesting library for Indian equities gives you a number that assumes the market is a frictionless place. It isn't. There is a whole ecosystem of small, boring things that sit between "the price on the chart" and "what actually lands in your account." Most tools skip them entirely, because modelling them correctly is annoying and unglamorous.

## The gap nobody talks about

Here is what a free backtest usually leaves out:

- **Taxes.** STT, LTCG, STCG. All of them show up eventually.
- **Broker fees.** Different brokers, different structures. A flat fee is not the same as a percentage.
- **GST on the fees.** Yes, on the fees themselves.
- **Exchange charges.** Small per-trade amounts that compound with turnover.
- **Stamp duty.** State-dependent, quietly added.
- **Slippage.** The price you thought you got and the price you actually got are rarely the same.
- **Survivorship bias.** The index you're backtesting today didn't have the same companies five years ago. Some of them no longer exist.
- **Corporate actions.** Splits, bonuses, mergers. The HDFC merger alone changes the shape of a lot of Indian portfolios if you don't handle it correctly.

Add all of that back into a backtest and the story on the screen changes. Sometimes a little. Sometimes a lot. The point is not to be scary about it — the point is that a strategy should be judged on the honest version of its story, not the polished one.

## What I actually built

OpenQuant India is not one big library. It's seven small ones, each doing one thing, each installable on its own.

- **`oq-core`** — the shared primitives. Instruments, the NSE trading calendar, config.
- **`oq-data`** — clean NSE data ingestion. Bhavcopy parsing, corporate-action-adjusted prices, point-in-time index universes. Writes to local Parquet, no external database required.
- **`oq-backtest`** — a vectorised backtester with the full Indian cost engine and an intraday module.
- **`oq-broker`** — a unified async broker abstraction with a paper-trading engine.
- **`oq-mcp`** — an MCP server, so you can drive the whole stack from Claude Desktop or any other MCP client.
- **`oq-zoo`** — a community strategy library, gated by an honesty test before anything gets in.
- **`oqstack`** — a meta-package that installs everything in one line for people who just want it all.

Each of these is genuinely small. You can pull in only the piece you need. Or you can `pip install oqstack` and get the lot.

The design principle underneath all of it is the same: **the honest number is the default number.** The gross figure is available if you ask for it explicitly. The net figure — the one that models the real world — is what you see first.

## Why open source

A few reasons, all of them boring and none of them clever.

The first is that this kind of infrastructure should not be a moat. The people who need it most are the ones who cannot afford to buy a professional data terminal. Retail traders. Students. Small teams. Anyone learning. They deserve tools that don't quietly lie to them, and the way to make sure those tools exist is to give them away.

The second is that I wanted something I could point a friend to. If someone messages me tomorrow saying they want to try writing a strategy, I want to be able to send them one link and say — *use this, it won't lie to you.* That's it. That's the whole pitch.

The third is that open source keeps me honest too. Every cost calculation, every adjustment, every assumption is in the repo. If I get something wrong, someone will notice. That's the point.

## What it explicitly is not

I want to be very clear about this, because there is enough hype in this space already.

- It is **not** investment advice.
- It is **not** a trading bot.
- It is **not** a signal-selling service. No tips. No "guaranteed" anything. Ever.
- It is **not** a black box. Every calculation is documented and tested.

It is infrastructure. That's the whole thing. It gives you honest numbers so you can make your own decisions with your eyes open.

## How to try it

If you want to poke at it, the fastest path is:

```bash
pip install oqstack
```

Or, if you'd rather just read the code first, the repo is here:

🔗 **[github.com/thecoderpanda/openquant](https://github.com/thecoderpanda/openquant)**

There's also a small Streamlit dashboard in the repo (`apps/dashboard/`) that lets you run a strategy end-to-end and see the gross-vs-net gap plotted for yourself. That was the visualisation I wanted to exist first, and it's honestly the fastest way to feel the difference this makes.

## What's next

This is early. It works, it's tested, it's honest — but it gets better with more people using it, breaking it, and telling me what's missing.

If you write code, care about Indian markets, and have ever had a moment of quiet suspicion that your backtest looked a bit too good — please try it. Open an issue if something is wrong. Send a PR if you can. Tell me what you'd want next.

That's the whole point of building in the open. The tool is not finished until the people it's for have shaped it.

---

*OpenQuant India is Apache-2.0 licensed. Repo: [github.com/thecoderpanda/openquant](https://github.com/thecoderpanda/openquant). Feedback and PRs welcome.*
