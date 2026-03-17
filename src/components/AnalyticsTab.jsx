import React, { useState } from "react";
import { TxRow } from "./Dashboard";
import "../styles/Ventanillas.css";

const MONTHS = ["Ene", "Feb", "Mar", "Abr"];
const MONTH_DATA = {
  Ene: { inc: 120000, exp: 34000 },
  Feb: { inc: 95000, exp: 41000 },
  Mar: { inc: 145000, exp: 43000 },
  Abr: { inc: 0, exp: 0 },
};

export default function AnalyticsTab({ transactions }) {
  const [selectedMonth, setSelectedMonth] = useState("Mar");

  const incomeTotal = transactions
    .filter((t) => t.amount > 0)
    .reduce((s, t) => s + t.amount, 0);
  const expenseTotal = transactions
    .filter((t) => t.amount < 0)
    .reduce((s, t) => s + Math.abs(t.amount), 0);
  const savingsPct =
    incomeTotal > 0
      ? Math.round(((incomeTotal - expenseTotal) / incomeTotal) * 100)
      : 0;

  // Category breakdown from transactions
  const catMap = {};
  transactions
    .filter((t) => t.amount < 0)
    .forEach((t) => {
      catMap[t.cat] = (catMap[t.cat] || 0) + Math.abs(t.amount);
    });
  const cats = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  const maxCat = cats[0]?.[1] || 1;

  const BAR_COLORS = [
    "var(--green)",
    "var(--blue)",
    "var(--amber)",
    "var(--purple)",
    "var(--teal, #0891b2)",
  ];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100%" }}>
      {/* Header */}
      <div
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          padding: "20px 20px 16px",
        }}
      >
        <div
          style={{
            fontFamily: "var(--display)",
            fontSize: 20,
            fontWeight: 800,
            color: "var(--text)",
            marginBottom: 2,
          }}
        >
          Análisis
        </div>
        <div style={{ fontSize: 13, color: "var(--text3)" }}>
          Resumen financiero 2026
        </div>
      </div>

      {/* Month selector */}
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "16px 16px 8px",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {MONTHS.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMonth(m)}
            style={{
              padding: "8px 18px",
              background:
                selectedMonth === m ? "var(--green)" : "var(--surface)",
              border: `1.5px solid ${
                selectedMonth === m ? "var(--green)" : "var(--border)"
              }`,
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 700,
              color: selectedMonth === m ? "#fff" : "var(--text2)",
              cursor: "pointer",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
              fontFamily: "var(--display)",
              boxShadow:
                selectedMonth === m ? "0 4px 12px rgba(0,135,90,0.20)" : "none",
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="an-cards">
        {[
          {
            label: "Ingresos",
            val: "+" + (MONTH_DATA[selectedMonth].inc / 1000).toFixed(0) + "K",
            cls: "pos",
          },
          {
            label: "Gastos",
            val: "-" + (MONTH_DATA[selectedMonth].exp / 1000).toFixed(0) + "K",
            cls: "neg",
          },
          { label: "Ahorro", val: savingsPct + "%", color: "var(--amber)" },
          { label: "Transacciones", val: String(transactions.length), cls: "" },
        ].map((c) => (
          <div key={c.label} className="an-card">
            <div className="an-lbl">{c.label}</div>
            <div
              className={`an-val ${c.cls || ""}`}
              style={c.color ? { color: c.color } : {}}
            >
              {c.val}
            </div>
          </div>
        ))}
      </div>

      {/* Monthly bar chart */}
      <div style={{ padding: "0 16px 20px" }}>
        <div className="sec-hdr" style={{ padding: "0 0 12px" }}>
          <span className="sec-title">Ingresos vs Gastos</span>
        </div>
        <div
          style={{
            background: "var(--surface)",
            border: "1.5px solid var(--border)",
            borderRadius: 16,
            padding: "16px 12px",
            display: "flex",
            gap: 8,
            alignItems: "flex-end",
            height: 120,
          }}
        >
          {MONTHS.map((m) => {
            const d = MONTH_DATA[m];
            const maxVal = 145000;
            const incH = Math.round((d.inc / maxVal) * 80);
            const expH = Math.round((d.exp / maxVal) * 80);
            return (
              <div
                key={m}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 3,
                    alignItems: "flex-end",
                    height: 80,
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: incH || 4,
                      background:
                        selectedMonth === m
                          ? "var(--green)"
                          : "rgba(0,135,90,0.3)",
                      borderRadius: "4px 4px 0 0",
                      minWidth: 10,
                      transition: "all 0.4s ease",
                    }}
                  />
                  <div
                    style={{
                      width: "100%",
                      height: expH || 4,
                      background:
                        selectedMonth === m
                          ? "var(--red)"
                          : "rgba(229,62,62,0.25)",
                      borderRadius: "4px 4px 0 0",
                      minWidth: 10,
                      transition: "all 0.4s ease",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 10,
                    color:
                      selectedMonth === m ? "var(--green)" : "var(--text3)",
                    fontWeight: 700,
                  }}
                >
                  {m}
                </span>
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 8,
            justifyContent: "center",
          }}
        >
          {[
            { color: "var(--green)", label: "Ingresos" },
            { color: "var(--red)", label: "Gastos" },
          ].map((l) => (
            <div
              key={l.label}
              style={{ display: "flex", alignItems: "center", gap: 5 }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: l.color,
                }}
              />
              <span
                style={{ fontSize: 11, color: "var(--text3)", fontWeight: 500 }}
              >
                {l.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      {cats.length > 0 && (
        <div style={{ padding: "0 16px 20px" }}>
          <div className="sec-hdr" style={{ padding: "0 0 12px" }}>
            <span className="sec-title">Gastos por categoría</span>
          </div>
          <div className="bars">
            {cats.map(([cat, val], i) => (
              <div key={cat} className="bar-row">
                <div
                  className="bar-lbl"
                  style={{ width: 60, textAlign: "left", fontSize: 11 }}
                >
                  {cat}
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: Math.round((val / maxCat) * 100) + "%",
                      background: BAR_COLORS[i % BAR_COLORS.length],
                    }}
                  />
                </div>
                <div className="bar-val">{(val / 1000).toFixed(1)}K XAF</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full transaction history */}
      <div style={{ padding: "0 16px 16px" }}>
        <div className="sec-hdr" style={{ padding: "0 0 12px" }}>
          <span className="sec-title">Historial completo</span>
        </div>
        <div className="activity">
          {transactions.map((tx) => (
            <TxRow key={tx.id} tx={tx} />
          ))}
        </div>
      </div>

      <div style={{ height: 20 }} />
    </div>
  );
}
