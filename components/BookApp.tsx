"use client";

import React, { useRef, useState, useEffect, forwardRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { ArrowRight, ArrowLeft, RotateCcw, Check, Bookmark, Coffee, Download, Share2, X } from "lucide-react";
import { DrinkCategory, PairingResult } from "@/types/pairing";
import { getPairingDiagnosis } from "@/lib/pairingService";

const SWEETS_PRESETS = [
  { name: "カヌレ", category: "焼き菓子", note: "焦がしカラメルとラム酒", texture: "外カリ中モチ" },
  { name: "ビターチョコレート", category: "ショコラ", note: "カカオ70%のほろ苦さ", texture: "濃厚なくちどけ" },
  { name: "バスクチーズケーキ", category: "ケーキ", note: "焦げ目と濃厚クリーム", texture: "クリーミー" },
  { name: "苺のショートケーキ", category: "生ケーキ", note: "生クリームといちご", texture: "ふんわり軽快" },
  { name: "ポテトチップス", category: "スナック", note: "カリッとした塩気と油脂", texture: "クリスピー" },
  { name: "練り羊羹", category: "和菓子", note: "小豆の上品な甘み", texture: "滑らかで重厚" },
  { name: "シュークリーム", category: "洋菓子", note: "濃厚カスタード", texture: "とろける甘み" },
  { name: "ピスタチオのマカロン", category: "洋菓子", note: "香ばしいナッツ風味", texture: "サクふわ" },
];

const DRINK_GENRES: { id: DrinkCategory; title: string; subtitle: string }[] = [
  { id: "all", title: "おまかせ（全ジャンル）", subtitle: "相性スコアが最も高い最高の一杯" },
  { id: "coffee", title: "珈琲（コーヒー）", subtitle: "ドリップ・エスプレッソ・カフェラテ" },
  { id: "tea", title: "紅茶・ハーブティー", subtitle: "ストレート・アールグレイ・ミルク" },
  { id: "green_tea", title: "日本茶・中国茶", subtitle: "深蒸し煎茶・ほうじ茶・烏龍茶" },
  { id: "alcohol", title: "お酒（ワイン・洋酒等）", subtitle: "赤ワイン・ウイスキー・クラフトビール" },
];

const TASTE_FOCUS_OPTIONS = [
  { id: "harmony", label: "風味の同調", desc: "似た香りを重ねて深みを引き出す" },
  { id: "contrast", label: "後味のキレ", desc: "苦味や酸味で甘みをすっきり整える" },
  { id: "richness", label: "贅沢なコク", desc: "口いっぱいに広がる濃厚な重層感" },
  { id: "aftertaste", label: "香りの余韻", desc: "鼻腔に抜ける心地よいアロマを愉しむ" },
];

// 本文ページコンポーネント
const BookPage = forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    className?: string;
    pageNumber?: number;
    side?: "left" | "right";
    isCoverStyle?: boolean;
    density?: "hard" | "soft";
  }
>(({ children, className = "", pageNumber, side = "left", isCoverStyle = false, density = "soft" }, ref) => {
  const isLeft = side === "left";
  return (
    <div
      ref={ref}
      data-density={density}
      className={`page w-full h-full p-3.5 sm:p-5 flex flex-col justify-between select-none relative ${
        isCoverStyle ? "text-[#FAF8F4]" : "bg-[#FAF8F4] text-[#1C1917]"
      } ${className}`}
      style={{
        height: "100%",
        minHeight: "100%",
        boxSizing: "border-box",
        ...(isCoverStyle
          ? {
              background: "linear-gradient(145deg, #24201D 0%, #161412 100%)",
              border: "1px solid #3D3732",
              boxShadow: isLeft
                ? "inset -18px 0 30px rgba(0,0,0,0.5)"
                : "inset 18px 0 30px rgba(0,0,0,0.5)",
            }
          : {
              boxShadow: isLeft
                ? "inset -18px 0 25px -10px rgba(0,0,0,0.06), inset 0 0 15px rgba(0,0,0,0.02)"
                : "inset 18px 0 25px -10px rgba(0,0,0,0.06), inset 0 0 15px rgba(0,0,0,0.02)",
              borderLeft: isLeft ? "1px solid #E8E2D9" : "none",
              borderRight: isLeft ? "none" : "1px solid #E8E2D9",
              borderTop: "1px solid #E8E2D9",
              borderBottom: "1px solid #E8E2D9",
            }),
      }}
    >
      <div className="flex-1 flex flex-col h-full overflow-hidden justify-between">{children}</div>
      {pageNumber && (
        <div
          className={`pt-1.5 mt-auto border-t flex items-center justify-between text-[9px] sm:text-[10px] font-sans shrink-0 ${
            isCoverStyle ? "border-[#8C532B]/30 text-[#948B82]" : "border-[#E8E2D9]/70 text-[#948B82]"
          }`}
        >
          <span className="tracking-widest uppercase text-[8px] sm:text-[8.5px]">Sweets & Drink Pairing Journal</span>
          <span className="font-display italic font-medium">Page {pageNumber}</span>
        </div>
      )}
    </div>
  );
});
BookPage.displayName = "BookPage";

interface BookAppProps {
  onResetToCover?: () => void;
}

export default function BookApp({ onResetToCover }: BookAppProps) {
  const bookRef = useRef<any>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  });
  const [sweetsName, setSweetsName] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<DrinkCategory>("all");
  const [selectedFocus, setSelectedFocus] = useState<string>("harmony");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PairingResult | null>(null);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [isPageTurning, setIsPageTurning] = useState<boolean>(false);
  const lastFlipTimeRef = useRef<number>(0);

  // リサイズリスナーを間引き（スマホのアドレスバー伸縮による無限再描画・激重ループを完全防止）
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

  const isMobile = windowSize.width < 768;
  const bookWidth = isMobile ? Math.min(windowSize.width - 16, 400) : 430;
  const bookHeight = isMobile ? Math.min(windowSize.height - 20, 600) : Math.min(windowSize.height - 80, 590);

  // ページめくり所要時間ロック（600ms）
  const FLIP_LOCK_DURATION = 600;

  const handleFlipNext = () => {
    try {
      const pf = bookRef.current?.pageFlip();
      if (!pf) return;
      pf.flipNext();
    } catch (e) {
      console.error("handleFlipNext error:", e);
      try {
        bookRef.current?.pageFlip()?.turnToNextPage();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFlipPrev = () => {
    try {
      const pf = bookRef.current?.pageFlip();
      if (!pf) return;
      pf.flipPrev();
    } catch (e) {
      console.error("handleFlipPrev error:", e);
      try {
        bookRef.current?.pageFlip()?.turnToPrevPage();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDiagnose = async () => {
    if (!sweetsName) {
      alert("お菓子を選択するか、名前を入力してください。");
      return;
    }
    setIsLoading(true);
    try {
      const res = await getPairingDiagnosis(
        { name: sweetsName },
        selectedCategory
      );
      setResult(res);
      setIsLoading(false);

      setTimeout(() => {
        try {
          const pf = bookRef.current?.pageFlip();
          pf?.flipNext();
        } catch (e) {
          bookRef.current?.pageFlip()?.turnToNextPage();
        }
      }, 150);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      alert("診断中にエラーが発生しました。");
    }
  };

  const handleResetToFirst = () => {
    setResult(null);
    setSweetsName("");
    setSelectedCategory("all");
    if (onResetToCover) {
      onResetToCover();
    } else {
      try {
        bookRef.current?.pageFlip()?.flip(0);
      } catch (e) {
        bookRef.current?.pageFlip()?.turnToPage(0);
      }
    }
  };

  const handleOpenImageSaveModal = async () => {
    if (!result || isSharing) return;

    setIsSharing(true);
    try {
      // 100%確実にすべての端末（iOS Safari, Android, PC）で高速・高画質生成する Canvas 2D レンダラー
      const canvas = document.createElement("canvas");
      const width = 800;
      const height = 1000;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context is not available");

      // 1. 背景（上質なエクリュ・和紙テクスチャトーン）
      ctx.fillStyle = "#FAF8F4";
      ctx.fillRect(0, 0, width, height);

      // 2. 外枠フレーム（ブロンズ＆ゴールドのエレガントな二重枠）
      ctx.strokeStyle = "#E8E2D9";
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, width - 40, height - 40);

      ctx.strokeStyle = "rgba(140, 83, 43, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(32, 32, width - 64, height - 64);

      // コーナー装飾（手帖らしい上品なアクセント）
      const cornerSize = 16;
      ctx.fillStyle = "#8C532B";
      ctx.fillRect(30, 30, cornerSize, 2);
      ctx.fillRect(30, 30, 2, cornerSize);
      ctx.fillRect(width - 30 - cornerSize, 30, cornerSize, 2);
      ctx.fillRect(width - 32, 30, 2, cornerSize);
      ctx.fillRect(30, height - 32, cornerSize, 2);
      ctx.fillRect(30, height - 30 - cornerSize, 2, cornerSize);
      ctx.fillRect(width - 30 - cornerSize, height - 32, cornerSize, 2);
      ctx.fillRect(width - 32, height - 30 - cornerSize, 2, cornerSize);

      // 3. ヘッダーエリア
      ctx.fillStyle = "#8C532B";
      ctx.font = "bold 14px sans-serif";
      ctx.letterSpacing = "4px";
      ctx.fillText("FLAVOR PAIRING JOURNAL", 60, 80);

      ctx.fillStyle = "#1C1917";
      ctx.font = "italic 32px serif";
      ctx.fillText("お菓子と飲み物の手帖", 60, 122);

      // 日付
      const dateStr = new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
      ctx.fillStyle = "#948B82";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(dateStr, width - 60, 115);
      ctx.textAlign = "left";

      // 水平区切り線
      ctx.strokeStyle = "#E8E2D9";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(60, 145);
      ctx.lineTo(width - 60, 145);
      ctx.stroke();

      // 4. お菓子情報 & 相性スコア
      ctx.fillStyle = "#948B82";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText(`【お菓子】 ${result.sweets.category || "Confectionery"}`, 60, 185);

      ctx.fillStyle = "#1C1917";
      ctx.font = "bold 34px sans-serif";
      ctx.fillText(result.sweets.name, 60, 230);

      // 相性スコアバッジ
      ctx.textAlign = "right";
      ctx.fillStyle = "#8C532B";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("相性スコア", width - 60, 190);

      ctx.font = "bold 48px serif";
      ctx.fillText(`${result.bestMatch.matchScore}%`, width - 60, 238);
      ctx.textAlign = "left";

      // 5. ベストマッチ カードボックス
      ctx.fillStyle = "#FAF5F0";
      ctx.strokeStyle = "#E4CFBC";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(60, 265, width - 120, 140, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#8C532B";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText(`✦ BEST MATCH · ${result.bestMatch.categoryLabel}`, 85, 305);

      ctx.fillStyle = "#1C1917";
      ctx.font = "bold 28px sans-serif";
      ctx.fillText(result.bestMatch.drinkName, 85, 345);

      ctx.fillStyle = "#57534E";
      ctx.font = "italic 16px serif";
      ctx.fillText(`「${result.bestMatch.catchphrase}」`, 85, 380);

      // 6. 科学的分析・調和の理由ボックス
      ctx.fillStyle = "#F5F2EB";
      ctx.strokeStyle = "#E8E2D9";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(60, 425, width - 120, 230, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#1C1917";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("【香りと風味の同調】", 85, 465);

      ctx.fillStyle = "#44403C";
      ctx.font = "15px sans-serif";
      // テキスト折り返し描画
      const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
        let line = "";
        for (let n = 0; n < text.length; n++) {
          const testLine = line + text[n];
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = text[n];
            y += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, x, y);
        return y;
      };

      const yAfterHarmony = wrapText(result.bestMatch.flavorSynergy.harmonyReason, 85, 495, width - 170, 24);

      // 区切り
      ctx.strokeStyle = "#E8E2D9";
      ctx.beginPath();
      ctx.moveTo(85, 545);
      ctx.lineTo(width - 85, 545);
      ctx.stroke();

      ctx.fillStyle = "#1C1917";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("【味覚の相乗効果（科学的根拠）】", 85, 575);

      ctx.fillStyle = "#44403C";
      ctx.font = "15px sans-serif";
      wrapText(result.bestMatch.flavorSynergy.scienceNotes, 85, 605, width - 170, 24);

      // 7. サービングガイド（おすすめ温度 & 淹れ方）
      const guideBoxWidth = (width - 135) / 2;

      // 左ボックス：温度
      ctx.fillStyle = "#FAF8F4";
      ctx.strokeStyle = "#E8E2D9";
      ctx.beginPath();
      ctx.roundRect(60, 675, guideBoxWidth, 80, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#948B82";
      ctx.font = "13px sans-serif";
      ctx.fillText("おすすめ温度", 75, 705);
      ctx.fillStyle = "#1C1917";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText(result.bestMatch.servingGuide.temperature, 75, 735);

      // 右ボックス：淹れ方
      ctx.fillStyle = "#FAF8F4";
      ctx.strokeStyle = "#E8E2D9";
      ctx.beginPath();
      ctx.roundRect(60 + guideBoxWidth + 15, 675, guideBoxWidth, 80, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#948B82";
      ctx.font = "13px sans-serif";
      ctx.fillText("淹れ方・濃さ", 60 + guideBoxWidth + 30, 705);
      ctx.fillStyle = "#1C1917";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText(result.bestMatch.servingGuide.strengthOrBrew, 60 + guideBoxWidth + 30, 735);

      // 8. テイスティングの作法
      ctx.fillStyle = "#FAF5F0";
      ctx.strokeStyle = "#E4CFBC";
      ctx.beginPath();
      ctx.roundRect(60, 775, width - 120, 110, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#8C532B";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("✦ テイスティングの作法", 80, 805);

      ctx.fillStyle = "#44403C";
      ctx.font = "14px sans-serif";
      ctx.fillText("1. 先にお菓子を一口味わい、口いっぱいに甘みと香りを広げます。", 80, 835);
      ctx.fillText("2. 余韻が残るうちに温かい一杯を含み、調和の重なりを愉しみます。", 80, 862);

      // 9. フッター
      ctx.strokeStyle = "#E8E2D9";
      ctx.beginPath();
      ctx.moveTo(60, 915);
      ctx.lineTo(width - 60, 915);
      ctx.stroke();

      ctx.fillStyle = "#948B82";
      ctx.font = "12px sans-serif";
      ctx.fillText("Sweets & Drink Pairing Journal · Edition 2026", 60, 945);

      ctx.textAlign = "right";
      ctx.font = "italic 13px serif";
      ctx.fillText("#お菓子ペアリング手帖", width - 60, 945);
      ctx.textAlign = "left";

      // 完了：DataURLに変換
      const dataUrl = canvas.toDataURL("image/png");
      setGeneratedImageUrl(dataUrl);
      setShowImageModal(true);
    } catch (err) {
      console.error("画像生成エラー:", err);
      alert("画像の生成に失敗しました。もう一度お試しください。");
    } finally {
      setIsSharing(false);
    }
  };

  const handleShareFromModal = async () => {
    if (!generatedImageUrl || !result) return;
    try {
      const blob = await (await fetch(generatedImageUrl)).blob();
      const file = new File([blob], `pairing-${result.sweets.name}.png`, { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `お菓子ペアリング手帖 - ${result.sweets.name}`,
          text: `【お菓子ペアリング手帖】${result.sweets.name} ✕ ${result.bestMatch.drinkName}（相性: ${result.bestMatch.matchScore}%）`,
        });
      } else {
        const text = `【お菓子ペアリング手帖】\nお菓子: ${result.sweets.name}\nベストマッチ: ${result.bestMatch.drinkName}（相性: ${result.bestMatch.matchScore}%）\n「${result.bestMatch.catchphrase}」\n#お菓子ペアリング`;
        await navigator.clipboard.writeText(text);
        alert("ペアリング結果のテキストをクリップボードにコピーしました！");
      }
    } catch (err) {
      console.error("共有エラー:", err);
    }
  };

  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center p-2 sm:p-8 select-none bg-[#F0EEE9] overflow-hidden">
      {/* ヘッダー（PCのみ表示） */}
      <div className="text-center mb-4 px-2 hidden md:block">
        <span className="font-sans text-[10px] font-semibold text-charcoal-400 uppercase tracking-widest block mb-1">
          Interactive Pairing Book
        </span>
        <h1 className="font-display font-light italic text-3xl text-charcoal-900 tracking-tight">
          お菓子と飲み物の手帖
        </h1>
        <p className="font-sans text-xs text-charcoal-400 mt-1">
          手帖のボタンを押して、ページをめくりながらお楽しみください
        </p>
      </div>

      {/* 本のコンテナ */}
      <div className="relative w-full max-w-[940px] flex justify-center perspective-[2000px] overflow-visible">
        {/* 中央の背表紙シャドウ（PC見開き時のみ表示） */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 bg-gradient-to-r from-transparent via-black/[0.08] to-transparent pointer-events-none z-20 hidden md:block" />

        {/* @ts-ignore */}
        <HTMLFlipBook
          key="flipbook-stable-instance"
          ref={bookRef}
          width={bookWidth}
          height={bookHeight}
          size="fixed"
          minWidth={280}
          maxWidth={470}
          minHeight={450}
          maxHeight={680}
          maxShadowOpacity={0.4}
          showCover={false}
          mobileScrollSupport={true}
          className="shadow-[0_20px_50px_-15px_rgba(0,0,0,0.25)] rounded-2xl overflow-hidden"
          style={{}}
          startPage={0}
          drawShadow={true}
          flippingTime={600}
          usePortrait={isMobile}
          startZIndex={0}
          autoSize={true}
          clickEventForward={false}
          useMouseEvents={true}
          swipeDistance={500}
          showPageCorners={false}
          disableFlipByClick={true}
          onFlip={(e: any) => {
            const pageIndex = typeof e?.data === "number" ? e.data : undefined;
            // 診断結果が存在しないのに Page 5 (index 4) 以降へ進もうとした場合は即座に Page 4 (index 3) へ押し戻す
            if (!result && pageIndex !== undefined && pageIndex >= 4) {
              setTimeout(() => {
                try {
                  bookRef.current?.pageFlip()?.turnToPage(3);
                } catch (err) {
                  bookRef.current?.pageFlip()?.flip(3);
                }
              }, 50);
            }
          }}
        >
          {/* =========================================================
              見開き 1：【Page 1】扉絵・表紙
          ========================================================= */}
          <BookPage pageNumber={1} side="left" isCoverStyle={true}>
            <div className="h-full flex flex-col justify-between text-center py-1">
              <div className="space-y-2">
                <span className="font-sans text-[8px] sm:text-[10px] tracking-[0.25em] text-[#C4BEB5] uppercase block">
                  Flavor Pairing Journal · Vol. 1
                </span>
                <h2 className="font-display font-light italic text-xl sm:text-3xl text-[#FDFCFB] tracking-tight leading-tight">
                  お菓子と飲み物の手帖
                </h2>
                <div className="w-8 sm:w-10 h-px bg-[#8C532B] mx-auto my-2" />
                <p className="font-sans text-[10px] sm:text-xs text-[#948B82] leading-relaxed max-w-xs mx-auto">
                  日常のひとくちを、至福のひとときに変える<br />
                  感性と科学が織りなすペアリングの記録
                </p>
              </div>

              <div className="my-auto flex flex-col items-center justify-center py-3 space-y-2">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-[#8C532B]/50 flex items-center justify-center text-[#E4CFBC] shadow-inner bg-[#1A1715]/60">
                  <Bookmark className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.2]" />
                </div>
                <span className="text-[8.5px] text-[#C4BEB5] tracking-widest uppercase">
                  Edition 2026 · Sensory Archive
                </span>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-[#1F1B18] border border-[#3D3732] text-left text-[9.5px] text-[#948B82] space-y-1">
                  <span className="font-semibold text-[10px] text-[#E4CFBC] block">手帖の役割</span>
                  <p className="leading-relaxed">
                    お菓子の甘み・油脂・香りを科学的に読み解き、最も引き立て合う至極の一杯を処方します。
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlipNext();
                  }}
                  className="btn-lift w-full py-3 rounded-xl font-sans font-medium text-xs text-[#1C1917] bg-[#FAF8F4] hover:bg-white shadow-[0_4px_15px_rgba(0,0,0,0.2)] flex items-center justify-center gap-2 tracking-wider uppercase md:hidden active:scale-95 cursor-pointer"
                >
                  <span>手帖を開く</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <p className="font-sans text-[11px] text-[#C4BEB5] hidden md:block">
                  右のページでお菓子を記してください 👉
                </p>
              </div>
            </div>
          </BookPage>

          {/* =========================================================
              見開き 1：【Page 2】イントロダクション ＆ 次へ進む
          ========================================================= */}
          <BookPage pageNumber={2} side="right">
            <div className="h-full flex flex-col justify-between space-y-2.5">
              <div>
                <span className="font-sans text-[8px] sm:text-[10px] font-semibold text-charcoal-400 uppercase tracking-widest block mb-0.5">
                  Introduction & Science
                </span>
                <h3 className="font-display font-light text-lg sm:text-2xl text-charcoal-900 leading-tight">
                  ペアリングの愉しみ
                </h3>
                <p className="text-[10px] sm:text-xs text-charcoal-600 leading-relaxed font-sans mt-1">
                  甘み、苦味、酸味、そして香り。<br />
                  二つが重なり合うとき、それぞれの美味しさは何倍にも引き立ちます。
                </p>
              </div>

              {/* ペアリングの三原則 */}
              <div className="space-y-1">
                <span className="font-sans text-[8px] sm:text-[9px] font-bold text-[#8C532B] uppercase tracking-wider block">
                  ペアリングの三原則
                </span>
                <div className="p-2 sm:p-2.5 rounded-xl bg-[#F5F2EB] border border-[#E8E2D9] text-[10px] sm:text-[11px] text-charcoal-700 space-y-1">
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-[#8C532B]">Ⅰ.</span>
                    <span><strong>風味の同調</strong>：似た香りやコクを重ねて深みを倍増</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-[#8C532B]">Ⅱ.</span>
                    <span><strong>味覚の補完</strong>：苦味や酸味で甘みを引き締め、後味を整える</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-[#8C532B]">Ⅲ.</span>
                    <span><strong>余韻の調和</strong>：喉を通ったあとに広がる心地よいアロマ</span>
                  </div>
                </div>
              </div>

              {/* 味覚構造ガイド */}
              <div className="p-2 sm:p-2.5 rounded-xl bg-[#FAF5F0] border border-[#E4CFBC] text-[9.5px] sm:text-[10.5px] text-charcoal-700 space-y-1">
                <span className="font-bold uppercase tracking-wider text-[8.5px] text-[#8C532B] block">味覚のマリアージュ構造</span>
                <p className="leading-relaxed text-charcoal-600">
                  お菓子の油脂分を飲み物の温かさやタンニンが優しく包み込み、口内をリセットする科学的な心地よさを処方します。
                </p>
              </div>

              <div className="pt-0.5 flex gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlipPrev();
                  }}
                  className="btn-lift flex items-center justify-center gap-1 px-3 py-3 sm:py-3.5 rounded-xl font-sans font-medium text-xs border border-cream-300 bg-[#FAF8F4] text-charcoal-600 md:hidden active:scale-95 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  表紙へ
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlipNext();
                  }}
                  className="btn-lift flex-1 flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-xl font-sans font-medium text-xs text-cream-50 bg-[#1C1917] shadow-premium active:scale-95 cursor-pointer"
                >
                  <span>お菓子を選ぶ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </BookPage>

          {/* =========================================================
              見開き 2：【Page 3】Chapter I お菓子を選ぶ
          ========================================================= */}
          <BookPage pageNumber={3} side="left">
            <div className="h-full flex flex-col justify-between space-y-2">
              <div>
                <span className="font-sans text-[8px] sm:text-[10px] font-semibold text-charcoal-400 uppercase tracking-widest block mb-0.5">
                  Chapter I · Confectionery
                </span>
                <h2 className="font-display font-light text-base sm:text-xl text-charcoal-900 leading-tight">
                  今日のお菓子を記す
                </h2>
                <p className="font-sans text-[9px] sm:text-[11px] text-charcoal-400">
                  定番目録または自由入力から選んでください
                </p>
              </div>

              {/* 定番お菓子目録（8種全表示） */}
              <div className="space-y-1.5 flex-1 flex flex-col justify-center">
                <span className="font-sans text-[8px] sm:text-[9px] font-semibold text-charcoal-400 uppercase tracking-wider block">
                  定番の目録から選ぶ
                </span>
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                  {SWEETS_PRESETS.map((item) => {
                    const isSelected = sweetsName === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setSweetsName(isSelected ? "" : item.name)}
                        className={`p-2 rounded-xl text-left transition-all text-xs ${
                          isSelected
                            ? "bg-[#1C1917] text-[#FAF8F4] border border-[#1C1917] shadow-sm"
                            : "bg-[#FAF8F4] hover:bg-[#F5F2EB] text-[#1C1917] border border-[#E8E2D9]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] text-[#948B82] block">{item.category}</span>
                          <span className="text-[7.5px] text-[#8C532B] opacity-80">{item.texture}</span>
                        </div>
                        <p className="font-semibold text-[10.5px] sm:text-xs truncate mt-0.5">{item.name}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 手入力 */}
              <div className="space-y-1">
                <span className="font-sans text-[8px] sm:text-[9px] font-semibold text-charcoal-400 uppercase tracking-wider block">
                  または自由に入力
                </span>
                <input
                  type="text"
                  value={sweetsName}
                  onChange={(e) => setSweetsName(e.target.value)}
                  placeholder="お菓子名を入力（例: モンブラン、レモンタルト）..."
                  className="input-editorial text-[10.5px] sm:text-xs py-2 sm:py-2.5"
                />
              </div>

              {/* モバイル用操作ボタン */}
              <div className="pt-0.5 md:hidden flex gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlipPrev();
                  }}
                  className="btn-lift flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl font-sans font-medium text-xs border border-cream-300 bg-[#FAF8F4] text-charcoal-600 active:scale-95 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  戻る
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlipNext();
                  }}
                  className="btn-lift flex-1 py-2.5 rounded-xl font-sans font-medium text-xs text-cream-50 bg-[#1C1917] shadow-premium flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <span>次へ：飲み物を選ぶ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </BookPage>

          {/* =========================================================
              見開き 2：【Page 4】Chapter II 飲み物の気分を選ぶ
          ========================================================= */}
          <BookPage pageNumber={4} side="right">
            <div className="h-full flex flex-col justify-between space-y-1.5 relative">
              {/* 鑑定前はページの右端・右下をタップ/ドラッグしても勝手にめくられないようガード */}
              {!result && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="absolute top-0 bottom-0 right-0 w-8 z-30 pointer-events-auto"
                />
              )}

              <div>
                <span className="font-sans text-[8px] sm:text-[9.5px] font-semibold text-charcoal-400 uppercase tracking-widest block mb-0.5">
                  Chapter II · Beverage Direction
                </span>
                <h2 className="font-display font-light text-base sm:text-xl text-charcoal-900 leading-tight">
                  合わせたい一杯
                </h2>
                <p className="font-sans text-[9px] sm:text-[10.5px] text-charcoal-400">
                  お菓子：<span className="font-semibold text-charcoal-800">{sweetsName || "写真のお菓子"}</span>
                </p>
              </div>

              {/* 味覚の志向（コンパクト化） */}
              <div className="space-y-1">
                <span className="font-sans text-[7.5px] sm:text-[8.5px] font-bold text-[#8C532B] uppercase tracking-wider block">
                  ペアリングの志向
                </span>
                <div className="grid grid-cols-2 gap-1">
                  {TASTE_FOCUS_OPTIONS.map((item) => {
                    const isSelected = selectedFocus === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedFocus(item.id)}
                        className={`py-1 px-2 rounded-lg border text-left transition-all ${
                          isSelected
                            ? "bg-[#1C1917] text-cream-50 border-[#1C1917]"
                            : "bg-[#FAF8F4] border-[#E8E2D9] text-charcoal-700 hover:bg-[#F5F2EB]"
                        }`}
                      >
                        <span className="font-semibold text-[9.5px] sm:text-[10.5px] block leading-tight">{item.label}</span>
                        <span className="text-[7px] sm:text-[8px] opacity-75 block truncate">{item.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ジャンル一覧（2列グリッドで劇的省スペース＆見切れ解消） */}
              <div className="space-y-1">
                <span className="font-sans text-[7.5px] sm:text-[8.5px] font-bold text-[#8C532B] uppercase tracking-wider block">
                  飲み物のジャンル指定
                </span>
                <div className="space-y-1">
                  {/* おまかせ（全ジャンル） */}
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className={`selectable-row w-full py-1.5 px-2.5 ${
                      selectedCategory === "all" ? "selected" : ""
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-sans text-[10px] sm:text-[11px] font-semibold leading-tight">おまかせ（全ジャンル）</p>
                      <p className="font-sans text-[7.5px] sm:text-[8.5px] text-[#948B82] leading-tight">科学的相性が最も高い最高の一杯</p>
                    </div>
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedCategory === "all" ? "border-white bg-white text-charcoal-900" : "border-[#D3C9BD]"
                      }`}
                    >
                      {selectedCategory === "all" && <Check className="w-2 h-2 stroke-[3]" />}
                    </div>
                  </button>

                  {/* 4ジャンルの2列グリッド */}
                  <div className="grid grid-cols-2 gap-1">
                    {DRINK_GENRES.filter((g) => g.id !== "all").map((genre) => {
                      const isSelected = selectedCategory === genre.id;
                      return (
                        <button
                          key={genre.id}
                          type="button"
                          onClick={() => setSelectedCategory(genre.id)}
                          className={`p-1.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                            isSelected
                              ? "bg-[#1C1917] text-cream-50 border-[#1C1917]"
                              : "bg-[#FAF8F4] border-[#E8E2D9] text-charcoal-700 hover:bg-[#F5F2EB]"
                          }`}
                        >
                          <div className="min-w-0 pr-1">
                            <p className="font-sans text-[9.5px] sm:text-[10.5px] font-semibold truncate leading-tight">{genre.title}</p>
                            <p className="font-sans text-[7px] sm:text-[8px] opacity-75 truncate leading-tight">{genre.subtitle}</p>
                          </div>
                          <div
                            className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? "border-white bg-white text-charcoal-900" : "border-[#D3C9BD]"
                            }`}
                          >
                            {isSelected && <Check className="w-1.5 h-1.5 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 鑑定ボタン */}
              <div className="pt-1 flex gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlipPrev();
                  }}
                  className="btn-lift flex items-center justify-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-sans font-medium text-xs border border-cream-300 bg-[#FAF8F4] text-charcoal-600 active:scale-95 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  戻る
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDiagnose();
                  }}
                  disabled={isLoading}
                  className="btn-lift flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-xl font-sans font-medium text-xs text-cream-50 bg-[#1C1917] shadow-premium disabled:opacity-85 transition-all active:scale-95 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 border-2 border-cream-100/40 border-t-cream-100 rounded-full animate-spin" />
                      <span>相性を科学鑑定中...</span>
                    </div>
                  ) : (
                    <>
                      <span>鑑定結果を記してめくる</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </BookPage>

          {/* =========================================================
              見開き 3：【Page 5】Chapter III ペアリング主鑑（隙間なし）
          ========================================================= */}
          <BookPage pageNumber={5} side="left">
            {result ? (
              <div className="h-full flex flex-col justify-between space-y-2">
                <div className="space-y-2.5">
                  {/* ヘッダー */}
                  <div className="flex items-start justify-between pb-1.5 border-b border-[#E8E2D9]">
                    <div>
                      <span className="font-sans text-[8px] sm:text-[9px] font-semibold text-charcoal-400 uppercase tracking-widest block">
                        {result.sweets.category} · Analysis
                      </span>
                      <h3 className="font-display font-light italic text-base sm:text-xl text-charcoal-900 mt-0.5">
                        {result.sweets.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="font-sans text-[7.5px] sm:text-[8.5px] text-charcoal-400 uppercase block">相性スコア</span>
                      <div className="flex items-baseline justify-end gap-0.5">
                        <span className="font-display font-bold text-2xl sm:text-3xl text-[#8C532B]">
                          {result.bestMatch.matchScore}
                        </span>
                        <span className="font-sans text-[10px] sm:text-xs font-semibold text-[#8C532B]">%</span>
                      </div>
                    </div>
                  </div>

                  {/* ベストマッチカード */}
                  <div className="p-3 rounded-xl bg-[#FAF5F0] border border-[#E4CFBC] space-y-1">
                    <span className="font-sans text-[7.5px] sm:text-[8.5px] font-bold text-[#8C532B] uppercase tracking-wider block">
                      Best Match · {result.bestMatch.categoryLabel}
                    </span>
                    <h4 className="font-display font-semibold text-sm sm:text-lg text-charcoal-900 leading-tight">
                      {result.bestMatch.drinkName}
                    </h4>
                    <p className="font-sans text-[10px] sm:text-xs text-charcoal-600 leading-relaxed pt-0.5">
                      「{result.bestMatch.catchphrase}」
                    </p>
                  </div>

                  {/* 風味と味覚の分析 */}
                  <div className="p-2.5 rounded-xl bg-[#F5F2EB] text-xs space-y-1.5 border border-[#E8E2D9]">
                    <div>
                      <span className="font-semibold text-charcoal-800 block text-[8px] sm:text-[9.5px] mb-0.5">【香りと風味の同調】</span>
                      <p className="text-charcoal-600 text-[9px] sm:text-[10.5px] leading-relaxed">
                        {result.bestMatch.flavorSynergy.harmonyReason}
                      </p>
                    </div>
                    <div className="pt-1.5 border-t border-[#E8E2D9]">
                      <span className="font-semibold text-charcoal-800 block text-[8px] sm:text-[9.5px] mb-0.5">【味覚の相乗効果（科学的根拠）】</span>
                      <p className="text-charcoal-600 text-[9px] sm:text-[10.5px] leading-relaxed">
                        {result.bestMatch.flavorSynergy.scienceNotes}
                      </p>
                    </div>
                  </div>

                  {/* 味覚の調和度バランス */}
                  <div className="p-2 rounded-xl bg-[#FAF8F4] border border-[#E8E2D9] space-y-1 text-[8.5px] sm:text-[9.5px]">
                    <span className="font-semibold text-charcoal-700 uppercase tracking-wider block text-[7.5px]">味覚のマリアージュ指標</span>
                    <div className="grid grid-cols-3 gap-1 text-center">
                      <div className="p-1 rounded bg-[#F5F2EB]">
                        <span className="text-[#948B82] block text-[7.5px]">甘味の調和</span>
                        <span className="font-bold text-charcoal-800">極上</span>
                      </div>
                      <div className="p-1 rounded bg-[#F5F2EB]">
                        <span className="text-[#948B82] block text-[7.5px]">油脂のリセット</span>
                        <span className="font-bold text-charcoal-800">最適</span>
                      </div>
                      <div className="p-1 rounded bg-[#F5F2EB]">
                        <span className="text-[#948B82] block text-[7.5px]">香りの重層</span>
                        <span className="font-bold text-[#8C532B]">同調</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* モバイル用次へボタン */}
                <div className="pt-1 md:hidden flex gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFlipPrev();
                    }}
                    className="btn-lift flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl font-sans font-medium text-xs border border-cream-300 bg-[#FAF8F4] text-charcoal-600 active:scale-95 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    戻る
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFlipNext();
                    }}
                    className="btn-lift flex-1 py-2.5 rounded-xl font-sans font-medium text-xs text-cream-50 bg-[#1C1917] shadow-premium flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <span>次へ：嗜み方と保存</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                <Coffee className="w-7 h-7 text-charcoal-300 mx-auto" />
                <p className="font-display italic text-xs text-charcoal-500">
                  前のページでお菓子と飲み物を選び、鑑定ボタンを押すと記されます
                </p>
              </div>
            )}
          </BookPage>

          {/* =========================================================
              見開き 3：【Page 6】Chapter IV 嗜み方 ＆ 他の候補 ＆ アクション（隙間なし）
          ========================================================= */}
          <BookPage pageNumber={6} side="right">
            {result ? (
              <div className="h-full flex flex-col justify-between space-y-2">
                <div className="space-y-2">
                  <div>
                    <span className="font-sans text-[8px] sm:text-[10px] font-semibold text-charcoal-400 uppercase tracking-widest block mb-0.5">
                      Chapter IV · Serving & Alternatives
                    </span>
                    <h3 className="font-display font-light text-base sm:text-lg text-charcoal-900">
                      嗜み方と他の候補
                    </h3>
                  </div>

                  {/* 4グリッド サービングガイド */}
                  <div className="grid grid-cols-2 gap-1 sm:gap-1.5 text-xs">
                    <div className="p-2 rounded-xl bg-[#FAF8F4] border border-[#E8E2D9]">
                      <span className="text-[7.5px] sm:text-[8.5px] text-[#948B82] block">おすすめ温度</span>
                      <span className="font-medium text-charcoal-800 text-[9.5px] sm:text-[10.5px]">{result.bestMatch.servingGuide.temperature}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FAF8F4] border border-[#E8E2D9]">
                      <span className="text-[7.5px] sm:text-[8.5px] text-[#948B82] block">淹れ方・濃さ</span>
                      <span className="font-medium text-charcoal-800 text-[9.5px] sm:text-[10.5px]">{result.bestMatch.servingGuide.strengthOrBrew}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FAF8F4] border border-[#E8E2D9]">
                      <span className="text-[7.5px] sm:text-[8.5px] text-[#948B82] block">器・グラス</span>
                      <span className="font-medium text-charcoal-800 text-[9.5px] sm:text-[10.5px]">{result.bestMatch.servingGuide.recommendedVessel}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FAF8F4] border border-[#E8E2D9]">
                      <span className="text-[7.5px] sm:text-[8.5px] text-[#948B82] block">プロの一言</span>
                      <span className="font-medium text-charcoal-800 text-[9.5px] sm:text-[10.5px] line-clamp-1">{result.bestMatch.servingGuide.specialTip}</span>
                    </div>
                  </div>

                  {/* テイスティング手順（Tasting Ritual） */}
                  <div className="p-2.5 rounded-xl bg-[#F5F2EB] border border-[#E8E2D9] text-[9px] sm:text-[10px] text-charcoal-700 space-y-1">
                    <span className="font-bold text-[#8C532B] block text-[8px] uppercase tracking-wider">ペアリングの作法</span>
                    <div className="space-y-0.5 text-charcoal-600">
                      <p><strong>1.</strong> 先にお菓子を一口味わい、口いっぱいに甘みと香りを広げます。</p>
                      <p><strong>2.</strong> 余韻が残るうちに温かい一杯を含み、調和の重なりを愉しみます。</p>
                    </div>
                  </div>

                  {/* 他の組み合わせ */}
                  {result.alternativePairings && result.alternativePairings.length > 0 && (
                    <div className="space-y-1">
                      <span className="font-sans text-[7.5px] sm:text-[8.5px] font-semibold text-charcoal-400 uppercase tracking-wider block">
                        他の候補・別の表情
                      </span>
                      <div className="space-y-1">
                        {result.alternativePairings.slice(0, 2).map((alt, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-1.5 rounded-xl bg-[#FAF8F4] border border-[#E8E2D9] text-xs"
                          >
                            <div className="flex items-center gap-1">
                              <span className="text-[7.5px] sm:text-[8px] px-1 py-0.5 rounded bg-[#F5F2EB] text-[#736B63]">
                                {alt.categoryLabel}
                              </span>
                              <span className="font-medium text-charcoal-800 text-[9px] sm:text-[10.5px]">{alt.drinkName}</span>
                            </div>
                            <span className="font-display font-bold text-[#8C532B] text-xs">{alt.matchScore}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 下部アクションボタン */}
                <div className="flex gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenImageSaveModal();
                    }}
                    disabled={isSharing}
                    className="btn-lift flex-1 flex items-center justify-center gap-1 py-2.5 sm:py-3 rounded-xl border border-cream-300 bg-[#FAF8F4] text-[11px] sm:text-xs font-medium text-charcoal-800 shadow-premium disabled:opacity-75 active:scale-95 cursor-pointer"
                  >
                    {isSharing ? (
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 border-2 border-charcoal-400 border-t-charcoal-900 rounded-full animate-spin" />
                        <span>生成中...</span>
                      </div>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 text-[#8C532B]" />
                        <span>手帖画像を保存</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResetToFirst();
                    }}
                    className="btn-lift flex items-center justify-center gap-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#1C1917] text-cream-50 text-[11px] sm:text-xs font-medium shadow-premium active:scale-95 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>最初へ</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <p className="font-display italic text-xs text-charcoal-400">鑑定結果が記されるのをお待ちください</p>
              </div>
            )}
          </BookPage>
        </HTMLFlipBook>
      </div>

      {/* =========================================================
          スマホ・PC完全対応：画像保存＆共有モーダル
      ========================================================= */}
      {showImageModal && generatedImageUrl && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F4] text-[#1C1917] rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-[#E8E2D9] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-2">
              <span className="font-display italic font-semibold text-sm text-[#1C1917]">
                お菓子ペアリング手帖カード
              </span>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-charcoal-100 text-charcoal-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 生成された画像 */}
            <div className="rounded-xl overflow-hidden border border-[#E8E2D9] shadow-md bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={generatedImageUrl} alt="手帖カード" className="w-full h-auto object-contain max-h-[50vh]" />
            </div>

            <p className="text-[11px] text-center text-charcoal-500 font-sans">
              📱 <strong className="text-charcoal-800">画像を長押し</strong>して「写真に追加」で端末に保存できます
            </p>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleShareFromModal}
                className="btn-lift flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#1C1917] text-cream-50 text-xs font-medium shadow-premium"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>SNSで共有</span>
              </button>

              <a
                href={generatedImageUrl}
                download={`お菓子ペアリング手帖_${result?.sweets.name || "結果"}.png`}
                className="btn-lift flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-cream-300 bg-[#FAF8F4] text-xs font-medium text-charcoal-800"
              >
                <Download className="w-3.5 h-3.5" />
                <span>保存</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
