# Case Follow-up Tracker

Small enterprise-style front-end app (training-friendly) for internal banking operations.

Employees can:
- Add a follow-up task for a case
- Delete a task
- Mark a task as completed
- Assign priority
- Add a case ID and internal note
- Filter tasks by status and priority

## How to run
This is a static HTML/CSS/JS app.

Recommended (so sample data loads):
- Use **VS Code Live Server**, then open `index.html`.

Alternative (Python):
- Run `python -m http.server 8000` in this folder
- Open `http://localhost:8000/`

> Note: If you open `index.html` via `file://`, your browser may block `fetch()` for `data/sample-tasks.json`.

## Data & persistence
- On first run, the app attempts to seed localStorage from `data/sample-tasks.json`.
- After that, tasks are stored in localStorage under `case-followup-tracker.tasks.v1`.

## Project structure
- `index.html` — UI (semantic HTML)
- `css/styles.css` — styling (CSS variables + simple enterprise layout)
- `js/app.js` — behavior (CRUD + filters + localStorage)
- `data/sample-tasks.json` — realistic sample tasks

## Copilot customizations (VS Code)
This repo includes Copilot customization files aligned with the current VS Code approach.

- `.github/copilot-instructions.md`
  - Workspace-level guidance for Copilot (pair-programming style, maintainability, enterprise UX patterns).
- `.github/agents/frontend-pair-programmer.agent.md`
  - Use when you want implementation help and small, safe code changes.
- `.github/agents/enterprise-ux-reviewer.agent.md`
  - Use when you want a UX/accessibility review (should not add new features).
- `.github/agents/internal-banking-copy.agent.md`
  - Use when you want realistic internal UI wording (labels, helper text, empty states).
- `.github/prompts/add-feature.prompt.md`
  - Use as a starting point to add a feature without overengineering.
- `.github/prompts/ux-review.prompt.md`
  - Use to run a structured UX review checklist.

## Workshop extension ideas (optional)
If you want to extend the app in a workshop:
- Add edit-task support (keep it inline, no modal)
- Add basic validation rules for case ID format
- Add a simple search field for case ID
