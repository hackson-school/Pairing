"use client";

import React from "react";
import { DrinkCategory } from "@/types/pairing";

const CATEGORIES: { id: DrinkCategory; label: string }[] = [
  { id: "all", label: "おまかせ" },
  { id: "coffee", label: "珈琲" },
  { id: "tea", label: "紅茶" },
  { id: "green_tea", label: "日本茶" },
  { id: "alcohol", label: "お酒" },
];

interface CategoryFilterProps {
  selectedCategory: DrinkCategory;
  onSelectCategory: (category: DrinkCategory) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="space-y-2.5">
      <span className="text-xs text-[#878179] font-medium tracking-wide uppercase block">
        飲みたいジャンル
      </span>
      <div className="flex p-1 bg-[#EFECE6] rounded-xl gap-1">
        {CATEGORIES.map((item) => {
          const isSelected = selectedCategory === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectCategory(item.id)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all text-center ${
                isSelected
                  ? "bg-white text-[#191716] shadow-sm font-semibold"
                  : "text-[#736E68] hover:text-[#191716]"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
