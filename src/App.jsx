import { useState } from "react";
import { Autenticacion } from "./pages/Autenticacion";
import { RegistroLealtad } from "./pages/RegistroLealtad";

/**
 * Componente raíz de la aplicación.
 * Gestiona el estado de la sesión y decide qué vista renderizar
 * dependiendo de si el usuario está autenticado o no.
 */
export default function App() {
  // Estado que almacena los datos del usuario activo (nulo si no ha iniciado sesión)
  const [usuarioActual, establecerUsuarioActual] = useState(null);

  /**
   * Función encargada de actualizar el estado de la aplicación
   * una vez que el usuario se autentica correctamente en el backend.
   * @param {Object} datosUsuario - Objeto con la información del usuario (ej. correo).
   */
  const manejarAutenticacion = (datosUsuario) => {
    establecerUsuarioActual(datosUsuario);
  };

  /**
   * Maneja el cierre de sesión seguro del usuario.
   * Elimina el rastro del token de seguridad criptográfico y reinicia el estado global
   * para evitar accesos no autorizados mediante la persistencia del Local Storage.
   */
  const manejarCierreSesion = () => {
    // 1. Destruimos las credenciales y datos almacenados localmente
    localStorage.removeItem("tokenAcceso");
    localStorage.removeItem("correoUsuario");

    // 2. Reiniciamos el estado del usuario en React para desmontar la vista privada
    establecerUsuarioActual(null);
    
  };

  return (
    // Renderizado condicional:
    // Si usuarioActual tiene datos, mostramos el formulario de lealtad.
    // Si es nulo, mostramos la pantalla de inicio de sesión/registro.
    <main className="aplicacionPrincipal">
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
}
