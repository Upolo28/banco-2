import React, { useEffect, useRef, useState } from "react";
import {
  X, Send, ArrowUpCircle, PlusCircle, CreditCard,
  ArrowLeft, CheckCircle, Shield, Lock, FileText,
  LogOut, Bell, User, ChevronRight, Edit3, Leaf,
} from "lucide-react";
import { DL_DATA } from "./DailyLifeSection";
import { TxRow } from "./Dashboard";
import "../styles/Ventanillas.css";

const DELIVERY = [
  { id: "mx", name: "Malabo Express",  fee: 1500, time: "15-25 min", icon: "🛵" },
  { id: "gd", name: "Guinea Delivery", fee: 2000, time: "30-40 min", icon: "🚲" },
];

const BANKS = [
  { id: "bange", name: "BANGE",            full: "Banco Nacional de GE",  color: "#c0392b", icon: "B", branches: ["Malabo Central", "Bata Litoral", "Ebibeyin"] },
  { id: "ccei",  name: "CCEIBANK",         full: "CCEI Bank GE",          color: "#2c3e50", icon: "C", branches: ["Malabo II", "Bata", "Mongomo"] },
  { id: "sg",    name: "Société Générale", full: "SG Guinea Ecuatorial",  color: "#e31e24", icon: "S", branches: ["Ctra. Aeropuerto", "Bata Centro"] },
  { id: "eco",   name: "Ecobank",          full: "Ecobank GE",            color: "#0052a5", icon: "E", branches: ["Malabo II", "Bata Puerto"] },
];

function useToast() {
  const [msg, setMsg] = useState("");
  const timer = useRef(null);
  const show = (m) => {
    setMsg(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(""), 2800);
  };
  return { msg, show };
}

export default function BottomSheet({
  open, onClose, user, balance, transactions, invoices,
  onDeduct, onCredit, onAddTx, onPayInvoice, onAddInvoice, onLogout,
}) {
  const { msg, show } = useToast();

  useEffect(() => {
    const esc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);

  if (!open) return msg ? <Toast msg={msg} /> : null;
  const sheetType = typeof open === "string" ? open : open?.type;

  const SHEETS = {
    send:     <SendSheet     balance={balance} onDeduct={onDeduct} onAddTx={onAddTx} onClose={onClose} toast={show} />,
    withdraw: <WithdrawSheet balance={balance} onDeduct={onDeduct} onAddTx={onAddTx} onClose={onClose} toast={show} />,
    deposit:  <DepositSheet  onCredit={onCredit} onAddTx={onAddTx} onClose={onClose} toast={show} />,
    banks:    <BanksSheet    onClose={onClose} toast={show} />,
    daily:    <DailySheet    balance={balance} onDeduct={onDeduct} onAddTx={onAddTx} onClose={onClose} toast={show} />,
    checkout: <CheckoutSheet item={open?.item} balance={balance} onDeduct={onDeduct} onAddTx={onAddTx} onClose={onClose} toast={show} />,
    profile:  <ProfileSheet  user={user} onLogout={onLogout} onClose={onClose} />,
    notifications: <NotificationsSheet />,
    search:   <SearchSheet   transactions={transactions} />,
    analytics:<AnalyticsSheet transactions={transactions} />,
    "invoice-detail": <InvoiceDetailSheet inv={open?.inv} onPayInvoice={onPayInvoice} onClose={onClose} toast={show} />,
    "new-invoice":    <NewInvoiceSheet    onAddInvoice={onAddInvoice} onClose={onClose} toast={show} />,
  };

  const content = SHEETS[sheetType];
  if (!content) return null;

  return (
    <>
      <div className="overlay open" onClick={onClose}>
        <div className="sheet" onClick={(e) => e.stopPropagation()}>
          <div className="sh-handle" />
          <button className="sh-close" onClick={onClose}><X size={14} /></button>
          {content}
        </div>
      </div>
      {msg && <Toast msg={msg} />}
    </>
  );
}

function Toast({ msg }) {
  return <div className="toast-snack">{msg}</div>;
}

function QuickPills({ values, onSelect }) {
  const [active, setActive] = useState(null);
  return (
    <div className="qpills">
      {values.map((v) => (
        <div key={v} className={`qpill ${active === v ? "active" : ""}`}
          onClick={() => { setActive(v); onSelect(v); }}>
          {v.toLocaleString()} XAF
        </div>
      ))}
    </div>
  );
}

function TogglePills({ options }) {
  const [active, setActive] = useState(options[0]);
  return (
    <div className="toggle-pills">
      {options.map((o) => (
        <div key={o} className={`toggle-pill ${active === o ? "active" : ""}`}
          onClick={() => setActive(o)}>{o}</div>
      ))}
    </div>
  );
}

/* ── SEND ──────────────────────────────────────────────── */
function SendSheet({ balance, onDeduct, onAddTx, onClose, toast }) {
  const [name, setName] = useState("");
  const [to,   setTo]   = useState("");
  const [amt,  setAmt]  = useState("");

  const confirm = () => {
    if (!name.trim() || !to.trim()) { toast("⚠ Completa destinatario y cuenta"); return; }
    const a = Number(amt);
    if (!a || a <= 0)  { toast("⚠ Ingresa un monto válido"); return; }
    if (a > balance)   { toast("⚠ Saldo insuficiente"); return; }
    onDeduct(a);
    onAddTx({ icon: "↑", name: "Envío a " + name, sub: "Transferencia · Ahora", amount: -a, cat: "Transferencias" });
    onClose();
    toast("✓ Enviados " + a.toLocaleString() + " XAF a " + name);
  };

  return (
    <>
      <div className="sh-title">Enviar Dinero</div>
      <div className="sf">
        <div className="sif">
          <label>Destinatario</label>
          <input type="text" placeholder="Nombre completo" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="sif">
          <label>Cuenta / Teléfono</label>
          <input type="text" placeholder="+240 222 ..." value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div className="sif">
          <label>Monto (XAF)</label>
          <input type="number" className="big" placeholder="0" value={amt} onChange={(e) => setAmt(e.target.value)} />
        </div>
        <QuickPills values={[5000, 10000, 25000, 50000]} onSelect={(v) => setAmt(String(v))} />
        <button className="btn-sh" onClick={confirm}><Send size={16} /> Confirmar Envío</button>
      </div>
    </>
  );
}

/* ── WITHDRAW ──────────────────────────────────────────── */
function WithdrawSheet({ balance, onDeduct, onAddTx, onClose, toast }) {
  const [amt,  setAmt]  = useState("");
  const [code, setCode] = useState(null);

  const generate = () => {
    const a = Number(amt);
    if (!a || a <= 0) { toast("⚠ Ingresa un monto"); return; }
    if (a > balance)  { toast("⚠ Saldo insuficiente"); return; }
    setCode(Math.floor(100000 + Math.random() * 900000));
  };

  const confirm = () => {
    onDeduct(Number(amt));
    onAddTx({ icon: "↑", name: "Retiro en efectivo", sub: "Cajero/Agente · Ahora", amount: -Number(amt), cat: "Retiros" });
    onClose();
    toast("✓ Retiro de " + Number(amt).toLocaleString() + " XAF confirmado");
  };

  if (code) return (
    <>
      <div className="sh-title">Código de Retiro</div>
      <div className="otp-box">
        <div className="otp-code">{code}</div>
        <div className="otp-label">Muestra este código en el punto de retiro</div>
        <div className="otp-timer">⏱ Válido por 10 minutos</div>
      </div>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <span style={{ fontFamily: "Poppins", fontSize: 20, fontWeight: 800, color: "#0D1B2A" }}>
          {Number(amt).toLocaleString()} XAF
        </span>
      </div>
      <button className="btn-sh" onClick={confirm}><CheckCircle size={16} /> Confirmar Retiro</button>
    </>
  );

  return (
    <>
      <div className="sh-title">Retirar Fondos</div>
      <div className="sf">
        <div className="balance-pill" onClick={() => setAmt(String(balance))}>
          <div>
            <div className="balance-pill-label">Saldo disponible</div>
            <div className="balance-pill-amount">{balance.toLocaleString()} XAF</div>
          </div>
          <div className="balance-pill-hint">Toca para retirar todo →</div>
        </div>
        <div className="sif">
          <label>Monto a retirar (XAF)</label>
          <input type="number" className="big" placeholder="0" value={amt} onChange={(e) => setAmt(e.target.value)} />
        </div>
        <QuickPills values={[10000, 50000, 100000]} onSelect={(v) => setAmt(String(v))} />
        <div className="sif">
          <label>Método de retiro</label>
          <select>
            <option>Cajero Automático (OTP)</option>
            <option>Punto Agente Autorizado</option>
          </select>
        </div>
        <button className="btn-sh danger" onClick={generate}><ArrowUpCircle size={16} /> Generar Código OTP</button>
      </div>
    </>
  );
}

/* ── DEPOSIT ────────────────────────────────────────────── */
function DepositSheet({ onCredit, onAddTx, onClose, toast }) {
  const [amt, setAmt] = useState("");

  const confirm = () => {
    const a = Number(amt);
    if (!a || a <= 0) { toast("⚠ Ingresa un monto válido"); return; }
    onCredit(a);
    onAddTx({ icon: "↓", name: "Depósito recibido", sub: "Ingreso · Ahora", amount: +a, cat: "Ingresos" });
    onClose();
    toast("✓ Depósito de " + a.toLocaleString() + " XAF exitoso");
  };

  return (
    <>
      <div className="sh-title">Ingresar Dinero</div>
      <div className="sf">
        <div className="sif">
          <label>Fuente de ingreso</label>
          <TogglePills options={["Tarjeta", "Ahorro", "Transferencia"]} />
        </div>
        <div className="sif">
          <label>Monto (XAF)</label>
          <input type="number" className="big" placeholder="0" value={amt} onChange={(e) => setAmt(e.target.value)} />
        </div>
        <QuickPills values={[10000, 50000, 100000]} onSelect={(v) => setAmt(String(v))} />
        <button className="btn-sh" onClick={confirm}><PlusCircle size={16} /> Proceder al Depósito</button>
      </div>
    </>
  );
}

/* ── BANKS ──────────────────────────────────────────────── */
function BanksSheet({ onClose, toast }) {
  const [detail,  setDetail]  = useState(null);
  const [tramite, setTramite] = useState("");

  if (detail) return (
    <>
      <button className="back-btn" onClick={() => { setDetail(null); setTramite(""); }}>
        <ArrowLeft size={13} /> Volver
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, padding: "16px", background: "#F4F6F9", borderRadius: 18 }}>
        <div className="bank-lgo" style={{ background: detail.color, width: 54, height: 54, borderRadius: 16, fontSize: 22 }}>
          {detail.icon}
        </div>
        <div>
          <div style={{ fontFamily: "Poppins", fontSize: 18, fontWeight: 700, color: "#0D1B2A" }}>{detail.name}</div>
          <div style={{ fontSize: 13, color: "#8096A7" }}>{detail.full}</div>
        </div>
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#8096A7", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>
        Sucursales
      </div>
      <div className="branch-chips">
        {detail.branches.map((b) => <div key={b} className="branch-chip">{b}</div>)}
      </div>
      <div className="sf" style={{ marginTop: 20 }}>
        <div className="sif">
          <label>Tipo de trámite</label>
          <input type="text" placeholder="Ej: Solicitud de crédito" value={tramite} onChange={(e) => setTramite(e.target.value)} />
        </div>
        <button className="btn-sh" style={{ background: detail.color, boxShadow: `0 4px 20px ${detail.color}55` }}
          onClick={() => { toast("✓ Solicitud enviada a " + detail.name); onClose(); }}>
          Enviar Solicitud
        </button>
      </div>
    </>
  );

  return (
    <>
      <div className="sh-title">Bancos en GE</div>
      <div className="bank-list">
        {BANKS.map((b) => (
          <div key={b.id} className="bank-row" onClick={() => setDetail(b)}>
            <div className="bank-lgo" style={{ background: b.color }}>{b.icon}</div>
            <div className="bank-inf">
              <strong>{b.name}</strong>
              <small>{b.full}</small>
            </div>
            <ChevronRight size={18} style={{ color: "#B0C0CC" }} />
          </div>
        ))}
      </div>
    </>
  );
}

/* ── DAILY FULL PANEL ───────────────────────────────────── */
function DailySheet({ balance, onDeduct, onAddTx, onClose, toast }) {
  const [tab,      setTab]      = useState("super");
  const [checkout, setCheckout] = useState(null);

  if (checkout) return (
    <CheckoutSheet item={checkout.item} balance={balance}
      onDeduct={onDeduct} onAddTx={onAddTx} onClose={onClose} toast={toast}
      onBack={() => setCheckout(null)} />
  );

  const TABS = [
    { id: "super", label: "🛒 Super" },
    { id: "rest",  label: "🍕 Restaurantes" },
    { id: "util",  label: "⚡ Servicios" },
    { id: "attr",  label: "🌍 Atracciones" },
  ];

  return (
    <>
      <div className="sh-title">Vida Diaria</div>
      <div className="dl-full-tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`dl-tab ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>
      {(DL_DATA[tab] || []).map((item) => (
        <div key={item.id} className="dl-row" onClick={() => setCheckout({ item })}>
          <div className="dl-em">{item.icon}</div>
          <div className="dl-info">
            <strong>{item.name}</strong>
            <small>{item.info}</small>
          </div>
          <div className="dl-price">{item.price ? item.price.toLocaleString() + " XAF" : "Libre"}</div>
        </div>
      ))}
    </>
  );
}

/* ── CHECKOUT ───────────────────────────────────────────── */
function CheckoutSheet({ item, balance, onDeduct, onAddTx, onClose, toast, onBack }) {
  const [delivery, setDelivery] = useState(DELIVERY[0]);
  const [success,  setSuccess]  = useState(false);

  if (!item) return null;
  const subtotal = item.price || 0;
  const total    = subtotal + (item.delivery ? delivery.fee : 0);

  const pay = () => {
    if (total > balance) { toast("⚠ Saldo insuficiente"); return; }
    onDeduct(total);
    onAddTx({ icon: item.icon, name: item.name, sub: (item.delivery ? "Entrega " + delivery.name : item.info) + " · Ahora", amount: -total, cat: "Compras" });
    setSuccess(true);
  };

  if (success) return (
    <div className="success-view">
      <div className="success-ring"><CheckCircle size={40} color="#00875A" /></div>
      <h3>¡Pago Exitoso!</h3>
      <p>Tu pedido de <strong style={{ color: "#0D1B2A" }}>{item.name}</strong> fue procesado correctamente.</p>
      {item.delivery && <p style={{ color: "#00875A", fontWeight: 600 }}>🛵 En camino con {delivery.name}</p>}
      <button className="btn-sh" style={{ marginTop: 16, width: "auto", padding: "14px 36px" }} onClick={onClose}>
        ¡Perfecto!
      </button>
    </div>
  );

  return (
    <>
      {onBack && <button className="back-btn" onClick={onBack}><ArrowLeft size={13} /> Volver</button>}
      <div className="sh-title">Confirmar Pedido</div>
      <div className="ck-sum">
        <div className="ck-row"><span>{item.name}</span><span>{subtotal ? subtotal.toLocaleString() + " XAF" : "Gratis"}</span></div>
        {item.delivery && <div className="ck-row"><span>Entrega ({delivery.name})</span><span>{delivery.fee.toLocaleString()} XAF</span></div>}
        <div className="ck-row"><span>Total</span><span>{total.toLocaleString()} XAF</span></div>
      </div>
      {item.delivery && (
        <>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#8096A7", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>
            Elige mensajería
          </div>
          <div className="del-opts" style={{ marginBottom: 20 }}>
            {DELIVERY.map((d) => (
              <div key={d.id} className={`del-opt ${delivery.id === d.id ? "active" : ""}`} onClick={() => setDelivery(d)}>
                <span className="del-emoji">{d.icon}</span>
                <div>
                  <strong>{d.name}</strong>
                  <small>{d.time} · {d.fee.toLocaleString()} XAF</small>
                </div>
                {delivery.id === d.id && <CheckCircle size={18} color="#00875A" style={{ marginLeft: "auto" }} />}
              </div>
            ))}
          </div>
        </>
      )}
      <button className="btn-sh" onClick={pay}><CreditCard size={16} /> Pagar con Green Bank</button>
    </>
  );
}

/* ── PROFILE ────────────────────────────────────────────── */
function ProfileSheet({ user, onLogout, onClose }) {
  const name     = user?.name  || "Usuario GreenBank";
  const email    = user?.email || "usuario@greenbank.gq";
  const phone    = user?.phone || "+240 222 000 000";
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const handle   = "@" + name.toLowerCase().replace(/\s+/g, "_") + "_ge";

  const rows = [
    {
      section: "Cuenta",
      items: [
        { icon: <User size={16} />, bg: "#E8F5EF", color: "#00875A", label: email },
        { icon: <Bell size={16} />, bg: "#EEF2FF", color: "#4F46E5", label: phone },
      ],
    },
    {
      section: "Seguridad",
      items: [
        { icon: <Shield size={16} />, bg: "#FFF8E1", color: "#D97706", label: "Centro de Privacidad" },
        { icon: <Lock   size={16} />, bg: "#FFF0F0", color: "#E53E3E", label: "Cambiar PIN / Contraseña" },
      ],
    },
    {
      section: "Preferencias",
      items: [
        { icon: <Edit3    size={16} />, bg: "#F0F4FF", color: "#2563EB", label: "Editar perfil" },
        { icon: <FileText size={16} />, bg: "#F4F6F9", color: "#8096A7", label: "Términos y condiciones" },
      ],
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="prof-header">
        <div className="prof-av">{initials}</div>
        <div className="prof-name">{name}</div>
        <div className="prof-handle">{handle}</div>
        <div className="prof-badge">
          <Leaf size={12} />
          Cuenta Eco Verde
        </div>
      </div>

      <div className="prof-secs">
        {rows.map((sec) => (
          <div key={sec.section}>
            <div className="prof-section-title">{sec.section}</div>
            {sec.items.map((item) => (
              <button key={item.label} className="s-row">
                <div className="s-row-icon" style={{ background: item.bg, color: item.color }}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
                <ChevronRight size={16} className="s-row-arrow" />
              </button>
            ))}
          </div>
        ))}

        <button className="btn-logout" onClick={() => { onClose(); onLogout(); }}>
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>
    </>
  );
}

/* ── NOTIFICATIONS ──────────────────────────────────────── */
const NOTIFS = [
  { id: 1, bg: "#E8F5EF", color: "#00875A", icon: "✓",  title: "Pago Recibido",      msg: "Has recibido 25,000 XAF de Juan Nguema.",                time: "Hace 5 min" },
  { id: 2, bg: "#EEF2FF", color: "#4F46E5", icon: "📊", title: "Resumen Semanal",    msg: "Tu historial de Marzo ya está disponible.",              time: "Hoy, 09:00" },
  { id: 3, bg: "#FFF8E1", color: "#D97706", icon: "✉",  title: "Soporte Green Bank", msg: "Tu tarjeta ECO virtual está activa y lista para usar.", time: "Ayer" },
  { id: 4, bg: "#FFF0F0", color: "#E53E3E", icon: "⚠",  title: "Factura vencida",    msg: "La factura de SNEC Agua venció el 08 de Marzo.",         time: "Hace 2 días" },
];

function NotificationsSheet() {
  return (
    <>
      <div className="sh-title">Notificaciones</div>
      <div className="notif-list">
        {NOTIFS.map((n) => (
          <div key={n.id} className="notif-item">
            <div className="notif-ic" style={{ background: n.bg, color: n.color }}>{n.icon}</div>
            <div className="notif-body">
              <strong>{n.title}</strong>
              <p>{n.msg}</p>
              <time>{n.time}</time>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ── SEARCH ─────────────────────────────────────────────── */
function SearchSheet({ transactions }) {
  const [q, setQ] = useState("");
  const results = q.trim()
    ? transactions.filter((t) =>
        t.name.toLowerCase().includes(q.toLowerCase()) ||
        t.sub.toLowerCase().includes(q.toLowerCase()) ||
        t.cat.toLowerCase().includes(q.toLowerCase())
      )
    : [];

  return (
    <>
      <div className="sh-title">Buscar</div>
      <div className="search-input-w">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input type="text" placeholder="Buscar transacciones, categorías..." value={q}
          onChange={(e) => setQ(e.target.value)} autoFocus />
      </div>
      <div className="search-results">
        {q && results.length === 0 && (
          <div className="empty">
            <span style={{ fontSize: 32 }}>🔍</span>
            <span>Sin resultados para "{q}"</span>
          </div>
        )}
        {results.map((tx) => <TxRow key={tx.id} tx={tx} />)}
      </div>
    </>
  );
}

/* ── ANALYTICS SHEET ────────────────────────────────────── */
function AnalyticsSheet({ transactions }) {
  return (
    <>
      <div className="sh-title">Historial completo</div>
      <div className="activity">
        {transactions.map((tx) => <TxRow key={tx.id} tx={tx} />)}
      </div>
    </>
  );
}

/* ── INVOICE DETAIL ─────────────────────────────────────── */
function InvoiceDetailSheet({ inv, onPayInvoice, onClose, toast }) {
  if (!inv) return null;

  const pay = () => {
    const ok = onPayInvoice(inv.id);
    if (!ok) { toast("⚠ Saldo insuficiente"); return; }
    onClose();
    toast("✓ Factura pagada: " + inv.amount.toLocaleString() + " XAF");
  };

  return (
    <>
      <div className="sh-title">Detalle de Factura</div>
      <div className="inv-detail-hdr">
        <div className="inv-detail-ic" style={{
          background: inv.status === "paid" ? "#E8F5EF" : inv.status === "over" ? "#FFF0F0" : "#FFF8E1"
        }}>
          {inv.icon}
        </div>
        <div>
          <div style={{ fontFamily: "Poppins", fontSize: 17, fontWeight: 700, color: "#0D1B2A" }}>{inv.desc}</div>
          <span className={`inv-status ${inv.status}`} style={{ marginTop: 6, display: "inline-block" }}>
            {inv.status === "paid" ? "Pagado" : inv.status === "pend" ? "Pendiente" : "Vencido"}
          </span>
        </div>
      </div>
      {[["Categoría", inv.cat], ["Monto", inv.amount.toLocaleString() + " XAF"], ["Vencimiento", inv.due]].map(([k, v]) => (
        <div key={k} className="inv-dr"><span>{k}</span><span>{v}</span></div>
      ))}
      {inv.status !== "paid" ? (
        <button className="btn-sh" style={{ marginTop: 24 }} onClick={pay}>
          <CreditCard size={16} /> Pagar — {inv.amount.toLocaleString()} XAF
        </button>
      ) : (
        <div style={{ textAlign: "center", padding: 20, color: "#00875A", fontWeight: 700, fontSize: 14 }}>
          ✓ Esta factura ya está pagada
        </div>
      )}
    </>
  );
}

/* ── NEW INVOICE ────────────────────────────────────────── */
const INV_CATS = [
  { value: "⚡", label: "⚡ Electricidad" },
  { value: "💧", label: "💧 Agua" },
  { value: "📞", label: "📞 Telecomunicaciones" },
  { value: "🏠", label: "🏠 Alquiler" },
  { value: "🛒", label: "🛒 Alimentación" },
  { value: "📋", label: "📋 Otro" },
];

function NewInvoiceSheet({ onAddInvoice, onClose, toast }) {
  const [desc, setDesc] = useState("");
  const [amt,  setAmt]  = useState("");
  const [due,  setDue]  = useState("");
  const [cat,  setCat]  = useState("⚡");

  const save = () => {
    if (!desc.trim() || !amt || !due) { toast("⚠ Completa todos los campos"); return; }
    const catLabel = INV_CATS.find((c) => c.value === cat)?.label.replace(/^.\s/, "") || "Otro";
    onAddInvoice({ icon: cat, desc, amount: Number(amt), due, cat: catLabel });
    onClose();
    toast("✓ Factura guardada correctamente");
  };

  return (
    <>
      <div className="sh-title">Nueva Factura</div>
      <div className="sf">
        <div className="sif">
          <label>Descripción</label>
          <input type="text" placeholder="Ej: SEGESA Marzo" value={desc} onChange={(e) => setDesc(e.target.value)} />
        </div>
        <div className="sif">
          <label>Monto (XAF)</label>
          <input type="number" className="big" placeholder="0" value={amt} onChange={(e) => setAmt(e.target.value)} />
        </div>
        <div className="sif">
          <label>Fecha de vencimiento</label>
          <input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
        </div>
        <div className="sif">
          <label>Categoría</label>
          <select value={cat} onChange={(e) => setCat(e.target.value)}>
            {INV_CATS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <button className="btn-sh" onClick={save}>Guardar Factura</button>
      </div>
    </>
  );
}
