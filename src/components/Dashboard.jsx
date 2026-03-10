import React, { useState } from 'react';
import { 
  Send, ArrowUpCircle, PlusCircle, Landmark, 
  History, X, ChevronRight, Bell, User, Search, ShoppingBag
} from 'lucide-react';
import '../styles/Dashboard.css';

const BANCOS_GE = [
  { id: 'bange', name: 'BANGE', full: 'Banco Nacional de Guinea Ecuatorial', color: '#e74c3c' },
  { id: 'cceibank', name: 'CCEIBANK', full: 'CCEI Bank GE', color: '#2c3e50' },
  { id: 'societe', name: 'Société Générale', full: 'SG Guinea Ecuatorial', color: '#636e72' },
  { id: 'ecobank', name: 'Ecobank', full: 'Ecobank GE', color: '#3498db' }
];

export default function Dashboard({ balance = 1250500, notifCount = 2, openNotifs }) {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);

  const closeModal = () => { setActiveModal(null); setSelectedBank(null); };

  return (
    <div className="dashboard-container">
      {/* HEADER SUPERIOR PROFESIONAL */}
      <header className="dash-header">
        <div className="user-profile">
          <div className="avatar-wrapper"><User size={20} /></div>
          <span>Hola, <strong>Marie Claire</strong></span>
        </div>
        <div className="header-actions">
          <button className="icon-circle-btn"><Search size={20} /></button>
          <button className="icon-circle-btn" onClick={openNotifs}>
            <Bell size={20} />
            {notifCount > 0 && <span className="notif-badge">{notifCount}</span>}
          </button>
        </div>
      </header>

      {/* TARJETA DE SALDO (GLASSMORPHISM) */}
      <section className="balance-hero-section">
        <div className="balance-glass-card">
          <span className="label">Saldo Disponible</span>
          <h2 className="amount">{balance.toLocaleString()} <small>XAF</small></h2>
          <div className="card-waves"></div>
        </div>
      </section>

      {/* NAVEGACIÓN DE ACCIONES RÁPIDAS */}
      <nav className="quick-actions-grid">
        <button className="nav-item" onClick={() => setActiveModal('send')}>
          <div className="icon-container blue"><Send size={22} /></div>
          <span>Enviar</span>
        </button>
        <button className="nav-item" onClick={() => setActiveModal('withdraw')}>
          <div className="icon-container red"><ArrowUpCircle size={22} /></div>
          <span>Retirar</span>
        </button>
        <button className="nav-item" onClick={() => setActiveModal('deposit')}>
          <div className="icon-container yellow"><PlusCircle size={22} /></div>
          <span>Ingresar</span>
        </button>
        <button className="nav-item" onClick={() => setActiveModal('banks')}>
          <div className="icon-container green"><Landmark size={22} /></div>
          <span>Bancos GE</span>
        </button>
      </nav>

      {/* MODAL DINÁMICO MEJORADO */}
      {activeModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-sheet animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="modal-handle"></div>
            <button className="btn-close-sheet" onClick={closeModal}><X size={22} /></button>
            
            <div className="modal-body-content">
                {activeModal === 'send' && <FormSend />}
                {activeModal === 'withdraw' && <FormWithdraw balance={balance} />}
                {activeModal === 'deposit' && <FormDeposit />}
                {activeModal === 'banks' && !selectedBank && (
                  <BankSelector onSelect={setSelectedBank} />
                )}
                {selectedBank && (
                  <BankDetail bank={selectedBank} onBack={() => setSelectedBank(null)} />
                )}
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN DE ACTIVIDAD RECIENTE */}
      <section className="activity-container">
        <div className="activity-header">
          <h3>Actividad reciente</h3>
          <button className="btn-text">Ver todo</button>
        </div>
        
        <div className="activity-feed">
          <div className="activity-item">
            <div className="activity-icon shop"><ShoppingBag size={18} /></div>
            <div className="activity-details">
              <strong>Martínez Hnos</strong>
              <span>Supermercado • 14:20</span>
            </div>
            <div className="activity-value status-negative">-12,500 XAF</div>
          </div>
          
          <div className="empty-state-msg">
            <History size={32} />
            <p>No hay más movimientos pendientes</p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* --- SUB-COMPONENTES ACTUALIZADOS --- */

const FormSend = () => (
  <form className="modern-form">
    <h3>Enviar Dinero</h3>
    <div className="input-field">
      <label>Destinatario</label>
      <input type="text" placeholder="Nombre completo" />
    </div>
    <div className="input-field">
      <label>Cuenta o Teléfono</label>
      <input type="text" placeholder="+240 ..." />
    </div>
    <div className="input-field">
      <label>Monto (XAF)</label>
      <input type="number" placeholder="0.00" className="amount-input" />
    </div>
    <button className="btn-action-primary">Confirmar Envío</button>
  </form>
);

const FormWithdraw = ({ balance }) => (
  <form className="modern-form">
    <h3>Retirar Fondos</h3>
    <div className="quick-withdraw-cards">
      <button type="button" className="quick-card">
        <small>Retirar Todo</small>
        <strong>{balance.toLocaleString()}</strong>
      </button>
    </div>
    <div className="input-field">
      <label>Método de Retiro</label>
      <select>
        <option>Cajero Automático (OTP)</option>
        <option>Punto de Agente Autorizado</option>
      </select>
    </div>
    <button className="btn-action-primary red-bg">Generar Código de Retiro</button>
  </form>
);

const BankSelector = ({ onSelect }) => (
  <div className="bank-selection-list">
    <h3>Bancos en Guinea Ecuatorial</h3>
    <div className="banks-grid">
      {BANCOS_GE.map(bank => (
        <div key={bank.id} className="bank-card-item" onClick={() => onSelect(bank)}>
          <div className="bank-logo-box" style={{ background: bank.color }}>{bank.name[0]}</div>
          <div className="bank-text">
            <strong>{bank.name}</strong>
            <span>{bank.full}</span>
          </div>
          <ChevronRight size={18} color="#ccc" />
        </div>
      ))}
    </div>
  </div>
);

const FormDeposit = () => (
  <form className="modern-form">
    <h3>Ingresar Dinero</h3>
    <div className="deposit-toggle">
      <button type="button" className="toggle-btn active">Tarjeta</button>
      <button type="button" className="toggle-btn">Ahorro</button>
    </div>
    <div className="input-field">
      <label>Monto a ingresar</label>
      <input type="number" placeholder="Monto en XAF" />
    </div>
    <button className="btn-action-primary">Proceder al depósito</button>
  </form>
);

const BankDetail = ({ bank, onBack }) => (
  <div className="bank-detail-view">
    <button onClick={onBack} className="back-link">← Volver a la lista</button>
    <div className="bank-header-detail">
        <div className="large-logo" style={{ background: bank.color }}>{bank.name[0]}</div>
        <h3 style={{ color: bank.color }}>{bank.name}</h3>
    </div>
    <div className="branch-grid">
      <div className="branch-card">Malabo I (Central)</div>
      <div className="branch-card">Bata (Litoral)</div>
    </div>
    <div className="modern-form">
      <label>Trámite Bancario</label>
      <input type="text" placeholder="Ej: Solicitud de crédito" />
      <button className="btn-action-primary" style={{ background: bank.color }}>Enviar Solicitud</button>
    </div>
  </div>
);