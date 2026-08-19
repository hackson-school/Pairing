"use client";

import React from "react";
import { SweetsPreset } from "@/types/pairing";

const PRESET_TAGS: { id: string; name: string; category: string }[] = [
  { id: "canele", name: "カヌレ", category: "焼き菓子" },
  { id: "dark_chocolate", name: "ビターチョコレート", category: "カカオ70%" },
  { id: "cheesecake", name: "バスクチーズケーキ", category: "チーズ" },
  { id: "shortcake", name: "苺のショートケーキ", category: "生ケーキ" },
  { id: "potato_chips", name: "ポテトチップス", category: "スナック" },
  { id: "yokan", name: "練り羊羹", category: "和菓子" },
  { id: "macaron", name: "ピスタチオのマカロン", category: "洋菓子" },
  { id: "cream_puff", name: "シュークリーム", category: "カスタード" },
];

interface PresetSelectorProps {
  selectedPresetId: string | null;
  onSelectPreset: (preset: SweetsPreset | null) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  selectedPresetId,
  onSelectPreset,
}) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#878179] font-medium tracking-wide uppercase">
          定番からワンタップで選ぶ
        </span>
        {selectedPresetId && (
          <button
            type="button"
            onClick={() => onSelectPreset(null)}
            className="text-[#878179] hover:text-[#191716] underline transition-colors"
          >
            解除
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESET_TAGS.map((item) => {
          const isSelected = selectedPresetId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                onSelectPreset(
                  isSelected
                    ? null
                    : {
                        id: item.id,
                        name: item.name,
                        emoji: "",
                        category: item.category,
                        defaultDescription: "",
                      }
                )
              }
              className={`px-3.5 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                isSelected
                  ? "bg-[#191716] text-[#F6F5F2] shadow-sm font-medium"
                  : "bg-[#EFECE6] hover:bg-[#E5E1D8] text-[#4A453F]"
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
