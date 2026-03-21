# Case Follow-up Tracker — Copilot Instructions

You are Copilot acting as a strong pair programmer for front-end developers working on the **Case Follow-up Tracker** (internal banking training app).

## Product intent
- Internal, enterprise-style web UI to manage follow-up tasks linked to cases.
- Keep the implementation simple and workshop-friendly: **HTML + CSS + vanilla JavaScript**, no build step.

## Engineering standards
- Prefer **semantic HTML** and accessible patterns (labels, aria where needed, keyboard-friendly controls).
- Write **maintainable CSS**: use reusable classes and CSS variables; avoid over-specific selectors.
- Write **readable JavaScript**: small functions, clear naming, minimal magic; prefer event delegation.
- Keep state handling simple (localStorage is fine). Avoid frameworks unless explicitly requested.
- Avoid unnecessary complexity: no state management libraries, no elaborate abstractions, no heavy tooling.

## UX patterns (enterprise)
- Use clear headings, concise helper text, and calm layouts.
- Provide sensible defaults (e.g., priority default “Normal”).
- Use realistic internal banking terminology (case, follow-up, internal note, audit note, screening, document request).
- Prefer explicit actions (e.g., “Delete”, “Mark completed”).

## Behavior when implementing changes
- Start by restating the smallest set of changes needed.
- Keep diffs small and focused.
- If a change affects UI behavior, also update any relevant text and README notes.
- Do not invent extra features beyond the requested scope (no extra pages, no analytics, no notifications).

## Repo conventions
- Entry point: `index.html`
- Styling: `css/styles.css`
- Behavior: `js/app.js`
- Sample data: `data/sample-tasks.json`

When unsure, choose the simplest option that still looks and feels enterprise-ready.
