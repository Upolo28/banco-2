import { useState } from 'react';
import { User, Mail, Phone, Lock, Globe, ArrowRight, Leaf } from 'lucide-react';
import '../styles/AuthStyles.css';

const CEMAC_COUNTRIES = [
  { code: '+237', name: 'Camerún (CM)' },
  { code: '+236', name: 'Rep. Centroafricana (CF)' },
  { code: '+235', name: 'Chad (TD)' },
  { code: '+242', name: 'Congo (CG)' },
  { code: '+240', name: 'Guinea Ecuatorial (GQ)' },
  { code: '+241', name: 'Gabón (GA)' },
];

export default function Register({ onRegister, onGoToLogin }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    countryCode: '+237',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Nombre obligatorio';
    if (!formData.email) {
      newErrors.email = 'Correo obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Correo inválido';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Teléfono obligatorio';
    } else if (!/^\d{6,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Número inválido (6–15 dígitos)';
    }
    if (!formData.password) {
      newErrors.password = 'Contraseña obligatoria';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'No coinciden';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      console.log('Enviando a Green Bank:', {
        ...formData,
        fullPhone: `${formData.countryCode}${formData.phone}`
      });
      
      setTimeout(() => {
        onRegister?.();
      }, 1500);
    } catch (err) {
      alert('Error en el sistema.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-body-context">
      <div className="auth-card-modern register-wide">
        {/* Cabecera del Formulario */}
        <div className="logo-container">
          <Leaf size={28} color="var(--primary-green)" fill="var(--primary-green)" />
          <h1 className="logo-minimal">Green<span>Bank</span></h1>
        </div>
        
        <h2 className="auth-title-minimal">Crear cuenta eco</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Nombre Completo */}
          <div className="modern-input-group">
            <label>Nombre completo</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon-minimal" />
              <input 
                name="fullName" 
                type="text" 
                placeholder="Ej: Marie Claire Nguema"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className="modern-input-group">
            <label>Correo electrónico</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon-minimal" />
              <input 
                name="email" 
                type="email" 
                placeholder="tu@correo.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Teléfono con Selector CEMAC */}
          <div className="modern-input-group">
            <label>Contacto telefónico</label>
            <div className="phone-flex-container">
              <div className="country-select-wrapper">
                <Globe size={16} className="select-icon" />
                <select name="countryCode" value={formData.countryCode} onChange={handleChange}>
                  {CEMAC_COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>{c.code} {c.name}</option>
                  ))}
                </select>
              </div>
              <div className="input-with-icon flex-grow">
                <Phone size={18} className="input-icon-minimal" />
                <input 
                  name="phone" 
                  type="tel" 
                  placeholder="6XX XXX XXX"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          {/* Contraseñas */}
          <div className="password-grid">
            <div className="modern-input-group">
              <label>Contraseña</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon-minimal" />
                <input 
                  name="password" 
                  type="password" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
            <div className="modern-input-group">
              <label>Confirmar</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon-minimal" />
                <input 
                  name="confirmPassword" 
                  type="password" 
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          </div>

          <button type="submit" className="btn-primary-minimal" disabled={isLoading}>
            {isLoading ? 'Procesando...' : <>Unirse ahora <ArrowRight size={18} /></>}
          </button>

          <p className="auth-footer-minimal">
            ¿Ya eres miembro? <span className="link-minimal" onClick={onGoToLogin}>Inicia sesión</span>
          </p>
        </form>
      </div>
    </div>
  );
}