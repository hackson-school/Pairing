# 2026 Web UI Design System & Guidelines (お菓子ペアリング)

本ドキュメントは、2026年の最先端Webデザイン（Awwwards SOTY、国内大手食品・ライフスタイルブランドの体験型Webサイト）のリサーチ結果に基づいて策定された、当プロジェクトの絶対的なデザインシステム仕様書です。
**AI特有の安っぽさ（絵文字の乱用、均一なカードの羅列、紫/青の機械的グラデーション、デフォルトグレー）を100%排除**し、人間デザイナーが手掛けたような温かみと高級感（Human-Craft & Warm Editorial）を保証します。

---

## 1. カラーパレット（Warm Neutral × Roast Accent）

| トークン | Hex | 役割・用途 |
|---|---|---|
| `--color-bg` | `#F0EEE9` | メイン背景（純白・原色グレーを完全排除、Cloud Dancer） |
| `--color-surface` | `#FAF8F4` | カード・セクション背景（Warm Parchment） |
| `--color-surface-sub` | `#F5F2EB` | サブ領域・入力欄・解説枠（Linen） |
| `--color-text-primary` | `#1C1917` | メイン見出し・本文（Espresso） |
| `--color-text-secondary` | `#5A534C` | サブコピー・説明文（Driftwood） |
| `--color-text-muted` | `#948B82` | ラベル・キャプション・プレースホルダー（Stone） |
| `--color-accent-roast` | `#8C532B` | プライマリアクセント（珈琲・焼き菓子・スコア強調） |
| `--color-accent-mocha` | `#A47764` | セカンダリアクセント（Mocha Mousse） |
| `--color-accent-sage` | `#4A6B5D` | 成功・タグ・補足（Forest Sage） |
| `--color-border` | `#E8E2D9` | 通常境界線（Sand） |
| `--color-border-subtle` | `#D3C9BD` | 補助境界線（Mist） |

---

## 2. タイポグラフィ階層（Fraunces × DM Sans）

### フォントファミリー
- **見出し（Display）**: `Fraunces`（Google Fonts）+ `Georgia`, `serif`
- **本文（Sans）**: `DM Sans` + `-apple-system`, `Noto Sans JP`, `sans-serif`

### エディトリアルコントラスト
- **見出し（H1/H2）**: `font-light` / `italic` / `letter-spacing: -0.03em` を組み合わせ、雑誌の装丁のような洗練度を演出。
- **メタ情報・ラベル**: `font-semibold` / `text-[10px]` / `uppercase` / `letter-spacing: 0.12em〜0.14em` で端正に引き締める。
- **本文**: `leading-relaxed`（行間1.6）、1行最大52〜65文字で可読性を担保。

---

## 3. テクスチャと質感（2026年の最重要技術）

### ① 微細SVGノイズ（.noise-surface）
- 背景・カード・ヘッダーに微細なフラクタルノイズ（`opacity: 0.025`, `mix-blend-mode: multiply`）を適用。
- デジタルの無機質な平面感を消し、紙やリネンのような手触り感・クラフト感を付与。

### ② 2重シャドウシステム（Premium Shadow）
- 単一のボケ影ではなく、輪郭を定義する「1pxの環境光」＋「接地感を作るソフトシャドウ」を合成。
  ```css
  /* 通常時 */
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  /* ホバー時 */
  box-shadow: 0 10px 20px rgba(0,0,0,0.07), 0 4px 6px rgba(0,0,0,0.04);
  ```

---

## 4. インタラクション・モーション原則（Micro-Lift）

- **非対称トランジション**:
  - Hover-in: `200ms cubic-bezier(0.16, 1, 0.3, 1)`（スプリング感のある浮き上がり）
  - Hover-out: `150ms ease-in`
  - Active: `100ms`（押し込みフィードバック）
- **Micro-Lift**:
  - ホバー時に `-translate-y-0.5`（1〜2px）だけ重力に逆らって静かに浮き上がる。
- **画面遷移**:
  - ステップ切り替え・結果表示時は `animate-slide-up`（450ms スプリングイージング）でスムーズに展開。

---

## 5. UIレイアウト・アンチパターン厳守事項

### ❌ 絶対に禁止するAI生成パターン
1. 🧁 🍫 ☕ 🍷 などの絵文字をUIボタンや見出しにペタペタ貼り付けること
2. 「AIソムリエ」「人工知能が解析中」などのわざとらしいAIセリフ
3. 全カードが全く同じ正方形・同じ高さの「画一的で平坦な縦積みカード」
4. Tailwindデフォルトの `text-gray-500` や `bg-gray-100` などの無機質な灰色
5. 紫・シアンのサイバー調ネオングラデーション

### ✅ 採用する人間らしいレイアウトパターン
1. **ステップ進行（1画面1アクション）**: 迷わせず、写真・お菓子 $\rightarrow$ 気分 $\rightarrow$ 結果へ流れる体験。
2. **雑誌風マガジンロウ & 非対称グリッド**: コンテンツ量に応じた自然な高低差。
3. **SNS共有したくなる「ペアリング鑑定カード」**: 1枚の美しいグラフィックとして完結する結果画面。
