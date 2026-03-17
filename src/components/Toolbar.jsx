import React from "react";
import { Home, Wallet, PieChart, User, ShoppingBag } from "lucide-react";
import "../styles/Toolbar.css";

const MENU_ITEMS = [
  { id: "dashboard", icon: Home,        label: "Inicio",   bg: "#E8F5EF", color: "#00875A" },
  { id: "daily",     icon: ShoppingBag, label: "Daily",    bg: "#EEEAFF", color: "#6D4AFF", sheet: true },
  { id: "wallet",    icon: Wallet,      label: "Cartera",  bg: "#EFF6FF", color: "#3B82F6" },
  { id: "analytics", icon: PieChart,    label: "Análisis", bg: "#FFFBEA", color: "#F59E0B" },
  { id: "profile",   icon: User,        label: "Perfil",   bg: "#FFF0F0", color: "#EF4444", sheet: true },
];

export default function Toolbar({ activeTab, setActiveTab, openSlider }) {
  const handleClick = (item) => {
    if (item.sheet) openSlider(item.id);
    else setActiveTab(item.id);
  };

  return (
    <nav className="toolbar-container-v2">
      <div className="toolbar-content-v2">
        {MENU_ITEMS.map((item) => {
          const Icon    = item.icon;
          const isActive = !item.sheet && activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`toolbar-item-v2 ${isActive ? "active" : ""}`}
              onClick={() => handleClick(item)}
            >
              {/* Revolut-style bubble — filled when active */}
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 13,
                background: isActive ? item.bg : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                position: "relative",
              }}>
                <Icon
                  size={20}
                  color={isActive ? item.color : "#A0AEC0"}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                {item.id === "dashboard" && (
                  <span style={{
                    position: "absolute",
                    top: 6, right: 6,
                    width: 7, height: 7,
                    background: "#EF4444",
                    borderRadius: "50%",
                    border: "1.5px solid white",
                  }} />
                )}
              </div>
              <span className="toolbar-label-v2" style={{
                color: isActive ? item.color : "#A0AEC0",
                fontWeight: isActive ? 700 : 500,
              }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
