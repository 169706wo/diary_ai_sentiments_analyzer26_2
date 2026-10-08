import { NextRequest, NextResponse } from "next/server";

// Next.js 백엔드 프록시: Google Apps Script Web App 연동
export async function GET(req: NextRequest) {
  try {
    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
    if (!scriptUrl) {
      return NextResponse.json(
        { success: false, error: "NEXT_PUBLIC_GOOGLE_SCRIPT_URL이 .env.local에 설정되지 않았습니다." },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const queryString = searchParams.toString();
    const targetUrl = queryString ? `${scriptUrl}?${queryString}` : scriptUrl;

    const res = await fetch(targetUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
      redirect: "follow",
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
    if (!scriptUrl) {
      return NextResponse.json(
        { success: false, error: "NEXT_PUBLIC_GOOGLE_SCRIPT_URL이 .env.local에 설정되지 않았습니다." },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Google Apps Script는 GET 쿼리 파라미터 방식으로 전송할 때 100% 안정적으로 리디렉션 처리됩니다.
    const searchParams = new URLSearchParams();
    for (const key of Object.keys(body)) {
      searchParams.set(key, String(body[key]));
    }

    const targetUrl = `${scriptUrl}?${searchParams.toString()}`;

    const res = await fetch(targetUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
      redirect: "follow",
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
