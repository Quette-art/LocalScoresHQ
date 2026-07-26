import React from "react";

export default function Header({ setShowSearch }) {
  return (
    <>
      {/* TOP HEADER */}
      <header
        style={{
          background: "#0f172a",
          color: "white",
          padding: "18px 32px",
          borderBottom: "1px solid #1e293b",
        }}
      >
        <div
          style={{
            maxWidth: "1300px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* LEFT */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
            }}
          >
            {/* Logo */}
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 16,
                background:
                  "linear-gradient(135deg,#2563eb,#0ea5e9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: 24,
                boxShadow:
                  "0 8px 30px rgba(37,99,235,.45)",
              }}
            >
              LS
            </div>

            {/* Text */}
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: 28,
                  fontWeight: 900,
                  letterSpacing: "-1px",
                }}
              >
                Local Scores
              </h1>

              <div
                style={{
                  color: "#94a3b8",
                  fontSize: 14,
                  marginTop: 4,
                  fontWeight: 600,
                }}
              >
                Love Local. Every Game.
              </div>
            </div>
          </div>

          {/* SEARCH */}
          <button
            onClick={() => setShowSearch(true)}
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              border: "none",
              background: "#1e293b",
              color: "white",
              fontSize: 22,
              cursor: "pointer",
            }}
          >
            🔍
          </button>
        </div>
      </header>

      {/* NAVIGATION */}
      <div
        style={{
          background: "white",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            maxWidth: "1300px",
            margin: "0 auto",
            display: "flex",
            gap: 40,
            padding: "16px 32px",
            fontWeight: 700,
            fontSize: 17,
            color: "#334155",
          }}
        >
          <span style={{ color: "#2563eb" }}>Home</span>
          <span>Scores</span>
          <span>Standings</span>
          <span>Favorites</span>
        </div>
      </div>
    </>
  );
}