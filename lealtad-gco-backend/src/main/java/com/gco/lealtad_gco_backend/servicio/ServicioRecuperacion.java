package com.gco.lealtad_gco_backend.servicio;

import com.gco.lealtad_gco_backend.modelo.TokenRecuperacion;
import com.gco.lealtad_gco_backend.modelo.Usuario;
import com.gco.lealtad_gco_backend.repositorio.TokenRecuperacionRepositorio;
import com.gco.lealtad_gco_backend.repositorio.UsuarioRepositorio;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Servicio encargado de orquestar la lógica de negocio para la recuperación de contraseñas.
 * Gestiona la generación de tokens seguros, el despacho de correos SMTP y el cambio de claves con BCrypt.
 */
@Service
public class ServicioRecuperacion {

    private final TokenRecuperacionRepositorio tokenRecuperacionRepositorio;
    private final JavaMailSender despachadorDeCorreos;
    private final UsuarioRepositorio usuarioRepositorio;
    private final PasswordEncoder codificadorContrasenas;

    /**
     * Inyección de dependencias mediante el constructor de la clase.
     */
    public ServicioRecuperacion(TokenRecuperacionRepositorio tokenRecuperacionRepositorio,
            JavaMailSender despachadorDeCorreos,
            UsuarioRepositorio usuarioRepositorio,
            PasswordEncoder codificadorContrasenas) {
        this.tokenRecuperacionRepositorio = tokenRecuperacionRepositorio;
        this.despachadorDeCorreos = despachadorDeCorreos;
        this.usuarioRepositorio = usuarioRepositorio;
        this.codificadorContrasenas = codificadorContrasenas;
    }

    /**
     * Procesa la solicitud inicial de recuperación: depura tokens viejos, genera un nuevo UUID,
     * almacena el registro en PostgreSQL y envía las instrucciones al correo del usuario[cite: 2].
     * 
     * @param correoUsuario Correo electrónico del usuario que solicita la recuperación.
     */
    @Transactional
    public void procesarSolicitudRecuperacion(String correoUsuario) {
        // 1. Limpiamos cualquier token previo asociado a este correo
        tokenRecuperacionRepositorio.deleteByCorreoUsuario(correoUsuario);

        // 2. Generamos un identificador criptográfico único (UUID)
        String tokenGenerado = UUID.randomUUID().toString();

        // 3. Creamos el token con una vigencia estricta de 15 minutos
        TokenRecuperacion nuevoToken = new TokenRecuperacion(tokenGenerado, correoUsuario, 15);
        
        // 4. Guardamos la entidad en la base de datos
        tokenRecuperacionRepositorio.save(nuevoToken);

        // 5. Despachamos el correo electrónico mediante el servicio SMTP configurado
        enviarCorreoRecuperacion(correoUsuario, tokenGenerado);
    }

    /**
     * Construye la estructura del mensaje de correo electrónico con el enlace de restablecimiento seguro.
     * 
     * @param destinatario Correo destino del usuario.
     * @param token Token criptográfico único generado.
     */
    private void enviarCorreoRecuperacion(String destinatario, String token) {
        String enlaceRecuperacion = "http://localhost:5173/restablecer-contrasena?token=" + token;

        SimpleMailMessage mensajeCorreo = new SimpleMailMessage();
        mensajeCorreo.setFrom("hawaslycode@gmail.com");
        mensajeCorreo.setTo(destinatario);
        mensajeCorreo.setSubject("GCO - Instrucciones de Recuperación de Contraseña");
        mensajeCorreo.setText("Hola,\n\n"
                + "Hemos recibido una solicitud para restablecer su contraseña en el programa de fidelidad GCO.\n"
                + "Por favor, haga clic en el siguiente enlace seguro para crear una nueva contraseña. "
                + "Este enlace caducará en 15 minutos por motivos de seguridad:\n\n"
                + enlaceRecuperacion + "\n\n"
                + "Si usted no solicitó este cambio, ignore y elimine este mensaje.\n\n"
                + "Atentamente,\nEquipo de Seguridad GCO");

        despachadorDeCorreos.send(mensajeCorreo);
    }

    /**
     * Valida la autenticidad y vigencia del token recibido, busca al usuario en la base de datos,
     * cifra la nueva contraseña con BCrypt, actualiza el registro y elimina el token de un solo uso[cite: 2].
     * 
     * @param tokenAcceso El token único proveniente de la URL del frontend.
     * @param nuevaContrasena La nueva contraseña en texto plano introducida por el usuario.
     */
    @Transactional
    public void cambiarContrasenaConToken(String tokenAcceso, String nuevaContrasena) {
        // 1. Verificamos la existencia del token en PostgreSQL
        TokenRecuperacion tokenGuardado = tokenRecuperacionRepositorio.findByTokenAcceso(tokenAcceso)
                .orElseThrow(() -> new IllegalArgumentException("El token de seguridad es inválido o no existe."));

        // 2. Validamos si el token ha superado los 15 minutos de caducidad
        if (tokenGuardado.getFechaExpiracion().isBefore(LocalDateTime.now())) {
            tokenRecuperacionRepositorio.delete(tokenGuardado);
            throw new IllegalArgumentException("El enlace de recuperación ha expirado. Por favor, solicite uno nuevo.");
        }

        // 3. Localizamos al usuario dueño del correo asociado al token
        Usuario usuario = usuarioRepositorio.findByCorreoElectronico(tokenGuardado.getCorreoUsuario())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado en el sistema."));

        // 4. Encriptamos la nueva contraseña utilizando BCrypt
        usuario.setContrasena(codificadorContrasenas.encode(nuevaContrasena));
        
        // 5. Persistimos los cambios del usuario
        usuarioRepositorio.save(usuario);

        // 6. Eliminamos el token utilizado para garantizar que no pueda ser reutilizado
        tokenRecuperacionRepositorio.delete(tokenGuardado);
    }
}