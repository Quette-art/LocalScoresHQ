import React from "react";

export default function TabNavigation({
  activeTab,
  setActiveTab,
}) {
  const tabs = [
    {
      key: "home",
      label: "Home",
      icon: "🏠",
    },
    {
      key: "scores",
      label: "Scores",
      icon: "📊",
    },
    {
      key: "standings",
      label: "Standings",
      icon: "🏆",
    },
  ];

  return (
    <div className="bottomNavWrapper compactBottomNav">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`bottomNavButton ${
            activeTab === tab.key
              ? "bottomNavButtonActive"
              : ""
          }`}
          onClick={() => setActiveTab(tab.key)}
        >
          <span className="bottomNavIcon">
            {tab.icon}
          </span>

          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}