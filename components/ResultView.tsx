"use client";

import React, { useState } from "react";
import { PairingResult } from "@/types/pairing";
import { RotateCcw, Share2, Check } from "lucide-react";

interface ResultViewProps {
  result: PairingResult;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);
  const { sweets, bestMatch, alternativePairings } = result;

  const handleShare = () => {
    const text = `【Sweets & Sips ペアリング処方箋】\nお菓子: ${sweets.name}\nおすすめの一杯: ${bestMatch.drinkName}（相性スコア: ${bestMatch.matchScore}%）\n「${bestMatch.catchphrase}」\n#SweetsAndSips`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* 操作バー */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#736E68] hover:text-[#191716] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>条件を変えて探す</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E8E5DF] bg-white hover:bg-[#FAF9F7] text-xs font-medium text-[#4A453F] transition-all shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-700" />
              <span className="text-emerald-700">コピー完了</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-[#736E68]" />
              <span>処方箋を共有</span>
            </>
          )}
        </button>
      </div>

      {/* メイン処方箋カード */}
      <div className="rounded-3xl bg-white border border-[#E8E5DF] p-6 sm:p-9 space-y-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
        {/* お菓子サマリー */}
        <div className="border-b border-[#F0ECE4] pb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono tracking-wider text-[#878179] uppercase">
              Target Sweets
            </span>
            <span className="text-[#D5D0C7]">/</span>
            <span className="text-[11px] text-[#878179]">
              {sweets.category}
            </span>
          </div>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-normal text-[#191716] tracking-tight">
            {sweets.name}
          </h2>
          <p className="text-xs text-[#736E68] leading-relaxed mt-1.5 font-light">
            {sweets.description}
          </p>
        </div>

        {/* ベストマッチ ドリンク & スコア */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#EFECE6] text-[#4A453F] text-[11px] font-mono tracking-wider uppercase">
              <span>Best Match / {bestMatch.categoryLabel}</span>
            </div>
            <h3 className="font-serif-title text-3xl sm:text-4xl font-normal text-[#191716] tracking-tight">
              {bestMatch.drinkName}
            </h3>
            <p className="text-xs sm:text-sm text-[#78350F] italic font-serif-title leading-relaxed pt-1">
              「{bestMatch.catchphrase}」
            </p>
          </div>

          <div className="self-start px-5 py-3 rounded-2xl bg-[#FAF9F7] border border-[#E8E5DF] text-center shrink-0">
            <span className="text-[10px] font-mono tracking-widest text-[#878179] uppercase block">
              Match Score
            </span>
            <span className="font-serif-title text-3xl font-bold text-[#191716] block mt-0.5">
              {bestMatch.matchScore}
              <span className="text-sm font-normal text-[#878179] ml-0.5">%</span>
            </span>
          </div>
        </div>

        {/* なぜ美味しいのか */}
        <div className="rounded-2xl bg-[#FAF9F7] border border-[#E8E5DF] p-5 sm:p-6 space-y-4 text-xs">
          <div>
            <span className="font-medium text-[#191716] block mb-1">
              【風味の調和】
            </span>
            <p className="text-[#615C56] leading-relaxed">
              {bestMatch.flavorSynergy.harmonyReason}
            </p>
          </div>

          <div className="border-t border-[#EAE6DD] pt-3.5">
            <span className="font-medium text-[#191716] block mb-1">
              【味覚のメカニズム】
            </span>
            <p className="text-[#615C56] leading-relaxed">
              {bestMatch.flavorSynergy.scienceNotes}
            </p>
          </div>
        </div>

        {/* おすすめの楽しみ方 */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono tracking-wider text-[#878179] uppercase">
            Serving Guide
          </h4>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#FAF9F7] border border-[#E8E5DF]">
              <span className="text-[10px] text-[#878179] font-mono uppercase block mb-0.5">
                推奨温度
              </span>
              <span className="text-[#191716] font-medium block">{bestMatch.servingGuide.temperature}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF9F7] border border-[#E8E5DF]">
              <span className="text-[10px] text-[#878179] font-mono uppercase block mb-0.5">
                抽出・濃さ
              </span>
              <span className="text-[#191716] font-medium block">{bestMatch.servingGuide.strengthOrBrew}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF9F7] border border-[#E8E5DF]">
              <span className="text-[10px] text-[#878179] font-mono uppercase block mb-0.5">
                おすすめの器
              </span>
              <span className="text-[#191716] font-medium block">{bestMatch.servingGuide.recommendedVessel}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF9F7] border border-[#E8E5DF]">
              <span className="text-[10px] text-[#878179] font-mono uppercase block mb-0.5">
                ワンポイント
              </span>
              <span className="text-[#191716] font-medium block line-clamp-2">{bestMatch.servingGuide.specialTip}</span>
            </div>
          </div>
        </div>

        {/* サブ候補 */}
        {alternativePairings && alternativePairings.length > 0 && (
          <div className="border-t border-[#F0ECE4] pt-6 space-y-3">
            <h4 className="text-xs font-mono tracking-wider text-[#878179] uppercase">
              Other Selections
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {alternativePairings.map((alt, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl border border-[#E8E5DF] bg-[#FAF9F7] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-[#878179] uppercase">
                        {alt.categoryLabel}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#191716]">
                        {alt.matchScore}%
                      </span>
                    </div>
                    <p className="text-xs font-medium text-[#191716]">
                      {alt.drinkName}
                    </p>
                    <p className="text-[11px] text-[#736E68] mt-1 leading-relaxed">
                      {alt.shortReason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ボタン */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onReset}
            className="w-full py-4 rounded-2xl bg-[#191716] hover:bg-[#332F2B] text-white text-xs font-medium tracking-wider uppercase transition-all shadow-md"
          >
            別のお菓子でペアリングを探す
          </button>
        </div>
      </div>
    </div>
  );
};
