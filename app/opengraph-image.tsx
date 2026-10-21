import { ImageResponse } from "next/og";
import { company } from "@/data/site";

export const alt = `${company.name} — ${company.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "68px 76px",
          color: "#ffffff",
          background:
            "linear-gradient(118deg, #172333 0%, #26394d 62%, #344e5e 100%)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 14,
              height: 54,
              borderRadius: 8,
              background: "#e5a63b"
            }}
          />
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 3,
              color: "#e8eef3"
            }}
          >
            INFRASTRUCTURE • MATERIALS • LOGISTICS
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: -2 }}>
            {company.name}
          </div>
          <div style={{ fontSize: 34, color: "#f2c36f" }}>{company.tagline}</div>
        </div>
        <div style={{ fontSize: 22, color: "#d7e0e8" }}>
          {company.groupLine}
        </div>
      </div>
    ),
    size
  );
}
