import React from "react";
import { Home, Wallet, PieChart, User, ShoppingBag } from "lucide-react";
import "../styles/Toolbar.css";

export default function Toolbar({ activeTab, setActiveTab, openSlider }) {
  // Añadimos "DailyLife" para que aparezca en la barra principal
  const menuItems = [
    { id: "dashboard", icon: <Home size={22} />, label: "Inicio" },
    { id: "daily", icon: <ShoppingBag size={22} />, label: "Daily" }, // Abre DailyContent
    { id: "wallet", icon: <Wallet size={22} />, label: "Cartera" },
    { id: "analytics", icon: <PieChart size={22} />, label: "Análisis" },
    { id: "profile", icon: <User size={22} />, label: "Perfil" }, // Abre ProfileContent
  ];

  const handleAction = (itemId) => {
    if (itemId === "daily") {
      openSlider("daily"); // Llama a la función para abrir VentanillaSlider.jsx
    } else if (itemId === "profile") {
      openSlider("profile");
    } else {
      setActiveTab(itemId);
    }
  };

  return (
    <nav className="toolbar-container-v2">
      <div className="toolbar-content-v2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`toolbar-item-v2 ${
              activeTab === item.id ? "active" : ""
            }`}
            onClick={() => handleAction(item.id)}
          >
            <div className="icon-box-v2">
              {item.icon}
              {item.id === "dashboard" && <span className="notif-dot-v2" />}
            </div>
            <span className="toolbar-label-v2">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
