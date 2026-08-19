"use client";

import React, { useState } from "react";
import { PairingResult } from "@/types/pairing";
import { RotateCcw, Share2, Check, ArrowUpRight, Sparkles } from "lucide-react";

interface BentoResultProps {
  result: PairingResult;
  onReset: () => void;
}

export const BentoResult: React.FC<BentoResultProps> = ({
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
    <div className="w-full space-y-4">
      {/* 操作バー */}
      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-stone-500 hover:text-stone-900 transition-colors uppercase tracking-wider"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Pairing</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-stone-200 text-xs font-mono text-stone-700 hover:bg-stone-50 transition-all shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-700" />
              <span className="text-emerald-700 font-medium">COPIED</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>SHARE SPEC</span>
            </>
          )}
        </button>
      </div>

      {/* 2026 Bento Result Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Tile 1: ヒーローペアリング（MD: 8 cols） */}
        <div className="md:col-span-8 bg-stone-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-stone-400 tracking-wider">
              <span>BEST MATCH</span>
              <span>{bestMatch.categoryLabel}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-normal tracking-tight mt-4 text-white">
              {bestMatch.drinkName}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 italic mt-2 leading-relaxed">
              「{bestMatch.catchphrase}」
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-800 flex items-center justify-between">
            <span className="text-xs font-mono text-stone-400 uppercase tracking-wider">
              Optimal Pairing Formula
            </span>
            <div className="inline-flex items-center gap-1 text-xs text-stone-300 font-mono">
              <span>MATCH RATIO</span>
              <span className="font-bold text-white ml-1">{bestMatch.matchScore}%</span>
            </div>
          </div>
        </div>

        {/* Tile 2: スコア＆お菓子（MD: 4 cols） */}
        <div className="md:col-span-4 bg-white rounded-3xl border border-stone-200/80 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-stone-400 tracking-wider">
            <span>HARMONY INDEX</span>
            <span>SPEC</span>
          </div>

          <div className="text-center my-4">
            <span className="text-5xl sm:text-6xl font-light tracking-tighter text-stone-900">
              {bestMatch.matchScore}
            </span>
            <span className="text-lg text-stone-400 font-light ml-1">%</span>
            <span className="text-[10px] font-mono text-stone-400 block tracking-widest uppercase mt-1">
              Affinity Score
            </span>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60">
            <span className="text-[10px] font-mono text-stone-400 uppercase block">Target</span>
            <p className="text-xs font-medium text-stone-800 mt-0.5 truncate">{sweets.name}</p>
            <p className="text-[11px] text-stone-500 mt-0.5">{sweets.category}</p>
          </div>
        </div>

        {/* Tile 3: フレーバー科学・シナジー解析（MD: 6 cols） */}
        <div className="md:col-span-6 bg-white rounded-3xl border border-stone-200/80 p-6 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between text-xs font-mono text-stone-400 tracking-wider">
            <span>01 / FLAVOR SYNERGY</span>
            <span>CHEMISTRY</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/50">
              <span className="font-medium text-stone-900 block mb-1">
                香りと風味の同調
              </span>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                {bestMatch.flavorSynergy.harmonyReason}
              </p>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/50">
              <span className="font-medium text-stone-900 block mb-1">
                味覚の相乗メカニズム
              </span>
              <p className="text-stone-600 leading-relaxed text-[11px]">
                {bestMatch.flavorSynergy.scienceNotes}
              </p>
            </div>
          </div>
        </div>

        {/* Tile 4: サービングスペック（MD: 6 cols） */}
        <div className="md:col-span-6 bg-white rounded-3xl border border-stone-200/80 p-6 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between text-xs font-mono text-stone-400 tracking-wider">
            <span>02 / SERVING GUIDE</span>
            <span>OPTIMIZATION</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/50">
              <span className="text-[10px] font-mono text-stone-400 uppercase block mb-0.5">
                温度
              </span>
              <span className="text-stone-800 font-medium text-[11px] block">{bestMatch.servingGuide.temperature}</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/50">
              <span className="text-[10px] font-mono text-stone-400 uppercase block mb-0.5">
                抽出・濃さ
              </span>
              <span className="text-stone-800 font-medium text-[11px] block">{bestMatch.servingGuide.strengthOrBrew}</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/50">
              <span className="text-[10px] font-mono text-stone-400 uppercase block mb-0.5">
                器
              </span>
              <span className="text-stone-800 font-medium text-[11px] block">{bestMatch.servingGuide.recommendedVessel}</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/50">
              <span className="text-[10px] font-mono text-stone-400 uppercase block mb-0.5">
                Tips
              </span>
              <span className="text-stone-800 font-medium text-[11px] block truncate">{bestMatch.servingGuide.specialTip}</span>
            </div>
          </div>
        </div>

        {/* Tile 5: オルタナティブ候補（MD: 12 cols） */}
        {alternativePairings && alternativePairings.length > 0 && (
          <div className="md:col-span-12 bg-white rounded-3xl border border-stone-200/80 p-6">
            <div className="flex items-center justify-between text-xs font-mono text-stone-400 tracking-wider mb-4">
              <span>03 / ALTERNATIVE SELECTIONS</span>
              <span>SECONDARY PICKS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {alternativePairings.map((alt, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-stone-600 border border-stone-200">
                      {alt.categoryLabel}
                    </span>
                    <h4 className="text-xs font-medium text-stone-900 mt-1">
                      {alt.drinkName}
                    </h4>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      {alt.shortReason}
                    </p>
                  </div>

                  <span className="text-sm font-mono font-medium text-stone-900 shrink-0">
                    {alt.matchScore}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* リセットボタン */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-mono tracking-wider uppercase transition-all shadow-md"
        >
          Diagnose Another Sweet
        </button>
      </div>
    </div>
  );
};
