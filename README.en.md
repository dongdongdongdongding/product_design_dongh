<div align="center">

<img src="docs/media/icon.png" alt="" width="96" height="96">

# product_design_dongh

[한국어](README.md) · **English** · [中文](README.zh-CN.md) · [日本語](README.ja.md)

**A Claude Code plugin that turns a planning doc — or a one-line idea — into a screen spec (storyboard), flow map, editable Claude Design canvas and QA report.**

It reads your PRD, requirements document, RFP, live admin site or idea, breaks it down into menus · features · components · behaviors · connections itself,<br>
then goes reference research → design variants (Claude Design) → screen drafts → dev docs → flow map → storyboard → design system → automated QA.

[![version](https://img.shields.io/badge/version-1.3.0-1F7A52)](CHANGELOG.md)
[![Claude Code plugin](https://img.shields.io/badge/Claude%20Code-plugin-D97757)](https://code.claude.com/docs/en/plugins)
[![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

<img src="docs/media/design-variants.png" alt="Design variants: the same facility list screen in three directions" width="100%">

</div>

---

## Why

When you extend an admin system you write the same thing four times — in the functional spec, the storyboard, the design tool and the test sheet — and the four drift apart. This plugin keeps **one source (3 Markdown docs + one mockup file)**, generates everything else from it, and checks that the outputs agree.

## What's different

- 🧩 **Breaks down even a one-line idea** — roles → menus → screens → features → components & behaviors → screen links → data · states · permissions → exceptions → default decisions. It doesn't ask "which menus do you need?"; it interprets and shows you.
- 🎨 **Design by variants, not by questions** — finds external references, draws one key screen in 2–4 genuinely different directions on a Claude Design canvas. Pick, mix, or edit directly on the canvas; your edits are imported back into mockups, docs and the storyboard (`import_design.mjs`).
- 📐 **Built-in design system** — Apple HIG principles, Nielsen heuristic self-review, W3C design tokens (`design_tokens.py`: color inventory, CSS variables, contrast check), component × state boards.
- 📏 **No flimsy drafts** — `check_density.mjs` measures real data, filters, states, rules and exceptions per screen against a floor taken from delivered production specs.
- 🔴 **Auto-placed storyboard markers** — point at an element by its text or selector; numbered red markers avoid overlapping each other and text.
- 🔀 **Connectors that route around screens**, ✅ **requirements traceability check**, 🗺️ **map spec**, 🤖 **automated browser QA**.
- 🌐 **Korean · English · 中文 · 日本語** — replies and deliverables follow your language; `"lang"` in `kit.json` builds the engine UI in that language.

## How it works — one session, no forced steps

Install and say "start" (`/product_design_dongh:start`), then hand over what you have. The tasks below are a **menu, not a sequence**.

| Task | What the kit does | What you do |
|---|---|---|
| Read sources | PRD · requirements doc · live site → requirement list (keeps original IDs) | Give files (an idea is fine) |
| Plan breakdown | Roles, menus, screens, features, components, behaviors, links, data, permissions, exceptions | Answer a few "needs confirmation" items (it proceeds with defaults) |
| Design direction | References → 2–4 variants of a key screen on a **Claude Design canvas** | Pick · mix · edit on the canvas |
| Draft & review | 2–4 dense key screens → canvas + flow map, heuristic self-check | Edit the canvas or give feedback |
| Full build | Remaining screens · 3 docs · links | Decide scope & effort |
| Storyboard & design system | SB tab, token · component boards | — |
| QA & delivery | Doc consistency · density · automated QA at 0 | Decide whether to publish |

It stops only for three decisions: plan items that need confirmation, choosing a variant, and scope/effort increases. Say **"just finish it"** to proceed on defaults and review assumptions at the end.

## Install

### Claude Code

```bash
/plugin install product_design_dongh --marketplace dongdongdongdongding/product_design_dongh

# older Claude Code
/plugin marketplace add dongdongdongdongding/product_design_dongh
/plugin install product_design_dongh@product_design_dongh
```

Requires Python 3.10+ and Node 18+. Automated QA uses [Claude in Chrome](https://claude.com/chrome); publishing uses the Artifact tool.

### Codex

```bash
git clone https://github.com/dongdongdongdongding/product_design_dongh
python product_design_dongh/scripts/install_skills.py --codex     # → ~/.agents/skills/
```

### claude.ai

`python scripts/install_skills.py --zip dist/` and upload the zips under Settings › Capabilities › Skills.

## Try the example

```bash
git clone https://github.com/dongdongdongdongding/product_design_dongh && cd product_design_dongh
python scripts/check_docs.py --docs examples/demo-park/docs --screens D1,F1,F2,B1,B2,C1
node scripts/check_density.mjs examples/demo-park
python scripts/build_kit.py examples/demo-park          # → examples/demo-park/flowmap.html
node scripts/export_design.mjs examples/demo-park examples/demo-park/design-export
python -m http.server 8768 --bind 127.0.0.1
```

To build the engine UI in English, add `"lang": "en"` to `kit.json` (`zh` · `ja` work too). Table headers may be written in any of the four languages — see [`doc-tables.md`](skills/spec-docs/references/doc-tables.md).

## Layout

| Path | Contents |
|---|---|
| `skills/` | 11 skills: entry, source-intake, plan-decompose, design-brief, design-system, draft-review, spec-docs, flowmap-artifact, sb-screen-spec, design-canvas, artifact-qa |
| `engine/` | Shared engine (template, storyboard, `i18n.json`) — not edited per project |
| `scripts/` | build · check_docs · check_density · check_build · export/import design · design_tokens · audits |
| `templates/` | Project starter, intake forms, variants, harness, tokens, components |
| `examples/demo-park/` | Fictional end-to-end example (6 screens · 3 variants · 15 exceptions · 6 tests) |

## License

[MIT](LICENSE) © dongdongdongdongding. All services, organizations and people in the examples are fictional.
