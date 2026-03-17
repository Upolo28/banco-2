import React, { useState } from "react";
import {
  MapPin,
  Star,
  Clock,
  Truck,
  ChevronRight,
  ShoppingBag,
  Utensils,
  Zap,
  CheckCircle,
  CreditCard,
  ArrowLeft,
  Landmark,
} from "lucide-react";

// --- 1. BASE DE DATOS INTEGRADA ---
const DELIVERY_COMPANIES = [
  {
    id: "mx",
    name: "Malabo Express",
    fee: 1500,
    time: "15-25 min",
    icon: "🛵",
  },
  {
    id: "guineadiv",
    name: "Guinea Delivery",
    fee: 2000,
    time: "30-40 min",
    icon: "🚲",
  },
];

const DAILY_LIFE_DATA = {
  supermercados: [
    {
      id: "martinez",
      name: "Martínez Hnos",
      logo: "image_0329b9.png",
      info: "Malabo II",
      priceAvg: 12000,
    },
    {
      id: "egtc",
      name: "EGTC Guinea",
      logo: "image_032920.png",
      info: "Puerto de Malabo",
      priceAvg: 8500,
    },
    {
      id: "pegasos",
      name: "Pegasos Express",
      logo: "image_02d743.png",
      info: "Caracolas",
      priceAvg: 5000,
    },
  ],
  restaurantes: [
    {
      id: "paz",
      name: "Pizzería la Paz",
      icon: "🍕",
      info: "Malabo II",
      priceAvg: 7500,
      rate: 4.9,
    },
    {
      id: "veranda",
      name: "La Veranda",
      icon: "🍲",
      info: "Hotel Sipopo",
      priceAvg: 18000,
      rate: 4.7,
    },
  ],
  utilidades: [
    {
      id: "segesa",
      name: "SEGESA",
      icon: "⚡",
      info: "Electricidad",
      color: "#f1c40f",
    },
    {
      id: "getesa",
      name: "GETESA",
      icon: "📞",
      info: "Recargas/Datos",
      color: "#3498db",
    },
  ],
  atracciones: [
    {
      id: "parque",
      name: "Parque Nacional",
      icon: "🌳",
      info: "Carretera Aeropuerto",
      fee: 2000,
    },
    {
      id: "catedral",
      name: "Catedral Sta. Isabel",
      icon: "⛪",
      info: "Plaza Independencia",
      fee: 0,
    },
  ],
};

// --- 2. COMPONENTE INTEGRADO ---
export default function DailyLife({ balance, onPurchase }) {
  const [view, setView] = useState("categories"); // 'categories', 'checkout', 'success'
  const [activeTab, setActiveTab] = useState("super");
  const [selectedItem, setSelectedItem] = useState(null);
  const [deliveryType, setDeliveryType] = useState(DELIVERY_COMPANIES[0]);

  const handleProcessPayment = () => {
    const total =
      (selectedItem.priceAvg || selectedItem.fee || 0) +
      (activeTab !== "util" ? deliveryType.fee : 0);

    // Llamamos a la función de App.jsx para descontar saldo real
    const success = onPurchase(total, selectedItem.name);
    if (success) setView("success");
  };

  // --- VISTA 3: PANTALLA DE ÉXITO ---
  if (view === "success") {
    return (
      <div className="dl-success-screen animate-fade-in">
        <div className="success-icon-wrap">
          <CheckCircle size={60} color="#2ecc71" />
        </div>
        <h2>¡Pago Exitoso!</h2>
        <p>
          Tu orden de <strong>{selectedItem.name}</strong> ha sido procesada.
        </p>
        {activeTab !== "util" && (
          <div className="delivery-tracking-info">
            <Truck size={20} />
            <span>
              En camino con <strong>{deliveryType.name}</strong>
            </span>
          </div>
        )}
        <button className="btn-finish-dl" onClick={() => setView("categories")}>
          Volver al Ecosistema
        </button>
      </div>
    );
  }

  // --- VISTA 2: FORMULARIO DE CHECKOUT ---
  if (view === "checkout") {
    const subtotal = selectedItem.priceAvg || selectedItem.fee || 0;
    const total = subtotal + (activeTab !== "util" ? deliveryType.fee : 0);

    return (
      <div className="dl-checkout-container animate-slide-up">
        <button className="btn-back-dl" onClick={() => setView("categories")}>
          <ArrowLeft size={18} /> Volver
        </button>

        <div className="checkout-summary">
          <h3>Resumen del Pedido</h3>
          <div className="summary-row">
            <span>{selectedItem.name}</span>{" "}
            <span>{subtotal.toLocaleString()} XAF</span>
          </div>
          {activeTab !== "util" && (
            <div className="summary-row">
              <span>Entrega</span>{" "}
              <span>{deliveryType.fee.toLocaleString()} XAF</span>
            </div>
          )}
          <hr />
          <div className="summary-row total">
            <span>Total</span> <span>{total.toLocaleString()} XAF</span>
          </div>
        </div>

        {activeTab !== "util" && (
          <>
            <h4>Empresa de Mensajería</h4>
            <div className="delivery-selector">
              {DELIVERY_COMPANIES.map((co) => (
                <div
                  key={co.id}
                  className={`delivery-option-card ${
                    deliveryType.id === co.id ? "selected" : ""
                  }`}
                  onClick={() => setDeliveryType(co)}
                >
                  <span className="dl-emoji">{co.icon}</span>
                  <div className="dl-option-text">
                    <strong>{co.name}</strong>
                    <span>
                      {co.time} • {co.fee} XAF
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <button className="btn-confirm-payment" onClick={handleProcessPayment}>
          <CreditCard size={18} /> Pagar con Green Bank
        </button>
      </div>
    );
  }

  // --- VISTA 1: CATEGORÍAS Y LISTADOS ---
  return (
    <div className="daily-life-main">
      <div className="dl-nav-tabs">
        <button
          className={activeTab === "super" ? "active" : ""}
          onClick={() => setActiveTab("super")}
        >
          <ShoppingBag size={18} />
        </button>
        <button
          className={activeTab === "rest" ? "active" : ""}
          onClick={() => setActiveTab("rest")}
        >
          <Utensils size={18} />
        </button>
        <button
          className={activeTab === "attr" ? "active" : ""}
          onClick={() => setActiveTab("attr")}
        >
          <Landmark size={18} />
        </button>
        <button
          className={activeTab === "util" ? "active" : ""}
          onClick={() => setActiveTab("util")}
        >
          <Zap size={18} />
        </button>
      </div>

      <div className="dl-content-list">
        {activeTab === "super" &&
          DAILY_LIFE_DATA.supermercados.map((item) => (
            <div
              key={item.id}
              className="dl-item-row"
              onClick={() => {
                setSelectedItem(item);
                setView("checkout");
              }}
            >
              <div className="dl-img-box">
                <img src={item.logo} alt="" />
              </div>
              <div className="dl-info">
                <strong>{item.name}</strong>
                <span>{item.info}</span>
              </div>
              <ChevronRight size={16} color="#ccc" />
            </div>
          ))}

        {activeTab === "rest" &&
          DAILY_LIFE_DATA.restaurantes.map((item) => (
            <div
              key={item.id}
              className="dl-item-row"
              onClick={() => {
                setSelectedItem(item);
                setView("checkout");
              }}
            >
              <div className="dl-icon-box rest">{item.icon}</div>
              <div className="dl-info">
                <strong>{item.name}</strong>
                <span>
                  {item.info} • ★{item.rate}
                </span>
              </div>
              <ChevronRight size={16} color="#ccc" />
            </div>
          ))}

        {activeTab === "util" &&
          DAILY_LIFE_DATA.utilidades.map((item) => (
            <div key={item.id} className="dl-item-row">
              <div
                className="dl-icon-box util"
                style={{ background: item.color }}
              >
                {item.icon}
              </div>
              <div className="dl-info">
                <strong>{item.name}</strong>
                <span>{item.info}</span>
              </div>
              <button
                className="btn-pay-util"
                onClick={() => {
                  setSelectedItem(item);
                  setView("checkout");
                }}
              >
                Pagar
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
