import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Watendawili, Nairobi's Afro-fusion duo, official merch store";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const heroData = await readFile(
  join(process.cwd(), "public/images/hero/watendawili-live-og.jpg"),
  "base64"
);
const heroSrc = `data:image/jpeg;base64,${heroData}`;

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          position: "relative",
          backgroundColor: "#0a1a12",
        }}
      >
        {/* next/og's ImageResponse renders via satori, not the DOM — next/image isn't usable here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroSrc}
          alt=""
          width={size.width}
          height={size.height}
          style={{
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(to top, rgba(10,26,18,0.95) 0%, rgba(10,26,18,0.55) 45%, rgba(10,26,18,0.35) 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "64px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 30,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#b9c9bd",
              marginBottom: 12,
            }}
          >
            Nairobi&apos;s Afro-Fusion Duo
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 800,
              color: "#f4f1e9",
              lineHeight: 1,
              letterSpacing: -2,
            }}
          >
            WATENDAWILI
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#f4f1e9",
              marginTop: 20,
            }}
          >
            Official Merch Store
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
