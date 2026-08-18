"use client";

import React, { useRef, useState, useEffect, forwardRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { Camera, X, ArrowRight, ArrowLeft, RotateCcw, Share2, Check, Bookmark, BookOpen, Coffee, Download, Sparkles } from "lucide-react";
import { DrinkCategory, PairingResult } from "@/types/pairing";
import { getPairingDiagnosis } from "@/lib/pairingService";
import { toPng } from "html-to-image";

const SWEETS_PRESETS = [
  { name: "カヌレ", category: "焼き菓子", note: "焦がしカラメルとラム酒" },
  { name: "ビターチョコレート", category: "ショコラ", note: "カカオ70%のほろ苦さ" },
  { name: "バスクチーズケーキ", category: "ケーキ", note: "焦げ目と濃厚クリーム" },
  { name: "苺のショートケーキ", category: "生ケーキ", note: "生クリームといちご" },
  { name: "ポテトチップス", category: "スナック", note: "カリッとした塩気と油脂" },
  { name: "練り羊羹", category: "和菓子", note: "小豆の上品な甘み" },
  { name: "シュークリーム", category: "洋菓子", note: "濃厚カスタード" },
  { name: "ピスタチオのマカロン", category: "洋菓子", note: "香ばしいナッツ風味" },
];

const DRINK_GENRES: { id: DrinkCategory; title: string; subtitle: string }[] = [
  { id: "all", title: "おまかせ", subtitle: "全ジャンルから最高の一杯" },
  { id: "coffee", title: "珈琲（コーヒー）", subtitle: "ドリップ・エスプレッソ" },
  { id: "tea", title: "紅茶・ハーブティー", subtitle: "ストレート・ミルク" },
  { id: "green_tea", title: "日本茶・中国茶", subtitle: "煎茶・ほうじ茶・烏龍茶" },
  { id: "alcohol", title: "お酒（ワイン・洋酒等）", subtitle: "ワイン・ウイスキー・ビール" },
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
  }
>(({ children, className = "", pageNumber, side = "left", isCoverStyle = false }, ref) => {
  const isLeft = side === "left";
  return (
    <div
      ref={ref}
      className={`w-full h-full p-5 sm:p-8 flex flex-col justify-between select-none relative overflow-y-auto ${
        isCoverStyle ? "text-[#FAF8F4]" : "bg-[#FAF8F4] text-[#1C1917]"
      } ${className}`}
      style={
        isCoverStyle
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
            }
      }
    >
      <div className="flex-1">{children}</div>
      {pageNumber && (
        <div
          className={`pt-3 sm:pt-4 mt-auto border-t flex items-center justify-between text-[10px] sm:text-[11px] font-sans ${
            isCoverStyle ? "border-[#8C532B]/30 text-[#948B82]" : "border-[#E8E2D9]/70 text-[#948B82]"
          }`}
        >
          <span className="tracking-widest uppercase text-[8px] sm:text-[9px]">Sweets & Drink Pairing</span>
          <span className="font-display italic font-medium">{pageNumber}</span>
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({ width: 1024, height: 768 });
  const [sweetsName, setSweetsName] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<DrinkCategory>("all");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PairingResult | null>(null);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [sharedSuccess, setSharedSuccess] = useState<boolean>(false);

  // 画面サイズの動的取得
  useEffect(() => {
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const isMobile = windowSize.width < 768;
  const bookWidth = isMobile ? Math.min(windowSize.width - 24, 380) : 450;
  const bookHeight = isMobile ? Math.min(windowSize.height - 140, 580) : 620;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        if (!sweetsName) setSweetsName("写真のお菓子");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFlipNext = () => {
    bookRef.current?.pageFlip()?.flipNext();
  };

  const handleFlipPrev = () => {
    bookRef.current?.pageFlip()?.flipPrev();
  };

  const handleDiagnose = async () => {
    if (!sweetsName && !image) {
      alert("お菓子を選択するか、写真または名前を入力してください。");
      return;
    }
    setIsLoading(true);
    try {
      const res = await getPairingDiagnosis(
        { name: sweetsName || "お菓子", image },
        selectedCategory
      );
      setResult(res);
      setIsLoading(false);

      setTimeout(() => {
        bookRef.current?.pageFlip()?.flipNext();
      }, 200);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      alert("診断中にエラーが発生しました。");
    }
  };

  const handleResetToFirst = () => {
    setResult(null);
    setImage(null);
    setSweetsName("");
    setSelectedCategory("all");
    if (onResetToCover) {
      onResetToCover();
    } else {
      bookRef.current?.pageFlip()?.turnToPage(0);
    }
  };

  const handleDownloadImage = async () => {
    if (!result || !shareCardRef.current || isSharing) return;

    setIsSharing(true);
    try {
      const dataUrl = await toPng(shareCardRef.current, {
        cacheBust: true,
        quality: 1.0,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `お菓子ペアリング手帖_${result.sweets.name}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSharedSuccess(true);
      setTimeout(() => setSharedSuccess(false), 2500);
    } catch (err) {
      console.error("画像ダウンロードエラー:", err);
      alert("画像のダウンロードに失敗しました。もう一度お試しください。");
    } finally {
      setIsSharing(false);
    }
  };

  const handleShareNative = async () => {
    if (!result || !shareCardRef.current || isSharing) return;

    setIsSharing(true);
    try {
      const dataUrl = await toPng(shareCardRef.current, {
        cacheBust: true,
        quality: 1.0,
        pixelRatio: 2,
      });

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `pairing-note-${result.sweets.name}.png`, { type: "image/png" });

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
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-2 sm:p-8 select-none bg-[#F0EEE9] overflow-x-hidden">
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />

      {/* ヘッダー */}
      <div className="text-center mb-3 sm:mb-6 px-2">
        <span className="font-sans text-[9px] sm:text-[10px] font-semibold text-charcoal-400 uppercase tracking-widest block mb-0.5 sm:mb-1">
          Interactive Pairing Book
        </span>
        <h1 className="font-display font-light italic text-xl sm:text-3xl text-charcoal-900 tracking-tight">
          お菓子と飲み物の手帖
        </h1>
        <p className="font-sans text-[11px] sm:text-xs text-charcoal-400 mt-0.5 sm:mt-1">
          {isMobile ? "ページをスワイプまたはタップしてめくってください" : "ページの端をドラッグして、ペラペラとめくりながらお楽しみください"}
        </p>
      </div>

      {/* 本のコンテナ */}
      <div className="relative w-full max-w-[940px] flex justify-center perspective-[2000px] overflow-visible">
        {/* 中央の背表紙シャドウ（PC見開き時のみ表示） */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-6 bg-gradient-to-r from-transparent via-black/[0.08] to-transparent pointer-events-none z-20 hidden md:block" />

        {/* @ts-ignore */}
        <HTMLFlipBook
          key={isMobile ? "mobile-book" : "desktop-book"}
          ref={bookRef}
          width={bookWidth}
          height={bookHeight}
          size="stretch"
          minWidth={300}
          maxWidth={470}
          minHeight={460}
          maxHeight={640}
          maxShadowOpacity={0.4}
          showCover={false}
          mobileScrollSupport={true}
          className="shadow-[0_20px_50px_-15px_rgba(0,0,0,0.2)] rounded-2xl overflow-hidden"
          style={{}}
          startPage={0}
          drawShadow={true}
          flippingTime={700}
          usePortrait={isMobile}
          startZIndex={0}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={25}
          showPageCorners={true}
          disableFlipByClick={true}
        >
          {/* =========================================================
              見開き 1：【Page 1】扉絵・表紙
          ========================================================= */}
          <BookPage pageNumber={1} side="left" isCoverStyle={true}>
            <div className="space-y-4 sm:space-y-6 pt-2 sm:pt-4 text-center">
              <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.25em] text-[#C4BEB5] uppercase block">
                Grind & Confectionery
              </span>
              <h2 className="font-display font-light italic text-2xl sm:text-3xl text-[#FDFCFB] tracking-tight leading-tight">
                お菓子と飲み物の手帖
              </h2>
              <div className="w-8 sm:w-10 h-px bg-[#8C532B] mx-auto" />
              <p className="font-sans text-[11px] sm:text-xs text-[#948B82] leading-relaxed max-w-xs mx-auto">
                日常のひとくちを、至福のひとときに変える<br />
                フレーバーペアリングの記録
              </p>
            </div>

            <div className="my-auto flex justify-center py-4 sm:py-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-[#8C532B]/50 flex items-center justify-center text-[#E4CFBC] shadow-inner">
                <Bookmark className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.2]" />
              </div>
            </div>

            <div className="text-center pb-1 sm:pb-2">
              <button
                type="button"
                onClick={handleFlipNext}
                className="btn-lift w-full py-3 rounded-xl font-sans font-medium text-xs text-[#1C1917] bg-[#FAF8F4] hover:bg-white shadow-[0_4px_15px_rgba(0,0,0,0.2)] flex items-center justify-center gap-2 tracking-wider uppercase md:hidden"
              >
                <span>手帖を開く</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <p className="font-sans text-[11px] text-[#C4BEB5] hidden md:block">
                右のページでお菓子を記してください 👉
              </p>
            </div>
          </BookPage>

          {/* =========================================================
              見開き 1：【Page 2】イントロダクション ＆ 次へ進む
          ========================================================= */}
          <BookPage pageNumber={2} side="right">
            <div className="space-y-3 sm:space-y-5 pt-1 sm:pt-2">
              <div>
                <span className="font-sans text-[9px] sm:text-[10px] font-semibold text-charcoal-400 uppercase tracking-widest block mb-0.5 sm:mb-1">
                  Introduction
                </span>
                <h3 className="font-display font-light text-xl sm:text-2xl text-charcoal-900 leading-tight">
                  ペアリングの愉しみ
                </h3>
              </div>

              <div className="space-y-2 sm:space-y-3 text-[11px] sm:text-xs text-charcoal-600 leading-relaxed font-sans">
                <p>
                  甘み、苦味、酸味、そして香り。<br />
                  お菓子と飲み物が重なり合うとき、それぞれの美味しさは何倍にも引き立ちます。
                </p>
                <p className="text-charcoal-500">
                  本手帖では、お菓子の風味の骨格を科学的に読み解き、最高に調和する一杯を鑑定・処方いたします。
                </p>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-[#F5F2EB] border border-[#E8E2D9] space-y-1">
                <span className="font-sans text-[9px] sm:text-[10px] font-bold text-[#8C532B] uppercase tracking-wider block">
                  手帖のめくり方
                </span>
                <ul className="text-[10px] sm:text-[11px] text-charcoal-700 space-y-0.5 sm:space-y-1">
                  <li>• スワイプまたは下のボタンでページが進みます</li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFlipNext}
                  className="btn-lift w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-xl font-sans font-medium text-xs text-cream-50 bg-[#1C1917] shadow-premium"
                >
                  <span>手帖を開いてお菓子を選ぶ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </BookPage>

          {/* =========================================================
              見開き 2：【Page 3】Chapter I お菓子を選ぶ
          ========================================================= */}
          <BookPage pageNumber={3} side="left">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <span className="font-sans text-[9px] sm:text-[10px] font-semibold text-charcoal-400 uppercase tracking-widest block mb-0.5 sm:mb-1">
                  Chapter I
                </span>
                <h2 className="font-display font-light text-lg sm:text-xl text-charcoal-900 leading-tight">
                  今日のお菓子を記す
                </h2>
                <p className="font-sans text-[10px] sm:text-[11px] text-charcoal-400">
                  写真を貼るか、目録から選んでください
                </p>
              </div>

              {/* 写真ゾーン */}
              {image ? (
                <div className="relative rounded-xl overflow-hidden p-2 flex items-center justify-center bg-[#F5F2EB] border border-[#E8E2D9]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="プレビュー" className="max-h-20 sm:max-h-28 w-auto rounded-lg object-contain" />
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-charcoal-900/80 text-cream-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl p-2.5 sm:p-3 flex flex-col items-center justify-center gap-1 cursor-pointer border border-dashed border-[#D3C9BD] hover:border-[#948B82] bg-[#FAF8F4] hover:bg-[#F5F2EB] transition-all"
                >
                  <Camera className="w-4 h-4 text-charcoal-400" />
                  <p className="font-sans text-[10px] sm:text-[11px] font-medium text-charcoal-800">お菓子の写真を貼る</p>
                </div>
              )}

              {/* 定番お菓子 */}
              <div className="space-y-1">
                <span className="font-sans text-[8px] sm:text-[9px] font-semibold text-charcoal-400 uppercase tracking-wider block">
                  定番の目録
                </span>
                <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
                  {SWEETS_PRESETS.slice(0, 6).map((item) => {
                    const isSelected = sweetsName === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setSweetsName(isSelected ? "" : item.name)}
                        className={`p-1.5 sm:p-2 rounded-xl text-left transition-all text-xs ${
                          isSelected
                            ? "bg-[#1C1917] text-[#FAF8F4] border border-[#1C1917]"
                            : "bg-[#FAF8F4] hover:bg-[#F5F2EB] text-[#1C1917] border border-[#E8E2D9]"
                        }`}
                      >
                        <span className="text-[8px] text-[#948B82] block">{item.category}</span>
                        <p className="font-semibold text-[10px] sm:text-[11px] truncate">{item.name}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 手入力 */}
              <div>
                <input
                  type="text"
                  value={sweetsName}
                  onChange={(e) => setSweetsName(e.target.value)}
                  placeholder="または自由にお菓子名を入力..."
                  className="input-editorial text-xs py-2"
                />
              </div>

              {/* モバイル用次へボタン */}
              <div className="pt-1 md:hidden">
                <button
                  type="button"
                  onClick={handleFlipNext}
                  className="btn-lift w-full py-2.5 rounded-xl font-sans font-medium text-xs text-cream-50 bg-[#1C1917] shadow-premium flex items-center justify-center gap-1.5"
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
            <div className="space-y-3 sm:space-y-4">
              <div>
                <span className="font-sans text-[9px] sm:text-[10px] font-semibold text-charcoal-400 uppercase tracking-widest block mb-0.5 sm:mb-1">
                  Chapter II
                </span>
                <h2 className="font-display font-light text-lg sm:text-xl text-charcoal-900 leading-tight">
                  合わせたい一杯
                </h2>
                <p className="font-sans text-[10px] sm:text-[11px] text-charcoal-400">
                  お菓子：<span className="font-semibold text-charcoal-800">{sweetsName || "写真のお菓子"}</span>
                </p>
              </div>

              {/* ジャンル一覧 */}
              <div className="space-y-1.5 sm:space-y-2">
                {DRINK_GENRES.map((genre) => {
                  const isSelected = selectedCategory === genre.id;
                  return (
                    <button
                      key={genre.id}
                      type="button"
                      onClick={() => setSelectedCategory(genre.id)}
                      className={`selectable-row w-full py-2 sm:py-2.5 px-3 ${
                        isSelected ? "selected" : ""
                      }`}
                    >
                      <div className="text-left">
                        <p className="font-sans text-[11px] sm:text-xs font-semibold">{genre.title}</p>
                        <p className="font-sans text-[9px] sm:text-[10px] text-[#948B82]">{genre.subtitle}</p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? "border-white bg-white text-charcoal-900" : "border-[#D3C9BD]"
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* 鑑定ボタン */}
              <div className="pt-1 sm:pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleFlipPrev}
                  className="btn-lift flex items-center justify-center gap-1 px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl font-sans font-medium text-xs border border-cream-300 bg-[#FAF8F4] text-charcoal-600"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  戻る
                </button>

                <button
                  type="button"
                  onClick={handleDiagnose}
                  disabled={isLoading}
                  className="btn-lift flex-1 flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-xl font-sans font-medium text-xs text-cream-50 bg-[#1C1917] shadow-premium disabled:opacity-85 transition-all"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 border-2 border-cream-100/40 border-t-cream-100 rounded-full animate-spin" />
                      <span>鑑定中...</span>
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
              見開き 3：【Page 5】Chapter III ペアリング主鑑
          ========================================================= */}
          <BookPage pageNumber={5} side="left">
            {result ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start justify-between pb-2 sm:pb-3 border-b border-[#E8E2D9]">
                  <div>
                    <span className="font-sans text-[8px] sm:text-[9px] font-semibold text-charcoal-400 uppercase tracking-widest block">
                      {result.sweets.category}
                    </span>
                    <h3 className="font-display font-light italic text-lg sm:text-xl text-charcoal-900 mt-0.5">
                      {result.sweets.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="font-sans text-[8px] sm:text-[9px] text-charcoal-400 uppercase block">相性スコア</span>
                    <div className="flex items-baseline justify-end gap-0.5">
                      <span className="font-display font-bold text-2xl sm:text-3xl text-[#8C532B]">
                        {result.bestMatch.matchScore}
                      </span>
                      <span className="font-sans text-[10px] sm:text-xs font-semibold text-[#8C532B]">%</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 sm:p-4 rounded-xl bg-[#FAF5F0] border border-[#E4CFBC] space-y-0.5 sm:space-y-1">
                  <span className="font-sans text-[8px] sm:text-[9px] font-bold text-[#8C532B] uppercase tracking-wider block">
                    Best Match · {result.bestMatch.categoryLabel}
                  </span>
                  <h4 className="font-display font-semibold text-base sm:text-xl text-charcoal-900">
                    {result.bestMatch.drinkName}
                  </h4>
                  <p className="font-sans text-[11px] sm:text-xs text-charcoal-600 leading-relaxed pt-0.5">
                    「{result.bestMatch.catchphrase}」
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#F5F2EB] text-xs space-y-2 border border-[#E8E2D9]">
                  <div>
                    <span className="font-semibold text-charcoal-800 block text-[9px] sm:text-[10px] mb-0.5">【香りと風味の同調】</span>
                    <p className="text-charcoal-600 text-[10px] sm:text-[11px] leading-relaxed">
                      {result.bestMatch.flavorSynergy.harmonyReason}
                    </p>
                  </div>
                  <div className="pt-1.5 border-t border-[#E8E2D9]">
                    <span className="font-semibold text-charcoal-800 block text-[9px] sm:text-[10px] mb-0.5">【味覚の相乗効果】</span>
                    <p className="text-charcoal-600 text-[10px] sm:text-[11px] leading-relaxed">
                      {result.bestMatch.flavorSynergy.scienceNotes}
                    </p>
                  </div>
                </div>

                {/* モバイル用次へボタン */}
                <div className="pt-1 md:hidden">
                  <button
                    type="button"
                    onClick={handleFlipNext}
                    className="btn-lift w-full py-2.5 rounded-xl font-sans font-medium text-xs text-cream-50 bg-[#1C1917] shadow-premium flex items-center justify-center gap-1.5"
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
              見開き 3：【Page 6】Chapter IV 嗜み方 ＆ 他の候補 ＆ アクション
          ========================================================= */}
          <BookPage pageNumber={6} side="right">
            {result ? (
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <span className="font-sans text-[9px] sm:text-[10px] font-semibold text-charcoal-400 uppercase tracking-widest block mb-0.5 sm:mb-1">
                    Serving & Alternatives
                  </span>
                  <h3 className="font-display font-light text-base sm:text-lg text-charcoal-900">
                    嗜み方と他の候補
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-[#FAF8F4] border border-[#E8E2D9]">
                    <span className="text-[8px] sm:text-[9px] text-[#948B82] block">おすすめ温度</span>
                    <span className="font-medium text-charcoal-800 text-[10px] sm:text-[11px]">{result.bestMatch.servingGuide.temperature}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#FAF8F4] border border-[#E8E2D9]">
                    <span className="text-[8px] sm:text-[9px] text-[#948B82] block">淹れ方・濃さ</span>
                    <span className="font-medium text-charcoal-800 text-[10px] sm:text-[11px]">{result.bestMatch.servingGuide.strengthOrBrew}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#FAF8F4] border border-[#E8E2D9]">
                    <span className="text-[8px] sm:text-[9px] text-[#948B82] block">器</span>
                    <span className="font-medium text-charcoal-800 text-[10px] sm:text-[11px]">{result.bestMatch.servingGuide.recommendedVessel}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#FAF8F4] border border-[#E8E2D9]">
                    <span className="text-[8px] sm:text-[9px] text-[#948B82] block">ワンポイント</span>
                    <span className="font-medium text-charcoal-800 text-[10px] sm:text-[11px] line-clamp-1">{result.bestMatch.servingGuide.specialTip}</span>
                  </div>
                </div>

                {result.alternativePairings && result.alternativePairings.length > 0 && (
                  <div className="space-y-1">
                    <span className="font-sans text-[8px] sm:text-[9px] font-semibold text-charcoal-400 uppercase tracking-wider block">
                      他の組み合わせ
                    </span>
                    <div className="space-y-1">
                      {result.alternativePairings.slice(0, 2).map((alt, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-1.5 sm:p-2 rounded-xl bg-[#FAF8F4] border border-[#E8E2D9] text-xs"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-[8px] px-1 py-0.5 rounded bg-[#F5F2EB] text-[#736B63]">
                              {alt.categoryLabel}
                            </span>
                            <span className="font-medium text-charcoal-800 text-[10px] sm:text-[11px]">{alt.drinkName}</span>
                          </div>
                          <span className="font-display font-bold text-[#8C532B] text-xs">{alt.matchScore}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-1.5 sm:gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleDownloadImage}
                    disabled={isSharing}
                    className="btn-lift flex-1 flex items-center justify-center gap-1 py-2.5 sm:py-3 rounded-xl border border-cream-300 bg-[#FAF8F4] text-[11px] sm:text-xs font-medium text-charcoal-800 shadow-premium disabled:opacity-75"
                  >
                    {isSharing ? (
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 border-2 border-charcoal-400 border-t-charcoal-900 rounded-full animate-spin" />
                        <span>生成中...</span>
                      </div>
                    ) : sharedSuccess ? (
                      <div className="flex items-center gap-1 text-emerald-700">
                        <Check className="w-3 h-3" />
                        <span>保存完了</span>
                      </div>
                    ) : (
                      <>
                        <Download className="w-3 h-3 text-[#8C532B]" />
                        <span>画像保存</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleShareNative}
                    disabled={isSharing}
                    className="btn-lift flex items-center justify-center gap-1 px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-xl border border-cream-300 bg-[#FAF8F4] text-[11px] sm:text-xs font-medium text-charcoal-700 shadow-premium"
                    title="SNSで共有"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>共有</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetToFirst}
                    className="btn-lift flex items-center justify-center gap-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#1C1917] text-cream-50 text-[11px] sm:text-xs font-medium shadow-premium"
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
          画像書き出し用の高解像度手帖カード（不可視レイヤー）
      ========================================================= */}
      {result && (
        <div className="fixed left-0 top-0 opacity-0 pointer-events-none -z-50">
          <div
            ref={shareCardRef}
            className="w-[520px] bg-[#FAF8F4] text-[#1C1917] p-9 rounded-2xl relative overflow-hidden flex flex-col justify-between"
            style={{
              border: "2px solid #E8E2D9",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            }}
          >
            <div className="absolute inset-3 border border-[#8C532B]/30 rounded-xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D9] relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#1C1917] flex items-center justify-center text-[#FAF8F4]">
                  <Bookmark className="w-3.5 h-3.5 stroke-[1.5]" />
                </div>
                <div>
                  <span className="font-sans text-[9px] font-semibold text-[#8C532B] uppercase tracking-widest block">
                    Pairing Journal
                  </span>
                  <h3 className="font-display italic text-base text-[#1C1917] leading-none">
                    お菓子と飲み物の手帖
                  </h3>
                </div>
              </div>
              <span className="font-sans text-[10px] text-[#948B82]">
                {new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            </div>

            <div className="py-5 space-y-4 relative z-10">
              <div className="flex items-end justify-between">
                <div>
                  <span className="font-sans text-[10px] font-semibold text-charcoal-400 uppercase tracking-widest block">
                    {result.sweets.category}
                  </span>
                  <h2 className="font-display font-light italic text-2xl text-charcoal-900">
                    {result.sweets.name}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="font-sans text-[9px] text-charcoal-400 uppercase block">相性スコア</span>
                  <div className="flex items-baseline justify-end gap-0.5">
                    <span className="font-display font-bold text-3xl text-[#8C532B]">
                      {result.bestMatch.matchScore}
                    </span>
                    <span className="font-sans text-xs font-semibold text-[#8C532B]">%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF5F0] border border-[#E4CFBC] space-y-1">
                <span className="font-sans text-[9px] font-bold text-[#8C532B] uppercase tracking-wider block">
                  Best Match · {result.bestMatch.categoryLabel}
                </span>
                <h4 className="font-display font-semibold text-xl text-charcoal-900">
                  {result.bestMatch.drinkName}
                </h4>
                <p className="font-sans text-xs text-charcoal-600 leading-relaxed pt-0.5">
                  「{result.bestMatch.catchphrase}」
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F5F2EB] text-xs space-y-2 border border-[#E8E2D9]">
                <div>
                  <span className="font-semibold text-charcoal-800 block text-[10px] mb-0.5">【香りと風味の同調】</span>
                  <p className="text-charcoal-600 text-[11px] leading-relaxed">
                    {result.bestMatch.flavorSynergy.harmonyReason}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#E8E2D9]">
                  <span className="font-semibold text-charcoal-800 block text-[10px] mb-0.5">【味覚の相乗効果】</span>
                  <p className="text-charcoal-600 text-[11px] leading-relaxed">
                    {result.bestMatch.flavorSynergy.scienceNotes}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-[#FAF8F4] border border-[#E8E2D9]">
                  <span className="text-[9px] text-[#948B82] block">おすすめ温度</span>
                  <span className="font-medium text-charcoal-800 text-[11px]">{result.bestMatch.servingGuide.temperature}</span>
                </div>
                <div className="p-2 rounded-lg bg-[#FAF8F4] border border-[#E8E2D9]">
                  <span className="text-[9px] text-[#948B82] block">淹れ方・濃さ</span>
                  <span className="font-medium text-charcoal-800 text-[11px]">{result.bestMatch.servingGuide.strengthOrBrew}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8E2D9] flex items-center justify-between text-[10px] text-[#948B82] relative z-10">
              <span className="tracking-widest uppercase text-[9px]">Sweets & Drink Pairing Journal</span>
              <span className="font-serif italic">#お菓子ペアリング</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
