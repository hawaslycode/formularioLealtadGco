import { useState } from "react";
import "./Autenticacion.css";
import logoGco from "../assets/gcologo.png";

export const Autenticacion = ({ alAutenticar }) => {
  const [esRegistro, establecerEsRegistro] = useState(false);
  const [correoElectronico, establecerCorreoElectronico] = useState("");
  const [contrasena, establecerContrasena] = useState("");
  const [aceptaTerminos, establecerAceptaTerminos] = useState(false);

  const [estaCargando, establecerEstaCargando] = useState(false);

  const [mensajeAlerta, establecerMensajeAlerta] = useState({
    texto: "",
    tipo: "",
  });

  
  const manejarEnvioAutenticacion = async (evento) => {
    evento.preventDefault();

    if (!aceptaTerminos) {
      establecerMensajeAlerta({
        texto: "Debe aceptar los términos, condiciones y laF política de tratamiento de datos personales para continuar.",
        tipo: "error",
      });
      return;
    }

    const endpoint = esRegistro
      ? "/api/autenticacion/registrar"
      : "/api/autenticacion/login";

    establecerEstaCargando(true);
    establecerMensajeAlerta({ texto: "", tipo: "" });

    try {
      const respuesta = await fetch(`http://localhost:8080${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correoElectronico, contrasena }),
      });

      if (respuesta.ok) {
        const datosRespuesta = await respuesta.json();

        if (!esRegistro) {
          localStorage.setItem("tokenAcceso", datosRespuesta.tokenAcceso);
          localStorage.setItem(
            "correoUsuario",
            datosRespuesta.usuario.correoElectronico,
          );
        }

        establecerMensajeAlerta({
          texto: esRegistro
            ? "¡Cuenta creada con éxito! Por favor, inicie sesión."
            : "¡Inicio de sesión exitoso!",
          tipo: "exito",
        });

        setTimeout(() => {
          if (esRegistro) {
            establecerEsRegistro(false);
            establecerMensajeAlerta({ texto: "", tipo: "" });
            establecerContrasena("");
          } else {
            alAutenticar({ correo: datosRespuesta.usuario.correoElectronico });
          }
        }, 1500);
      } else {
        const textoError = await respuesta.text();

        if (respuesta.status === 404 && !esRegistro) {
          establecerMensajeAlerta({
            texto: "El correo ingresado no se encuentra registrado en nuestra base de datos. ¿Desea crear una cuenta?",
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
    } finally {
      establecerEstaCargando(false);
    }
  };

  const manejarRecuperacionContrasena = async () => {
    if (!correoElectronico) {
      establecerMensajeAlerta({
        texto: "Por favor, ingrese su correo electrónico en el campo superior para recuperar su contraseña.",
        tipo: "info",
      });
      return;
    }

    establecerEstaCargando(true);
    establecerMensajeAlerta({ texto: "", tipo: "" });

    try {
      const respuesta = await fetch(
        "http://localhost:8080/api/autenticacion/olvide-contrasena",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correoElectronico }),
        },
      );

      if (respuesta.ok) {
        establecerMensajeAlerta({
          texto: `Hemos enviado las instrucciones de recuperación al correo: ${correoElectronico}. Por favor, revise su bandeja de entrada.`,
          tipo: "exito",
        });
      } else {
        const textoErrorServidor = await respuesta.text();
        establecerMensajeAlerta({
          texto: textoErrorServidor || "Ocurrió un error al intentar procesar su solicitud de recuperación.",
          tipo: "error",
        });
      }
    } catch (excepcion) {
      console.error("Error de conexión al recuperar contraseña:", excepcion);
      establecerMensajeAlerta({
        texto: "Error de conexión con el servidor backend en Spring Boot.",
        tipo: "error",
      });
    } finally {
      establecerEstaCargando(false);
    }
  };

  return (
    <div className="contenedor-autenticacion">
      <div className="tarjeta-autenticacion">
        {/* Contenedor del Logotipo Corporativo GCO */}
        <div className="contenedor-logo-auth">
          <img 
            src={logoGco} 
            alt="Logotipo GCO Programas de Lealtad" 
            className="imagen-logo-auth" 
          />
        </div>

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
              disabled={estaCargando}
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
              disabled={estaCargando}
            />
          </div>

          {!esRegistro && (
            <div className="contenedor-recuperar-contrasena">
              <span
                className="enlace-recuperar"
                onClick={manejarRecuperacionContrasena}
              >
                ¿Olvidó su contraseña?
              </span>
            </div>
          )}

          <div className="grupo-checkbox">
            <label className="etiqueta-checkbox">
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(evento) =>
                  establecerAceptaTerminos(evento.target.checked)
                }
                required
                disabled={estaCargando}
              />
              <span>
                Acepto los términos, condiciones y la política de tratamiento de
                datos personales.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="boton-principal-auth"
            disabled={estaCargando}
          >
            {estaCargando ? (
              <div className="contenedor-cargador">
                <span className="cargador-giratorio"></span>
                <span>Procesando...</span>
              </div>
            ) : esRegistro ? (
              "Registrarse"
            ) : (
              "Ingresar"
            )}
          </button>
        </form>

        <div className="enlace-cambio-modo" style={{ marginTop: "25px" }}>
          {esRegistro ? (
            <p>
              ¿Ya tiene una cuenta?{" "}
              <span
                onClick={() => !estaCargando && establecerEsRegistro(false)}
                style={{
                  cursor: estaCargando ? "not-allowed" : "pointer",
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
                onClick={() => !estaCargando && establecerEsRegistro(true)}
                style={{
                  cursor: estaCargando ? "not-allowed" : "pointer",
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