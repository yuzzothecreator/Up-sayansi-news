import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { siteConfig } from "@/config/site";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") ?? siteConfig.name;
  const subtitle = searchParams.get("subtitle") ?? siteConfig.tagline;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px",
          background: "linear-gradient(135deg, #0f766e 0%, #134e4a 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            opacity: 0.85,
            marginBottom: 24,
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: "900px",
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              fontSize: 28,
              marginTop: 24,
              opacity: 0.9,
              maxWidth: "800px",
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
