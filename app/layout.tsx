import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MONO.fm - Music Player",
  description: "레트로 턴테이블 UI의 음악 플레이어",
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
