import React from "react";

export default function Header({ setShowSearch }) {
  return (
    <header
      style={{
        background: "#0f172a",
        borderBottom: "3px solid #2563eb",
        padding: "18px 30px",
        boxShadow: "0 8px 30px rgba(0,0,0,.15)",
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
        {/* Logo + Name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <img
            src="/logo.png"
            alt="Local Scores"
            style={{
              width: "56px",
              height: "56px",
              objectFit: "contain",
            }}
          />

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "8px",
              }}
            >
              <span
                style={{
                  color: "#ffffff",
                  fontSize: "30px",
                  fontWeight: 800,
                }}
              >
                Local Scores
              </span>

              <span
                style={{
                  color: "#60a5fa",
                  fontWeight: 700,
                  fontSize: "16px",
                }}
              >
                HQ
              </span>
            </div>

            <div
              style={{
                color: "#94a3b8",
                fontSize: "14px",
                marginTop: "4px",
              }}
            >
              Love Local. Every Game.
            </div>
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={() => setShowSearch(true)}
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "14px",
            border: "none",
            background: "#2563eb",
            color: "white",
            fontSize: "22px",
            cursor: "pointer",
            transition: ".2s",
          }}
        >
          🔍
        </button>
      </div>
    </header>
  );
}