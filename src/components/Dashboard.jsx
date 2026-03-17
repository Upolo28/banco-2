import React from "react";
import {
  Send, ArrowDown, ArrowUp, Building2,
  Bell, Search, ShoppingCart, Zap,
  UtensilsCrossed, Phone, Banknote, Droplets,
  Home, TrendingUp, ArrowDownLeft, ArrowUpRight,
} from "lucide-react";
import WalletTab from "./WalletTab";
import AnalyticsTab from "./AnalyticsTab";
import DailyLifeSection from "./DailyLifeSection";
import "../styles/Dashboard.css";

/* ─────────────────────────────────────────
   Revolut-style icon bubble
   Rounded square + soft pastel bg + icon
───────────────────────────────────────── */
function IconBubble({ icon: Icon, bg, color, size = 20 }) {
  return (
    <div style={{
      width: 46,
      height: 46,
      borderRadius: 14,
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}>
      <Icon size={size} color={color} strokeWidth={1.8} />
    </div>
  );
}

/* Category → icon + colors */
const ICON_MAP = {
  "🛒": { icon: ShoppingCart,  bg: "#E8F5EF", color: "#00875A" },
  "💸": { icon: ArrowDownLeft, bg: "#EEEAFF", color: "#6D4AFF" },
  "⚡": { icon: Zap,           bg: "#FFFBEA", color: "#F59E0B" },
  "🍕": { icon: UtensilsCrossed,bg:"#FFF0F0", color: "#EF4444" },
  "📞": { icon: Phone,         bg: "#EFF6FF", color: "#3B82F6" },
  "💰": { icon: Banknote,      bg: "#E8F5EF", color: "#00875A" },
  "↑":  { icon: ArrowUpRight,  bg: "#FFF0F0", color: "#EF4444" },
  "↓":  { icon: ArrowDownLeft, bg: "#E8F5EF", color: "#00875A" },
  "🏠": { icon: Home,          bg: "#FFFBEA", color: "#F59E0B" },
  "💧": { icon: Droplets,      bg: "#EFF6FF", color: "#3B82F6" },
};

function TxIconBubble({ icon }) {
  const cfg = ICON_MAP[icon] || { icon: Banknote, bg: "#F4F6F9", color: "#8096A7" };
  return <IconBubble icon={cfg.icon} bg={cfg.bg} color={cfg.color} />;
}

/* ── TxRow — exported for BottomSheet ── */
export function TxRow({ tx }) {
  const isPos = tx.amount > 0;
  return (
    <div className="tx-row">
      <TxIconBubble icon={tx.icon} />
      <div className="tx-info">
        <strong>{tx.name}</strong>
        <small>{tx.sub}</small>
      </div>
      <div className={`tx-amt ${isPos ? "pos" : "neg"}`}>
        {isPos ? "+" : ""}{tx.amount.toLocaleString()} XAF
      </div>
    </div>
  );
}

/* ── Quick action button ── */
const ACTIONS = [
  { icon: Send,     bg: "#EEEAFF", color: "#6D4AFF", label: "Enviar",    sheet: "send"     },
  { icon: ArrowUp,  bg: "#FFF0F0", color: "#EF4444", label: "Retirar",   sheet: "withdraw" },
  { icon: ArrowDown,bg: "#E8F5EF", color: "#00875A", label: "Ingresar",  sheet: "deposit"  },
  { icon: Building2,bg: "#FFFBEA", color: "#F59E0B", label: "Bancos GE", sheet: "banks"    },
];

function QuickAction({ icon: Icon, bg, color, label, onClick }) {
  return (
    <button className="nav-item" onClick={onClick}>
      <div style={{
        width: 52,
        height: 52,
        borderRadius: 18,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.15s, box-shadow 0.15s",
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.07)"; e.currentTarget.style.boxShadow = `0 6px 20px ${color}33`; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)";    e.currentTarget.style.boxShadow = "none"; }}
      >
        <Icon size={22} color={color} strokeWidth={1.8} />
      </div>
      <span>{label}</span>
    </button>
  );
}

/* ── Dashboard root ── */
export default function Dashboard({
  user, balance, transactions, invoices,
  activeTab, onOpenSheet, onPayInvoice, onAddInvoice,
}) {
  if (activeTab === "wallet")
    return (
      <WalletTab
        user={user} balance={balance} invoices={invoices}
        onPayInvoice={onPayInvoice} onAddInvoice={onAddInvoice}
        onOpenSheet={onOpenSheet}
      />
    );

  if (activeTab === "analytics")
    return <AnalyticsTab transactions={transactions} />;

  const name         = user?.name || "Usuario";
  const initials     = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const firstName    = name.split(" ")[0];
  const incomeTotal  = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const expenseTotal = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div className="dashboard-container">

      {/* Header */}
      <header className="dash-header">
        <div className="user-profile">
          <div className="avatar-wrapper">{initials}</div>
          <div className="user-greeting">
            <span className="user-greeting-text">Hola,</span>
            <span className="user-greeting-name">{firstName} 👋</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="icon-circle-btn" onClick={() => onOpenSheet("search")}>
            <Search size={18} />
          </button>
          <button className="icon-circle-btn" onClick={() => onOpenSheet("notifications")}>
            <Bell size={18} />
            <span className="notif-badge">3</span>
          </button>
        </div>
      </header>

      {/* Balance card */}
      <section className="balance-hero-section">
        <div className="balance-glass-card">
          <span className="label">Saldo Disponible</span>
          <h2 className="amount">
            {balance.toLocaleString()} <small>XAF</small>
          </h2>
          <div className="balance-card-sub">
            <div className="balance-sub-item">
              <small>Ingresos</small>
              <span>+{incomeTotal.toLocaleString()}</span>
            </div>
            <div className="balance-sub-item">
              <small>Gastos</small>
              <span>-{expenseTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="quick-actions-section">
        <div className="quick-actions-title">Acciones rápidas</div>
        <div className="quick-actions-grid">
          {ACTIONS.map(a => (
            <QuickAction key={a.sheet} {...a} onClick={() => onOpenSheet(a.sheet)} />
          ))}
        </div>
      </section>

      {/* Daily Life */}
      <DailyLifeSection
        balance={balance}
        onOpenCheckout={(item, tab) => onOpenSheet({ type: "checkout", item, tab })}
      />

      {/* Recent activity */}
      <section className="activity-container">
        <div className="sec-hdr" style={{ padding: "4px 0 10px" }}>
          <span className="sec-title">Actividad reciente</span>
          <span className="sec-link" onClick={() => onOpenSheet("analytics")}>Ver todo</span>
        </div>
        <div className="activity-feed">
          {transactions.slice(0, 5).map(tx => (
            <div key={tx.id} className="activity-item">
              <TxIconBubble icon={tx.icon} />
              <div className="activity-details">
                <strong>{tx.name}</strong>
                <span>{tx.sub}</span>
              </div>
              <div className={`activity-value ${tx.amount > 0 ? "status-positive" : "status-negative"}`}>
                {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString()} XAF
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
