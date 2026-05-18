import React from "react";

export default function Header({ setShowSearch }) {
  return (
    <header
      style={{
        padding: "18px 16px",
        background:
          "linear-gradient(135deg, rgba(2,6,23,0.98), rgba(15,23,42,0.98))",
        borderBottom: "1px solid rgba(148,163,184,0.14)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #0284c7, #22d3ee)",
              display: "grid",
              placeItems: "center",
              fontSize: "24px",
              boxShadow: "0 0 22px rgba(34,211,238,0.35)",
            }}
          >
            HQ
          </div>

          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "26px",
                lineHeight: "1",
                fontWeight: "1000",
                letterSpacing: "-0.04em",
                color: "#ffffff",
              }}
            >
              LocalScoreHQ
            </h1>

            <p
              style={{
                margin: "6px 0 0",
                color: "#94a3b8",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              Where Every Game Counts
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowSearch(true)}
          aria-label="Open search"
          style={{
            width: "46px",
            height: "46px",
            borderRadius: "14px",
            border: "1px solid rgba(148,163,184,0.2)",
            background: "rgba(15,23,42,0.9)",
            color: "#fff",
            fontSize: "22px",
            cursor: "pointer",
          }}
        >
          🔍
        </button>
      </div>
    </header>
  );
}