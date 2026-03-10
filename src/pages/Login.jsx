import React, { useState } from "react";
import { Mail, Lock, ArrowRight, Leaf } from "lucide-react";
import "../styles/AuthStyles.css";

export default function Login({ onLogin, onGoToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="auth-body-context">
      <div className="auth-card-modern register-wide">
        {/* Logo */}
        <div className="logo-container">
          <Leaf
            size={32}
            color="var(--primary-green)"
            fill="var(--primary-green)"
          />
          <h1 className="logo-minimal">
            Green<span>Bank</span>
          </h1>
          <p className="tagline-minimal">
            Tu banca sostenible, ahora más simple.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="modern-input-group">
            <label>Correo electrónico</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon-minimal" />
              <input
                type="email"
                placeholder="ejemplo@green.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modern-input-group">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <label>Contraseña</label>
              <span className="forgot-password">¿Olvidaste tu clave?</span>
            </div>

            <div className="input-with-icon">
              <Lock size={18} className="input-icon-minimal" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary-minimal">
            Entrar <ArrowRight size={18} style={{ marginLeft: "8px" }} />
          </button>

          <p className="auth-footer-minimal">
            ¿Nuevo en Green Bank?{" "}
            <span className="link-minimal" onClick={onGoToRegister}>
              Crea una cuenta eco
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
