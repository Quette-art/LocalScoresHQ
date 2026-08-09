import React from "react";
import navbarLogo from "../assets/local-scores-navbar.png";

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
          }}
        >
          <img
            src={navbarLogo}
            alt="Local Scores"
            style={{
              width: "auto",
              height: "62px",
              maxWidth: "320px",
              display: "block",
              objectFit: "contain",
              filter:
                "drop-shadow(0 6px 14px rgba(37,99,235,0.28))",
            }}
          />
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