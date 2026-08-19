"use client";

import React, { useRef } from "react";
import { Camera, Image as ImageIcon, X, ArrowUpRight, Check, Sparkles } from "lucide-react";
import { DrinkCategory, SweetsPreset } from "@/types/pairing";

interface BentoInputProps {
  image: string | null;
  onImageChange: (img: string | null) => void;
  sweetsName: string;
  onSweetsNameChange: (name: string) => void;
  selectedPreset: SweetsPreset | null;
  onSelectPreset: (preset: SweetsPreset | null) => void;
  selectedCategory: DrinkCategory;
  onSelectCategory: (cat: DrinkCategory) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const PRESETS = [
  { id: "canele", name: "カヌレ", tag: "焦がしカラメル" },
  { id: "dark_chocolate", name: "ビターチョコ", tag: "カカオ70%" },
  { id: "cheesecake", name: "バスクチーズ", tag: "濃厚クリーミー" },
  { id: "shortcake", name: "苺ショート", tag: "生クリーム" },
  { id: "potato_chips", name: "ポテトチップス", tag: "塩味・油脂" },
  { id: "yokan", name: "練り羊羹", tag: "小豆の上品な甘み" },
  { id: "macaron", name: "マカロン", tag: "ピスタチオ" },
  { id: "cream_puff", name: "シュークリーム", tag: "カスタード" },
];

const CATEGORIES: { id: DrinkCategory; code: string; label: string }[] = [
  { id: "all", code: "ALL", label: "おまかせ" },
  { id: "coffee", code: "COF", label: "珈琲" },
  { id: "tea", code: "TEA", label: "紅茶" },
  { id: "green_tea", code: "GRN", label: "日本茶" },
  { id: "alcohol", code: "ALC", label: "お酒" },
];

export const BentoInput: React.FC<BentoInputProps> = ({
  image,
  onImageChange,
  sweetsName,
  onSweetsNameChange,
  selectedPreset,
  onSelectPreset,
  selectedCategory,
  onSelectCategory,
  onSubmit,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onImageChange(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => onImageChange(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* 隠しインプット */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* 2026 Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Tile 1: ビジュアル入力（カメラ / 写真ドロップ） (MD: 5 cols) */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="md:col-span-5 bg-white rounded-2xl border border-stone-200/80 p-5 flex flex-col justify-between relative overflow-hidden group min-h-[220px]"
        >
          <div className="flex items-center justify-between text-xs text-stone-400 font-mono tracking-wider">
            <span>01 / VISUAL</span>
            <span>PHOTO CAPTURE</span>
          </div>

          {image ? (
            <div className="relative my-2 w-full h-36 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt="Uploaded Sweets"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onImageChange(null)}
                className="absolute top-2 right-2 bg-stone-900/80 hover:bg-stone-900 text-white p-1.5 rounded-full backdrop-blur-sm transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="my-3 py-6 px-4 rounded-xl border border-dashed border-stone-200 hover:border-stone-400 hover:bg-stone-50/80 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 group-hover:scale-105 transition-transform">
                <Camera className="w-5 h-5 stroke-[1.5]" />
              </div>
              <p className="text-xs font-medium text-stone-700">
                写真をドロップ または 撮影
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 py-1.5 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-[11px] font-medium text-stone-700 transition-colors text-center"
            >
              カメラ
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-1.5 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-[11px] font-medium text-stone-700 transition-colors text-center"
            >
              ファイル選択
            </button>
          </div>
        </div>

        {/* Tile 2: お菓子名入力 & クイックピル (MD: 7 cols) */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-stone-200/80 p-5 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between text-xs text-stone-400 font-mono tracking-wider">
            <span>02 / IDENTITY</span>
            <span>SWEETS NAME</span>
          </div>

          <div className="space-y-1.5">
            <input
              type="text"
              value={sweetsName}
              onChange={(e) => {
                onSweetsNameChange(e.target.value);
                if (selectedPreset && e.target.value !== selectedPreset.name) {
                  onSelectPreset(null);
                }
              }}
              placeholder="お菓子の名前を入力 (例: カヌレ, マカロン)"
              className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200/80 text-stone-900 placeholder-stone-400 text-sm font-medium focus:outline-none focus:border-stone-900 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">
              Quick Selection
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((item) => {
                const isSelected = selectedPreset?.id === item.id;
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
                              category: item.tag,
                              defaultDescription: "",
                            }
                      )
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all border ${
                      isSelected
                        ? "bg-stone-900 text-white border-stone-900 font-medium shadow-sm"
                        : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200/60"
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tile 3: 飲み物ジャンル選択 (MD: 8 cols) */}
        <div className="md:col-span-8 bg-white rounded-2xl border border-stone-200/80 p-5 flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-xs text-stone-400 font-mono tracking-wider">
            <span>03 / CATEGORY</span>
            <span>BEVERAGE SELECTION</span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {CATEGORIES.map((item) => {
              const isSelected = selectedCategory === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectCategory(item.id)}
                  className={`py-3 px-2 rounded-xl text-center transition-all border flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                      : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200/60"
                  }`}
                >
                  <span
                    className={`text-[10px] font-mono leading-none ${
                      isSelected ? "text-stone-400" : "text-stone-400"
                    }`}
                  >
                    {item.code}
                  </span>
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tile 4: アクション実行ボタン (MD: 4 cols) */}
        <div className="md:col-span-4 bg-stone-900 rounded-2xl p-5 flex flex-col justify-between text-white relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-stone-400 font-mono tracking-wider">
            <span>EXECUTE</span>
            <span>READY</span>
          </div>

          <div className="my-2">
            <p className="text-xs text-stone-400">ペアリング解析を開始</p>
            <p className="text-lg font-medium text-white tracking-tight mt-0.5">
              ベストマッチを処方
            </p>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-white text-stone-900 font-medium text-xs tracking-wider uppercase hover:bg-stone-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>START PAIRING</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
