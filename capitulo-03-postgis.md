# Capítulo 3 — PostgreSQL y PostGIS

**Taller práctico | Servicios SIG y aplicaciones web geográficas**

**Área de trabajo:** Colombia
**Entorno:** Docker — PostgreSQL 16 — PostGIS 3.4
**Base de datos:** taller_gis

---

## 1. Objetivo

Implementar y verificar una base de datos espacial en PostgreSQL/PostGIS, mediante la creación de geometrías, consultas de distancia, áreas de influencia e índices espaciales.

## 2. Verificación del entorno

Se utilizó el contenedor Docker `curso_postgis`, independiente del entorno utilizado para los servicios SIG del proyecto Amazonas.

| Componente | Resultado verificado |
|---|---|
| Contenedor | `curso_postgis` |
| PostgreSQL | Versión 16 |
| Base de datos | `taller_gis` |
| PostGIS | `3.4 USE_GEOS=1 USE_PROJ=1 USE_STATS=1` |
| Cliente de consulta | `psql` mediante Docker |

La conexión y la consulta `postgis_version()` se ejecutaron satisfactoriamente.

## 3. Creación de la tabla de ciudades

Se creó la tabla `ciudades` con los campos `id`, `nombre`, `poblacion` y `geom`. Las geometrías corresponden a puntos en el sistema de referencia EPSG:4326.

| Ciudad | Población usada en el ejercicio | Longitud | Latitud |
|---|---:|---:|---:|
| Bogotá | 7.181.469 | -74.0721 | 4.7110 |
| Medellín | 2.508.452 | -75.5636 | 6.2442 |
| Cali | 2.227.642 | -76.5225 | 3.4516 |
| Barranquilla | 1.232.766 | -74.7813 | 10.9685 |
| Cartagena | 1.028.736 | -75.5144 | 10.3910 |

**Resultado:** cinco registros insertados y verificados.

Las poblaciones son los valores de ejemplo de la guía; no representan necesariamente estimaciones demográficas vigentes.

## 4. Distancias geodésicas

Se utilizó la función `ST_Distance` con conversión a `geography` para calcular las distancias entre todos los pares únicos de ciudades.

| Origen | Destino | Distancia (km) |
|---|---|---:|
| Barranquilla | Bogotá | 696,46 |
| Barranquilla | Cali | 853,24 |
| Barranquilla | Cartagena | 102,53 |
| Barranquilla | Medellín | 529,55 |
| Bogotá | Cali | 305,65 |
| Bogotá | Cartagena | 648,01 |
| Bogotá | Medellín | 236,77 |
| Cali | Cartagena | 775,47 |
| Cali | Medellín | 326,61 |
| Medellín | Cartagena | 458,66 |

**Resultado:** diez pares de ciudades, sin duplicaciones.

Las distancias corresponden a cálculos geodésicos en kilómetros y no a recorridos por carretera.

### Consulta SQL utilizada

    SELECT
        a.nombre AS origen,
        b.nombre AS destino,
        ROUND((ST_Distance(a.geom::geography,
              b.geom::geography) / 1000)::numeric, 2)
              AS distancia_km
    FROM ciudades a
    JOIN ciudades b ON a.id < b.id
    ORDER BY origen, destino;

## 5. Buffer de 200 km alrededor de Bogotá

Se utilizó `ST_Buffer` sobre la geometría convertida a `geography`, con una distancia solicitada de 200.000 metros. El resultado se almacenó en la tabla `buffer_bogota_200km`.

| Parámetro | Resultado |
|---|---|
| Ciudad | Bogotá |
| Radio solicitado | 200 km |
| Tipo de geometría | `ST_Polygon` |
| Sistema de referencia | EPSG:4326 |
| Área calculada | **124.894,68 km²** |
| Registros generados | 1 |

### Consulta de verificación

    SELECT
        nombre,
        ST_GeometryType(geom) AS tipo_geometria,
        ST_SRID(geom) AS srid,
        ROUND((ST_Area(geom::geography)
              / 1000000)::numeric, 2) AS area_km2
    FROM buffer_bogota_200km;

**Interpretación:** la superficie obtenida representa la aproximación poligonal del área de influencia de 200 km alrededor de Bogotá.

## 6. Creación y verificación del índice espacial

Se creó un índice espacial GiST sobre la columna `geom` de la tabla `ciudades`.

    CREATE INDEX IF NOT EXISTS idx_ciudades_geom
    ON ciudades USING GIST (geom);

La revisión de `pg_indexes` confirmó los siguientes índices:

| Índice | Tipo | Función |
|---|---|---|
| `ciudades_pkey` | B-tree | Identificador principal |
| `idx_ciudades_geom` | GiST | Indexación espacial de geometrías |

## 7. Validación final

| Comprobación | Cantidad | Estado |
|---|---:|---|
| Ciudades registradas | 5 | Correcto |
| Pares de ciudades analizados | 10 | Correcto |
| Buffer de Bogotá | 1 | Correcto |
| Índice espacial GiST | 1 | Correcto |

Durante el procedimiento se identificó y corrigió un inconveniente de codificación de caracteres en los nombres Bogotá y Medellín. Posteriormente se verificó que el buffer tuviera un registro válido.

## 8. Conclusiones

El desarrollo permitió comprobar el funcionamiento de PostgreSQL y PostGIS en Docker, así como la ejecución de operaciones espaciales básicas mediante SQL.

Se crearon cinco geometrías puntuales, se calcularon diez distancias geodésicas, se generó un buffer de 200 km y se verificó un índice espacial GiST.

Los resultados se contrastaron con las salidas obtenidas en PowerShell y `psql`, conservando la base `taller_gis` para continuar los próximos capítulos.

## Referencia

[Repositorio del profesor — Servicios SIG y Websites](https://github.com/epiragauta/servicios_sig_y_websites)
