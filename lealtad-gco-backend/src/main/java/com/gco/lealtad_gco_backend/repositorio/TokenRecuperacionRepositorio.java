package com.gco.lealtad_gco_backend.repositorio;

import com.gco.lealtad_gco_backend.modelo.TokenRecuperacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repositorio de Spring Data JPA para la gestión y persistencia de la entidad TokenRecuperacion.
 */
public interface TokenRecuperacionRepositorio extends JpaRepository<TokenRecuperacion, Long> {

    /**
     * Busca un registro de token de recuperación utilizando la cadena de acceso única.
     * 
     * @param tokenAcceso Cadena del token a buscar.
     * @return Un objeto Optional que contiene la entidad si es encontrada.
     */
    Optional<TokenRecuperacion> findByTokenAcceso(String tokenAcceso);

    /**
     * Elimina de la base de datos todos los tokens asociados previamente a un correo específico,
     * evitando acumulación de registros obsoletos al solicitar múltiples recuperaciones.
     * 
     * @param correoUsuario Correo del usuario cuyos tokens serán depurados.
     */
    void deleteByCorreoUsuario(String correoUsuario);
}