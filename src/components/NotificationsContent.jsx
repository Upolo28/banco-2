import { CheckCircle, History, Mail } from "lucide-react";

export default function NotificationsTab() {
  return (
    <div className="notifications-tab">
      <h3>Centro de Mensajes</h3>

      {/* Pago */}
      <div className="notif-card payment">
        <div className="notif-icon">
          <CheckCircle size={20} />
        </div>
        <div className="notif-body">
          <strong>Pago Recibido</strong>
          <p>Has recibido 25.000 XAF de Juan Nguema</p>
          <span className="notif-time">Hace 5 min</span>
        </div>
      </div>

      {/* Transacciones */}
      <div className="notif-card info">
        <div className="notif-icon">
          <History size={20} />
        </div>
        <div className="notif-body">
          <strong>Resumen Semanal</strong>
          <p>Tu historial de transacciones de Marzo ya está disponible.</p>
          <span className="notif-time">Hoy, 09:00</span>
        </div>
      </div>

      {/* Soporte */}
      <div className="notif-card message">
        <div className="notif-icon">
          <Mail size={20} />
        </div>
        <div className="notif-body">
          <strong>Soporte Green Bank</strong>
          <p>
            Hola Marie, tu nueva tarjeta ECO ya está en camino a la oficina de
            Malabo II.
          </p>
          <span className="notif-time">Ayer</span>
        </div>
      </div>
    </div>
  );
}
