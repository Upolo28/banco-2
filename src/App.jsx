import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./components/Dashboard";
import Toolbar from "./components/Toolbar";
import BottomSheet from "./components/BottomSheet";
import "./styles/global.css";
import "./styles/App.css";

const DB_KEY = "gb_users_v2";
const SES_KEY = "gb_session_v2";

const INIT_TXS = [
  {
    id: 1,
    icon: "🛒",
    name: "Martínez Hnos",
    sub: "Supermercado · 14:20",
    amount: -12500,
    cat: "Alimentación",
  },
  {
    id: 2,
    icon: "💸",
    name: "Juan Nguema",
    sub: "Transferencia · 10:05",
    amount: +25000,
    cat: "Ingresos",
  },
  {
    id: 3,
    icon: "⚡",
    name: "SEGESA",
    sub: "Electricidad · Ayer",
    amount: -18000,
    cat: "Servicios",
  },
  {
    id: 4,
    icon: "🍕",
    name: "Pizzería la Paz",
    sub: "Restaurante · 21:40",
    amount: -7500,
    cat: "Restaurantes",
  },
  {
    id: 5,
    icon: "📞",
    name: "GETESA",
    sub: "Internet · Lunes",
    amount: -5000,
    cat: "Servicios",
  },
  {
    id: 6,
    icon: "💰",
    name: "Empresa XYZ",
    sub: "Nómina · 01 Mar",
    amount: +120000,
    cat: "Ingresos",
  },
];

const INIT_INV = [
  {
    id: 1,
    icon: "⚡",
    desc: "SEGESA Marzo",
    amount: 18000,
    due: "2026-03-25",
    status: "pend",
    cat: "Electricidad",
  },
  {
    id: 2,
    icon: "📞",
    desc: "GETESA Internet",
    amount: 25000,
    due: "2026-03-10",
    status: "paid",
    cat: "Telecomunicaciones",
  },
  {
    id: 3,
    icon: "🏠",
    desc: "Alquiler Abril",
    amount: 150000,
    due: "2026-04-01",
    status: "pend",
    cat: "Alquiler",
  },
  {
    id: 4,
    icon: "💧",
    desc: "SNEC Agua",
    amount: 8500,
    due: "2026-03-08",
    status: "over",
    cat: "Agua",
  },
];

export default function App() {
  const [screen, setScreen] = useState("login");
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [openSheet, setOpenSheet] = useState(null);
  const [balance, setBalance] = useState(2710250);
  const [transactions, setTransactions] = useState(INIT_TXS);
  const [invoices, setInvoices] = useState(INIT_INV);

  // Restore session
  useEffect(() => {
    try {
      const ses = localStorage.getItem(SES_KEY);
      if (ses) {
        setUser(JSON.parse(ses));
        setScreen("app");
      }
    } catch {}
  }, []);

  const handleLogin = (email, pass) => {
    try {
      const db = JSON.parse(localStorage.getItem(DB_KEY) || "{}");
      if (!db[email]) {
        // Auto-create on first login (demo)
        const name = email
          .split("@")[0]
          .replace(/[._]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        db[email] = { name, email, pass };
        localStorage.setItem(DB_KEY, JSON.stringify(db));
      }
      const u = db[email];
      localStorage.setItem(SES_KEY, JSON.stringify(u));
      setUser(u);
      setScreen("app");
      return true;
    } catch {
      return false;
    }
  };

  const handleRegister = (data) => {
    try {
      const db = JSON.parse(localStorage.getItem(DB_KEY) || "{}");
      if (db[data.email]) return false; // already exists
      db[data.email] = data;
      localStorage.setItem(DB_KEY, JSON.stringify(db));
      localStorage.setItem(SES_KEY, JSON.stringify(data));
      setUser(data);
      setScreen("app");
      return true;
    } catch {
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(SES_KEY);
    setUser(null);
    setScreen("login");
    setActiveTab("dashboard");
    setOpenSheet(null);
  };

  const deduct = (amount) => {
    if (amount > balance) return false;
    setBalance((p) => p - amount);
    return true;
  };
  const credit = (amount) => setBalance((p) => p + amount);

  const addTx = (tx) =>
    setTransactions((p) => [{ id: Date.now(), ...tx }, ...p]);

  const payInvoice = (id) => {
    const inv = invoices.find((i) => i.id === id);
    if (!inv || inv.status === "paid") return false;
    if (!deduct(inv.amount)) return false;
    setInvoices((p) =>
      p.map((i) => (i.id === id ? { ...i, status: "paid" } : i))
    );
    addTx({
      icon: inv.icon,
      name: inv.desc,
      sub: "Factura · Ahora",
      amount: -inv.amount,
      cat: inv.cat,
    });
    return true;
  };

  const addInvoice = (inv) =>
    setInvoices((p) => [{ id: Date.now(), ...inv, status: "pend" }, ...p]);

  if (screen === "login")
    return (
      <Login
        onLogin={handleLogin}
        onGoToRegister={() => setScreen("register")}
      />
    );

  if (screen === "register")
    return (
      <Register
        onRegister={handleRegister}
        onGoToLogin={() => setScreen("login")}
      />
    );

  return (
    <div className="app-viewport">
      <main className="main-content">
        <Dashboard
          user={user}
          balance={balance}
          transactions={transactions}
          invoices={invoices}
          activeTab={activeTab}
          onOpenSheet={setOpenSheet}
          onPayInvoice={payInvoice}
          onAddInvoice={addInvoice}
        />
      </main>

      <Toolbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openSlider={setOpenSheet}
      />

      <BottomSheet
        open={openSheet}
        onClose={() => setOpenSheet(null)}
        user={user}
        balance={balance}
        transactions={transactions}
        invoices={invoices}
        onDeduct={deduct}
        onCredit={credit}
        onAddTx={addTx}
        onPayInvoice={payInvoice}
        onAddInvoice={addInvoice}
        onLogout={handleLogout}
      />
    </div>
  );
}
