package com.gco.lealtad_gco_backend.controlador;

import com.gco.lealtad_gco_backend.modelo.Usuario;
import com.gco.lealtad_gco_backend.repositorio.UsuarioRepositorio;
import com.gco.lealtad_gco_backend.seguridad.UtilidadJwt;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Controlador REST para el manejo de credenciales nativas.
 * Ahora integra seguridad BCrypt y emisión de JSON Web Tokens (JWT).
 */
@RestController
@RequestMapping("/api/autenticacion")
@CrossOrigin(origins = "http://localhost:5173")
public class AutenticacionControlador {

    private final UsuarioRepositorio repositorioDeUsuarios;
    private final PasswordEncoder codificadorDeContrasenas;
    private final UtilidadJwt utilidadJwt;

    /**
     * Inyección de dependencias mediante el constructor.
     * 
     * @param repositorioDeUsuarios Interfaz para interactuar con PostgreSQL.
     * @param codificadorDeContrasenas Herramienta de encriptación BCrypt.
     * @param utilidadJwt Componente para la generación y validación de tokens.
     */
    public AutenticacionControlador(UsuarioRepositorio repositorioDeUsuarios, 
                                    PasswordEncoder codificadorDeContrasenas,
                                    UtilidadJwt utilidadJwt) {
        this.repositorioDeUsuarios = repositorioDeUsuarios;
        this.codificadorDeContrasenas = codificadorDeContrasenas;
        this.utilidadJwt = utilidadJwt;
    }

    /**
     * Registra un nuevo usuario encriptando su contraseña antes de la persistencia.
     */
    @PostMapping("/registrar")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario nuevoUsuario) {
        try {
            Optional<Usuario> usuarioExistente = repositorioDeUsuarios.findByCorreoElectronico(nuevoUsuario.getCorreoElectronico());
            
            if (usuarioExistente.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Este correo electrónico ya se encuentra registrado.");
            }
            
            String contrasenaEncriptada = codificadorDeContrasenas.encode(nuevoUsuario.getContrasena());
            nuevoUsuario.setContrasena(contrasenaEncriptada);
            
            Usuario usuarioGuardado = repositorioDeUsuarios.save(nuevoUsuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioGuardado);
            
        } catch (Exception excepcion) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al guardar las credenciales: " + excepcion.getMessage());
        }
    }

    /**
     * Valida el acceso comparando el hash de la contraseña y emite un JWT.
     */
    @PostMapping("/login")
    public ResponseEntity<?> iniciarSesion(@RequestBody Usuario datosDeAcceso) {
        try {
            Optional<Usuario> usuarioEncontrado = repositorioDeUsuarios.findByCorreoElectronico(datosDeAcceso.getCorreoElectronico());
            
            if (usuarioEncontrado.isPresent()) {
                Usuario usuarioValidado = usuarioEncontrado.get();
                
                boolean esContrasenaCorrecta = codificadorDeContrasenas.matches(
                    datosDeAcceso.getContrasena(), 
                    usuarioValidado.getContrasena()
                );

                if (esContrasenaCorrecta) {
                    // =========================================================
                    // LÓGICA DE EMISIÓN DE JWT
                    // =========================================================
                    String tokenGenerado = utilidadJwt.generarToken(usuarioValidado.getCorreoElectronico());
                    
                    // Empaquetamos el usuario y el token en un mapa (JSON dinámico)
                    Map<String, Object> respuestaExitosa = new HashMap<>();
                    respuestaExitosa.put("usuario", usuarioValidado);
                    respuestaExitosa.put("tokenAcceso", tokenGenerado);
                    
                    return ResponseEntity.ok(respuestaExitosa);
                } else {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("La contraseña ingresada es incorrecta.");
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("El usuario no existe en la base de datos.");
            }
            
        } catch (Exception excepcion) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error procesando la solicitud de inicio de sesión.");
        }
    }
}