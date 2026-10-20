import React from "react";
import { House, ListFilter, Trophy, Star } from "lucide-react";

export default function TabNavigation({
  activeTab,
  setActiveTab,
}) {
  const tabs = [
    {
      key: "home",
      label: "Home",
      icon: House,
    },
    {
      key: "scores",
      label: "Scores",
      icon: ListFilter,
    },
    {
      key: "standings",
      label: "Standings",
      icon: Trophy,
    },
    {
      key: "favorites",
      label: "Favorites",
      icon: Star,
    },
  ];

  return (
    <nav className="bottomNav" aria-label="Main navigation">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`bottomNavButton ${
            activeTab === tab.key
              ? "bottomNavButtonActive"
              : ""
          }`}
          aria-current={activeTab === tab.key ? "page" : undefined}
          onClick={() => setActiveTab(tab.key)}
        >
          <span className="bottomNavIcon">
            <tab.icon size={22} strokeWidth={activeTab === tab.key ? 2.4 : 1.8} aria-hidden="true" />
          </span>

          <span className="bottomNavLabel">
            {tab.label}
          </span>
        </button>
      ))}
    </nav>
  );
}