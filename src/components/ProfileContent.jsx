import { User, Shield, Lock, FileText, LogOut, Camera } from "lucide-react";

export default function ProfileContent({ user, onLogout }) {
  return (
    <div className="profile-view">
      <div className="profile-header-pro">
        <div className="avatar-main">
          <img
            src={user?.photo || "https://via.placeholder.com/100"}
            alt="Profile"
          />
          <button className="edit-btn">
            <Camera size={14} />
          </button>
        </div>
        <h3>{user?.name || "Usuario GreenBank"}</h3>
        <p className="user-tag">@marie_claire_ge</p>
      </div>

      <div className="settings-grid">
        <section className="settings-section">
          <h4>Privacidad y Seguridad</h4>
          <button className="s-item">
            <Shield size={18} /> <span>Centro de Privacidad</span>
          </button>
          <button className="s-item">
            <Lock size={18} /> <span>Cambiar código PIN</span>
          </button>
        </section>

        <section className="settings-section">
          <h4>Legal</h4>
          <button className="s-item">
            <FileText size={18} /> <span>Documentación de cuenta</span>
          </button>
        </section>

        <button className="btn-logout-final" onClick={onLogout}>
          <LogOut size={18} /> Cerrar sesión segura
        </button>
      </div>
    </div>
  );
}
