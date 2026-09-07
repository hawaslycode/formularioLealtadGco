package com.gco.lealtad_gco_backend.controlador;

import com.gco.lealtad_gco_backend.servicio.ServicioRecuperacion;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controlador REST encargado de exponer los puntos de acceso públicos 
 * para iniciar la recuperación de credenciales y actualizar la contraseña de usuario.
 */
@RestController
@RequestMapping("/api/autenticacion")
@CrossOrigin(origins = "http://localhost:5173")
public class ControladorRecuperacion {

    private final ServicioRecuperacion servicioRecuperacion;

    /**
     * Inyección del servicio de negocio mediante el constructor.
     */
    public ControladorRecuperacion(ServicioRecuperacion servicioRecuperacion) {
        this.servicioRecuperacion = servicioRecuperacion;
    }

    /**
     * Endpoint POST para recibir el correo electrónico y disparar la generación y envío del token.
     * 
     * @param cargaUtil Mapa que contiene la clave "correoElectronico".
     * @return Respuesta HTTP indicando éxito o error al procesar.
     */
    @PostMapping("/olvide-contrasena")
    public ResponseEntity<String> solicitarRecuperacion(@RequestBody Map<String, String> cargaUtil) {
        String correoUsuario = cargaUtil.get("correoElectronico");
        try {
            servicioRecuperacion.procesarSolicitudRecuperacion(correoUsuario);
            return ResponseEntity.ok("Proceso de recuperación iniciado exitosamente.");
        } catch (Exception excepcion) {
            return ResponseEntity.internalServerError().body("Error al procesar la solicitud de recuperación.");
        }
    }

    /**
     * Endpoint POST para validar el token de acceso y aplicar el cambio definitivo de contraseña.
     * 
     * @param cargaUtil Mapa que contiene "tokenAcceso" y "nuevaContrasena".
     * @return Respuesta HTTP con el estado de la actualización o mensaje de fallo por validación.
     */
    @PostMapping("/cambiar-contrasena")
    public ResponseEntity<String> actualizarContrasena(@RequestBody Map<String, String> cargaUtil) {
        String tokenAcceso = cargaUtil.get("tokenAcceso");
        String nuevaContrasena = cargaUtil.get("nuevaContrasena");

        try {
            servicioRecuperacion.cambiarContrasenaConToken(tokenAcceso, nuevaContrasena);
            return ResponseEntity.ok("Contraseña actualizada exitosamente.");
        } catch (IllegalArgumentException excepcionValidacion) {
            return ResponseEntity.badRequest().body(excepcionValidacion.getMessage());
        } catch (Exception excepcionGeneral) {
            return ResponseEntity.internalServerError().body("Error interno al cambiar la contraseña.");
        }
    }
}