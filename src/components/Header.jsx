import React from "react";

export default function Header({ setShowSearch }) {
  return (
    <header
      style={{
        padding: "12px 16px",
        background:
          "radial-gradient(circle at 15% -50%, rgba(37,99,235,0.28), transparent 42%), linear-gradient(135deg, #030817, #0a1730)",
        borderBottom: "2px solid #147cff",
        boxShadow: "0 8px 24px rgba(2, 8, 23, 0.24)",
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            minWidth: 0,
            gap: "12px",
          }}
        >
          <img
            src="/logo-option-1.png"
            alt="Local Scores logo"
            style={{
              width: "58px",
              height: "58px",
              flexShrink: 0,
              objectFit: "cover",
              borderRadius: "15px",
              filter: "drop-shadow(0 5px 12px rgba(37,99,235,0.4))",
            }}
          />

          <div style={{ minWidth: 0 }}>
            <h1
              style={{
                margin: 0,
                fontSize: "24px",
                lineHeight: "1",
                fontWeight: "1000",
                letterSpacing: "-0.04em",
                color: "#ffffff",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              Local{" "}
              <span
                style={{
                  color: "#1686ff",
                }}
              >
                Scores
              </span>
            </h1>

            <p
              style={{
                margin: "6px 0 0",
                color: "#b8c6da",
                fontSize: "11px",
                lineHeight: "1.25",
                fontWeight: "800",
                letterSpacing: "0.02em",
              }}
            >
              Scores. Schedules. Standings. All in one place.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowSearch(true)}
          aria-label="Open search"
          style={{
            width: "46px",
            height: "46px",
            flexShrink: 0,
            borderRadius: "14px",
            border: "1px solid rgba(96,165,250,0.32)",
            background: "rgba(15,23,42,0.82)",
            color: "#ffffff",
            fontSize: "21px",
            cursor: "pointer",
            boxShadow: "0 5px 15px rgba(2,8,23,0.2)",
          }}
        >
          🔍
        </button>
      </div>
    </header>
  );
}