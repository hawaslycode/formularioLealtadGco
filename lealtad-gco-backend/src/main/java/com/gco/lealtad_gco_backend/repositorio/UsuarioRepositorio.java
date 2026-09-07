package com.gco.lealtad_gco_backend.repositorio;

import com.gco.lealtad_gco_backend.modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * Repositorio encargado de gestionar las operaciones CRUD de la entidad
 * Usuario.
 */
public interface UsuarioRepositorio extends JpaRepository<Usuario, Long> {

    /**
     * Busca un usuario registrado mediante su correo electrónico.
     * 
     * @param correoElectronico El correo a validar.
     * @return Objeto contenedor opcional con los datos del usuario.
     */
    Optional<Usuario> findByCorreoElectronico(String correoElectronico);
}