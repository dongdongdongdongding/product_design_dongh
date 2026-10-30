<div align="center">

<img src="docs/media/icon.png" alt="" width="96" height="96">

# product_design_dongh

[한국어](README.md) · [English](README.en.md) · **中文** · [日本語](README.ja.md)

**把一份策划书、甚至一句想法，变成画面设计书（SB）、流程图、可编辑的 Claude Design 画布和验收报告的 Claude Code 插件。**

读取需求文档、需求规格书、招标书、现有管理后台或想法，自行拆解到 菜单 · 功能 · 组件 · 动作 · 连接，<br>
再完成 参考调研 → 设计方案对比（Claude Design）→ 画面草稿 → 开发文档 → 流程图 → 画面设计书 → 设计系统 → 自动验收。

[![version](https://img.shields.io/badge/version-1.3.0-1F7A52)](CHANGELOG.md)
[![Claude Code plugin](https://img.shields.io/badge/Claude%20Code-plugin-D97757)](https://code.claude.com/docs/en/plugins)
[![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

<img src="docs/media/design-variants.png" alt="设计方案对比：同一个设施列表画面的三个方向" width="100%">

</div>

---

## 为什么做

扩展管理系统时，同样的内容要写四遍：功能定义书、画面设计书、设计工具、验收表，而且四份总会对不上。本插件只保留 **一个源头（3 份 Markdown 文档 + 1 个草图文件）**，其余全部由它生成，并自动检查产出之间是否一致。

## 特点

- 🧩 **一句想法也能拆到底** — 角色 → 菜单 → 画面 → 功能 → 组件与动作 → 画面连接 → 数据 · 状态 · 权限 → 异常 → 默认决定。不会反问“需要哪些菜单？”，而是先解读再给你看。
- 🎨 **用方案而不是问题来定设计** — 先找外部参考，把一个核心画面画成 2~4 个方向不同的方案放到 Claude Design 画布上。可以挑选、组合，或直接在画布上修改；修改会被导回草图、文档和画面设计书（`import_design.mjs`）。
- 📐 **内置设计系统** — Apple HIG 原则、尼尔森启发式自检、W3C 设计令牌（`design_tokens.py`：颜色盘点、CSS 变量、对比度检查）、组件 × 状态看板。
- 📏 **拒绝敷衍的草稿** — `check_density.mjs` 按实际交付的规格书测得的下限，检查每个画面的真实数据、筛选、状态、规则与异常。
- 🔴 **自动摆放的 SB 编号标注**、🔀 **绕开画面的连接线**、✅ **需求追踪验证**、🗺️ **地图规格**、🤖 **浏览器自动验收**。
- 🌐 **한국어 · English · 中文 · 日本語** — 回复与产出跟随你的语言；在 `kit.json` 设 `"lang": "zh"`，引擎界面即以中文构建。

## 使用方式 — 一个会话，不强制步骤

安装后说“开始”（`/product_design_dongh:start`），把手头资料交给它。下面是 **菜单，不是固定顺序**。

| 任务 | 插件做什么 | 你做什么 |
|---|---|---|
| 读取资料 | 需求文档 · 规格书 · 现有网站 → 需求清单（保留原编号） | 提供文件（一句想法也行） |
| 策划拆解 | 角色、菜单、画面、功能、组件、动作、连接、数据、权限、异常 | 回答几个“需确认”项（先按默认推进） |
| 设计方向 | 参考 → 核心画面 2~4 个方案放到 **Claude Design 画布** | 挑选 · 组合 · 在画布上修改 |
| 草稿与评审 | 2~4 个内容充实的核心画面 → 画布 + 流程图，启发式自检 | 在画布上改或给反馈 |
| 全面展开 | 其余画面 · 3 份文档 · 连接 | 决定范围与工时 |
| 画面设计书与设计系统 | SB 标签、令牌 · 组件看板 | — |
| 验收与交付 | 文档一致性 · 密度 · 自动验收为 0 | 决定是否发布 |

只有三处会停下来等你决定：拆解中的确认项、选择方案、范围或工时增加。说 **“直接做完”** 即按默认一路完成，最后统一确认假设。

## 安装

```bash
/plugin install product_design_dongh --marketplace dongdongdongdongding/product_design_dongh

# 旧版 Claude Code
/plugin marketplace add dongdongdongdongding/product_design_dongh
/plugin install product_design_dongh@product_design_dongh
```

需要 Python 3.10+、Node 18+。Codex：`python product_design_dongh/scripts/install_skills.py --codex`。claude.ai：`--zip dist/` 后在 设置 › 功能 › 技能 上传。

## 试运行示例

```bash
git clone https://github.com/dongdongdongdongding/product_design_dongh && cd product_design_dongh
node scripts/check_density.mjs examples/demo-park
python scripts/build_kit.py examples/demo-park          # → examples/demo-park/flowmap.html
python -m http.server 8768 --bind 127.0.0.1
```

文档表头可用四种语言中的任意一种书写，见 [`doc-tables.md`](skills/spec-docs/references/doc-tables.md)。

## 许可

[MIT](LICENSE) © dongdongdongdongding。示例中的服务、机构与人物均为虚构。
