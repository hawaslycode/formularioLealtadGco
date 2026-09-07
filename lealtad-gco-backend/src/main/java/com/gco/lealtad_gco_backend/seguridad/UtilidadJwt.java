package com.gco.lealtad_gco_backend.seguridad;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

/**
 * Componente utilitario para la generación, lectura y validación de JSON Web Tokens (JWT).
 * Gestiona la firma criptográfica para asegurar que los tokens no sean alterados.
 */
@Component
public class UtilidadJwt {

    /**
     * Clave secreta generada dinámicamente para firmar los tokens.
     * En un entorno estricto de producción, este valor debería inyectarse 
     * desde una variable de entorno (.env) o desde application.properties.
     */
    private final Key claveSecreta = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    
    /**
     * Tiempo de vida del token establecido en 24 horas (expresado en milisegundos).
     */
    private final long tiempoDeExpiracion = 86400000;

    /**
     * Fabrica un token JWT seguro con el correo del usuario como sujeto principal.
     * 
     * @param correoElectronico Identificador único del usuario autenticado.
     * @return Cadena de texto que representa el token firmado.
     */
    public String generarToken(String correoElectronico) {
        return Jwts.builder()
                .setSubject(correoElectronico)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + tiempoDeExpiracion))
                .signWith(claveSecreta)
                .compact();
    }

    /**
     * Desencripta el token para extraer el correo electrónico del usuario.
     * 
     * @param token Cadena JWT enviada por el frontend.
     * @return El correo electrónico contenido en la carga útil (Payload).
     */
    public String extraerCorreoElectronico(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(claveSecreta)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * Comprueba si el token enviado coincide con el usuario y si aún está vigente.
     * 
     * @param token El JWT a validar.
     * @param correoElectronico El correo esperado.
     * @return Verdadero si el token es legítimo y no ha caducado.
     */
    public boolean validarToken(String token, String correoElectronico) {
        final String correoExtraido = extraerCorreoElectronico(token);
        return (correoExtraido.equals(correoElectronico) && !estaExpirado(token));
    }

    /**
     * Verifica la fecha de caducidad interna del token.
     */
    private boolean estaExpirado(String token) {
        Date fechaExpiracion = Jwts.parserBuilder()
                .setSigningKey(claveSecreta)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
        return fechaExpiracion.before(new Date());
    }
}