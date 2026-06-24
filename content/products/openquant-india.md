---
title: OpenQuant India
description: Honest, open-source quant infrastructure for Indian markets. Your backtest is lying to you — OpenQuant fixes that.
status: building
tags: [Open Source, Quant Finance, Python, NSE, Building in Public]
github: https://github.com/revorhq/openquant
year: "2025"
---

## The Problem

Indian retail quants run backtests that look like this:

> "+22% CAGR. Sharpe 1.8. Strategy: 12-month momentum on Nifty 500."

Then they go live and bleed money.

The gap between gross and net is where retail quants get destroyed. A backtest that doesn't model STT, brokerage, exchange charges, GST, SEBI fees, stamp duty, STCG/LTCG, slippage, survivorship bias, and corporate actions isn't a backtest — it's a fantasy.

OpenQuant India shows you the right number, by default.

## What It Is

A composable, pip-installable Python stack for Indian markets:

| Package | Status | What it does |
|---|---|---|
| `oq-core` | Alpha | Shared primitives: Instrument, NSE TradingCalendar |
| `oq-data` | Planned | NSE/BSE bhavcopy ingestion, adjusted prices, point-in-time index universes |
| `oq-backtest` | Planned | Vectorized portfolio backtester with an honest Indian cost engine |
| `oq-mcp` | Planned | MCP server exposing data and backtests to LLM clients |
| `oq-broker` | Planned | Unified async broker abstraction (Kite / Upstox / Fyers / Dhan) |

Each package is independently installable. Use one piece or all of them.

## Quickstart

```bash
pip install oq-core
```

```python
from datetime import date
from oq_core import Instrument, TradingCalendar

reliance = Instrument(symbol="RELIANCE", isin="INE002A01018")
# NSE:EQ:RELIANCE

cal = TradingCalendar()
cal.is_session(date(2024, 1, 26))          # False — Republic Day
cal.next_session(date(2024, 8, 14))         # date(2024, 8, 16)
cal.session_count(date(2024, 1, 1), date(2024, 12, 31))
```

## Principles

- **Honesty over excitement** — net-of-cost numbers are the default. Gross requires an explicit flag.
- **Data correctness is sacred** — a wrong adjusted price is a P0 bug.
- **Paper-first, safety-default** — live execution is opt-in, loud, and guarded.
- **Composable, not monolithic** — separate packages with a shared core.
- **Community is the product** — built in public, contributions welcome.

## Roadmap

- **Phase 0 — Foundation** *(in progress)*: `oq-core`, repo scaffolding, CI, license.
- **Phase 1 — Data Layer**: NSE bhavcopy ingestion, corporate actions, point-in-time index universes.
- **Phase 2 — Backtester**: vectorized engine + honest cost engine + broker presets + tearsheet.
- **Phase 3 — MCP Server**: data and backtests exposed to LLM clients (Claude Desktop, etc.).
- **Phase 4 — Execution Layer**: paper + live broker abstraction with SEBI-2026 compliance built in.
- **Phase 5 — Ecosystem**: docs site, strategy zoo, Discord, cohorts.

---

Licensed under Apache 2.0. Watch the repo to follow along.
