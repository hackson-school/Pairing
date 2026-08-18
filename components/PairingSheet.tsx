"use client";

import React, { useState } from "react";
import { PairingResult, DrinkCategory } from "@/types/pairing";
import { X, Share2, Check, RotateCcw, ChevronDown, Thermometer, Flame, Layers } from "lucide-react";

interface PairingSheetProps {
  result: PairingResult;
  onClose: () => void;
  selectedCategory: DrinkCategory;
  onCategoryChange: (cat: DrinkCategory) => void;
}

const CATEGORIES: { id: DrinkCategory; label: string }[] = [
  { id: "all", label: "おすすめ" },
  { id: "coffee", label: "珈琲" },
  { id: "tea", label: "紅茶" },
  { id: "green_tea", label: "日本茶" },
  { id: "alcohol", label: "お酒" },
];

export const PairingSheet: React.FC<PairingSheetProps> = ({
  result,
  onClose,
  selectedCategory,
  onCategoryChange,
}) => {
  const [copied, setCopied] = useState(false);
  const { sweets, bestMatch, alternativePairings } = result;

  const handleShare = () => {
    const text = `【お菓子ペアリング】\nお菓子: ${sweets.name}\n最適マッチ: ${bestMatch.drinkName}（${bestMatch.matchScore}%）\n「${bestMatch.catchphrase}」\n#SweetsPairingLens`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg mx-auto bg-[#1A1918] text-white rounded-t-[32px] border-t border-[#33312E] p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto shadow-2xl animate-slide-up"
      >
        {/* シート上部バー & 閉じる */}
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-widest text-[#9E9B95] uppercase px-2.5 py-1 rounded-full bg-[#2B2926] border border-[#3D3A36]">
              {sweets.category}
            </span>
            <span className="text-xs text-[#9E9B95]">{sweets.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-full bg-[#2B2926] hover:bg-[#3D3A36] text-[#CCC8C0] transition-colors"
              title="共有"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-[#2B2926] hover:bg-[#3D3A36] text-[#CCC8C0] transition-colors"
              title="閉じる"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 飲み物ジャンル切り替えタブ */}
        <div className="flex bg-[#262422] p-1 rounded-xl border border-[#33312E] gap-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryChange(cat.id)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all text-center ${
                  isSelected
                    ? "bg-white text-black shadow-sm font-semibold"
                    : "text-[#9E9B95] hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ベストマッチ・ヒーロー表示 */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-[#262422] to-[#1F1D1B] border border-[#3A3733] space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-[#D97706] uppercase font-bold">
                BEST MATCH / {bestMatch.categoryLabel}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                {bestMatch.drinkName}
              </h2>
            </div>

            <div className="text-right shrink-0 px-3 py-1.5 rounded-xl bg-black/40 border border-[#3D3A36]">
              <span className="text-[9px] font-mono text-[#9E9B95] block uppercase tracking-wider">
                Harmony
              </span>
              <span className="text-2xl font-bold text-[#F59E0B] leading-none">
                {bestMatch.matchScore}
                <span className="text-xs font-normal text-[#9E9B95] ml-0.5">%</span>
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#D6D2CA] italic leading-relaxed pt-1">
            「{bestMatch.catchphrase}」
          </p>
        </div>

        {/* なぜ美味しいのか（フレーバーサイエンス） */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#9E9B95] uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-[#D97706]" />
            <span>ペアリングの理由</span>
          </div>

          <div className="p-4 rounded-xl bg-[#23211F] border border-[#33312E] space-y-2.5 text-xs leading-relaxed text-[#CCC8C0]">
            <div>
              <span className="text-white font-medium block mb-0.5">風味が同調するポイント</span>
              <p className="text-[#9E9B95]">{bestMatch.flavorSynergy.harmonyReason}</p>
            </div>
            <div className="pt-2 border-t border-[#33312E]">
              <span className="text-white font-medium block mb-0.5">味覚の相互作用</span>
              <p className="text-[#9E9B95]">{bestMatch.flavorSynergy.scienceNotes}</p>
            </div>
          </div>
        </div>

        {/* サービングガイド（温度・濃さ・器） */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#9E9B95] uppercase tracking-wider">
            <Thermometer className="w-3.5 h-3.5 text-[#D97706]" />
            <span>美味しい楽しみ方</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-[#23211F] border border-[#33312E]">
              <span className="text-[10px] text-[#78756F] uppercase block mb-0.5">おすすめ温度</span>
              <span className="text-white font-medium">{bestMatch.servingGuide.temperature}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#23211F] border border-[#33312E]">
              <span className="text-[10px] text-[#78756F] uppercase block mb-0.5">抽出・濃さ</span>
              <span className="text-white font-medium">{bestMatch.servingGuide.strengthOrBrew}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#23211F] border border-[#33312E]">
              <span className="text-[10px] text-[#78756F] uppercase block mb-0.5">おすすめの器</span>
              <span className="text-white font-medium">{bestMatch.servingGuide.recommendedVessel}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#23211F] border border-[#33312E]">
              <span className="text-[10px] text-[#78756F] uppercase block mb-0.5">ワンポイント</span>
              <span className="text-white font-medium line-clamp-2">{bestMatch.servingGuide.specialTip}</span>
            </div>
          </div>
        </div>

        {/* サブ候補 */}
        {alternativePairings && alternativePairings.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#9E9B95] uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-[#D97706]" />
              <span>その他の選択肢</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {alternativePairings.map((alt, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-[#23211F] border border-[#33312E] flex items-start justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2E2B28] text-[#9E9B95]">
                        {alt.categoryLabel}
                      </span>
                      <span className="font-semibold text-white">{alt.drinkName}</span>
                    </div>
                    <p className="text-[11px] text-[#78756F] leading-relaxed">{alt.shortReason}</p>
                  </div>
                  <span className="font-mono text-[#D97706] font-bold text-xs">{alt.matchScore}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 再撮影ボタン */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-white text-black font-bold text-xs tracking-wider uppercase hover:bg-stone-200 transition-all text-center"
          >
            別の写真を撮る / 閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
