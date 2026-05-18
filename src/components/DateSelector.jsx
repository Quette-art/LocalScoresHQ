import React from "react";

export default function DateSelector({ dates, selectedDate, setSelectedDate }) {
  return (
    <div style={{ marginBottom: "16px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {dates.map((date) => (
        <button
          key={date}
          onClick={() => setSelectedDate(date)}
          style={{
            padding: "8px 14px",
            borderRadius: "999px",
            border: "none",
            background:
              selectedDate === date
                ? "linear-gradient(135deg, #0284c7, #22d3ee)"
                : "#111827",
            color: selectedDate === date ? "#000" : "#fff",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          {date}
        </button>
      ))}
    </div>
  );
}