import { useState, useEffect } from "react";
import "./RegistroLealtad.css";

/**
 * Objeto con los beneficios exclusivos simulados por cada marca del grupo GCO.
 */
const beneficiosPorMarcaSimulados = {
  1: [
    {
      titulo: "Bono de Bienvenida",
      descripcion: "20% de descuento en tu primera compra como miembro.",
    },
    {
      titulo: "Cashback Exclusivo",
      descripcion: "Acumula el 5% de tus compras en puntos redimibles.",
    },
  ],
  2: [
    {
      titulo: "Acceso Anticipado VIP",
      descripcion: "Entrada preferencial a colecciones de temporada.",
    },
    {
      titulo: "Obsequio de Cumpleaños",
      descripcion: "Bono de $50.000 COP durante tu mes de cumpleaños.",
    },
  ],
  3: [
    {
      titulo: "Envío Gratuito",
      descripcion: "Envíos sin costo en todas tus compras digitales.",
    },
    {
      titulo: "Garantía Extendida",
      descripcion: "Garantía preferencial en chaquetas de cuero.",
    },
  ],
  4: [
    {
      titulo: "Descuento Aniversario",
      descripcion: "30% de descuento durante el mes de aniversario.",
    },
    {
      titulo: "Taller de Estilo",
      descripcion: "Invitación exclusiva a asesorías de imagen.",
    },
  ],
  5: [
    {
      titulo: "Preventa Flash",
      descripcion: "Descuentos de hasta 40% antes del público general.",
    },
    {
      titulo: "Acumulación Doble",
      descripcion: "Doble acumulación de puntos los fines de semana.",
    },
  ],
  6: [
    {
      titulo: "Puntos Redimibles",
      descripcion: "1 punto por cada $1.000 COP gastados en tiendas.",
    },
    {
      titulo: "Mantenimiento de Prendas",
      descripcion: "Ajustes y dobladillos sin costo en jeans.",
    },
  ],
};

export const RegistroLealtad = ({ usuarioActual, alCerrarSesion }) => {
  const [datosFormulario, establecerDatosFormulario] = useState({
    tipoIdentificacion: "",
    numeroIdentificacion: "",
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    direccion: "",
    pais: "",
    departamento: "",
    ciudad: "",
    idMarca: "",
  });

  const [listaTiposId, establecerListaTiposId] = useState([]);
  const [listaPaises, establecerListaPaises] = useState([]);
  const [listaDepartamentos, establecerListaDepartamentos] = useState([]);
  const [listaCiudades, establecerListaCiudades] = useState([]);
  const [listaMarcas, establecerListaMarcas] = useState([]);

  const [paisSeleccionadoId, establecerPaisSeleccionadoId] = useState("");
  const [departamentoSeleccionadoId, establecerDepartamentoSeleccionadoId] =
    useState("");
  const [mensajeAlerta, establecerMensajeAlerta] = useState({
    texto: "",
    tipo: "",
  });

  // 1. Cargar catálogos iniciales y precargar los datos del usuario registrado
  useEffect(() => {
    let estaMontado = true;

    const inicializarDatosVista = async () => {
      try {
        // Carga de catálogos
        const resTipos = await fetch(
          "http://localhost:8080/api/catalogos/tipos-identificacion",
        );
        if (resTipos.ok && estaMontado)
          establecerListaTiposId(await resTipos.json());

        const resPaises = await fetch(
          "http://localhost:8080/api/catalogos/paises",
        );
        if (resPaises.ok && estaMontado)
          establecerListaPaises(await resPaises.json());

        const resMarcas = await fetch(
          "http://localhost:8080/api/catalogos/marcas",
        );
        if (resMarcas.ok && estaMontado)
          establecerListaMarcas(await resMarcas.json());

        // Precarga de datos del cliente basado en el correo de la sesión activa
        if (usuarioActual?.correo) {
          const respuestaCliente = await fetch(`http://localhost:8080/api/lealtad/cliente/correo/${usuarioActual.correo}`);
          
          if (respuestaCliente.ok && estaMontado) {
            // Si el usuario ya existe en la tabla de lealtad, precargamos sus datos
            const datosCliente = await respuestaCliente.json();
            establecerDatosFormulario({
              tipoIdentificacion: datosCliente.tipoIdentificacion || '',
              numeroIdentificacion: datosCliente.numeroIdentificacion || '',
              nombres: datosCliente.nombres || '',
              apellidos: datosCliente.apellidos || '',
              fechaNacimiento: datosCliente.fechaNacimiento || '',
              direccion: datosCliente.direccion || '',
              pais: datosCliente.pais || '',
              departamento: datosCliente.departamento || '',
              ciudad: datosCliente.ciudad || '',
              idMarca: datosCliente.idMarca ? String(datosCliente.idMarca) : ''
            });
            
            establecerMensajeAlerta({
              texto: '¡Datos de lealtad precargados exitosamente desde la base de datos!',
              tipo: 'exito'
            });

          } else if (respuestaCliente.status === 404 && estaMontado) {
            // MANEJO ELEGANTE DEL 404: 
            // Sabemos que es un usuario nuevo, así que no mostramos error,
            // sino un mensaje de bienvenida invitándolo a llenar sus datos.
            console.info("Info: Usuario nuevo, formulario en blanco listo para ser diligenciado.");
            establecerMensajeAlerta({
              texto: '¡Bienvenido! Por favor, complete sus datos para registrarse en el programa de lealtad.',
              tipo: 'info' // Asegúrate de darle estilos a este tipo 'info' en tu CSS si lo deseas
            });
          }
        }
      } catch {
        if (estaMontado) {
          console.error("Error al inicializar la vista de lealtad.");
        }
      }
    };

    inicializarDatosVista();

    return () => {
      estaMontado = false;
    };
  }, [usuarioActual]);

  // 2. Sincronizar departamentos al cambiar el país
  useEffect(() => {
    let estaMontado = true;
    const cargarDepartamentos = async () => {
      if (paisSeleccionadoId) {
        try {
          const respuesta = await fetch(
            `http://localhost:8080/api/catalogos/departamentos/${paisSeleccionadoId}`,
          );
          if (respuesta.ok && estaMontado) {
            establecerListaDepartamentos(await respuesta.json());
            const paisObj = listaPaises.find(
              (p) => String(p.id) === String(paisSeleccionadoId),
            );
            if (paisObj) {
              establecerDatosFormulario((prev) => ({
                ...prev,
                pais: paisObj.nombre,
              }));
            }
          }
        } catch {
          if (estaMontado) console.error("Error al cargar departamentos.");
        }
      }
    };
    cargarDepartamentos();
    return () => {
      estaMontado = false;
    };
  }, [paisSeleccionadoId, listaPaises]);

  // 3. Sincronizar ciudades al cambiar el departamento
  useEffect(() => {
    let estaMontado = true;
    const cargarCiudades = async () => {
      if (departamentoSeleccionadoId) {
        try {
          const respuesta = await fetch(
            `http://localhost:8080/api/catalogos/ciudades/${departamentoSeleccionadoId}`,
          );
          if (respuesta.ok && estaMontado) {
            establecerListaCiudades(await respuesta.json());
            const depObj = listaDepartamentos.find(
              (d) => String(d.id) === String(departamentoSeleccionadoId),
            );
            if (depObj) {
              establecerDatosFormulario((prev) => ({
                ...prev,
                departamento: depObj.nombre,
              }));
            }
          }
        } catch {
          if (estaMontado) console.error("Error al cargar ciudades.");
        }
      }
    };
    cargarCiudades();
    return () => {
      estaMontado = false;
    };
  }, [departamentoSeleccionadoId, listaDepartamentos]);

  const listaBeneficios = datosFormulario.idMarca
    ? beneficiosPorMarcaSimulados[datosFormulario.idMarca] || []
    : [];

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    establecerDatosFormulario({
      ...datosFormulario,
      [name]: value,
    });
  };

  /**
   * Maneja el envío del formulario hacia el backend.
   * Intercepta los datos del estado local y les adjunta el correo de la sesión actual
   * para mantener la integridad referencial en la base de datos.
   */
  const manejarEnvioFormulario = async (evento) => {
    // Prevenimos la recarga por defecto de la página
    evento.preventDefault();

    // Construimos un nuevo objeto clonando los datos del formulario
    // y añadiendo el correo electrónico del usuario activo.
    const cargaUtilDeDatos = {
      ...datosFormulario,
      correoElectronico: usuarioActual.correo,
    };

    try {
      const respuesta = await fetch(
        "http://localhost:8080/api/lealtad/registrar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // Enviamos la nueva carga útil que ahora sí incluye el correo
          body: JSON.stringify(cargaUtilDeDatos),
        },
      );

      if (respuesta.ok) {
        establecerMensajeAlerta({
          texto:
            "¡Información guardada y actualizada en el programa de fidelidad con éxito!",
          tipo: "exito",
        });
      } else {
        const textoDeError = await respuesta.text();
        establecerMensajeAlerta({
          texto: textoDeError || "Ocurrió un error al procesar el registro.",
          tipo: "error",
        });
      }
    } catch (excepcion) {
      // Se utiliza la variable para imprimir el trazo del error en la consola
      // Esto es sumamente útil para depurar problemas de comunicación frontend-backend
      console.error("Fallo en la comunicación con la API:", excepcion);

      establecerMensajeAlerta({
        texto: "Error de conexión con el servidor backend en Spring Boot.",
        tipo: "error",
      });
    }
  };

  return (
    <div className="contenedor-registro">
      <form className="formulario-lealtad" onSubmit={manejarEnvioFormulario}>
        <div className="cabecera-formulario-lealtad">
          <span className="correo-sesion">
            Sesión activa: {usuarioActual?.correo}
          </span>
          <button
            type="button"
            className="boton-cerrar-sesion"
            onClick={alCerrarSesion}
          >
            Cerrar Sesión
          </button>
        </div>

        <h2 className="titulo-bienvenida">
          Bienvenido al programa de fidelidad de GCO
        </h2>
        <p className="descripcion-registro">
          Gestione sus datos personales, consulte sus beneficios o actualice su
          información.
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

        <div className="fila-formulario">
          <div className="grupo-input">
            <label htmlFor="tipoIdentificacion">Tipo de Identificación</label>
            <select
              id="tipoIdentificacion"
              name="tipoIdentificacion"
              value={datosFormulario.tipoIdentificacion}
              onChange={manejarCambio}
              required
            >
              <option value="">Seleccione...</option>
              {listaTiposId.map((tipo) => (
                <option key={tipo.id} value={tipo.nombre}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="grupo-input">
            <label htmlFor="numeroIdentificacion">
              Número de Identificación
            </label>
            <input
              type="text"
              id="numeroIdentificacion"
              name="numeroIdentificacion"
              value={datosFormulario.numeroIdentificacion}
              onChange={manejarCambio}
              placeholder="Ej. 1023456789"
              required
            />
          </div>
        </div>

        <div className="fila-formulario">
          <div className="grupo-input">
            <label htmlFor="nombres">Nombres</label>
            <input
              type="text"
              id="nombres"
              name="nombres"
              value={datosFormulario.nombres}
              onChange={manejarCambio}
              placeholder="Ingrese sus nombres"
              required
            />
          </div>

          <div className="grupo-input">
            <label htmlFor="apellidos">Apellidos</label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              value={datosFormulario.apellidos}
              onChange={manejarCambio}
              placeholder="Ingrese sus apellidos"
              required
            />
          </div>
        </div>

        <div className="fila-formulario">
          <div className="grupo-input">
            <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
            <input
              type="date"
              id="fechaNacimiento"
              name="fechaNacimiento"
              value={datosFormulario.fechaNacimiento}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="grupo-input">
            <label htmlFor="direccion">Dirección</label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={datosFormulario.direccion}
              onChange={manejarCambio}
              placeholder="Ej. Calle 100 # 15-20"
              required
            />
          </div>
        </div>

        {/* Listas desplegables geográficas en cascada */}
        <div className="fila-formulario">
          <div className="grupo-input">
            <label htmlFor="paisSeleccionado">País</label>
            <select
              id="paisSeleccionado"
              value={paisSeleccionadoId}
              onChange={(e) => establecerPaisSeleccionadoId(e.target.value)}
              required
            >
              <option value="">Seleccione un país...</option>
              {listaPaises.map((pais) => (
                <option key={pais.id} value={pais.id}>
                  {pais.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="grupo-input">
            <label htmlFor="departamentoSeleccionado">
              Departamento / Estado
            </label>
            <select
              id="departamentoSeleccionado"
              value={departamentoSeleccionadoId}
              onChange={(e) =>
                establecerDepartamentoSeleccionadoId(e.target.value)
              }
              required
              disabled={!paisSeleccionadoId}
            >
              <option value="">Seleccione departamento...</option>
              {listaDepartamentos.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="fila-formulario">
          <div className="grupo-input">
            <label htmlFor="ciudad">Ciudad</label>
            <select
              id="ciudad"
              name="ciudad"
              value={datosFormulario.ciudad}
              onChange={manejarCambio}
              required
              disabled={!departamentoSeleccionadoId}
            >
              <option value="">Seleccione ciudad...</option>
              {listaCiudades.map((ciu) => (
                <option key={ciu.id} value={ciu.nombre}>
                  {ciu.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="grupo-input">
            <label htmlFor="idMarca">Marca a la que desea registrarse</label>
            <select
              id="idMarca"
              name="idMarca"
              value={datosFormulario.idMarca}
              onChange={manejarCambio}
              required
            >
              <option value="">Seleccione una marca...</option>
              {listaMarcas.map((marca) => (
                <option key={marca.id} value={marca.id}>
                  {marca.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sección de Beneficios Exclusivos precargados según la marca */}
        {listaBeneficios.length > 0 && (
          <div className="contenedor-beneficios-marca">
            <h3 className="titulo-beneficios">
              Beneficios Exclusivos de su Marca
            </h3>
            <div className="tarjetas-beneficios">
              {listaBeneficios.map((beneficio, indice) => (
                <div key={indice} className="tarjeta-beneficio-item">
                  <strong>{beneficio.titulo}</strong>
                  <p>{beneficio.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botones inferiores de acción (Actualizar y Salir) */}
        <div className="contenedor-botones-inferiores">
          <button type="submit" className="boton-registro">
            Guardar y Actualizar Información
          </button>
          <button
            type="button"
            className="boton-salir-secundario"
            onClick={alCerrarSesion}
          >
            Salir / Cerrar Sesión
          </button>
        </div>
      </form>
    </div>
  );
};
