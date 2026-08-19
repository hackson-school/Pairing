# 📖 お菓子と飲み物の手帖 (Flavor Pairing Journal)

> **日常のひとくちを、至福のひとときに変える。**  
> 感性と科学が織りなす、インタラクティブ・ペアリング手帖 Web アプリケーション。

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5.23-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-3D_Transition-FF0055?logo=framer)](https://www.framer.com/motion/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-Pairing_Engine-8E75C2?logo=googlegemini)](https://ai.google.dev/)

---

## ✨ 主な特徴

- 🌟 **3Dイマーシブ・トランジション**: 画面中央の閉じた洋書をタップすると、表紙が開きページがパラパラとめくれながら本の中へ吸い込まれるズームイン演出。
- 📖 **3Dページフリップ手帖UI**: ページの端をマウスでドラッグしてペラペラとめくったり、ボタンで心地よくめくれるリアルな本のような操作感。
- 🔬 **科学的ペアリング診断**: お菓子の甘み・油脂・香りを Google Gemini AI が分析し、相性スコア（%）・風味の同調理由・味覚の相乗効果・サービング温度/淹れ方を処方。
- 🎨 **2026年エディトリアルデザイン**: 安っぽいAIアイコンや派手な配色を完全排除し、エクリュ（生成り）・クラシカルブロンズ・深みのあるチャコールによる上質なグルメ手帖の佇まい。
- 📱 **モバイル完全最適化**:
  - アドレスバー伸縮による無限再描画ループの解消（Debounce ＆ インスタンス固定）
  - ボタンタップと四隅判定の衝突防止
  - ページめくり期間（900ms）の完全排他ロックによるタップ貫通・ページ飛ばしの撲滅
- 🖼️ **100%確実なCanvas 2D手帖カード生成**: 診断結果をクラシカルな手帖カード画像として即座に高画質PNG生成（長押し保存・ダウンロード・SNS共有）。

---

## 🛠️ 技術スタック

| カテゴリ | 使用技術 |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router, Turbopack) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS, CSS 3D Transforms |
| **Animation** | Framer Motion, react-pageflip |
| **AI Engine** | Google Gemini API (`@google/genai`) |
| **Image Export** | HTML5 Canvas 2D API (Pure Native Renderer) |
| **Icons** | Lucide React |

---

## 🚀 ローカルでの立ち上げ方

### 1. リポジトリのクローン
```bash
git clone https://github.com/hackson-school/Pairing.git
cd Pairing
```

### 2. 依存パッケージのインストール
```bash
npm install
```

### 3. 環境変数の設定
プロジェクトルートに `.env.local` を作成し、Google Gemini APIキーを設定します：
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. 開発サーバーの起動
```bash
npm run dev
```
ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

---

## 📚 ドキュメント

- **[Zenn 投稿用技術記事 (ZENN_ARTICLE.md)](./ZENN_ARTICLE.md)**: 3D演出の設計、スマホ最適化の泥臭い戦い、Canvas 2D画像保存などを解説した完全版記事。

---

## 📄 ライセンス

This project is licensed under the MIT License.
