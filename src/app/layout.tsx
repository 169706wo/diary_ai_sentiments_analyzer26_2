import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diary AI Sentiments Analyzer",
  description: "나의 감정을 기록하고 Gemini 인텔리전스로 하루를 보듬는 감성 다이어리",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF9F4] text-[#1A1C18]">
        {children}
      </body>
    </html>
  );
}
