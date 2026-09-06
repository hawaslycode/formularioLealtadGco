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
   * Función encargada de limpiar el estado de la sesión,
   * retornando al usuario a la pantalla de inicio de sesión.
   */
  const manejarCierreSesion = () => {
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
