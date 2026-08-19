import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "お菓子ペアリング | スイーツと飲み物のベストマッチ診断",
  description: "お菓子にぴったり合う飲み物を提案・スコアリングするアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
