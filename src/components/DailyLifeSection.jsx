import React, { useState } from "react";
import {
  ShoppingCart, Beef, Leaf, Fish,
  Pizza, Drumstick, Salad, Sandwich,
  Zap, Droplets, Phone, Package,
  Waves, Trees, Landmark, Theater,
  ChevronRight,
} from "lucide-react";

/* ─────────────────────────────────────────
   Revolut-style icon config per item id
───────────────────────────────────────── */
const ITEM_ICONS = {
  // Super
  s1: { icon: ShoppingCart, bg: "#E8F5EF", color: "#00875A" },
  s2: { icon: Beef,         bg: "#FFF0F0", color: "#EF4444" },
  s3: { icon: Leaf,         bg: "#E8F5EF", color: "#16A34A" },
  s4: { icon: Fish,         bg: "#EFF6FF", color: "#3B82F6" },
  // Restaurantes
  r1: { icon: Pizza,        bg: "#FFF0F0", color: "#EF4444" },
  r2: { icon: Drumstick,    bg: "#FFFBEA", color: "#F59E0B" },
  r3: { icon: Salad,        bg: "#E8F5EF", color: "#16A34A" },
  r4: { icon: Sandwich,     bg: "#FFF5EB", color: "#EA580C" },
  // Servicios
  u1: { icon: Zap,          bg: "#FFFBEA", color: "#F59E0B" },
  u2: { icon: Droplets,     bg: "#EFF6FF", color: "#3B82F6" },
  u3: { icon: Phone,        bg: "#EEEAFF", color: "#6D4AFF" },
  u4: { icon: Package,      bg: "#F4F6F9", color: "#64748B" },
  // Atracciones
  a1: { icon: Waves,        bg: "#EFF6FF", color: "#0891B2" },
  a2: { icon: Trees,        bg: "#E8F5EF", color: "#16A34A" },
  a3: { icon: Landmark,     bg: "#FFFBEA", color: "#F59E0B" },
  a4: { icon: Theater,      bg: "#EEEAFF", color: "#6D4AFF" },
};

export const DL_DATA = {
  super: [
    { id: "s1", name: "Supermercado Elobey", info: "Malabo II · Lunes a Sábado", price: 0,     delivery: false },
    { id: "s2", name: "Carnicería Central",  info: "Res, cerdo, pollo frescos",  price: 8500,  delivery: true  },
    { id: "s3", name: "Verduras del Campo",  info: "Productos locales",           price: 3500,  delivery: true  },
    { id: "s4", name: "Pescadería Litoral",  info: "Pesca del día · Bata",        price: 6000,  delivery: false },
  ],
  rest: [
    { id: "r1", name: "Pizzería La Paz",     info: "Italiana · Av. de la Lib.",   price: 7500,  delivery: true  },
    { id: "r2", name: "Pollo Asado Nguema",  info: "Tradicional · Malabo Centro", price: 5000,  delivery: true  },
    { id: "r3", name: "Green Salad Bar",     info: "Ensaladas y zumos naturales", price: 4500,  delivery: true  },
    { id: "r4", name: "Burger House GE",     info: "Hamburguesería · Ctra. Apto.",price: 6500,  delivery: true  },
  ],
  util: [
    { id: "u1", name: "SEGESA Electricidad", info: "Pago de factura de luz",      price: 18000, delivery: false },
    { id: "u2", name: "SNEC Agua",           info: "Pago de servicio de agua",    price: 8500,  delivery: false },
    { id: "u3", name: "GETESA Internet",     info: "Recarga de internet / móvil", price: 10000, delivery: false },
    { id: "u4", name: "GE Correos",          info: "Envío nacional de paquetes",  price: 3500,  delivery: false },
  ],
  attr: [
    { id: "a1", name: "Playa de Sipopo",     info: "Entrada + bungaló",           price: 15000, delivery: false },
    { id: "a2", name: "Bosque de Malabo",    info: "Guía ecológico local",        price: 8000,  delivery: false },
    { id: "a3", name: "Museo Histórico GE",  info: "Av. de la Independencia",     price: 5000,  delivery: false },
    { id: "a4", name: "Centro Cultural",     info: "Espectáculos y exposiciones", price: 6500,  delivery: false },
  ],
};

const TABS = [
  { id: "super", label: "Super",       icon: ShoppingCart, bg: "#E8F5EF", color: "#00875A" },
  { id: "rest",  label: "Restaurantes",icon: Pizza,        bg: "#FFF0F0", color: "#EF4444" },
  { id: "util",  label: "Servicios",   icon: Zap,          bg: "#FFFBEA", color: "#F59E0B" },
  { id: "attr",  label: "Atracciones", icon: Waves,        bg: "#EFF6FF", color: "#0891B2" },
];

export default function DailyLifeSection({ onOpenCheckout }) {
  const [tab, setTab] = useState("super");

  return (
    <section style={{ padding: "0 16px 8px" }}>
      {/* Section header */}
      <div className="sec-hdr" style={{ padding: "4px 0 12px" }}>
        <span className="sec-title">Vida Diaria</span>
      </div>

      {/* Revolut-style tab pills with icon bubbles */}
      <div style={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        scrollbarWidth: "none",
        marginBottom: 14,
        paddingBottom: 2,
      }}>
        {TABS.map((t) => {
          const Icon     = t.icon;
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "8px 14px 8px 10px",
                background: isActive ? t.bg : "#fff",
                border: `1.5px solid ${isActive ? t.color + "44" : "#E2EAF0"}`,
                borderRadius: 40,
                fontSize: 13,
                fontWeight: 600,
                color: isActive ? t.color : "#8096A7",
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "Roboto, sans-serif",
                flexShrink: 0,
                boxShadow: isActive ? `0 2px 10px ${t.color}22` : "none",
              }}
            >
              {/* mini icon bubble */}
              <div style={{
                width: 24, height: 24,
                borderRadius: 8,
                background: isActive ? t.color + "22" : "#F4F6F9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <Icon size={13} color={isActive ? t.color : "#8096A7"} strokeWidth={2} />
              </div>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {(DL_DATA[tab] || []).slice(0, 3).map((item) => {
          const cfg  = ITEM_ICONS[item.id] || { icon: ShoppingCart, bg: "#F4F6F9", color: "#8096A7" };
          const Icon = cfg.icon;
          return (
            <div
              key={item.id}
              onClick={() => onOpenCheckout(item, tab)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 16px",
                background: "#fff",
                border: "1.5px solid #EEF2F6",
                borderRadius: 16,
                cursor: "pointer",
                transition: "all 0.18s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = cfg.color + "66";
                e.currentTarget.style.boxShadow = `0 4px 16px ${cfg.color}18`;
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#EEF2F6";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Revolut icon bubble */}
              <div style={{
                width: 46, height: 46,
                borderRadius: 14,
                background: cfg.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <Icon size={21} color={cfg.color} strokeWidth={1.8} />
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#0D1B2A", fontFamily: "Roboto, sans-serif" }}>
                  {item.name}
                </div>
                <div style={{ fontSize: 12, color: "#8096A7", marginTop: 2, fontFamily: "Roboto, sans-serif" }}>
                  {item.info}
                </div>
              </div>

              {/* Price + arrow */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <span style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: item.price ? "#0D1B2A" : "#00875A",
                }}>
                  {item.price ? item.price.toLocaleString() + " XAF" : "Libre"}
                </span>
                <ChevronRight size={16} color="#C0CACC" strokeWidth={2} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
