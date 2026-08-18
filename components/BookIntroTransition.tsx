"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark } from "lucide-react";

type Phase = "closed" | "opening" | "zooming" | "app";

interface Props {
  children: (resetToCover: () => void) => React.ReactNode;
}

const BASE_PAGE_W = 370;
const BASE_PAGE_H = 510;
const RIFFLE_COUNT = 5;

export default function BookIntroTransition({ children }: Props) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [scale, setScale] = useState<number>(1);

  // 画面幅に応じてレスポンシブにスケーリング計算
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // 閉じた状態（幅370px）または見開き（幅740px）が画面に収まるようにスケール
      const targetW = BASE_PAGE_W * 2 + 32; // 772px
      const targetH = BASE_PAGE_H + 160;   // 670px

      const scaleW = (w - 24) / targetW;
      const scaleH = (h - 40) / targetH;
      const calculatedScale = Math.min(1, Math.max(0.46, Math.min(scaleW, scaleH)));
      setScale(calculatedScale);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleOpen = () => {
    if (phase !== "closed") return;

    setPhase("opening");
    setTimeout(() => setPhase("zooming"), 1500);
    setTimeout(() => setPhase("app"), 2200);
  };

  const handleResetToCover = () => {
    setPhase("closed");
  };

  if (phase === "app") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full min-h-screen"
      >
        {children(handleResetToCover)}
      </motion.div>
    );
  }

  const isClosed = phase === "closed";
  const isZooming = phase === "zooming";

  return (
    <div className="fixed inset-0 bg-[#F0EEE9] flex flex-col items-center justify-center overflow-hidden p-2 sm:p-4 touch-none">
      {/* ヘッダーテキスト */}
      <AnimatePresence>
        {isClosed && (
          <motion.div
            key="header"
            className="absolute top-4 sm:top-8 text-center px-4 z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-sans text-[9px] sm:text-[10px] font-semibold text-charcoal-400 uppercase tracking-widest block mb-0.5 sm:mb-1">
              Pairing Journal
            </span>
            <h1 className="font-display font-light italic text-xl sm:text-3xl text-charcoal-900 tracking-tight">
              お菓子と飲み物の手帖
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          メインの本コンテナ（画面幅に合わせて動的スケーリング）
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        className="relative flex items-center justify-center transition-transform duration-300"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        <motion.div
          animate={{
            x: isClosed ? BASE_PAGE_W / 2 : 0,
            scale: isZooming ? 25 : 1,
            opacity: isZooming ? 0 : 1,
          }}
          transition={
            isZooming
              ? { duration: 0.7, ease: [0.55, 0, 1, 0.45] }
              : { duration: 0.55, ease: [0.25, 1, 0.5, 1] }
          }
          style={{ perspective: "1800px" }}
        >
          {/* 見開きの枠 */}
          <div
            className="relative flex shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] rounded-2xl overflow-visible"
            style={{ width: BASE_PAGE_W * 2, height: BASE_PAGE_H }}
          >
            {/* ── 左ページ ── */}
            <motion.div
              className="absolute left-0 top-0 bg-[#FAF8F4] rounded-l-2xl flex flex-col items-center justify-center overflow-hidden"
              style={{
                width: BASE_PAGE_W,
                height: BASE_PAGE_H,
                border: "1px solid #E8E2D9",
                boxShadow: "inset -18px 0 30px rgba(0,0,0,0.04)",
              }}
              animate={{ opacity: isClosed ? 0 : 1 }}
              transition={{ delay: 0.65, duration: 0.45, ease: "easeOut" }}
            >
              <div className="text-center space-y-4 px-8">
                <span className="font-sans text-[9px] tracking-widest text-[#948B82] uppercase block">
                  Introduction
                </span>
                <h3 className="font-display italic font-light text-2xl text-[#1C1917]">
                  ペアリングの愉しみ
                </h3>
                <div className="w-8 h-px bg-[#8C532B] mx-auto" />
                <p className="font-sans text-xs text-[#948B82] leading-relaxed">
                  甘み、苦味、酸味—<br />
                  二つが重なり合い、<br />
                  新たな調和が生まれる。
                </p>
              </div>
            </motion.div>

            {/* ── 右ページ（ベース） ── */}
            <div
              className="absolute top-0 bg-[#F5F2EB] rounded-r-2xl overflow-hidden"
              style={{
                left: BASE_PAGE_W,
                width: BASE_PAGE_W,
                height: BASE_PAGE_H,
                border: "1px solid #E8E2D9",
                boxShadow: "inset 18px 0 30px rgba(0,0,0,0.04)",
              }}
            />

            {/* ── パラパラめくりページ群 ── */}
            {!isClosed &&
              Array.from({ length: RIFFLE_COUNT }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-0 rounded-r-xl overflow-hidden"
                  style={{
                    left: BASE_PAGE_W,
                    width: BASE_PAGE_W,
                    height: BASE_PAGE_H,
                    transformOrigin: "left center",
                    backgroundColor: i % 2 === 0 ? "#FAF8F4" : "#F5F2EB",
                    border: "1px solid #E8E2D9",
                    zIndex: RIFFLE_COUNT - i + 2,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: -178 }}
                  transition={{
                    delay: 0.08 + i * 0.13,
                    duration: 0.42,
                    ease: [0.25, 0.8, 0.5, 1],
                  }}
                />
              ))}

            {/* ── 表紙（最前面・両面構造） ── */}
            <motion.div
              className="absolute top-0"
              style={{
                left: BASE_PAGE_W,
                width: BASE_PAGE_W,
                height: BASE_PAGE_H,
                transformOrigin: "left center",
                zIndex: RIFFLE_COUNT + 3,
                cursor: isClosed ? "pointer" : "default",
                transformStyle: "preserve-3d",
              }}
              animate={{ rotateY: isClosed ? 0 : -178 }}
              transition={
                isClosed
                  ? {}
                  : { delay: 0, duration: 0.65, ease: [0.25, 0.8, 0.5, 1] }
              }
              whileHover={isClosed ? { rotateY: -8, scale: 1.01 } : {}}
              onClick={handleOpen}
            >
              {/* 表面 */}
              <div
                className="absolute inset-0 rounded-r-2xl text-[#FAF8F4] overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, #24201D 0%, #161412 100%)",
                  border: "1px solid #3D3732",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <div className="absolute inset-4 border border-[#8C532B]/40 rounded-xl pointer-events-none" />
                <div className="h-full flex flex-col items-center justify-between py-10 px-8 text-center">
                  <div className="space-y-3">
                    <span className="font-sans text-[9px] tracking-[0.3em] text-[#C4BEB5] uppercase block">
                      Grind & Confectionery
                    </span>
                    <h2 className="font-display italic font-light text-2xl text-[#FDFCFB]">
                      お菓子と飲み物の手帖
                    </h2>
                    <div className="w-8 h-px bg-[#8C532B] mx-auto" />
                    <p className="font-sans text-[10px] text-[#948B82] leading-relaxed max-w-[200px] mx-auto">
                      日常のひとくちを、至福のひとときに変えるフレーバーペアリングの記録
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-full border border-[#8C532B]/40 flex items-center justify-center text-[#E4CFBC]">
                    <Bookmark className="w-6 h-6 stroke-[1.2]" />
                  </div>
                  <AnimatePresence>
                    {isClosed && (
                      <motion.span
                        key="tap"
                        className="font-sans text-[10px] text-[#948B82] tracking-widest uppercase"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                      >
                        クリックして開く
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* 裏面（見返し紙） */}
              <div
                className="absolute inset-0 rounded-l-2xl overflow-hidden flex flex-col items-center justify-center p-8 text-center select-none"
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

            {/* ── 中央の背表紙シャドウ ── */}
            <div
              className="absolute inset-y-0 pointer-events-none"
              style={{
                left: BASE_PAGE_W - 14,
                width: 28,
                background:
                  "linear-gradient(to right, transparent, rgba(0,0,0,0.1), transparent)",
                zIndex: 40,
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* フッターヒント */}
      <AnimatePresence>
        {isClosed && (
          <motion.p
            key="hint"
            className="absolute bottom-4 sm:bottom-8 font-sans text-[11px] sm:text-xs text-charcoal-400 tracking-wider text-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.85, 0.4] }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
          >
            ✦ タップして手帖を開く ✦
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
