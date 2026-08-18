"use client";

import React, { useRef } from "react";
import { Camera, X, Plus } from "lucide-react";

interface ImageUploaderProps {
  image: string | null;
  onImageChange: (image: string | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  image,
  onImageChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
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

      {image ? (
        <div className="relative rounded-2xl overflow-hidden bg-white border border-[#E8E5DF] p-3 shadow-sm">
          <div className="relative max-h-64 w-full flex items-center justify-center overflow-hidden rounded-xl bg-[#F6F5F2]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt="選択されたお菓子"
              className="max-h-64 w-auto object-contain rounded-xl"
            />
          </div>
          <button
            type="button"
            onClick={() => onImageChange(null)}
            className="absolute top-5 right-5 bg-[#191716]/80 hover:bg-[#191716] text-white p-2 rounded-full backdrop-blur-sm transition-all shadow-md"
            aria-label="写真を削除"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-2xl border border-dashed border-[#D5D0C7] hover:border-[#191716] p-8 text-center bg-[#FAF9F7] hover:bg-[#F3F1EC] transition-all cursor-pointer group flex flex-col items-center justify-center gap-3"
        >
          <div className="w-12 h-12 rounded-full bg-white border border-[#E8E5DF] group-hover:border-[#191716] group-hover:scale-105 flex items-center justify-center text-[#736E68] group-hover:text-[#191716] transition-all shadow-sm">
            <Camera className="w-5 h-5 stroke-[1.5]" />
          </div>

          <div>
            <p className="text-sm font-medium text-[#191716]">
              お菓子の写真をアップロード
            </p>
            <p className="text-xs text-[#878179] mt-0.5 font-light">
              ドラッグ＆ドロップ または クリックして選択
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                cameraInputRef.current?.click();
              }}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-[#EFECE6] border border-[#E0DCD4] text-xs font-medium text-[#4A453F] transition-all"
            >
              カメラを起動
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-[#EFECE6] border border-[#E0DCD4] text-xs font-medium text-[#4A453F] transition-all"
            >
              ライブラリから選択
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
