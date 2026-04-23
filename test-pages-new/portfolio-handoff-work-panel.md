# Handoff: Work panel — placeholder until case content exists

**Single-agent scope:** The **Work** nav tile (`active === 'work'`) in [`Portfolio.html`](./Portfolio.html): the React `WorkSection`. Currently a **minimal placeholder** (no case cards, no gallery)—nav and shell stay so the grid stays 2×2 with four sections.

**Code anchor:** Search `Portfolio.html` for `function WorkSection`.

---

## In scope

| Area | Responsibility |
| ---- | ---------------- |
| **Placeholder copy** | Short, honest “coming soon” / reserved messaging until real case studies ship. |
| **Future content** | When ready: case cards, imagery, links—match `ServicesSection`-style cards or a dedicated case layout as designed. |
| **`CARDS` row** | You may propose **`label` / `sub`** for `id: 'work'` (e.g. replace “Coming soon”). |

---

## Out of scope

- **Services** Solutions grid (`#services` mirror), **About**, **Contact**.

---

## Deliverables checklist

- [x] Placeholder copy is short, honest, and clearly “reserved / coming soon” (no fake case cards).
- [x] `WorkSection` uses `data-theme="dark"` and the same `portfolioPanelShell` pattern as other embed panels.
- [x] `CARDS` row for `id: 'work'` uses a clearer subline than a bare “Coming soon” where helpful.

---

## Revision log

| Date | Author | What changed |
| ---- | ------ | ------------ |
| 2026-04-22 | Agent | Work tile restored; `WorkSection` ships as placeholder only. |
| 2026-04-22 | Agent | Audited against handoff: placeholder tightened (why the grid stays), `aria-labelledby` on section, muted cross-link to Services/Contact; `CARDS.sub` → “Case studies when ready”; out-of-scope line updated for Services Solutions grid. |

---

## Paste into a new chat (Work agent)

You own **`WorkSection`** in `test-pages-bad/test-pages-new/Portfolio.html`. Read [`portfolio-handoff-work-panel.md`](./portfolio-handoff-work-panel.md). Replace the placeholder when case study content and art direction are ready; keep `data-theme="dark"` and panel shell consistent with other tabs.
