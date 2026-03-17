import React from "react";
import {
  TrendingUp, TrendingDown, Wallet, AlertCircle,
  CreditCard, Plus,
} from "lucide-react";
import "../styles/Ventanillas.css";

const STAT_CFG = [
  { key: "saldo",    label: "Saldo",     icon: Wallet,       bg: "#E8F5EF", color: "#00875A" },
  { key: "ingresos", label: "Ingresos",  icon: TrendingUp,   bg: "#E8F5EF", color: "#00875A" },
  { key: "gastos",   label: "Gastos",    icon: TrendingDown, bg: "#FFF0F0", color: "#EF4444" },
  { key: "pendiente",label: "Pendiente", icon: AlertCircle,  bg: "#FFFBEA", color: "#F59E0B" },
];

export default function WalletTab({ user, balance, invoices, onOpenSheet }) {
  const STATUS_LABEL = { paid: "Pagado", pend: "Pendiente", over: "Vencido" };

  const pendingTotal = invoices
    .filter(i => i.status !== "paid")
    .reduce((s, i) => s + i.amount, 0);

  const stats = {
    saldo:     balance.toLocaleString(),
    ingresos: "+145,000",
    gastos:   "-43,000",
    pendiente: pendingTotal.toLocaleString(),
  };

  return (
    <div style={{ background: "#F4F6F9", minHeight: "100%" }}>

      {/* Header */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #EEF2F6",
        padding: "20px 20px 16px",
      }}>
        <div style={{ fontFamily: "Poppins, sans-serif", fontSize: 20, fontWeight: 800, color: "#0D1B2A", marginBottom: 2 }}>
          Mi Cartera
        </div>
        <div style={{ fontSize: 13, color: "#8096A7" }}>Marzo 2026</div>
      </div>

      {/* Stats — Revolut icon bubbles */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 10,
        padding: "16px 16px 8px",
      }}>
        {STAT_CFG.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.key} style={{
              background: "#fff",
              border: "1.5px solid #EEF2F6",
              borderRadius: 16,
              padding: "14px 10px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}>
              {/* bubble */}
              <div style={{
                width: 36, height: 36,
                borderRadius: 11,
                background: s.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={17} color={s.color} strokeWidth={2} />
              </div>
              <div style={{ fontSize: 10, color: "#8096A7", textTransform: "uppercase", letterSpacing: ".5px", fontWeight: 600 }}>
                {s.label}
              </div>
              <div style={{ fontFamily: "Poppins,sans-serif", fontSize: 12, fontWeight: 700, color: s.color, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%" }}>
                {stats[s.key]}
              </div>
            </div>
          );
        })}
      </div>

      {/* Virtual card */}
      <div className="card-vis">
        <div className="card-lbl">Tarjeta Virtual ECO</div>
        <div className="card-num-disp">•••• •••• •••• 4821</div>
        <div className="card-bot">
          <div className="card-field">
            <small>Titular</small>
            <span>{user?.name?.toUpperCase().substring(0, 18) || "USUARIO GREEN"}</span>
          </div>
          <div className="card-field">
            <small>Expira</small>
            <span>12/28</span>
          </div>
          <div className="card-brand">Green<span style={{ color: "#fff" }}>Bank</span></div>
        </div>
      </div>

      {/* Invoices */}
      <div className="sec-hdr" style={{ padding: "8px 16px 10px" }}>
        <span className="sec-title">Facturas</span>
        <span className="sec-link" style={{ display: "flex", alignItems: "center", gap: 4 }}
          onClick={() => onOpenSheet("new-invoice")}>
          <Plus size={14} /> Nueva
        </span>
      </div>

      <div className="inv-list">
        {invoices.length === 0 && (
          <div style={{ textAlign: "center", padding: 28, color: "#8096A7", fontSize: 13 }}>
            No hay facturas registradas
          </div>
        )}
        {invoices.map(inv => (
          <div key={inv.id} className="inv-card"
            onClick={() => onOpenSheet({ type: "invoice-detail", inv })}>
            <div className="inv-ic" style={{
              background: inv.status === "paid" ? "#E8F5EF" : inv.status === "over" ? "#FFF0F0" : "#FFFBEA",
            }}>
              {/* Revolut-style icon inside bubble */}
              {inv.status === "paid"
                ? <CreditCard size={20} color="#00875A" strokeWidth={1.8} />
                : inv.status === "over"
                ? <AlertCircle size={20} color="#EF4444" strokeWidth={1.8} />
                : <AlertCircle size={20} color="#F59E0B" strokeWidth={1.8} />
              }
            </div>
            <div className="inv-body">
              <strong>{inv.desc}</strong>
              <small>{inv.cat} · Vence {inv.due}</small>
            </div>
            <div className="inv-right">
              <span className={`inv-amt ${inv.status === "paid" ? "pos" : "neg"}`}>
                {inv.amount.toLocaleString()} XAF
              </span>
              <span className={`inv-status ${inv.status}`}>
                {STATUS_LABEL[inv.status]}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 24 }} />
    </div>
  );
}
