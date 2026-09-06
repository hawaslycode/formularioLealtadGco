import { useState } from "react";
import { Autenticacion } from "./pages/Autenticacion";
import { RegistroLealtad } from "./pages/RegistroLealtad";
import { RestablecerContrasena } from "./pages/RestablecerContrasena";

/**
 * Componente raíz de la aplicación.
 * Actúa como Guardián de Sesión utilizando Inicialización Perezosa (Lazy Initialization)
 * para maximizar el rendimiento y evitar renderizados en cascada.
 * Gestiona además el enrutamiento manual para las vistas públicas de recuperación de claves.
 */
export const App = () => {
  /**
   * ESTADO GLOBAL DE USUARIO (Inicialización Perezosa)
   * Pasamos una función anónima a useState. React ejecutará esta función
   * de forma síncrona una única vez al instanciar el componente, interceptando
   * las credenciales del Local Storage antes del primer renderizado.
   */
  const [usuarioActual, establecerUsuarioActual] = useState(() => {
    const tokenGuardado = localStorage.getItem("tokenAcceso");
    const correoGuardado = localStorage.getItem("correoUsuario");

    // Si existen credenciales válidas, retornamos el objeto del usuario inmediatamente
    if (tokenGuardado && correoGuardado) {
      return { correo: correoGuardado };
    }
    
    // Si no hay sesión, el estado inicia en null
    return null;
  });

  /**
   * Función inyectada al componente de Autenticación para elevar el estado al autenticarse.
   * 
   * @param {Object} datosUsuario - Objeto que contiene el correo del usuario validado.
   */
  const manejarAutenticacion = (datosUsuario) => {
    establecerUsuarioActual(datosUsuario);
  };

  /**
   * Maneja el cierre de sesión seguro del usuario.
   * Destruye el rastro criptográfico en la bóveda del navegador y purga el estado global.
   */
  const manejarCierreSesion = () => {
    localStorage.removeItem("tokenAcceso");
    localStorage.removeItem("correoUsuario");
    establecerUsuarioActual(null);
  };

  // ====================================================================
  // RENDERIZADO CONDICIONAL Y ENRUTAMIENTO DE VISTAS
  // ====================================================================

  // Detectamos si el usuario ingresó a través del enlace seguro enviado a su correo
  const esRutaRecuperacion = window.location.pathname === "/restablecer-contrasena";

  if (esRutaRecuperacion) {
    return (
      <main>
        <RestablecerContrasena />
      </main>
    );
  }

  return (
    <main>
      {/* 
        Si usuarioActual tiene datos (leídos del localStorage o por login reciente), 
        renderiza el sistema. Si es null, bloquea la ruta y muestra el Login. 
      */}
      {usuarioActual ? (
        <RegistroLealtad 
          usuarioActual={usuarioActual} 
          alCerrarSesion={manejarCierreSesion} 
        />
      ) : (
        <Autenticacion alAutenticar={manejarAutenticacion} />
      )}
    </main>
  );
};

export default App;