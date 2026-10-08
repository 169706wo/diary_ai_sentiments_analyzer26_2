"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  Leaf,
  Save,
  BookMarked,
  Trash2,
  Edit3,
  X,
  RefreshCw,
} from "lucide-react";
import type { SentimentAnalysisResult } from "./api/analyze/route";

interface DiaryItem {
  rowIndex?: number;
  timestamp: string;
  datetime: string;
  content: string;
}

export default function DiaryAnalyzerPage() {
  const [diaryText, setDiaryText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<SentimentAnalysisResult | null>(null);

  // 구글 시트 CRUD 관련 상태
  const [isSaving, setIsSaving] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [diaryList, setDiaryList] = useState<DiaryItem[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [editingItem, setEditingItem] = useState<DiaryItem | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 날짜, 요일, 시간 상태
  const [currentDateTime, setCurrentDateTime] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 날짜/요일/시간 포맷터
  const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDays = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];
    const weekDay = weekDays[date.getDay()];
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "오후" : "오전";
    const formattedHours = hours % 12 || 12;

    return `${year}년 ${month}월 ${day}일 ${weekDay} ${period} ${formattedHours}:${minutes}`;
  };

  const formatLastModifiedTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "오후" : "오전";
    const formattedHours = hours % 12 || 12;
    return `${period} ${formattedHours}시 ${minutes}분`;
  };

  // Google Apps Script 직접 호출 헬퍼 (CORS 우회 및 리디렉션 완벽 처리)
  const callGoogleScript = async (params: Record<string, string>) => {
    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
    if (!scriptUrl) {
      throw new Error("NEXT_PUBLIC_GOOGLE_SCRIPT_URL이 설정되지 않았습니다.");
    }

    const searchParams = new URLSearchParams(params);
    const targetUrl = `${scriptUrl}?${searchParams.toString()}`;

    // 브라우저에서 직접 JSONP 또는 Fetch 시도
    const res = await fetch(targetUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
      redirect: "follow",
      cache: "no-store",
    });

    return await res.json();
  };

  // 1. 구글 시트에 일기 저장 (Create)
  const handleSaveDiary = async () => {
    if (!diaryText.trim()) {
      alert("저장할 일기 내용을 작성해 주세요.");
      return;
    }

    try {
      setIsSaving(true);
      const datetimeStr = formatDateString(currentDateTime);
      const data = await callGoogleScript({
        action: "create",
        datetime: datetimeStr,
        content: diaryText.trim(),
      });

      if (data.success === false) {
        throw new Error(data.message || data.error || "일기 저장 실패");
      }

      alert("구글 시트에 일기가 성공적으로 저장되었습니다!");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      alert(`저장 중 오류가 발생했습니다: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  // 2. 구글 시트 일기 목록 조회 (Read)
  const fetchDiaryList = async () => {
    try {
      setIsLoadingList(true);
      const data = await callGoogleScript({ action: "read" });
      if (data.success === false) {
        throw new Error(data.message || data.error || "목록 조회 실패");
      }
      setDiaryList(Array.isArray(data.items) ? data.items.reverse() : []);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      alert(`일기 목록을 불러오는 중 오류가 발생했습니다: ${msg}`);
    } finally {
      setIsLoadingList(false);
    }
  };

  // [일기보기] 모달 열기
  const handleOpenDiaryList = () => {
    setIsListModalOpen(true);
    fetchDiaryList();
  };

  // 3. 구글 시트 일기 수정 (Update)
  const handleUpdateDiary = async () => {
    if (!editingItem || !editingContent.trim()) {
      alert("수정할 내용을 입력해 주세요.");
      return;
    }

    try {
      setIsUpdating(true);
      const data = await callGoogleScript({
        action: "update",
        timestamp: editingItem.timestamp,
        content: editingContent.trim(),
      });

      if (data.success === false) {
        throw new Error(data.message || data.error || "일기 수정 실패");
      }

      alert("일기가 성공적으로 수정되었습니다.");
      setEditingItem(null);
      setEditingContent("");
      fetchDiaryList();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      alert(`수정 중 오류가 발생했습니다: ${msg}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // 4. 구글 시트 일기 삭제 (Delete)
  const handleDeleteDiary = async (timestamp: string) => {
    if (!window.confirm("정말 이 일기를 삭제하시겠습니까?")) {
      return;
    }

    try {
      setDeletingId(timestamp);
      const data = await callGoogleScript({
        action: "delete",
        timestamp: timestamp,
      });

      if (data.success === false) {
        throw new Error(data.message || data.error || "일기 삭제 실패");
      }

      setDiaryList((prev) => prev.filter((item) => item.timestamp !== timestamp));
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      alert(`삭제 중 오류가 발생했습니다: ${msg}`);
    } finally {
      setDeletingId(null);
    }
  };

  // 목록에서 클릭 시 현재 에디터로 불러오기
  const handleLoadToEditor = (item: DiaryItem) => {
    setDiaryText(item.content);
    setIsListModalOpen(false);
  };

  // AI 분석 핸들러
  const handleAnalyze = async () => {
    if (!diaryText.trim()) {
      alert("일기를 먼저 작성해 주세요.");
      return;
    }

    try {
      setIsAnalyzing(true);
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diaryText }),
      });

      if (!res.ok) {
        throw new Error("분석 요청 실패");
      }

      const data: SentimentAnalysisResult = await res.json();
      setAnalysisResult(data);
    } catch (error) {
      console.error(error);
      alert("분석 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 재시작 (초기화) 핸들러
  const handleReset = () => {
    if (
      diaryText.trim() &&
      !window.confirm("작성 중인 일기와 분석 결과를 초기화하시겠습니까?")
    ) {
      return;
    }
    setDiaryText("");
    setAnalysisResult(null);
  };

  // 5대 감정 정의
  const emotionIcons: {
    [key: string]: { icon: string; label: string };
  } = {
    행복: { icon: "😄", label: "행복" },
    설렘: { icon: "🥰", label: "설렘" },
    평온: { icon: "🌿", label: "평온" },
    지침: { icon: "🥺", label: "지침" },
    불안: { icon: "⚡", label: "불안" },
  };

  const emotionList: Array<"행복" | "설렘" | "평온" | "지침" | "불안"> = [
    "행복",
    "설렘",
    "평온",
    "지침",
    "불안",
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F4] text-[#1A1C18] flex flex-col p-4 md:p-8 max-w-[1240px] mx-auto w-full transition-colors duration-200">
      {/* 1. 상단 글로벌 헤더 */}
      <header className="bg-[#FAF9F4] border border-[#E3E3DB] rounded-2xl px-6 py-4 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_2px_8px_rgba(45,90,67,0.03)]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#E1EDE5] flex items-center justify-center text-[#2D5A43] shrink-0">
            <BookOpen className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight font-serif-diary">
                MindLog 마음 일기
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#137333] mr-1.5 animate-pulse" />
                AI 감성 케어
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#717973] mt-0.5">
              나의 감정을 기록하고 Gemini 인텔리전스로 하루를 보듬는 감성 다이어리
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFECE3] text-xs font-medium text-[#414943] border border-[#D3CEBE]/60">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2D5A43]" />
            <span>클라우드 동기화 완료</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#2D5A43] text-white flex items-center justify-center font-medium text-sm shadow-sm ring-2 ring-white">
            민
          </div>
        </div>
      </header>

      {/* 2. 컨트롤 바 (날짜/시간, 재시작, AI 감성분석 CTA) */}
      <section className="bg-white/80 backdrop-blur-sm border border-[#E3E3DB] rounded-2xl p-3 md:p-4 mb-4 shadow-[0_2px_10px_rgba(45,90,67,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* 날짜 & 요일 & 시간 표시 영역 */}
          <div className="flex items-center bg-[#EFECE3] border border-[#D3CEBE]/70 rounded-full px-4 py-2 text-sm text-[#1A1C18] gap-2.5 shadow-inner">
            <button
              title="이전 날"
              className="text-[#717973] hover:text-[#1A1C18] transition-colors p-0.5"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 font-medium">
              <CalendarIcon className="w-4 h-4 text-[#2D5A43]" />
              <span className="font-serif-diary tracking-tight">
                {formatDateString(currentDateTime)}
              </span>
            </div>
            <button
              title="다음 날"
              className="text-[#717973] hover:text-[#1A1C18] transition-colors p-0.5"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 작업 액션 버튼들 (재시작, AI 감성분석) */}
          <div className="flex flex-wrap items-center gap-2.5 ml-auto">
            {/* 재시작 (초기화) 버튼 */}
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-[#EFECE3] text-[#414943] border border-[#D3CEBE] hover:bg-[#E5E0D5] transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-[#717973]" />
              <span>재시작</span>
            </button>

            {/* AI 감성분석 (CTA) 버튼 */}
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold bg-[#1F4632] hover:bg-[#183928] text-white shadow-[0_4px_12px_rgba(31,70,50,0.25)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#A1D1B4]" />
              ) : (
                <Sparkles className="w-4 h-4 text-[#FFDDB6]" />
              )}
              <span>AI 감성분석</span>
              <span className="text-[11px] font-mono tracking-tight bg-[#2D5A43] text-[#A1D1B4] px-2 py-0.5 rounded-full border border-[#3E6F54]">
                gemini-3.8-flash
              </span>
            </button>
          </div>
        </div>

        {/* 3. 감성 이모지 영역: 분석 결과가 있을 때만 표시 */}
        {analysisResult && (
          <div className="mt-3 pt-3 border-t border-[#E8E4DA] flex flex-wrap items-center gap-2 transition-all duration-300 animate-fadeIn">
            <span className="text-xs font-medium text-[#717973] mr-1">
              오늘의 감정:
            </span>
            {emotionList.map((emo) => {
              const isHighlighted = analysisResult.primaryEmotion === emo;
              const emoScore = analysisResult.emotions?.[emo] ?? 0;

              return (
                <button
                  key={emo}
                  type="button"
                  onClick={() => {
                    setAnalysisResult({
                      ...analysisResult,
                      primaryEmotion: emo,
                    });
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                    isHighlighted
                      ? "bg-[#D1E7DA] text-[#0F2E1E] border-2 border-[#2D5A43] shadow-sm font-semibold scale-105"
                      : "bg-[#EFECE3] text-[#587D65] border border-[#D3CEBE] hover:bg-[#E8E4DA]"
                  }`}
                >
                  <span className="text-sm">{emotionIcons[emo].icon}</span>
                  <span>{emotionIcons[emo].label}</span>
                  {isHighlighted && emoScore > 0 && (
                    <span className="ml-1 text-[11px] font-bold text-[#14422D]">
                      {emoScore}%
                    </span>
                  )}
                  {isHighlighted && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A43]" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. 메인 콘텐츠 그리드 레이아웃 */}
      <main
        className={`grid gap-5 flex-1 items-start transition-all duration-300 ${
          analysisResult || isAnalyzing
            ? "grid-cols-1 lg:grid-cols-12"
            : "grid-cols-1 max-w-[800px] mx-auto w-full"
        }`}
      >
        {/* 좌측: [일기 작성 영역] */}
        <section
          className={`${
            analysisResult || isAnalyzing ? "lg:col-span-6" : "w-full"
          } bg-white rounded-3xl p-6 border border-[#E3E3DB] shadow-[0_4px_20px_rgba(45,90,67,0.03)] flex flex-col min-h-[520px] transition-all`}
        >
          {/* 영역 헤더 */}
          <div className="flex items-center justify-between pb-4 border-b border-[#EFECE3] mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[#2D5A43] font-semibold text-lg flex items-center gap-1.5">
                <span className="inline-block w-4 h-1 bg-[#2D5A43] rounded-full" />
                오늘의 일기 쓰기
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-[#EAF7EE] text-[#1B703C] font-medium border border-[#D1EED8]">
                실시간 동기화
              </span>
            </div>

            {/* 오른쪽 상단 액션: 글자 수, 저장 버튼, 일기보기 버튼 */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-[#9AA099] font-mono mr-1">
                {diaryText.length} / 1,000자
              </span>

              {/* [저장] 버튼 */}
              <button
                type="button"
                onClick={handleSaveDiary}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#2D5A43] text-white shadow-sm hover:bg-[#234634] active:scale-95 transition-all disabled:opacity-60"
                title="구글 시트에 일기 저장"
              >
                {isSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>{isSaving ? "저장 중..." : "저장"}</span>
              </button>

              {/* [일기보기] 버튼 ([저장] 버튼 오른쪽) */}
              <button
                type="button"
                onClick={handleOpenDiaryList}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#E1EDE5] text-[#2D5A43] border border-[#CEE3D5] hover:bg-[#D5E8DC] active:scale-95 transition-all"
                title="구글 시트에 저장된 일기 목록 보기"
              >
                <BookMarked className="w-3.5 h-3.5 text-[#2D5A43]" />
                <span>일기보기</span>
              </button>
            </div>
          </div>

          {/* 일기 작성 에디터 캔버스 */}
          <div className="flex-1 flex flex-col">
            <textarea
              value={diaryText}
              onChange={(e) => {
                if (e.target.value.length <= 1000) {
                  setDiaryText(e.target.value);
                }
              }}
              placeholder="오늘 하루 마음에 머물렀던 순간, 생각, 감정들을 자유롭게 적어보세요... 작성을 마친 후 상단의 [AI 감성분석] 버튼을 누르면 Gemini가 따뜻한 분석을 시작합니다."
              className="w-full flex-1 resize-none bg-transparent text-[#1A1C18] placeholder-[#9AA099] leading-relaxed text-[15px] focus:outline-none min-h-[360px] font-sans"
            />
          </div>

          {/* 하단 최종 작성 시각 */}
          <div className="pt-4 border-t border-[#EFECE3] mt-auto flex items-center justify-end text-xs text-[#807D74]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>현재 시각: {formatLastModifiedTime(currentDateTime)}</span>
            </div>
          </div>
        </section>

        {/* 우측: [AI 일기 감성 분석 결과] 영역 */}
        {(analysisResult || isAnalyzing) && (
          <section className="lg:col-span-6 bg-[#FAF9F4] rounded-3xl p-6 border border-[#E3E3DB] shadow-[0_4px_20px_rgba(45,90,67,0.03)] flex flex-col min-h-[520px] animate-fadeIn">
            {/* 결과 카드 헤더 */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E4DA] mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E1EDE5] flex items-center justify-center text-[#2D5A43]">
                  <Leaf className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold tracking-tight text-[#1A1C18]">
                  AI 일기 분석 결과
                </h2>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#E8F3EB] text-[#2D5A43] border border-[#C5E3CE]">
                  Gemini 3.8 Flash
                </span>
              </div>

              {analysisResult && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D1E7DA] text-[#0F2E1E] text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2D5A43]" />
                  <span>분석 완료</span>
                </div>
              )}
            </div>

            {isAnalyzing ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <Loader2 className="w-10 h-10 text-[#2D5A43] animate-spin mb-4" />
                <p className="text-base font-semibold text-[#1A1C18]">
                  Gemini 3.8 Flash가 일기를 깊이 분석하고 있습니다...
                </p>
                <p className="text-xs text-[#717973] mt-1">
                  사용자의 감정 성분과 맞춤 케어 루틴을 도출하는 중입니다.
                </p>
              </div>
            ) : analysisResult ? (
              <div className="flex-1 flex flex-col space-y-5">
                {/* 1) 오늘의 핵심 마음 메시지 */}
                <div className="relative bg-[#EFECE3]/80 border border-[#D3CEBE]/60 rounded-2xl p-5 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🌟</span>
                    <span className="text-xs font-bold text-[#42664F] tracking-wide">
                      오늘의 핵심 마음 메시지
                    </span>
                  </div>
                  <p className="text-[#1A1C18] text-[15px] font-serif-diary italic leading-relaxed pl-1 pr-4">
                    &ldquo;{analysisResult.coreMessage}&rdquo;
                  </p>
                  <div className="absolute right-4 bottom-2 text-3xl font-serif text-[#D3CEBE] opacity-60 select-none">
                    ””
                  </div>
                </div>

                {/* 2) 감정 성분 세부 분석 */}
                <div className="space-y-3">
                  <div className="flex items-center text-xs font-medium text-[#414943]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#2D5A43]" />
                      <span>감정 성분 세부 분석</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {analysisResult.breakdown.map((item, idx) => {
                      const colorClass =
                        item.color === "green"
                          ? "bg-[#2D5A43]"
                          : item.color === "teal"
                          ? "bg-[#42664F]"
                          : item.color === "amber"
                          ? "bg-[#D97706]"
                          : item.color === "rose"
                          ? "bg-[#E11D48]"
                          : "bg-[#059669]";

                      const iconEmoji =
                        item.percentage > 70
                          ? "😄"
                          : item.percentage > 5
                          ? "🌿"
                          : "☕";

                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs text-[#1A1C18] font-medium">
                            <span className="flex items-center gap-1.5">
                              <span>{iconEmoji}</span>
                              <span>{item.label}</span>
                            </span>
                            <span className="font-bold">{item.percentage}%</span>
                          </div>
                          <div className="w-full bg-[#E5E2D8] rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ease-out ${colorClass}`}
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3) Gemini 맞춤 마음 처방 & 굿나잇 루틴 */}
                <div className="bg-[#EFECE3]/70 border border-[#D3CEBE]/60 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#2D5A43]">
                    <Leaf className="w-3.5 h-3.5" />
                    <span>Gemini 맞춤 마음 처방 & 굿나잇 루틴</span>
                  </div>
                  <ul className="space-y-2 text-xs text-[#414943] leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A43] mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-[#1A1C18]">오늘 밤 루틴:</strong>{" "}
                        {analysisResult.prescription.nightRoutine}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A43] mt-1.5 shrink-0" />
                      <span>
                        <strong className="text-[#1A1C18]">
                          추천 티 & 사운드:
                        </strong>{" "}
                        {analysisResult.prescription.teaAndSound}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* 하단 상세 심리 리포트 링크 */}
                <div className="pt-3 border-t border-[#E8E4DA] mt-auto flex items-center justify-end text-xs">
                  <button
                    type="button"
                    onClick={() => alert("자세한 심리 리포트 기능은 준비 중입니다.")}
                    className="text-xs font-semibold text-[#2D5A43] hover:text-[#183928] flex items-center gap-1"
                  >
                    <span>자세한 심리 리포트</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        )}
      </main>

      {/* 5. 세련된 푸터 영역 (Copyright & 브랜드 정보) */}
      <footer className="mt-12 pt-8 pb-6 border-t border-[#E3E3DB]/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#717973] transition-colors">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 font-medium text-[#2D5A43]">
            <BookOpen className="w-4 h-4 text-[#2D5A43]" />
            <span className="font-serif-diary tracking-tight font-semibold text-sm">
              Diary AI Sentiments Analyzer
            </span>
          </div>
          <span className="hidden sm:inline-block text-[#D3CEBE]">•</span>
          <p className="tracking-wide text-[#587D65] font-medium">
            Copyright INU Diary AI Sentiments Analyzer by Haesol
          </p>
        </div>

        <div className="flex items-center gap-4 text-[#807D74]">
          <span className="px-2.5 py-1 rounded-full bg-[#EFECE3] text-[11px] font-medium text-[#414943] border border-[#D3CEBE]/60">
            Powered by Gemini 3.8 Flash & Google Sheets
          </span>
          <span className="text-[11px]">All rights reserved.</span>
        </div>
      </footer>

      {/* 5. [일기보기] 모달 팝업 (구글 시트 일기 목록 & 수정/삭제 CRUD) */}
      {isListModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FAF9F4] w-full max-w-2xl max-h-[85vh] rounded-3xl border border-[#E3E3DB] shadow-2xl flex flex-col overflow-hidden">
            {/* 모달 헤더 */}
            <div className="px-6 py-4 border-b border-[#E8E4DA] flex items-center justify-between bg-white/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E1EDE5] flex items-center justify-center text-[#2D5A43]">
                  <BookMarked className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1A1C18]">
                    구글 시트 저장된 일기 목록
                  </h3>
                  <p className="text-xs text-[#717973]">
                    스프레드시트에 기록된 일기 목록을 확인하고 관리합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchDiaryList}
                  disabled={isLoadingList}
                  title="새로고침"
                  className="p-1.5 rounded-full hover:bg-[#EFECE3] text-[#717973] transition-colors"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isLoadingList ? "animate-spin" : ""}`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsListModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="p-1.5 rounded-full hover:bg-[#EFECE3] text-[#717973] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 모달 본문 */}
            <div className="p-6 overflow-y-auto flex-1 space-y-3.5">
              {isLoadingList ? (
                <div className="py-16 text-center flex flex-col items-center justify-center text-[#717973]">
                  <Loader2 className="w-8 h-8 animate-spin text-[#2D5A43] mb-3" />
                  <p className="text-sm">구글 시트에서 일기를 불러오는 중...</p>
                </div>
              ) : diaryList.length === 0 ? (
                <div className="py-16 text-center text-[#717973]">
                  <BookOpen className="w-10 h-10 mx-auto text-[#C0C9C1] mb-2" />
                  <p className="text-sm font-medium">저장된 일기가 없습니다.</p>
                  <p className="text-xs text-[#807D74] mt-1">
                    일기를 작성한 후 [저장] 버튼을 눌러보세요.
                  </p>
                </div>
              ) : (
                diaryList.map((item) => (
                  <div
                    key={item.timestamp}
                    className="bg-white rounded-2xl p-4 border border-[#E3E3DB] shadow-sm hover:border-[#2D5A43]/40 transition-all flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between text-xs text-[#717973] border-b border-[#FAF9F4] pb-2">
                      <div className="flex items-center gap-1.5 font-medium text-[#2D5A43]">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>{item.datetime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {/* 현재 에디터로 불러오기 */}
                        <button
                          type="button"
                          onClick={() => handleLoadToEditor(item)}
                          className="px-2 py-1 rounded text-[11px] font-medium bg-[#EFECE3] text-[#414943] hover:bg-[#E5E0D5] transition-colors"
                          title="에디터로 불러오기"
                        >
                          불러오기
                        </button>
                        {/* 수정 모드 열기 */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItem(item);
                            setEditingContent(item.content);
                          }}
                          className="p-1 rounded text-[#587D65] hover:bg-[#EFECE3] transition-colors"
                          title="수정"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {/* 삭제 */}
                        <button
                          type="button"
                          onClick={() => handleDeleteDiary(item.timestamp)}
                          disabled={deletingId === item.timestamp}
                          className="p-1 rounded text-red-500 hover:bg-red-50 transition-colors"
                          title="삭제"
                        >
                          {deletingId === item.timestamp ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* 수정 폼 또는 일반 내용 표시 */}
                    {editingItem?.timestamp === item.timestamp ? (
                      <div className="space-y-2 mt-1">
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="w-full text-sm border border-[#D3CEBE] rounded-xl p-2.5 bg-[#FAF9F4] focus:outline-none focus:border-[#2D5A43] min-h-[90px]"
                        />
                        <div className="flex justify-end gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingItem(null);
                              setEditingContent("");
                            }}
                            className="px-3 py-1.5 rounded-full border border-[#D3CEBE] text-[#717973] hover:bg-[#EFECE3]"
                          >
                            취소
                          </button>
                          <button
                            type="button"
                            onClick={handleUpdateDiary}
                            disabled={isUpdating}
                            className="px-3 py-1.5 rounded-full bg-[#2D5A43] text-white hover:bg-[#234634] flex items-center gap-1 font-semibold"
                          >
                            {isUpdating && <Loader2 className="w-3 h-3 animate-spin" />}
                            <span>수정 완료</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-[#1A1C18] whitespace-pre-wrap leading-relaxed line-clamp-4">
                        {item.content}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* 모달 하단 푸터 */}
            <div className="px-6 py-3.5 border-t border-[#E8E4DA] bg-white/70 flex justify-between items-center text-xs text-[#717973]">
              <span>총 {diaryList.length}개의 기록</span>
              <button
                type="button"
                onClick={() => setIsListModalOpen(false)}
                className="px-4 py-1.5 rounded-full bg-[#EFECE3] text-[#414943] hover:bg-[#E5E0D5] font-medium"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
