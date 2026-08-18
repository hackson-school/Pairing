# 2026 Web UI Design Rules (Mandatory)

すべてのUI実装・画面改修において、以下の2026年Web UIトレンド基準を厳格に遵守すること。安易なAIテンプレート的デザイン（絵文字乱用、均一なカード縦積み、デフォルトグレー）は一切禁止とする。

1. **カラーパレット（Warm Editorial）**
   - 背景: `#F0EEE9` (Cloud Dancer / 純白は不可)
   - サーフェス: `#FAF8F4` (Warm Parchment)
   - テキスト: `#1C1917` (Espresso) / `#5A534C` (Driftwood) / `#948B82` (Stone)
   - アクセント: `#8C532B` (Roast) / `#A47764` (Mocha Mousse)
   - ボーダー: `#E8E2D9` (Sand)

2. **タイポグラフィ（Fraunces × DM Sans）**
   - 見出し: `font-display` (Fraunces), `font-light`, `italic`, `letter-spacing: -0.03em`
   - メタ・ラベル: `text-[10px]`, `uppercase`, `tracking-widest` (0.12em〜0.14em)
   - 本文: `font-sans` (DM Sans / Noto Sans JP), `leading-relaxed` (1.6)

3. **テクスチャ & シャドウ**
   - カードやヘッダーには `.noise-surface`（微細フラクタルノイズ 0.025）を適用。
   - シャドウは2重シャドウ（`0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)`）。

4. **インタラクション**
   - ホバー時に 1〜2px 浮き上がる `Micro-lift` と非対称トランジション（In: 200ms ease-out, Out: 150ms ease-in）。
