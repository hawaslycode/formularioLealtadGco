package com.gco.lealtad_gco_backend.controlador;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador REST para el suministro de catálogos estáticos (Geografía,
 * Marcas, Documentos).
 */
@RestController
@RequestMapping("/api/catalogos")
@CrossOrigin(origins = "http://localhost:5173")
public class CatalogoControlador {

    private final JdbcTemplate conectorJdbc;

    public CatalogoControlador(JdbcTemplate conectorJdbc) {
        this.conectorJdbc = conectorJdbc;
    }

    @GetMapping("/tipos-identificacion")
    public ResponseEntity<List<Map<String, Object>>> despacharTiposDeIdentificacion() {
        return ResponseEntity.ok(conectorJdbc
                .queryForList("SELECT id_tipo_identificacion AS id, nombre_tipo AS nombre FROM tipos_identificacion"));
    }

    @GetMapping("/marcas")
    public ResponseEntity<List<Map<String, Object>>> despacharMarcasDisponibles() {
        return ResponseEntity
                .ok(conectorJdbc.queryForList("SELECT id_marca AS id, nombre_marca AS nombre FROM marcas"));
    }

    @GetMapping("/paises")
    public ResponseEntity<List<Map<String, Object>>> despacharPaises() {
        return ResponseEntity.ok(conectorJdbc.queryForList("SELECT id_pais AS id, nombre_pais AS nombre FROM paises"));
    }

    @GetMapping("/departamentos/{idPais}")
    public ResponseEntity<List<Map<String, Object>>> despacharDepartamentosPorPais(@PathVariable Long idPais) {
        return ResponseEntity.ok(conectorJdbc.queryForList(
                "SELECT id_departamento AS id, nombre_departamento AS nombre FROM departamentos WHERE id_pais = ?",
                idPais));
    }

    @GetMapping("/ciudades/{idDepartamento}")
    public ResponseEntity<List<Map<String, Object>>> despacharCiudadesPorDepartamento(
            @PathVariable Long idDepartamento) {
        return ResponseEntity.ok(conectorJdbc.queryForList(
                "SELECT id_ciudad AS id, nombre_ciudad AS nombre FROM ciudades WHERE id_departamento = ?",
                idDepartamento));
    }
}