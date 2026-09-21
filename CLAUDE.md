# CLAUDE.md — Follow the Incident demo

## What this project is
An interactive web demo for the SASH paper on AI agent emergency shutdowns.
The full product spec is in `SPEC.md`. Read it before any work. If the spec and a request conflict, ask.

## Audience
Policy staffers with mixed technical skills. Everything on screen must be plain language.
Any technical term needs a short tooltip, using the Glossary in `SPEC.md`.

## Tech stack
- Vite + React + TypeScript.
- Plain CSS (CSS modules or one stylesheet). No UI framework unless I agree to it.
- Animation: CSS transitions or SVG first. Ask before adding an animation library.
- Static site only: no backend, no database, no login, no analytics, no external API calls at runtime.
- Must build to static files that can be hosted on GitHub Pages.

## Where content lives
- All scenario content (companies, events, timings, notes, options, results, on-screen text) lives in `src/data/scenario.json`.
- Components read from that file. Never hard-code scenario text inside components.
- This lets non-coders edit the story without touching code.

## Content rules
- Company names come from `scenario.json`, which stores a real name and a fictional name for each company plus a `nameMode` switch (see SPEC.md §4a). Default is `real` for this internal demo. Never hard-code a company name inside a component.
- In real-name mode a banner must appear on every screen saying the scenario is hypothetical and did not happen.
- Never suggest that a real company has an actual flaw, breach or failing. Real names mark roles only.
- Label all numbers as "illustrative".
- The demo describes design choices; it does not prescribe. Never mark an option as "correct".
- Keep the tone calm and factual.

## Design rules
- Clean, simple, readable. Large text, generous spacing.
- Colour code from the spec: yellow = actors that can intervene, blue = affected services, red = harmed, grey = stopped.
- Do not rely on colour alone: also use icons or labels.
- Works on a laptop browser; readable on a phone.
- Keyboard accessible: Back / Next / Play controls reachable with Tab and Enter.

## How to work with me
- I'm new to Claude Code. Explain briefly what you changed and how I can see it.
- Build in small stages. Stop after each stage so I can check it in the browser.
- Don't add features that aren't in `SPEC.md` for v1. Put ideas in a "Suggestions" note instead.
- Before finishing a stage, run `npm run build` and fix any errors.
- After I approve a stage, commit it to git with a clear message.
