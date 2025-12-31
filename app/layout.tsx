import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MONO.fm - AI Music Player",
  description: "레트로 턴테이블 UI의 AI 음악 추천 플레이어",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
