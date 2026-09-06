import { useState } from "react";
import "./Login.css";

/**
 * Componente funcional para gestionar el inicio de sesión del usuario.
 * @param {Object} propiedades - Propiedades pasadas desde el componente principal.
 * @param {Function} propiedades.alIniciarSesion - Función para cambiar el estado de autenticación.
 */
export const Login = ({ alIniciarSesion }) => {
  const [correoElectronico, establecerCorreoElectronico] = useState("");
  const [contrasena, establecerContrasena] = useState("");

  /**
   * Maneja el envío del formulario de acceso.
   * @param {Object} evento - Evento de envío del formulario.
   */
  const manejarEnvio = (evento) => {
    evento.preventDefault();
    // Validación básica de ejemplo; aquí se conectaría con Spring Boot más adelante
    if (correoElectronico && contrasena) {
      alIniciarSesion(true);
    } else {
      alert("Por favor, ingrese sus credenciales.");
    }
  };

  return (
    <div className="contenedor-login">
      <form className="formulario-login" onSubmit={manejarEnvio}>
        <h2 className="titulo-login">Iniciar Sesión</h2>
        <p className="descripcion-login">Acceda al sistema de lealtad GCO</p>

        <div className="grupo-input">
          <label htmlFor="correo">Correo Electrónico</label>
          <input
            type="email"
            id="correo"
            value={correoElectronico}
            onChange={(e) => establecerCorreoElectronico(e.target.value)}
            placeholder="correo@ejemplo.com"
            required
          />
        </div>

        <div className="grupo-input">
          <label htmlFor="contrasena">Contraseña</label>
          <input
            type="password"
            id="contrasena"
            value={contrasena}
            onChange={(e) => establecerContrasena(e.target.value)}
            placeholder="********"
            required
          />
        </div>

        <button type="submit" className="boton-ingresar">
          Ingresar
        </button>
      </form>
    </div>
  );
};
