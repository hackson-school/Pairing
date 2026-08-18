"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, ArrowRight } from "lucide-react";

type Phase = "closed" | "opening" | "zooming" | "app";

interface Props {
  children: (resetToCover: () => void) => React.ReactNode;
}

export default function BookIntroTransition({ children }: Props) {
  const [phase, setPhase] = useState<Phase>("closed");

  const handleOpen = () => {
    if (phase !== "closed") return;

    // ① 開く（表紙 + パラパラめくり）
    setPhase("opening");

    // ② パラパラ完了後にズームイン
    setTimeout(() => setPhase("zooming"), 1400);

    // ③ ズームイン完了後にアプリ表示
    setTimeout(() => setPhase("app"), 2000);
  };

  const handleResetToCover = () => {
    setPhase("closed");
  };

  if (phase === "app") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full min-h-screen"
      >
        {children(handleResetToCover)}
      </motion.div>
    );
  }

  const isClosed = phase === "closed";
  const isZooming = phase === "zooming";

  return (
    <div className="fixed inset-0 bg-[#F0EEE9] flex flex-col items-center justify-center overflow-hidden p-4 select-none">
      {/* ヘッダー */}
      <AnimatePresence>
        {isClosed && (
          <motion.div
            key="header"
            className="absolute top-6 sm:top-10 text-center px-4 z-20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <span className="font-sans text-[9px] sm:text-[10px] font-semibold text-charcoal-400 uppercase tracking-widest block mb-1">
              Pairing Journal
            </span>
            <h1 className="font-display font-light italic text-2xl sm:text-3xl text-charcoal-900 tracking-tight">
              お菓子と飲み物の手帖
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3D 本のコンテナ（完全中央配置・スマホでもズレない）
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.div
        className="relative flex items-center justify-center z-10"
        animate={{
          scale: isZooming ? 25 : 1,
          opacity: isZooming ? 0 : 1,
        }}
        transition={
          isZooming
            ? { duration: 0.65, ease: [0.55, 0, 1, 0.45] }
            : { duration: 0.4 }
        }
        style={{ perspective: "2000px" }}
      >
        {/* 本のベースフレーム */}
        <div
          className="relative w-[320px] sm:w-[360px] h-[480px] sm:h-[530px] rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* ── 内側の見開きベース（開いたときに見える中身） ── */}
          <div
            className="absolute inset-0 bg-[#FAF8F4] rounded-2xl p-7 sm:p-9 flex flex-col justify-between overflow-hidden border border-[#E8E2D9]"
            style={{
              boxShadow: "inset 0 0 30px rgba(0,0,0,0.05)",
            }}
          >
            <div className="text-center space-y-4 pt-4">
              <span className="font-sans text-[9px] tracking-widest text-[#948B82] uppercase block">
                Introduction
              </span>
              <h3 className="font-display italic font-light text-2xl text-[#1C1917]">
                ペアリングの愉しみ
              </h3>
              <div className="w-8 h-px bg-[#8C532B] mx-auto" />
              <p className="font-sans text-xs text-[#948B82] leading-relaxed">
                甘み、苦味、酸味、そして香り。<br />
                二つが重なり合うとき、<br />
                至福の調和が生まれる。
              </p>
            </div>
            <div className="text-center pb-2">
              <span className="font-sans text-[10px] text-[#8C532B] tracking-wider uppercase">
                手帖の世界へ吸い込まれます...
              </span>
            </div>
          </div>

          {/* ── パラパラめくりページ群（時間差で左へ回転） ── */}
          {!isClosed &&
            [0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-2xl border border-[#E8E2D9] overflow-hidden"
                style={{
                  transformOrigin: "left center",
                  backgroundColor: i % 2 === 0 ? "#FAF8F4" : "#F5F2EB",
                  zIndex: 20 - i,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  boxShadow: "-8px 0 20px rgba(0,0,0,0.12)",
                }}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -175 }}
                transition={{
                  delay: 0.1 + i * 0.12,
                  duration: 0.45,
                  ease: [0.25, 0.8, 0.5, 1],
                }}
              />
            ))}

          {/* ── 表紙（最前面・クリック/タップで開く） ── */}
          <motion.div
            className="absolute inset-0 rounded-2xl cursor-pointer"
            style={{
              transformOrigin: "left center",
              zIndex: 30,
              transformStyle: "preserve-3d",
            }}
            animate={{ rotateY: isClosed ? 0 : -175 }}
            transition={
              isClosed
                ? {}
                : { delay: 0, duration: 0.65, ease: [0.25, 0.8, 0.5, 1] }
            }
            whileHover={isClosed ? { rotateY: -6, scale: 1.01 } : {}}
            onClick={handleOpen}
          >
            {/* ［表紙の表面］ */}
            <div
              className="absolute inset-0 rounded-2xl text-[#FAF8F4] overflow-hidden p-6 sm:p-8 flex flex-col justify-between"
              style={{
                background: "linear-gradient(145deg, #24201D 0%, #161412 100%)",
                border: "1px solid #3D3732",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              {/* 金箔風飾り枠 */}
              <div className="absolute inset-3 sm:inset-4 border border-[#8C532B]/40 rounded-xl pointer-events-none" />

              <div className="relative z-10 text-center pt-3 sm:pt-6">
                <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.25em] text-[#C4BEB5] uppercase block mb-2">
                  Grind & Confectionery
                </span>
                <h2 className="font-display italic font-light text-2xl sm:text-3xl text-[#FDFCFB] tracking-tight leading-tight">
                  お菓子と飲み物の手帖
                </h2>
                <div className="w-8 sm:w-10 h-px bg-[#8C532B] mx-auto my-3" />
                <p className="font-sans text-[11px] sm:text-xs text-[#948B82] leading-relaxed max-w-[220px] mx-auto">
                  日常のひとくちを、至福のひとときに変えるフレーバーペアリングの記録
                </p>
              </div>

              <div className="my-auto flex justify-center py-4 relative z-10">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-[#8C532B]/50 flex items-center justify-center text-[#E4CFBC] shadow-inner">
                  <Bookmark className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.2]" />
                </div>
              </div>

              <div className="pb-1 text-center relative z-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpen();
                  }}
                  className="btn-lift w-full py-3.5 sm:py-4 rounded-xl font-sans font-medium text-xs text-[#1C1917] bg-[#FAF8F4] hover:bg-white shadow-[0_4px_15px_rgba(0,0,0,0.25)] flex items-center justify-center gap-2 tracking-wider uppercase active:scale-95 transition-transform"
                >
                  <span>手帖を開く</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ［表紙の裏面（見返し紙）］ */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-8 text-center select-none"
              style={{
                background: "linear-gradient(145deg, #1C1917 0%, #12100E 100%)",
                border: "1px solid #3D3732",
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                boxShadow: "inset -15px 0 25px rgba(0,0,0,0.6)",
              }}
            >
              <div className="w-10 h-10 rounded-full border border-[#8C532B]/30 flex items-center justify-center text-[#948B82] opacity-50 mb-2">
                <Bookmark className="w-4 h-4 stroke-[1]" />
              </div>
              <span className="font-sans text-[8px] tracking-[0.2em] text-[#948B82] uppercase block">
                Ex Libris · Pairing Note
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* フッターヒント */}
      <AnimatePresence>
        {isClosed && (
          <motion.p
            key="hint"
            className="absolute bottom-6 sm:bottom-10 font-sans text-xs text-charcoal-400 tracking-wider text-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          >
            ✦ タップして手帖を開く ✦
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
