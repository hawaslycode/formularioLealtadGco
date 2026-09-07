package com.gco.lealtad_gco_backend.controlador;

import com.gco.lealtad_gco_backend.modelo.ClienteLealtad;
import com.gco.lealtad_gco_backend.repositorio.ClienteLealtadRepositorio;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * Controlador REST encargado de gestionar los perfiles del programa de lealtad.
 */
@RestController
@RequestMapping("/api/lealtad")
@CrossOrigin(origins = "http://localhost:5173")
public class ClienteLealtadControlador {

    private final ClienteLealtadRepositorio repositorioDeLealtad;

    public ClienteLealtadControlador(ClienteLealtadRepositorio repositorioDeLealtad) {
        this.repositorioDeLealtad = repositorioDeLealtad;
    }

    /**
     * Endpoint GET que facilita la precarga automática de datos en el frontend de
     * React.
     * 
     * @param correoElectronico Correo asociado a la sesión del usuario.
     * @return Los datos del cliente registrados previamente.
     */
    @GetMapping("/cliente/correo/{correoElectronico}")
    public ResponseEntity<?> obtenerPerfilPorCorreo(@PathVariable String correoElectronico) {
        try {
            Optional<ClienteLealtad> perfilEncontrado = repositorioDeLealtad.findByCorreoElectronico(correoElectronico);

            if (perfilEncontrado.isPresent()) {
                return ResponseEntity.ok(perfilEncontrado.get());
            }

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No existen datos de lealtad registrados para este correo.");
        } catch (Exception excepcion) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ocurrió un error al consultar el perfil de lealtad.");
        }
    }

    /**
     * Endpoint POST que ejecuta lógica de 'Upsert' (Actualización si existe,
     * Inserción si es nuevo).
     */
    @PostMapping("/registrar")
    public ResponseEntity<?> registrarOActualizarPerfil(@RequestBody ClienteLealtad datosFormulario) {
        try {
            Optional<ClienteLealtad> registroExistente = repositorioDeLealtad
                    .findByCorreoElectronico(datosFormulario.getCorreoElectronico());

            ClienteLealtad perfilDestino;

            if (registroExistente.isPresent()) {
                perfilDestino = registroExistente.get();
                perfilDestino.setTipoIdentificacion(datosFormulario.getTipoIdentificacion());
                perfilDestino.setNumeroIdentificacion(datosFormulario.getNumeroIdentificacion());
                perfilDestino.setNombres(datosFormulario.getNombres());
                perfilDestino.setApellidos(datosFormulario.getApellidos());
                perfilDestino.setFechaNacimiento(datosFormulario.getFechaNacimiento());
                perfilDestino.setDireccion(datosFormulario.getDireccion());
                perfilDestino.setPais(datosFormulario.getPais());
                perfilDestino.setDepartamento(datosFormulario.getDepartamento());
                perfilDestino.setCiudad(datosFormulario.getCiudad());
                perfilDestino.setIdMarca(datosFormulario.getIdMarca());
            } else {
                perfilDestino = datosFormulario;
            }

            ClienteLealtad perfilGuardado = repositorioDeLealtad.save(perfilDestino);
            return ResponseEntity.ok(perfilGuardado);

        } catch (Exception excepcion) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error crítico al actualizar la base de datos PostgreSQL: " + excepcion.getMessage());
        }
    }
}