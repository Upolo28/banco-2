import React, { useState } from "react";
import { X } from "lucide-react";
import DailyLifeContent from "./DailyLifeContent"; // Importamos el contenido actualizado
import ProfileContent from "./ProfileContent";
import NotificationsContent from "./NotificationsContent";
import "../styles/Ventanillas.css";

export default function VentanillaSlider({ viewType, onClose }) {
  return (
    <div className="ventanilla-overlay" onClick={onClose}>
      {/* Detenemos la propagación del click para no cerrar al pinchar dentro */}
      <div
        className="ventanilla-content animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="btn-close-slider" onClick={onClose}>
          <X />
        </button>

        {/* Renderizado Condicional Profesional */}
        {viewType === "dailylife" && <DailyLifeContent />}
        {viewType === "profile" && <ProfileContent />}
        {viewType === "notifications" && <NotificationsContent />}
      </div>
    </div>
  );
}
