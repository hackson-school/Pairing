"use client";

import dynamic from "next/dynamic";
import BookIntroTransition from "@/components/BookIntroTransition";

const BookApp = dynamic(() => import("@/components/BookApp"), {
  ssr: false,
});

export default function Home() {
  return (
    <BookIntroTransition>
      {(resetToCover) => <BookApp onResetToCover={resetToCover} />}
    </BookIntroTransition>
  );
}
