import React from "react";
import { Coffee } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center">
            <Coffee className="w-4 h-4" />
          </div>
          <span className="font-semibold text-gray-900 text-sm">
            お菓子ペアリング
          </span>
        </div>
      </div>
    </header>
  );
};
