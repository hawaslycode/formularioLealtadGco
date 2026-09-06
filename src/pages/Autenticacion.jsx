import { useState } from "react";
import "./Autenticacion.css";

/**
 * Componente para el inicio de sesión y registro de usuarios nativo.
 * Conectado de manera real al backend en Spring Boot y PostgreSQL mediante credenciales locales.
 */
export const Autenticacion = ({ alAutenticar }) => {
  const [esRegistro, establecerEsRegistro] = useState(false);
  const [correoElectronico, establecerCorreoElectronico] = useState("");
  const [contrasena, establecerContrasena] = useState("");
  const [aceptaTerminos, establecerAceptaTerminos] = useState(false);
  const [mensajeAlerta, establecerMensajeAlerta] = useState({
    texto: "",
    tipo: "",
  });

  /**
   * Maneja el envío del formulario comunicándose con la API REST de Spring Boot.
   */
  const manejarEnvioAutenticacion = async (evento) => {
    evento.preventDefault();

    if (!aceptaTerminos) {
      establecerMensajeAlerta({
        texto:
          "Debe aceptar los términos, condiciones y políticas de privacidad para continuar.",
        tipo: "error",
      });
      return;
    }

    const endpoint = esRegistro
      ? "/api/autenticacion/registrar"
      : "/api/autenticacion/login";

    try {
      const respuesta = await fetch(`http://localhost:8080${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correoElectronico, contrasena }),
      });

      if (respuesta.ok) {
        const datosUsuario = await respuesta.json();
        establecerMensajeAlerta({
          texto: esRegistro
            ? "¡Cuenta creada con éxito! Bienvenido."
            : "¡Inicio de sesión exitoso!",
          tipo: "exito",
        });

        // Retraso intencional para permitir al usuario leer el mensaje de éxito
        setTimeout(() => {
          alAutenticar({ correo: datosUsuario.correoElectronico });
        }, 800);
      } else {
        const textoError = await respuesta.text();

        // Intercepta error 404 para ofrecer el registro si el correo no existe
        if (respuesta.status === 404 && !esRegistro) {
          establecerMensajeAlerta({
            texto:
              "El correo ingresado no se encuentra registrado en nuestra base de datos. ¿Desea crear una cuenta?",
            tipo: "sugerencia-registro",
          });
        } else {
          establecerMensajeAlerta({
            texto: textoError || "Ocurrió un error en la autenticación.",
            tipo: "error",
          });
        }
      }
    } catch {
      establecerMensajeAlerta({
        texto: "Error de conexión con el servidor backend en Spring Boot.",
        tipo: "error",
      });
    }
  };

  return (
    <div className="contenedor-autenticacion">
      <div className="tarjeta-autenticacion">
        <h2 className="titulo-autenticacion">
          {esRegistro ? "Crear Nueva Cuenta" : "Iniciar Sesión"}
        </h2>
        <p className="descripcion-autenticacion">
          {esRegistro
            ? "Regístrese para acceder al sistema de lealtad GCO."
            : "Ingrese sus credenciales de acceso."}
        </p>

        {mensajeAlerta.texto && (
          <div className={`aviso-alerta ${mensajeAlerta.tipo}`}>
            <span>{mensajeAlerta.texto}</span>
            {mensajeAlerta.tipo === "sugerencia-registro" ? (
              <button
                type="button"
                className="boton-accion-sugerencia"
                onClick={() => {
                  establecerEsRegistro(true);
                  establecerMensajeAlerta({ texto: "", tipo: "" });
                }}
              >
                Registrarse ahora
              </button>
            ) : (
              <button
                type="button"
                className="boton-cerrar-aviso"
                onClick={() => establecerMensajeAlerta({ texto: "", tipo: "" })}
              >
                &times;
              </button>
            )}
          </div>
        )}

        <form onSubmit={manejarEnvioAutenticacion}>
          <div className="grupo-input">
            <label htmlFor="correo">Correo Electrónico</label>
            <input
              type="email"
              id="correo"
              value={correoElectronico}
              onChange={(evento) =>
                establecerCorreoElectronico(evento.target.value)
              }
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
              onChange={(evento) => establecerContrasena(evento.target.value)}
              placeholder="********"
              required
            />
          </div>

          <div className="grupo-checkbox">
            <label className="etiqueta-checkbox">
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(evento) =>
                  establecerAceptaTerminos(evento.target.checked)
                }
                required
              />
              <span>
                Acepto los términos, condiciones y la política de tratamiento de
                datos personales.
              </span>
            </label>
          </div>

          <button type="submit" className="boton-principal-auth">
            {esRegistro ? "Registrarse" : "Ingresar"}
          </button>
        </form>

        <div className="enlace-cambio-modo" style={{ marginTop: "25px" }}>
          {esRegistro ? (
            <p>
              ¿Ya tiene una cuenta?{" "}
              <span
                onClick={() => establecerEsRegistro(false)}
                style={{
                  cursor: "pointer",
                  color: "#002855",
                  fontWeight: "bold",
                }}
              >
                Inicie sesión aquí
              </span>
            </p>
          ) : (
            <p>
              ¿No tiene cuenta registrada?{" "}
              <span
                onClick={() => establecerEsRegistro(true)}
                style={{
                  cursor: "pointer",
                  color: "#002855",
                  fontWeight: "bold",
                }}
              >
                Regístrese aquí
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
