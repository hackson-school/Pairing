# 【Next.js × 3Dページフリップ】「お菓子と飲み物の手帖」を作った話 〜 スマホ激重問題・タップ貫通・Canvas画像生成の泥臭い戦い 〜

---

## 📌 はじめに

学校ハッカソンにて、**「日常のひとくちを、至福のひとときに変える」** をコンセプトにしたWebアプリ **『お菓子と飲み物の手帖（Flavor Pairing Journal）』** を開発しました。

「今日食べるお菓子（カヌレ、ビターチョコ、ポテトチップスなど）」を選択または写真を撮ると、**Gemini AIが科学的根拠（風味の同調・味覚の補完・油脂のリセット）に基づき、相性最高の一杯（珈琲、紅茶、日本茶、お酒など）を処方してくれる** インタラクティブなグルメ手帖です。

本記事では、このアプリでこだわった **3DページフリップUIの演出**、**2026年らしい上質なエディトリアルデザイン**、そして開発終盤に立ちはだかった **「スマホ版が激重になる問題」「ボタンタップの貫通・ページ飛ばし」「モバイルSafariで画像保存ができない問題」** などの泥臭いフロントエンドのチューニング記録を余すことなく共有します。

---

## 🎯 アプリの概要と主な特徴

| 機能 / 特徴 | 内容 |
| :--- | :--- |
| **3Dイマーシブ・イントロ** | 画面中央に置かれた洋書をタップすると、表紙が開きパラパラとめくれながら本の中（物語の世界）へ吸い込まれるズームイン遷移 |
| **インタラクティブ手帖UI** | ページの端をマウスで掴んでめくったり、ボタンで心地よくペラペラめくれる3Dページフリップ体験 |
| **科学的ペアリング診断** | お菓子の甘み・油脂・香りを科学的に分析し、相性スコア（%）・風味の同調理由・おすすめ温度/淹れ方を提示 |
| **100%動く手帖画像保存** | 診断結果をクラシカルな手帖カードとして即座に高画質PNG生成（長押し保存・ダウンロード・SNS共有） |
| **脱・AIデザイン** | 安っぽい絵文字や過剰なグラデーションを排除し、エクリュ（生成り）と深みのあるブロンズを基調とした上質なタイポグラフィ |

---

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript (Strict モード)
- **スタイリング**: Tailwind CSS
- **アニメーション**: Framer Motion
- **ページめくりライブラリ**: `react-pageflip`
- **AI・バックエンド**: Google Gemini API（ペアリング診断エンジン）
- **画像生成**: HTML5 Canvas 2D API（完全ネイティブ描画）
- **デプロイ**: Vercel

---

## 📖 こだわり①：3Dページフリップ＆イマーシブトランジション

### 1. 表紙から本の世界へ吸い込まれるイントロ演出
アプリ起動時、3D CSS（`transform-style: preserve-3d`）と `Framer Motion` を組み合わせて「閉じた本」を表現しています。
タップすると表紙が開き、中身のページがパラパラとめくられた直後、カメラ視点が急速にページの挿絵へとズームイン（Zoom-in Intro）してメインの手帖画面へシームレスに切り替わります。

```tsx
// BookIntroTransition.tsx のズームイン・フェード演出の骨格
<motion.div
  initial={{ scale: 0.9, opacity: 0 }}
  animate={
    phase === "zooming"
      ? { scale: 3.2, opacity: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
      : { scale: 1, opacity: 1 }
  }
>
  {/* 3D 表紙・背表紙・パラパラページのアニメーション */}
</motion.div>
```

### 2. 「脱・AIっぽさ」を追求した2026年のエディトリアルデザイン
よくあるAI生成アプリは「派手な紫/ネオンのグラデーション」「絵文字（☕✨🍃📖）の乱用」「どこにでもある Bento Grid」になりがちです。
今回はそれらを徹底的に排除しました：
- **カラーパレット**: 紙の温もりを感じるエクリュ（`#FAF8F4`）、クラシカルなブロンズ（`#8C532B`）、引き締まったチャコール（`#1C1917`）。
- **タイポグラフィ**: セリフ体のイタリック見出し（`Playfair Display` / `Cinzel` 風）と、端正な幾何学サンセリフのメリハリ。
- **情報密度**: 無駄な空白（デッドスペース）を作らず、「風味の同調」「味覚のマリアージュ指標」「テイスティングの作法（Tasting Ritual）」など、実用的なグルメ手帖のコンテンツを凝縮。

---

## 🧗 直面した課題と泥臭い最適化（ここが本番！）

ハッカソン開発中、PCのブラウザでは完璧に動いていたものの、**スマホ（実機）で動かした途端に数々の深刻な問題** に直面しました。これらをどのように解決したかを記録します。

---

### 💥 課題1：スマホ版が「激重」になる無限再レンダリングループ

#### 【原因の特定】
スマホの Safari や Chrome は、画面スクロールやタップ時に **アドレスバー（URLバー）が伸び縮み** します。
この時、ブラウザの `window.innerHeight` が毎フレーム変化し、`resize` イベントが何十回も連続発火していました。

元のコードでは、この `resize` イベントをそのまま `useState` に流し込み、さらに `HTMLFlipBook` の `key` にサイズを渡していたため、**ページをめくっている最中に本全体が破棄 $\rightarrow$ 再構築（Canvas・DOMの再計算）を繰り返す地獄の再描画ループ** に陥っていました。

#### 【解決策】
1. `resize` イベントを **250ms の Debounce（間引き）** と `passive: true` に変更。
2. `HTMLFlipBook` の `key` を固定化し、画面のわずかな伸縮でインスタンスが破棄されないように保護。

```tsx
// BookApp.tsx
useEffect(() => {
  let timeoutId: NodeJS.Timeout;
  const updateSize = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }, 250);
  };
  updateSize();
  window.addEventListener("resize", updateSize, { passive: true });
  window.addEventListener("orientationchange", updateSize, { passive: true });
  return () => {
    clearTimeout(timeoutId);
    window.removeEventListener("resize", updateSize);
    window.removeEventListener("orientationchange", updateSize);
  };
}, []);
```

---

### 💥 課題2：ボタンタップと四隅判定の衝突・カクつき

#### 【原因の特定】
`react-pageflip` には「ページの四隅（右下・左下など）をタップするとめくる」という機能（`showPageCorners={true}`）がデフォルトで有効になっています。
これが、ページ下部に配置した **「次へ」「戻る」「鑑定する」ボタンのタップ領域とモロに重複** していました。

ボタンを押した瞬間に、ボタンのクリックイベントと本の角タップ判定が **二重に同時発火（イベント衝突）** し、アニメーションが途中で引っかかってカクついたり誤作動を起こしていました。

#### 【解決策】
1. `showPageCorners={false}` および `disableFlipByClick={true}` に設定し、ボタン背後の見えない角タップ判定を完全に排除。
2. 全ボタンの `onClick` ハンドラに `e.stopPropagation()` を追加し、イベントの伝播を遮断。

```tsx
<HTMLFlipBook
  showPageCorners={false}
  disableFlipByClick={true}
  clickEventForward={false}
  useMouseEvents={true} // PCでのマウスドラッグめくりは維持！
  ...
>
```

---

### 💥 課題3：次のページへのタップ判定貫通（ゴーストクリック・ページ飛ばし）

#### 【原因の特定】
スマホ版では、操作性を考慮して「次へ」ボタンを各ページのほぼ同じ位置（下部中央）に配置していました。
しかし、ユーザーがボタンをタップした際、**指が画面から離れるまでのわずかな時間差（または300msのタップ遅延）** の間にページがめくられ、**めくられた直後の「次のページの同じ位置にあるボタン」が反応してしまう「タップ貫通（ゴーストクリック）」** が発生。1タップで2〜3ページ先まで飛ばされてしまう事象が起きていました。

#### 【解決策：ページめくり期間の完全排他ロック】
「1ページめくる時間（600ms）＋ 安全猶予（300ms）＝ 計900ms」をロック時間（クールタイム）として定義。
ボタンを押した瞬間に、**本コンテナ全体に `pointer-events-none` を付与し、ボタンも `disabled` にして物理的にタップを無効化** しました。

```tsx
const FLIP_LOCK_DURATION = 900;

const handleFlipNext = () => {
  const now = Date.now();
  // めくり中は追加のタップを100%破棄（Early Return）
  if (isPageTurning || now - lastFlipTimeRef.current < FLIP_LOCK_DURATION) return;
  
  lastFlipTimeRef.current = now;
  setIsPageTurning(true);

  try {
    bookRef.current?.pageFlip()?.flipNext();
  } catch (e) {
    console.error(e);
  }

  // アニメーション完了まで確実にロック
  setTimeout(() => {
    setIsPageTurning(false);
  }, FLIP_LOCK_DURATION);
};

// 本のコンテナ：めくり中は pointer-events-none でタップ貫通を完全遮断
<div className={`relative w-full ... ${isPageTurning ? "pointer-events-none select-none" : ""}`}>
```

---

### 💥 課題4：モバイルSafariで画像保存が失敗する（html-to-imageの限界）

#### 【原因の特定】
診断結果を手帖風カード画像として保存する機能で、当初は `html-to-image`（DOM $\rightarrow$ Canvas）を使用していました。
しかし、iOS Safari / WebKit 環境では以下の問題が発生し、高確率で保存に失敗していました：
1. `display: none` や画面外（不可視）に配置したDOMは、WebKitがスタイル計算をスキップして真っ白な画像になる。
2. Google Fonts や外部Webフォントの読み込みが CORS 制限に引っかかり、Promise が reject される。

#### 【解決策：ブラウザ標準の Canvas 2D レンダラーへ完全移行】
外部ライブラリを捨て、**HTML5標準の `<canvas>` 2Dコンテキスト（`ctx.fillText`, `ctx.fillRect`, `ctx.roundRect` 等）で直接描画するピュアジェネレーター** を自前実装しました。

```tsx
const handleOpenImageSaveModal = async () => {
  if (!result || isSharing) return;
  setIsSharing(true);

  try {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context is not available");

    // 1. 紙質背景
    ctx.fillStyle = "#FAF8F4";
    ctx.fillRect(0, 0, 800, 1000);

    // 2. ブロンズ飾り枠 & コーナー装飾
    ctx.strokeStyle = "rgba(140, 83, 43, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(32, 32, 736, 936);

    // 3. テキスト・相性スコア・科学的根拠の描画
    ctx.fillStyle = "#1C1917";
    ctx.font = "bold 34px sans-serif";
    ctx.fillText(result.sweets.name, 60, 230);

    // 4. DataURLに変換（0.05秒で生成完了！）
    const dataUrl = canvas.toDataURL("image/png");
    setGeneratedImageUrl(dataUrl);
    setShowImageModal(true);
  } finally {
    setIsSharing(false);
  }
};
```
これにより、**Safari / Chrome / iOS / Android / PC すべての端末で、エラー 0・待ち時間 0.05秒で超高画質PNGの生成・長押し保存・SNS共有が完璧に動作** するようになりました。

---

## 📊 学んだこと・まとめ

1. **リッチな3D UIほど「モバイルの実機検証」が命**:
   PCの高速なCPU/GPUやマウス操作では見えなかった「アドレスバー伸縮による再描画ループ」や「タップ貫通」は、実機でテストして初めて顕在化しました。
2. **外部ライブラリに頼りすぎず、標準API（Canvas 2D）の堅牢さに立ち返る**:
   DOM to Image 系のライブラリは手軽ですが、モバイルWebKitのセキュリティやレンダリング仕様との戦いになりがちです。重要な画像生成は Canvas 2D で描くのが最も速く、確実で、デザインの自由度も高いです。
3. **「めくり時間」の物理的ロックは最高のUXガード**:
   アニメーション中に操作をさせない「明確なクールタイム」と `pointer-events-none` の組み合わせは、直感的でミスのない心地よい手触りを生み出します。

最後まで読んでいただきありがとうございました！
ハッカソンや個人開発でリッチなWeb本UIやペアリングアプリを作りたい方の参考になれば幸いです。
