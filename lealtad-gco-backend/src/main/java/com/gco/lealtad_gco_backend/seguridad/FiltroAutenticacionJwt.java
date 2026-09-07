package com.gco.lealtad_gco_backend.seguridad;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

/**
 * Filtro de seguridad que se ejecuta una única vez por cada petición HTTP.
 * Se encarga de interceptar las solicitudes, extraer el JWT y autorizar el acceso
 * al contexto de Spring Security si el token es válido.
 */
@Component
public class FiltroAutenticacionJwt extends OncePerRequestFilter {

    private final UtilidadJwt utilidadJwt;

    /**
     * Inyección de dependencias para usar nuestras herramientas criptográficas.
     */
    public FiltroAutenticacionJwt(UtilidadJwt utilidadJwt) {
        this.utilidadJwt = utilidadJwt;
    }

    /**
     * Lógica principal del filtro interceptor.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest peticion, HttpServletResponse respuesta, FilterChain cadenaDeFiltros)
            throws ServletException, IOException {
        
        // 1. Extraemos la cabecera 'Authorization' enviada desde React
        final String cabeceraAutorizacion = peticion.getHeader("Authorization");

        String correoUsuario = null;
        String tokenJwt = null;

        // 2. Verificamos que la cabecera exista y cumpla con el estándar "Bearer "
        if (cabeceraAutorizacion != null && cabeceraAutorizacion.startsWith("Bearer ")) {
            // Extraemos el token puro (ignorando los primeros 7 caracteres de "Bearer ")
            tokenJwt = cabeceraAutorizacion.substring(7);
            try {
                correoUsuario = utilidadJwt.extraerCorreoElectronico(tokenJwt);
            } catch (Exception excepcion) {
                // Si el token es manipulado o expira, capturamos el error silenciosamente
                System.out.println("No se pudo extraer el JWT o ha expirado: " + excepcion.getMessage());
            }
        }

        // 3. Si obtuvimos el correo y aún no hay una sesión activa en el contexto actual
        if (correoUsuario != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            // Validamos matemáticamente la firma del token
            if (utilidadJwt.validarToken(tokenJwt, correoUsuario)) {
                
                // Generamos un certificado de autenticación interno para Spring Security
                UsernamePasswordAuthenticationToken tokenDeAutenticacion = new UsernamePasswordAuthenticationToken(
                        correoUsuario, null, new ArrayList<>());
                
                tokenDeAutenticacion.setDetails(new WebAuthenticationDetailsSource().buildDetails(peticion));
                
                // Aprobamos oficialmente el acceso para esta petición en el servidor
                SecurityContextHolder.getContext().setAuthentication(tokenDeAutenticacion);
            }
        }
        
        // 4. Continuamos con el flujo normal de la petición (dejamos pasar hacia el controlador)
        cadenaDeFiltros.doFilter(peticion, respuesta);
    }
}