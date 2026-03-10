import React, { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./components/Dashboard";
import Toolbar from "./components/Toolbar";
import VentanillaSlider from "./components/VentanillaSlider";

import "./styles/App.css";

function App() {
  const [user, setUser] = useState({ name: "Marie Claire" }); // Usuario inicial
  const [authMode, setAuthMode] = useState("authenticated"); // 'login', 'register', 'authenticated'
  const [activeView, setActiveView] = useState(null); // 'dailylife', 'profile', 'notifications', 'wallet', 'analytics'
  const [balance, setBalance] = useState(2710250); // Saldo inicial basado en tu imagen
  const [notifCount, setNotifCount] = useState(3);

  // Lógica para procesar pagos desde DailyLife u otros módulos
  const handlePurchase = (amount, description) => {
    if (balance >= amount) {
      setBalance((prev) => prev - amount);
      console.log(`Pago de ${amount} XAF para ${description} procesado.`);
      return true;
    } else {
      alert("Saldo insuficiente en Green Bank");
      return false;
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setAuthMode("authenticated");
  };

  const handleLogout = () => {
    setAuthMode("login");
    setActiveView(null);
    setUser(null);
  };

  // --- NAVEGACIÓN ---
  // Pantalla de Login
  if (authMode === "login") {
    return (
      <Login
        onLogin={handleLogin}
        onGoToRegister={() => setAuthMode("register")}
      />
    );
  }

  // Pantalla de Registro
  if (authMode === "register") {
    return (
      <Register
        onRegister={() => setAuthMode("login")}
        onGoToLogin={() => setAuthMode("login")}
      />
    );
  }

  // --- APP PRINCIPAL (ESTILO NATIVO) ---
  return (
    <div className="app-container">
      {/* El Dashboard recibe el balance real y funciones para abrir ventanillas */}
      <Dashboard
        user={user}
        balance={balance}
        notifCount={notifCount}
        openNotifications={() => setActiveView("notifications")}
      />

      {/* Ventanilla Deslizante Dinámica */}
      {activeView && (
        <VentanillaSlider
          viewType={activeView}
          onClose={() => setActiveView(null)}
          user={user}
          balance={balance}
          onPurchase={handlePurchase} // Pasamos la función de pago a DailyLife
          onLogout={handleLogout}
        />
      )}

      {/* La Toolbar controla qué ventanilla se desliza o qué pestaña se activa */}
      <Toolbar
        activeTab={activeView || "dashboard"}
        setActiveTab={(tab) => setActiveView(tab === "dashboard" ? null : tab)}
      />
    </div>
  );
}

export default App;
