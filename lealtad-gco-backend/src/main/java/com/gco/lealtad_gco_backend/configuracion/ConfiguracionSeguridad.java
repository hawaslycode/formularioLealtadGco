package com.gco.lealtad_gco_backend.configuracion;

import com.gco.lealtad_gco_backend.seguridad.FiltroAutenticacionJwt;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;


/**
 * Clase de configuración principal de Spring Security.
 * Gestiona la política de sesiones stateless, la encriptación BCrypt,
 * el filtro de autenticación JWT y las reglas de acceso público/protegido.
 */
@Configuration
@EnableWebSecurity
public class ConfiguracionSeguridad {

    private final FiltroAutenticacionJwt filtroAutenticacionJwt;

    /**
     * Inyección del filtro JWT personalizado mediante el constructor de la clase.
     */
    public ConfiguracionSeguridad(FiltroAutenticacionJwt filtroAutenticacionJwt) {
        this.filtroAutenticacionJwt = filtroAutenticacionJwt;
    }

    /**
     * Define el bean para la codificación y verificación de contraseñas utilizando BCrypt.
     */
    @Bean
    public PasswordEncoder codificadorContrasenas() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Expone el gestor de autenticación requerido para validar credenciales nativas.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuracionAutenticacion) throws Exception {
        return configuracionAutenticacion.getAuthenticationManager();
    }

    /**
     * Configura la cadena de filtros de seguridad HTTP, deshabilitando CSRF para APIs REST,
     * estableciendo sesiones stateless, permitiendo el acceso público al módulo de autenticación/recuperación
     * e integrando el filtro JWT para el resto de rutas privadas.
     */
    @Bean
    public SecurityFilterChain filtrarCadenaSeguridad(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(crearFuenteConfiguracionCors())) // Activamos CORS aquí
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(autorizacion -> autorizacion
                .requestMatchers("/api/autenticacion/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(filtroAutenticacionJwt, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Define los orígenes, cabeceras y métodos HTTP permitidos para evitar bloqueos CORS.
     */
    @Bean
    public CorsConfigurationSource crearFuenteConfiguracionCors() {
        CorsConfiguration configuracionCors = new CorsConfiguration();
        
        // Permitimos explícitamente el origen de tu servidor de desarrollo en React
        configuracionCors.setAllowedOrigins(List.of("http://localhost:5173"));
        
        // Métodos HTTP permitidos para las transacciones REST
        configuracionCors.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Permitimos todas las cabeceras, incluyendo 'Authorization' (fundamental para el JWT)
        configuracionCors.setAllowedHeaders(List.of("*"));
        
        // Permitimos el envío de credenciales y tokens de sesión
        configuracionCors.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource origenConfiguracion = new UrlBasedCorsConfigurationSource();
        origenConfiguracion.registerCorsConfiguration("/**", configuracionCors);
        
        return origenConfiguracion;
    }
}