"use client";

import React, { useState, useRef } from "react";
import { Camera, X, ArrowRight, ArrowLeft, RotateCcw, Share2, Check, Bookmark, BookOpen, Coffee, Sparkles } from "lucide-react";
import { DrinkCategory, PairingResult } from "@/types/pairing";
import { getPairingDiagnosis } from "@/lib/pairingService";

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

export default function BookJournalApp() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 見開きスプレッドのインデックス: 0 (扉絵) | 1 (入力) | 2 (結果)
  const [spreadIndex, setSpreadIndex] = useState<0 | 1 | 2>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const [sweetsName, setSweetsName] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<DrinkCategory>("all");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PairingResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

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

  // スプレッド切り替え（スムーズなページめくりトランジション）
  const goToSpread = (nextIndex: 0 | 1 | 2) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSpreadIndex(nextIndex);
      setIsTransitioning(false);
    }, 280);
  };

  // 1. 扉絵から入力見開きへ
  const handleOpenBook = () => {
    goToSpread(1);
  };

  // 2. 鑑定して結果見開きへ
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
      goToSpread(2);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      alert("診断中にエラーが発生しました。");
    }
  };

  // 3. 最初（扉絵）へリセット
  const handleResetToCover = () => {
    goToSpread(0);
    setTimeout(() => {
      setResult(null);
      setImage(null);
      setSweetsName("");
      setSelectedCategory("all");
    }, 300);
  };

  const handleShare = () => {
    if (!result) return;
    const text = `【お菓子ペアリング手帖】\nお菓子: ${result.sweets.name}\nベストマッチ: ${result.bestMatch.drinkName}（相性: ${result.bestMatch.matchScore}%）\n「${result.bestMatch.catchphrase}」\n#お菓子ペアリング`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-8 select-none overflow-hidden bg-[#F0EEE9]">
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />

      {/* ヘッダー（ミニマル・上質） */}
      <div className="text-center mb-6">
        <span className="font-sans text-[10px] font-semibold text-charcoal-400 uppercase tracking-widest block mb-1">
          Pairing Journal
        </span>
        <h1 className="font-display font-light italic text-2xl sm:text-3xl text-charcoal-900 tracking-tight">
          お菓子と飲み物の手帖
        </h1>
        <p className="font-sans text-xs text-charcoal-400 mt-1">
          {spreadIndex === 0 && "極上のペアリングの世界へ、ようこそ"}
          {spreadIndex === 1 && "今日のお菓子と気分を記してください"}
          {spreadIndex === 2 && "鑑定された調和と嗜み方をご覧ください"}
        </p>
      </div>

      {/* =========================================================
          見開き本コンテナ（中央配置・サイズ固定で軸がブレない）
      ========================================================= */}
      <div
        className="w-full max-w-[940px] h-[620px] rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] border border-[#E8E2D9] relative flex transition-all duration-300"
        style={{
          background: spreadIndex === 0 ? "transparent" : "#FAF8F4",
        }}
      >
        {/* 中央の背表紙シャドウ（本の折り目の立体感） */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-transparent via-black/[0.08] to-transparent pointer-events-none z-30 hidden md:block" />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            スプレッド 0: 【扉絵見開き（Cover Spread）】
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {spreadIndex === 0 && (
          <div
            className={`w-full h-full flex transition-all duration-300 ${
              isTransitioning ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"
            }`}
          >
            {/* 扉絵 左ページ（装丁） */}
            <div
              className="w-1/2 h-full text-[#FAF8F4] p-8 sm:p-10 flex flex-col justify-between relative border-r border-[#3D3732]"
              style={{
                background: "linear-gradient(145deg, #24201D 0%, #161412 100%)",
                boxShadow: "inset -18px 0 30px rgba(0,0,0,0.5)",
              }}
            >
              <div className="absolute inset-4 sm:inset-5 border border-[#8C532B]/40 rounded-xl pointer-events-none" />

              <div className="relative z-10 text-center pt-8">
                <span className="font-sans text-[10px] tracking-[0.25em] text-[#C4BEB5] uppercase block mb-3">
                  Grind & Confectionery
                </span>
                <h2 className="font-display font-light italic text-3xl sm:text-4xl text-[#FDFCFB] tracking-tight leading-tight">
                  お菓子と飲み物の手帖
                </h2>
                <div className="w-10 h-px bg-[#8C532B] mx-auto my-4" />
                <p className="font-sans text-xs text-[#948B82] leading-relaxed max-w-xs mx-auto">
                  日常のひとくちを、至福のひとときに変える<br />
                  フレーバーペアリングの記録
                </p>
              </div>

              <div className="my-auto flex justify-center py-6 relative z-10">
                <div className="w-16 h-16 rounded-full border border-[#8C532B]/50 flex items-center justify-center text-[#E4CFBC] shadow-inner">
                  <Bookmark className="w-7 h-7 stroke-[1.2]" />
                </div>
              </div>

              <div className="pt-4 border-t border-[#8C532B]/30 flex justify-between text-[11px] text-[#948B82] font-sans relative z-10">
                <span className="tracking-widest uppercase text-[9px]">Sweets & Drink Pairing</span>
                <span className="font-display italic">Cover</span>
              </div>
            </div>

            {/* 扉絵 右ページ（前書き ＆ 開始ボタン） */}
            <div
              className="w-1/2 h-full bg-[#FAF8F4] text-[#1C1917] p-8 sm:p-10 flex flex-col justify-between relative overflow-y-auto"
              style={{
                boxShadow: "inset 18px 0 25px -10px rgba(0,0,0,0.06)",
              }}
            >
              <div className="space-y-4 pt-4">
                <div>
                  <span className="font-sans text-[10px] font-semibold text-charcoal-400 uppercase tracking-widest block mb-1">
                    Introduction
                  </span>
                  <h3 className="font-display font-light text-2xl text-charcoal-900 leading-tight">
                    ペアリングの愉しみ
                  </h3>
                </div>

                <div className="space-y-3 text-xs text-charcoal-600 leading-relaxed font-sans">
                  <p>
                    甘み、苦味、酸味、そして香り。<br />
                    お菓子と飲み物が重なり合うとき、それぞれの美味しさは何倍にも引き立ちます。
                  </p>
                  <p className="text-charcoal-500">
                    本手帖では、お菓子の風味の骨格（カラメル、カカオ、乳脂肪分など）を科学的に読み解き、最高に調和する一杯を鑑定・処方いたします。
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#F5F2EB] border border-[#E8E2D9] space-y-1.5">
                  <span className="font-sans text-[10px] font-bold text-[#8C532B] uppercase tracking-wider block">
                    HOW TO USE
                  </span>
                  <ul className="text-[11px] text-charcoal-700 space-y-1">
                    <li>1. お菓子の写真を貼るか、目録から選ぶ</li>
                    <li>2. 合わせたい飲み物の気分を選ぶ</li>
                    <li>3. 手帖に記される鑑定結果と嗜み方を楽しむ</li>
                  </ul>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleOpenBook}
                  className="btn-lift w-full py-4 rounded-xl font-sans font-medium text-xs text-cream-50 bg-[#1C1917] shadow-premium flex items-center justify-center gap-2 tracking-wider uppercase"
                >
                  <span>手帖を開く（始める）</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            スプレッド 1: 【入力見開き（Input Spread）】
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {spreadIndex === 1 && (
          <div
            className={`w-full h-full flex transition-all duration-300 ${
              isTransitioning ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"
            }`}
          >
            {/* 入力 左ページ（お菓子選択） */}
            <div
              className="w-1/2 h-full bg-[#FAF8F4] text-[#1C1917] p-7 sm:p-9 flex flex-col justify-between relative overflow-y-auto border-r border-[#E8E2D9]"
              style={{
                boxShadow: "inset -18px 0 25px -10px rgba(0,0,0,0.06)",
              }}
            >
              <div className="space-y-4">
                <div>
                  <span className="font-sans text-[10px] font-semibold text-charcoal-400 uppercase tracking-widest block mb-1">
                    Chapter I
                  </span>
                  <h2 className="font-display font-light text-xl text-charcoal-900 leading-tight">
                    今日のお菓子を記す
                  </h2>
                  <p className="font-sans text-[11px] text-charcoal-400 mt-0.5">
                    写真を貼るか、目録から選んでください
                  </p>
                </div>

                {/* 写真ゾーン */}
                {image ? (
                  <div className="relative rounded-xl overflow-hidden p-2 flex items-center justify-center bg-[#F5F2EB] border border-[#E8E2D9]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt="プレビュー" className="max-h-28 w-auto rounded-lg object-contain" />
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
                    className="rounded-xl p-3 flex flex-col items-center justify-center gap-1 cursor-pointer border border-dashed border-[#D3C9BD] hover:border-[#948B82] bg-[#FAF8F4] hover:bg-[#F5F2EB] transition-all"
                  >
                    <Camera className="w-4 h-4 text-charcoal-400" />
                    <p className="font-sans text-[11px] font-medium text-charcoal-800">お菓子の写真を貼る</p>
                  </div>
                )}

                {/* 定番お菓子 */}
                <div className="space-y-1.5">
                  <span className="font-sans text-[9px] font-semibold text-charcoal-400 uppercase tracking-wider block">
                    定番の目録
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {SWEETS_PRESETS.map((item) => {
                      const isSelected = sweetsName === item.name;
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => setSweetsName(isSelected ? "" : item.name)}
                          className={`p-2 rounded-xl text-left transition-all text-xs ${
                            isSelected
                              ? "bg-[#1C1917] text-[#FAF8F4] border border-[#1C1917]"
                              : "bg-[#FAF8F4] hover:bg-[#F5F2EB] text-[#1C1917] border border-[#E8E2D9]"
                          }`}
                        >
                          <span className="text-[9px] text-[#948B82] block">{item.category}</span>
                          <p className="font-semibold text-[11px] truncate">{item.name}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 手入力 */}
                <div className="space-y-1">
                  <input
                    type="text"
                    value={sweetsName}
                    onChange={(e) => setSweetsName(e.target.value)}
                    placeholder="または自由にお菓子名を入力..."
                    className="input-editorial text-xs py-2"
                  />
                </div>
              </div>

              <div className="pt-4 mt-auto border-t border-[#E8E2D9]/70 flex items-center justify-between text-[11px] text-[#948B82] font-sans">
                <span className="tracking-widest uppercase text-[9px]">Sweets & Drink Pairing</span>
                <span className="font-display italic font-medium">1</span>
              </div>
            </div>

            {/* 入力 右ページ（飲み物気分選択） */}
            <div
              className="w-1/2 h-full bg-[#FAF8F4] text-[#1C1917] p-7 sm:p-9 flex flex-col justify-between relative overflow-y-auto"
              style={{
                boxShadow: "inset 18px 0 25px -10px rgba(0,0,0,0.06)",
              }}
            >
              <div className="space-y-4">
                <div>
                  <span className="font-sans text-[10px] font-semibold text-charcoal-400 uppercase tracking-widest block mb-1">
                    Chapter II
                  </span>
                  <h2 className="font-display font-light text-xl text-charcoal-900 leading-tight">
                    合わせたい一杯
                  </h2>
                  <p className="font-sans text-[11px] text-charcoal-400 mt-0.5">
                    お菓子：<span className="font-semibold text-charcoal-800">{sweetsName || "写真のお菓子"}</span>
                  </p>
                </div>

                {/* ジャンル一覧 */}
                <div className="space-y-2">
                  {DRINK_GENRES.map((genre) => {
                    const isSelected = selectedCategory === genre.id;
                    return (
                      <button
                        key={genre.id}
                        type="button"
                        onClick={() => setSelectedCategory(genre.id)}
                        className={`selectable-row w-full py-2.5 px-3 ${
                          isSelected ? "selected" : ""
                        }`}
                      >
                        <div className="text-left">
                          <p className="font-sans text-xs font-semibold">{genre.title}</p>
                          <p className="font-sans text-[10px] text-[#948B82]">{genre.subtitle}</p>
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
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleDiagnose}
                    disabled={isLoading}
                    className="btn-lift w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-sans font-medium text-xs text-cream-50 bg-[#1C1917] shadow-premium disabled:opacity-85 transition-all"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-cream-100/40 border-t-cream-100 rounded-full animate-spin" />
                        <span>手帖に調和を記しています...</span>
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

              <div className="pt-4 mt-auto border-t border-[#E8E2D9]/70 flex items-center justify-between text-[11px] text-[#948B82] font-sans">
                <span className="tracking-widest uppercase text-[9px]">Sweets & Drink Pairing</span>
                <span className="font-display italic font-medium">2</span>
              </div>
            </div>
          </div>
        )}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            スプレッド 2: 【結果見開き（Result Spread）】
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {spreadIndex === 2 && result && (
          <div
            className={`w-full h-full flex transition-all duration-300 ${
              isTransitioning ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"
            }`}
          >
            {/* 結果 左ページ（主鑑） */}
            <div
              className="w-1/2 h-full bg-[#FAF8F4] text-[#1C1917] p-7 sm:p-9 flex flex-col justify-between relative overflow-y-auto border-r border-[#E8E2D9]"
              style={{
                boxShadow: "inset -18px 0 25px -10px rgba(0,0,0,0.06)",
              }}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between pb-3 border-b border-[#E8E2D9]">
                  <div>
                    <span className="font-sans text-[9px] font-semibold text-charcoal-400 uppercase tracking-widest block">
                      {result.sweets.category}
                    </span>
                    <h3 className="font-display font-light italic text-xl text-charcoal-900 mt-0.5">
                      {result.sweets.name}
                    </h3>
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

                <div className="p-4 rounded-2xl bg-[#FAF5F0] border border-[#E4CFBC] space-y-1.5">
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

                <div className="p-3.5 rounded-2xl bg-[#F5F2EB] text-xs space-y-2.5 border border-[#E8E2D9]">
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
              </div>

              <div className="pt-4 mt-auto border-t border-[#E8E2D9]/70 flex items-center justify-between text-[11px] text-[#948B82] font-sans">
                <span className="tracking-widest uppercase text-[9px]">Sweets & Drink Pairing</span>
                <span className="font-display italic font-medium">3</span>
              </div>
            </div>

            {/* 結果 右ページ（嗜み方・他候補・操作） */}
            <div
              className="w-1/2 h-full bg-[#FAF8F4] text-[#1C1917] p-7 sm:p-9 flex flex-col justify-between relative overflow-y-auto"
              style={{
                boxShadow: "inset 18px 0 25px -10px rgba(0,0,0,0.06)",
              }}
            >
              <div className="space-y-4">
                <div>
                  <span className="font-sans text-[10px] font-semibold text-charcoal-400 uppercase tracking-widest block mb-1">
                    Serving & Alternatives
                  </span>
                  <h3 className="font-display font-light text-lg text-charcoal-900">
                    嗜み方と他の候補
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#FAF8F4] border border-[#E8E2D9]">
                    <span className="text-[9px] text-[#948B82] block">おすすめ温度</span>
                    <span className="font-medium text-charcoal-800 text-[11px]">{result.bestMatch.servingGuide.temperature}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FAF8F4] border border-[#E8E2D9]">
                    <span className="text-[9px] text-[#948B82] block">淹れ方・濃さ</span>
                    <span className="font-medium text-charcoal-800 text-[11px]">{result.bestMatch.servingGuide.strengthOrBrew}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FAF8F4] border border-[#E8E2D9]">
                    <span className="text-[9px] text-[#948B82] block">器</span>
                    <span className="font-medium text-charcoal-800 text-[11px]">{result.bestMatch.servingGuide.recommendedVessel}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FAF8F4] border border-[#E8E2D9]">
                    <span className="text-[9px] text-[#948B82] block">ワンポイント</span>
                    <span className="font-medium text-charcoal-800 text-[11px] line-clamp-1">{result.bestMatch.servingGuide.specialTip}</span>
                  </div>
                </div>

                {result.alternativePairings && result.alternativePairings.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="font-sans text-[9px] font-semibold text-charcoal-400 uppercase tracking-wider block">
                      他の組み合わせ
                    </span>
                    <div className="space-y-1.5">
                      {result.alternativePairings.map((alt, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 rounded-xl bg-[#FAF8F4] border border-[#E8E2D9] text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#F5F2EB] text-[#736B63]">
                              {alt.categoryLabel}
                            </span>
                            <span className="font-medium text-charcoal-800 text-[11px]">{alt.drinkName}</span>
                          </div>
                          <span className="font-display font-bold text-[#8C532B] text-xs">{alt.matchScore}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="btn-lift flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl border border-cream-300 bg-[#FAF8F4] text-xs font-medium text-charcoal-800 shadow-premium"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-sage-500" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copied ? "コピー完了" : "手帖を共有"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetToCover}
                    className="btn-lift flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-[#1C1917] text-cream-50 text-xs font-medium shadow-premium"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>最初へ戻る</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 mt-auto border-t border-[#E8E2D9]/70 flex items-center justify-between text-[11px] text-[#948B82] font-sans">
                <span className="tracking-widest uppercase text-[9px]">Sweets & Drink Pairing</span>
                <span className="font-display italic font-medium">4</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
