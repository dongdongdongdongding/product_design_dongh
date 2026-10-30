<div align="center">

<img src="docs/media/icon.png" alt="" width="96" height="96">

# product_design_dongh

[한국어](README.md) · [English](README.en.md) · [中文](README.zh-CN.md) · **日本語**

**企画書ひとつ、アイデア一行から、画面設計書（SB）· フローマップ · 編集できる Claude Design キャンバス · 検収レポートまで作る Claude Code プラグイン。**

企画書 · 要件定義書 · RFP · 運用中の管理画面 · アイデアを読み、メニュー · 機能 · コンポーネント · 動作 · 連結まで自ら分解し、<br>
参考調査 → デザイン案の比較（Claude Design）→ 画面の下書き → 開発文書 → フローマップ → 画面設計書 → デザインシステム → 自動検収まで進めます。

[![version](https://img.shields.io/badge/version-1.3.0-1F7A52)](CHANGELOG.md)
[![Claude Code plugin](https://img.shields.io/badge/Claude%20Code-plugin-D97757)](https://code.claude.com/docs/en/plugins)
[![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

<img src="docs/media/design-variants.png" alt="デザイン案の比較: 同じ施設一覧画面を3つの方向で" width="100%">

</div>

---

## なぜ作ったか

管理システムの追加開発では、同じ内容を機能定義書 · 画面設計書 · デザインツール · 検収表に4回書き、4つは少しずつずれていきます。このプラグインは **原本を1つ（Markdown 文書3種 + 試案ファイル1つ）** にし、残りをすべてそこから生成し、成果物どうしが合っているかを自動で確かめます。

## 特長

- 🧩 **アイデア一行でも最後まで分解** — 役割 → メニュー → 画面 → 機能 → コンポーネントと動作 → 画面の連結 → データ · 状態 · 権限 → 例外 → 既定の決定。「どんなメニューが必要ですか？」とは聞かず、解釈して見せます。
- 🎨 **質問ではなく案でデザインを決める** — 外部の参考を探し、主要画面を方向の異なる 2〜4 案で Claude Design キャンバスに並べます。選ぶ · 混ぜる · キャンバスで直接直す — 直した内容は試案 · 文書 · 画面設計書に取り込まれます（`import_design.mjs`）。
- 📐 **デザインシステム内蔵** — Apple HIG の原則、ニールセンのヒューリスティック自己評価、W3C デザイントークン（`design_tokens.py`: 色の棚卸し · CSS 変数 · コントラスト検査）、コンポーネント × 状態ボード。
- 📏 **薄い下書きは出さない** — `check_density.mjs` が、実際に納品した仕様書から測った下限で、画面ごとの実データ · フィルター · 状態 · ルール · 例外を確かめます。
- 🔴 **SB 番号マーカーの自動配置**、🔀 **画面を避ける連結線**、✅ **要求追跡の検証**、🗺️ **地図仕様**、🤖 **ブラウザー自動検収**。
- 🌐 **한국어 · English · 中文 · 日本語** — 返答と成果物はあなたの言語で。`kit.json` に `"lang": "ja"` を入れるとエンジン UI も日本語でビルドされます。

## 使い方 — 段階を強制しない1つのセッション

インストールして「開始」（`/product_design_dongh:start`）と言い、手元の資料を渡すだけです。下の表は **順番ではなくメニュー** です。

| 作業 | プラグインがすること | あなたがすること |
|---|---|---|
| 資料の読み込み | 企画書 · 要件定義書 · 運用サイト → 要求一覧（元の ID を維持） | ファイルを渡す（アイデアでも可） |
| 企画の分解 | 役割、メニュー、画面、機能、コンポーネント、動作、連結、データ、権限、例外 | 「要確認」をいくつか答える（既定案で先に進む） |
| デザインの方向性 | 参考 → 主要画面の 2〜4 案を **Claude Design キャンバス** に | 選ぶ · 混ぜる · キャンバスで直す |
| 下書きとレビュー | 中身のある主要画面 2〜4 枚 → キャンバス + フローマップ、ヒューリスティック自己点検 | キャンバスで直すかフィードバック |
| 全体の展開 | 残りの画面 · 文書3種 · 連結 | 範囲 · 工数の判断 |
| 画面設計書とデザインシステム | SB タブ、トークン · コンポーネントボード | — |
| 検収と納品 | 文書の整合 · 密度 · 自動検収 0 件 | 公開するかどうか |

止まるのは3つの判断だけです: 分解の要確認、案の選択、範囲 · 工数の増加。**「最後までお任せ」** と言えば既定案で進め、最後に仮定をまとめて確認します。

## インストール

```bash
/plugin install product_design_dongh --marketplace dongdongdongdongding/product_design_dongh

# 旧バージョンの Claude Code
/plugin marketplace add dongdongdongdongding/product_design_dongh
/plugin install product_design_dongh@product_design_dongh
```

Python 3.10+、Node 18+ が必要です。Codex: `python product_design_dongh/scripts/install_skills.py --codex`。claude.ai: `--zip dist/` で作った zip を 設定 › 機能 › スキル にアップロード。

## 例を動かす

```bash
git clone https://github.com/dongdongdongdongding/product_design_dongh && cd product_design_dongh
node scripts/check_density.mjs examples/demo-park
python scripts/build_kit.py examples/demo-park          # → examples/demo-park/flowmap.html
python -m http.server 8768 --bind 127.0.0.1
```

文書の表の見出しは4言語のどれで書いても読めます。[`doc-tables.md`](skills/spec-docs/references/doc-tables.md) を参照。

## ライセンス

[MIT](LICENSE) © dongdongdongdongding。例に出てくるサービス · 組織 · 人物はすべて架空です。
