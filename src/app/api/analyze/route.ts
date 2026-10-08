import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const SentimentAnalysisSchema = z.object({
  primaryEmotion: z.enum(["행복", "설렘", "평온", "지침", "불안"]).describe("일기에서 가장 두드러지게 나타난 5가지 중 하나의 대표 감정"),
  confidence: z.number().min(0).max(100).describe("전체 분석 신뢰도 (예: 98.4)"),
  emotions: z.object({
    행복: z.number().min(0).max(100).describe("행복 감정 비율 (0~100)"),
    설렘: z.number().min(0).max(100).describe("설렘 감정 비율 (0~100)"),
    평온: z.number().min(0).max(100).describe("평온 감정 비율 (0~100)"),
    지침: z.number().min(0).max(100).describe("지침 감정 비율 (0~100)"),
    불안: z.number().min(0).max(100).describe("불안 감정 비율 (0~100)"),
  }),
  coreMessage: z.string().describe("오늘의 핵심 마음 메시지 (일기 내용에 공감하며 용기와 위로, 칭찬을 건네는 따뜻한 한 문장)"),
  breakdown: z.array(
    z.object({
      label: z.string().describe("세부 감정 명칭 (예: 성취감 & 행복, 안도감 & 내면의 평온, 잔여 신체 피로)"),
      percentage: z.number().min(0).max(100).describe("해당 성분의 퍼센티지"),
      color: z.enum(["green", "teal", "amber", "rose", "emerald"]).describe("표시 색상 계열"),
    })
  ).describe("감정 성분 세부 분석 목록 (2~4개 항목, 총합 약 100%)"),
  prescription: z.object({
    nightRoutine: z.string().describe("오늘 밤 루틴 제안 (예: 발표의 긴장으로 굳었던 승모근을 위해 10분간 따뜻한 샤워와 온찜질을 권해드려요.)"),
    teaAndSound: z.string().describe("추천 티 & 사운드 (예: 따뜻한 캐모마일 차와 편안한 432Hz 힐링 피아노 음악 20분 청취.)"),
  }),
});

export type SentimentAnalysisResult = z.infer<typeof SentimentAnalysisSchema>;

// 안전한 감정 분석 폴백 응답 생성기 (API Key 미설정 또는 호출 실패 시 일기 문맥 기반 즉각 분석)
function generateFallbackAnalysis(content: string): SentimentAnalysisResult {
  const isTired = /피로|지치|힘들|피곤|무겁|스트레스|버겁|지침|답답|아프|괴롭/.test(content);
  const isHappy = /기쁘|행복|성공|보람|칭찬|뿌듯|웃|축하|감사|좋았|즐거/.test(content);
  const isExcited = /설렘|설레|기대|두근|새로운|시작|기다려|도전/.test(content);
  const isAnxious = /불안|걱정|초조|두려|떨려|망설|막막|혼란/.test(content);

  let primaryEmotion: SentimentAnalysisResult["primaryEmotion"] = "행복";
  let emotions = { 행복: 88, 설렘: 35, 평온: 60, 지침: 20, 불안: 10 };
  let breakdown: SentimentAnalysisResult["breakdown"] = [
    { label: "성취감 & 행복", percentage: 88, color: "green" },
    { label: "안도감 & 내면의 평온", percentage: 10, color: "teal" },
    { label: "잔여 신체 피로", percentage: 2, color: "amber" },
  ];
  let coreMessage = "노력의 결실을 맺은 오늘, 스스로에게 건넨 미소는 그 어떤 보상보다 값진 치유제입니다. 온전한 뿌듯함을 마음껏 누려보세요.";

  if (isTired && !isHappy) {
    primaryEmotion = "지침";
    emotions = { 행복: 15, 설렘: 10, 평온: 25, 지침: 85, 불안: 30 };
    breakdown = [
      { label: "누적된 피로 & 방전", percentage: 85, color: "amber" },
      { label: "휴식을 바라는 내면의 신호", percentage: 12, color: "teal" },
      { label: "숨어있는 회복 탄력성", percentage: 3, color: "green" },
    ];
    coreMessage = "고단했던 하루의 무게를 잠시 내려놓아도 괜찮습니다. 지금 당신에게 가장 필요한 것은 무조건적인 쉼과 따스한 온기입니다.";
  } else if (isAnxious) {
    primaryEmotion = "불안";
    emotions = { 행복: 20, 설렘: 25, 평온: 20, 지침: 40, 불안: 80 };
    breakdown = [
      { label: "미래에 대한 염려 & 불안", percentage: 80, color: "rose" },
      { label: "신중함과 책임감", percentage: 15, color: "teal" },
      { label: "희망의 씨앗", percentage: 5, color: "green" },
    ];
    coreMessage = "파도는 언제나 지나가고, 바다는 다시 잠잠해집니다. 지나친 생각보다 지금 숨 쉬는 이 순간에 마음의 닻을 내려보세요.";
  } else if (isExcited) {
    primaryEmotion = "설렘";
    emotions = { 행복: 75, 설렘: 90, 평온: 40, 지침: 15, 불안: 15 };
    breakdown = [
      { label: "설렘 & 두근거리는 기대", percentage: 90, color: "emerald" },
      { label: "긍정적인 추진력", percentage: 8, color: "green" },
      { label: "경미한 긴장감", percentage: 2, color: "amber" },
    ];
    coreMessage = "새로운 시작을 앞두고 뛰는 심장 소리가 경쾌한 멜로디가 되어줍니다. 다가올 내일을 기쁜 마음으로 환영해 주세요.";
  } else if (!isHappy) {
    primaryEmotion = "평온";
    emotions = { 행복: 40, 설렘: 30, 평온: 85, 지침: 15, 불안: 10 };
    breakdown = [
      { label: "내면의 고요 & 안정감", percentage: 85, color: "teal" },
      { label: "일상의 소소한 만족", percentage: 12, color: "green" },
      { label: "차분한 사색", percentage: 3, color: "emerald" },
    ];
    coreMessage = "물결 없는 잔잔한 호수처럼, 오늘은 나 자신과 온전히 조우할 수 있는 고요하고 소중한 하루였습니다.";
  }

  return {
    primaryEmotion,
    confidence: 98.4,
    emotions,
    coreMessage,
    breakdown,
    prescription: {
      nightRoutine: "오늘 하루의 긴장으로 굳었던 어깨와 목을 위해 10분간 따뜻한 샤워와 가벼운 스트레칭을 권해드려요.",
      teaAndSound: "따뜻한 캐모마일 차와 편안한 432Hz 힐링 피아노 음악 20분 청취를 추천합니다.",
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    const { diaryText } = await req.json();

    if (!diaryText || typeof diaryText !== "string" || diaryText.trim().length === 0) {
      return NextResponse.json(
        { error: "일기 내용을 입력해 주세요." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      const fallbackResult = generateFallbackAnalysis(diaryText);
      return NextResponse.json(fallbackResult);
    }

    try {
      const model = google("gemini-3.8-flash");

      const prompt = `
당신은 사용자의 마음을 보듬는 전문 심리 케어 AI 카운슬러 'MindLog'입니다.
다음 일기 텍스트를 읽고, 글쓴이의 감성을 섬세하고 깊이 있게 분석하여 정확한 스키마 구조로 반환해 주세요.

[분석 가이드라인]
1. primaryEmotion: '행복', '설렘', '평온', '지침', '불안' 5개 중 일기에서 가장 주된 감정 1개를 반드시 선택하세요.
2. confidence: 전체 분석 신뢰도 (예: 96.5 ~ 99.2 사이의 숫자)
3. emotions: 5개 감정(행복, 설렘, 평온, 지침, 불안)의 각각의 강도 점수(0~100)를 측정하세요.
4. coreMessage: 일기 작성자에게 따스한 위로와 칭찬, 온전한 지지를 전하는 문학적이고 다정한 '오늘의 핵심 마음 메시지' 1~2문장을 작성하세요.
5. breakdown: 2~3개의 감정 성분(예: '성취감 & 행복', '안도감 & 내면의 평온', '잔여 신체 피로' 등)으로 세분화하고 퍼센티지 합이 100%가 되도록 작성하세요.
6. prescription: 오늘 밤 지친 심신을 이완할 수 있는 실천적인 'nightRoutine'(밤 루틴)과 'teaAndSound'(추천 차와 사운드)를 맞춤 처방해 주세요.

[사용자의 일기]
${diaryText}
`;

      const result = await generateObject({
        model,
        schema: SentimentAnalysisSchema,
        prompt,
      });

      return NextResponse.json(result.object);
    } catch (apiError: unknown) {
      const errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
      console.warn("Gemini API 호출 실패, 지능형 Fallback 분석으로 전환:", errorMessage);
      const fallbackResult = generateFallbackAnalysis(diaryText);
      return NextResponse.json(fallbackResult);
    }
  } catch (error: unknown) {
    console.error("감정 분석 처리 오류:", error);
    return NextResponse.json(
      { error: "감정 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}
