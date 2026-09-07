import { useState } from "react";
import "./Autenticacion.css";

/**
 * Componente funcional encargado de renderizar la vista para crear una nueva contraseña.
 * Captura el token criptográfico desde la URL para autorizar la transacción
 * utilizando inicialización perezosa (Lazy Initialization) para evitar renderizados en cascada.
 */
export const RestablecerContrasena = () => {
  const [contrasenaNueva, establecerContrasenaNueva] = useState("");
  const [confirmarContrasena, establecerConfirmarContrasena] = useState("");
  const [estaCargando, establecerEstaCargando] = useState(false);

  /**
   * ESTADO DEL TOKEN (Inicialización Perezosa)
   * Leemos la barra de direcciones de forma síncrona al momento de instanciar el componente.
   * Esto evita el uso de useEffect para extraer parámetros de la URL, optimizando el rendimiento.
   */
  const [tokenRecuperacion] = useState(() => {
    const parametrosUrl = new URLSearchParams(window.location.search);
    return parametrosUrl.get("token");
  });

  /**
   * ESTADO DE ALERTA (Inicialización Perezosa)
   * Evaluamos si el token es nulo o inválido desde el primer ciclo de renderizado
   * para mostrar el mensaje de error inmediatamente y evitar advertencias del linter en VS Code.
   */
  const [mensajeAlerta, establecerMensajeAlerta] = useState(() => {
    if (!tokenRecuperacion) {
      return {
        texto: "Enlace inválido o corrupto. No se detectó un token de seguridad en la URL.",
        tipo: "error",
      };
    }
    return { texto: "", tipo: "" };
  });

  /**
   * Maneja el envío del formulario para actualizar la contraseña interactuando
   * con el controlador REST de Spring Boot y la base de datos PostgreSQL.
   * 
   * @param {Object} evento - Objeto que representa el evento de envío del formulario.
   */
  const manejarActualizacionContrasena = async (evento) => {
    evento.preventDefault();

    // 1. Validación de integridad de datos en el cliente (Frontend)
    if (contrasenaNueva !== confirmarContrasena) {
      establecerMensajeAlerta({
        texto: "Las contraseñas no coinciden. Por favor, verifíquelas e intente nuevamente.",
        tipo: "error",
      });
      return;
    }

    // 2. Validación de seguridad (Token presente)
    if (!tokenRecuperacion) {
      establecerMensajeAlerta({
        texto: "No es posible procesar la solicitud sin un token de seguridad válido.",
        tipo: "error",
      });
      return;
    }

    // 3. Preparamos la interfaz gráfica bloqueando los controles interactivos
    establecerEstaCargando(true);
    establecerMensajeAlerta({ texto: "", tipo: "" });

    try {
      // 4. Petición HTTP real hacia nuestro backend protegido y configurado en Spring Boot
      const respuesta = await fetch("http://localhost:8080/api/autenticacion/cambiar-contrasena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          tokenAcceso: tokenRecuperacion, 
          nuevaContrasena: contrasenaNueva 
        }),
      });

      // 5. Procesamiento transaccional de la respuesta
      if (respuesta.ok) {
        establecerMensajeAlerta({
          texto: "¡Contraseña actualizada con éxito! Ya puede regresar a la pantalla de inicio de sesión.",
          tipo: "exito",
        });
        // Limpiamos los campos por seguridad
        establecerContrasenaNueva("");
        establecerConfirmarContrasena("");
      } else {
        // Capturamos el error controlado enviado desde Spring Boot (ej. Token expirado)
        const mensajeError = await respuesta.text();
        establecerMensajeAlerta({
          texto: mensajeError || "No se pudo actualizar la contraseña en el servidor.",
          tipo: "error",
        });
      }
    } catch (excepcion) {
      console.error("Error al actualizar la contraseña:", excepcion);
      establecerMensajeAlerta({
        texto: "Error de conexión con el servidor backend en Spring Boot.",
        tipo: "error",
      });
    } finally {
      // 6. Liberamos la interfaz gráfica independientemente del resultado de la transacción
      establecerEstaCargando(false);
    }
  };

  return (
    <div className="contenedor-autenticacion">
      <div className="tarjeta-autenticacion">
        <h2 className="titulo-autenticacion">Crear Nueva Contraseña</h2>
        <p className="descripcion-autenticacion">
          Ingrese su nueva contraseña de acceso seguro.
        </p>

        {mensajeAlerta.texto && (
          <div className={`aviso-alerta ${mensajeAlerta.tipo}`}>
            <span>{mensajeAlerta.texto}</span>
            <button
              type="button"
              className="boton-cerrar-aviso"
              onClick={() => establecerMensajeAlerta({ texto: "", tipo: "" })}
            >
              &times;
            </button>
          </div>
        )}

        <form onSubmit={manejarActualizacionContrasena}>
          <div className="grupo-input">
            <label htmlFor="contrasenaNueva">Nueva Contraseña</label>
            <input
              type="password"
              id="contrasenaNueva"
              value={contrasenaNueva}
              onChange={(evento) => establecerContrasenaNueva(evento.target.value)}
              placeholder="********"
              required
              disabled={estaCargando || !tokenRecuperacion}
            />
          </div>

          <div className="grupo-input">
            <label htmlFor="confirmarContrasena">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmarContrasena"
              value={confirmarContrasena}
              onChange={(evento) => establecerConfirmarContrasena(evento.target.value)}
              placeholder="********"
              required
              disabled={estaCargando || !tokenRecuperacion}
            />
          </div>

          <button
            type="submit"
            className="boton-principal-auth"
            disabled={estaCargando || !tokenRecuperacion}
          >
            {estaCargando ? (
              <div className="contenedor-cargador">
                <span className="cargador-giratorio"></span>
                <span>Procesando...</span>
              </div>
            ) : (
              "Actualizar Contraseña"
            )}
          </button>
        </form>

        <div className="enlace-cambio-modo" style={{ marginTop: "25px" }}>
          <p>
            ¿Recordó su contraseña?{" "}
            <a href="/" style={{ color: "#002855", fontWeight: "bold" }}>
              Inicie sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};