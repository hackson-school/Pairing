import React from "react";

export const LoadingAnimation: React.FC = () => {
  return (
    <div className="py-16 text-center">
      <div className="inline-block w-6 h-6 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin mb-4" />
      <p className="text-xs text-stone-500 font-light tracking-wide">
        ペアリングを検索しています...
      </p>
    </div>
  );
};
