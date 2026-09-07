package com.gco.lealtad_gco_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Clase principal que arranca la aplicación backend del programa de lealtad
 * GCO.
 */
@SpringBootApplication
public class LealtadGcoBackendApplication {

    /**
     * Método principal de ejecución.
     * 
     * @param argumentos Argumentos de línea de comandos.
     */
    public static void main(String[] argumentos) {
        SpringApplication.run(LealtadGcoBackendApplication.class, argumentos);
    }
}