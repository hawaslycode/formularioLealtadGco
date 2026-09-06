import { useState, useEffect } from "react";
import "./RegistroLealtad.css";

/**
 * Objeto con los beneficios exclusivos simulados por cada marca del grupo GCO.
 */
const beneficiosPorMarcaSimulados = {
  1: [
    { titulo: "Bono de Bienvenida", descripcion: "20% de descuento en tu primera compra como miembro." },
    { titulo: "Cashback Exclusivo", descripcion: "Acumula el 5% de tus compras en puntos redimibles." },
  ],
  2: [
    { titulo: "Acceso Anticipado VIP", descripcion: "Entrada preferencial a colecciones de temporada." },
    { titulo: "Obsequio de Cumpleaños", descripcion: "Bono de $50.000 COP durante tu mes de cumpleaños." },
  ],
  3: [
    { titulo: "Envío Gratuito", descripcion: "Envíos sin costo en todas tus compras digitales." },
    { titulo: "Garantía Extendida", descripcion: "Garantía preferencial en chaquetas de cuero." },
  ],
  4: [
    { titulo: "Descuento Aniversario", descripcion: "30% de descuento durante el mes de aniversario." },
    { titulo: "Taller de Estilo", descripcion: "Invitación exclusiva a asesorías de imagen." },
  ],
  5: [
    { titulo: "Preventa Flash", descripcion: "Descuentos de hasta 40% antes del público general." },
    { titulo: "Acumulación Doble", descripcion: "Doble acumulación de puntos los fines de semana." },
  ],
  6: [
    { titulo: "Puntos Redimibles", descripcion: "1 punto por cada $1.000 COP gastados en tiendas." },
    { titulo: "Mantenimiento de Prendas", descripcion: "Ajustes y dobladillos sin costo en jeans." },
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
  const [departamentoSeleccionadoId, establecerDepartamentoSeleccionadoId] = useState("");
  
  const [mensajeAlerta, establecerMensajeAlerta] = useState({ texto: "", tipo: "" });
  const [estaCargando, establecerEstaCargando] = useState(false);

  /**
   * 1. EFECTO PRINCIPAL: Cargar catálogos iniciales y precargar los datos del usuario.
   * Se ha inyectado el JWT en las cabeceras para sortear el Filtro de Seguridad.
   */
  useEffect(() => {
    let estaMontado = true;

    const inicializarDatosVista = async () => {
      // Recuperamos el token seguro guardado durante el inicio de sesión
      const tokenDeAcceso = localStorage.getItem('tokenAcceso');

      if (!tokenDeAcceso) {
        console.warn('Acceso denegado: No se encontró un token de sesión.');
        return;
      }

      // Preparamos la cabecera estándar para peticiones GET protegidas
      const configuracionPeticion = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenDeAcceso}`
        }
      };

      try {
        // --- 1.1 Carga de Catálogos Seguros ---
        const resTipos = await fetch("http://localhost:8080/api/catalogos/tipos-identificacion", configuracionPeticion);
        if (resTipos.ok && estaMontado) establecerListaTiposId(await resTipos.json());

        const resPaises = await fetch("http://localhost:8080/api/catalogos/paises", configuracionPeticion);
        if (resPaises.ok && estaMontado) establecerListaPaises(await resPaises.json());

        const resMarcas = await fetch("http://localhost:8080/api/catalogos/marcas", configuracionPeticion);
        if (resMarcas.ok && estaMontado) establecerListaMarcas(await resMarcas.json());

        // --- 1.2 Precarga de Datos del Cliente ---
        if (usuarioActual?.correo) {
          const respuestaCliente = await fetch(`http://localhost:8080/api/lealtad/cliente/correo/${usuarioActual.correo}`, configuracionPeticion);
          
          if (respuestaCliente.ok && estaMontado) {
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
            console.info("Info: Usuario nuevo, formulario en blanco.");
            establecerMensajeAlerta({
              texto: '¡Bienvenido! Por favor, complete sus datos para registrarse en el programa de lealtad.',
              tipo: 'info'
            });
          }
        }
      } catch (error) {
        if (estaMontado) console.error("Error al inicializar la vista de lealtad:", error);
      }
    };

    inicializarDatosVista();

    return () => { estaMontado = false; };
  }, [usuarioActual]);

  /**
   * 2. EFECTO SECUNDARIO: Cargar departamentos dependientes del país.
   * Se incluye inyección del JWT en la cabecera.
   */
  useEffect(() => {
    let estaMontado = true;
    const cargarDepartamentos = async () => {
      const tokenDeAcceso = localStorage.getItem('tokenAcceso');
      if (paisSeleccionadoId && tokenDeAcceso) {
        try {
          const respuesta = await fetch(`http://localhost:8080/api/catalogos/departamentos/${paisSeleccionadoId}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${tokenDeAcceso}` }
          });
          
          if (respuesta.ok && estaMontado) {
            establecerListaDepartamentos(await respuesta.json());
            const paisObj = listaPaises.find((p) => String(p.id) === String(paisSeleccionadoId));
            if (paisObj) {
              establecerDatosFormulario((prev) => ({ ...prev, pais: paisObj.nombre }));
            }
          }
        } catch (error) {
          if (estaMontado) console.error("Error al cargar departamentos:", error);
        }
      }
    };
    
    cargarDepartamentos();
    return () => { estaMontado = false; };
  }, [paisSeleccionadoId, listaPaises]);

  /**
   * 3. EFECTO TERCIARIO: Cargar ciudades dependientes del departamento.
   * Se incluye inyección del JWT en la cabecera.
   */
  useEffect(() => {
    let estaMontado = true;
    const cargarCiudades = async () => {
      const tokenDeAcceso = localStorage.getItem('tokenAcceso');
      if (departamentoSeleccionadoId && tokenDeAcceso) {
        try {
          const respuesta = await fetch(`http://localhost:8080/api/catalogos/ciudades/${departamentoSeleccionadoId}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${tokenDeAcceso}` }
          });
          
          if (respuesta.ok && estaMontado) {
            establecerListaCiudades(await respuesta.json());
            const depObj = listaDepartamentos.find((d) => String(d.id) === String(departamentoSeleccionadoId));
            if (depObj) {
              establecerDatosFormulario((prev) => ({ ...prev, departamento: depObj.nombre }));
            }
          }
        } catch (error) {
          if (estaMontado) console.error("Error al cargar ciudades:", error);
        }
      }
    };
    
    cargarCiudades();
    return () => { estaMontado = false; };
  }, [departamentoSeleccionadoId, listaDepartamentos]);

  const listaBeneficios = datosFormulario.idMarca
    ? beneficiosPorMarcaSimulados[datosFormulario.idMarca] || []
    : [];

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    establecerDatosFormulario({ ...datosFormulario, [name]: value });
  };

  /**
   * Maneja el envío del formulario hacia el backend.
   * Valida el JWT y registra o actualiza al cliente.
   */
  const manejarEnvioFormulario = async (evento) => {
    evento.preventDefault();
    
    const tokenDeAcceso = localStorage.getItem('tokenAcceso');
    const cargaUtilDeDatos = { ...datosFormulario, correoElectronico: usuarioActual.correo };

    try {
      const respuesta = await fetch('http://localhost:8080/api/lealtad/registrar', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenDeAcceso}`
        },
        body: JSON.stringify(cargaUtilDeDatos),
      });

      if (respuesta.ok) {
        establecerMensajeAlerta({
          texto: '¡Información guardada y actualizada en el programa de fidelidad con éxito!',
          tipo: 'exito'
        });
      } else {
        if (respuesta.status === 401 || respuesta.status === 403) {
           establecerMensajeAlerta({
             texto: 'Su sesión ha expirado o no tiene permisos. Por favor, inicie sesión nuevamente.',
             tipo: 'error'
           });
        } else {
           const textoDeError = await respuesta.text();
           establecerMensajeAlerta({ texto: textoDeError || 'Ocurrió un error al procesar el registro.', tipo: 'error' });
        }
      }
    } catch (excepcion) {
      console.error('Error enviando datos protegidos:', excepcion);
      establecerMensajeAlerta({ texto: 'Error de conexión con el servidor backend en Spring Boot.', tipo: 'error' });
    }
  };

  return (
    <div className="contenedor-registro">
      <form className="formulario-lealtad" onSubmit={manejarEnvioFormulario}>
        <div className="cabecera-formulario-lealtad">
          <span className="correo-sesion">Sesión activa: {usuarioActual?.correo}</span>
          <button type="button" className="boton-cerrar-sesion" onClick={alCerrarSesion}>
            Cerrar Sesión
          </button>
        </div>

        <h2 className="titulo-bienvenida">Bienvenido al programa de fidelidad de GCO</h2>
        <p className="descripcion-registro">Gestione sus datos personales, consulte sus beneficios o actualice su información.</p>

        {mensajeAlerta.texto && (
          <div className={`aviso-alerta ${mensajeAlerta.tipo}`}>
            <span>{mensajeAlerta.texto}</span>
            <button type="button" className="boton-cerrar-aviso" onClick={() => establecerMensajeAlerta({ texto: "", tipo: "" })}>
              &times;
            </button>
          </div>
        )}

        <div className="fila-formulario">
          <div className="grupo-input">
            <label htmlFor="tipoIdentificacion">Tipo de Identificación</label>
            <select id="tipoIdentificacion" name="tipoIdentificacion" value={datosFormulario.tipoIdentificacion} onChange={manejarCambio} required>
              <option value="">Seleccione...</option>
              {listaTiposId.map((tipo) => (
                <option key={tipo.id} value={tipo.nombre}>{tipo.nombre}</option>
              ))}
            </select>
          </div>

          <div className="grupo-input">
            <label htmlFor="numeroIdentificacion">Número de Identificación</label>
            <input type="text" id="numeroIdentificacion" name="numeroIdentificacion" value={datosFormulario.numeroIdentificacion} onChange={manejarCambio} placeholder="Ej. 1023456789" required />
          </div>
        </div>

        <div className="fila-formulario">
          <div className="grupo-input">
            <label htmlFor="nombres">Nombres</label>
            <input type="text" id="nombres" name="nombres" value={datosFormulario.nombres} onChange={manejarCambio} placeholder="Ingrese sus nombres" required />
          </div>
          <div className="grupo-input">
            <label htmlFor="apellidos">Apellidos</label>
            <input type="text" id="apellidos" name="apellidos" value={datosFormulario.apellidos} onChange={manejarCambio} placeholder="Ingrese sus apellidos" required />
          </div>
        </div>

        <div className="fila-formulario">
          <div className="grupo-input">
            <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
            <input type="date" id="fechaNacimiento" name="fechaNacimiento" value={datosFormulario.fechaNacimiento} onChange={manejarCambio} required />
          </div>
          <div className="grupo-input">
            <label htmlFor="direccion">Dirección</label>
            <input type="text" id="direccion" name="direccion" value={datosFormulario.direccion} onChange={manejarCambio} placeholder="Ej. Calle 100 # 15-20" required />
          </div>
        </div>

        <div className="fila-formulario">
          <div className="grupo-input">
            <label htmlFor="paisSeleccionado">País</label>
            <select id="paisSeleccionado" value={paisSeleccionadoId} onChange={(e) => establecerPaisSeleccionadoId(e.target.value)} required>
              <option value="">Seleccione un país...</option>
              {listaPaises.map((pais) => (
                <option key={pais.id} value={pais.id}>{pais.nombre}</option>
              ))}
            </select>
          </div>

          <div className="grupo-input">
            <label htmlFor="departamentoSeleccionado">Departamento / Estado</label>
            <select id="departamentoSeleccionado" value={departamentoSeleccionadoId} onChange={(e) => establecerDepartamentoSeleccionadoId(e.target.value)} required disabled={!paisSeleccionadoId}>
              <option value="">Seleccione departamento...</option>
              {listaDepartamentos.map((dep) => (
                <option key={dep.id} value={dep.id}>{dep.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="fila-formulario">
          <div className="grupo-input">
            <label htmlFor="ciudad">Ciudad</label>
            <select id="ciudad" name="ciudad" value={datosFormulario.ciudad} onChange={manejarCambio} required disabled={!departamentoSeleccionadoId}>
              <option value="">Seleccione ciudad...</option>
              {listaCiudades.map((ciu) => (
                <option key={ciu.id} value={ciu.nombre}>{ciu.nombre}</option>
              ))}
            </select>
          </div>

          <div className="grupo-input">
            <label htmlFor="idMarca">Marca a la que desea registrarse</label>
            <select id="idMarca" name="idMarca" value={datosFormulario.idMarca} onChange={manejarCambio} required>
              <option value="">Seleccione una marca...</option>
              {listaMarcas.map((marca) => (
                <option key={marca.id} value={marca.id}>{marca.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        {listaBeneficios.length > 0 && (
          <div className="contenedor-beneficios-marca">
            <h3 className="titulo-beneficios">Beneficios Exclusivos de su Marca</h3>
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

        <div className="contenedor-botones-inferiores">
          <button type="submit" className="boton-registro">Guardar y Actualizar Información</button>
          <button type="button" className="boton-salir-secundario" onClick={alCerrarSesion}>Salir / Cerrar Sesión</button>
        </div>
      </form>
    </div>
  );
};