# Capítulo 3 — Instalación de PostgreSQL y PostGIS

**Curso:** Servicios SIG y aplicaciones web geográficas  
**Guía utilizada:** `taller/capitulo-03-postgresql-postgis.md` del repositorio del profesor  
**Entorno:** Windows PowerShell, Docker, PostgreSQL 16 / PostGIS 3.4  
**Contenedor:** `curso_postgis`  
**Base de datos:** `taller_gis`  
**Puerto de acceso desde Windows:** `5433` (contenedor: `5432`)  
**Área de trabajo:** cinco ciudades de Colombia.

## 1. Objetivo y alcance

Verificar PostgreSQL/PostGIS mediante Docker y ejecutar el ejercicio práctico del capítulo: crear una tabla espacial de ciudades, insertar los datos del ejemplo, calcular distancias entre ciudades, generar un buffer de 200 km y crear un índice GiST. Se utiliza el contenedor del curso y se conserva la separación respecto del proyecto previo del Amazonas.

## 2. Verificación de servicios y base de datos

Se revisó el estado de los contenedores con `docker ps -a`. Inicialmente, `curso_postgis` estaba detenido, mientras que el contenedor `postgis` del proyecto anterior estaba activo. Se inició **solo** `curso_postgis` mediante `docker start curso_postgis`.

La consulta a `pg_database` mostró tres bases en ese contenedor: `postgres`, `taller_gis` y `geodatos`. Por tanto, no se necesitó crear nuevamente `taller_gis` ni eliminar los volúmenes existentes.

Se verificó la extensión con:

```powershell
docker exec curso_postgis psql -U postgres -d taller_gis -c "SELECT current_database() AS base_datos, postgis_version() AS version_postgis;"
```

**Respuesta comprobada:** `taller_gis | 3.4 USE_GEOS=1 USE_PROJ=1 USE_STATS=1`.

> Nota de infraestructura: la guía del profesor describe el puerto `5432` para su configuración predeterminada. En este equipo el contenedor `curso_postgis` está publicado en el **puerto 5433 del anfitrión**, para evitar conflictos con otro servicio PostgreSQL que utiliza el `5432`. Desde `docker exec` no se necesita especificar ese puerto.

## 3. Creación de la tabla y carga de ciudades

Se ejecutó una definición espacial equivalente a la propuesta en la guía:

```sql
CREATE TABLE IF NOT EXISTS ciudades (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    poblacion INTEGER,
    geom GEOMETRY(POINT, 4326)
);
```

Los puntos se crearon con `ST_MakePoint(longitud, latitud)` y se etiquetaron en `EPSG:4326` mediante `ST_SetSRID`.

| Ciudad | Población del ejemplo | Longitud | Latitud |
|---|---:|---:|---:|
| Bogotá | 7.181.469 | -74.0721 | 4.7110 |
| Medellín | 2.508.452 | -75.5636 | 6.2442 |
| Cali | 2.227.642 | -76.5225 | 3.4516 |
| Barranquilla | 1.232.766 | -74.7813 | 10.9685 |
| Cartagena | 1.028.736 | -75.5144 | 10.3910 |

**Resultado de la operación:** `CREATE TABLE` e `INSERT 0 5`.

![Salida inicial de la tabla de ciudades](evidencias/capitulo-03/00_ciudades_insertadas.png)

Las poblaciones son **valores didácticos suministrados en la guía**, no estimaciones demográficas actuales.

Durante la carga, la consola mostró inicialmente `Bogot?` y `Medell?n`. Se corrigieron los nombres con literales Unicode SQL (`U&'Bogot\00E1'`, `U&'Medell\00EDn'`) y se verificó posteriormente la visualización de las tildes en los resultados de consultas.

## 4. Distancias geodésicas entre ciudades

La instrucción SQL usada para obtener pares únicos, evitando duplicar A–B y B–A, fue:

```sql
SELECT
    a.nombre AS origen,
    b.nombre AS destino,
    ROUND(
        (ST_Distance(a.geom::geography, b.geom::geography) / 1000)::numeric,
        2
    ) AS distancia_km
FROM ciudades a
JOIN ciudades b ON a.id < b.id
ORDER BY origen, destino;
```

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

**Resultado verificado:** diez pares únicos (`10 rows`). Las cifras representan distancias geodésicas aproximadas en kilómetros, **no** recorridos por carretera.

![Evidencia de diez distancias calculadas](evidencias/capitulo-03/03_distancias_ciudades.png)

## 5. Buffer de 200 km alrededor de Bogotá

Se creó la tabla `buffer_bogota_200km` a partir de la geometría del punto de Bogotá utilizando:

```sql
SELECT ST_Buffer(geom::geography, 200000)::geometry AS geom
FROM ciudades
WHERE nombre = U&'Bogot\00E1';
```

En la primera ejecución, la tabla quedó vacía debido al problema de codificación del nombre. Después de corregir el nombre se reconstruyó su contenido y se verificó el siguiente resultado:

| Propiedad | Valor comprobado |
|---|---|
| Nombre | Bogotá |
| Radio solicitado | 200.000 metros (200 km) |
| Tipo de geometría | `ST_Polygon` |
| SRID | 4326 |
| Área calculada mediante `ST_Area(geom::geography)` | **124.894,68 km²** |
| Registros de la tabla | **1** |

**Consulta de verificación:**

```sql
SELECT
    nombre,
    ST_GeometryType(geom) AS tipo_geometria,
    ST_SRID(geom) AS srid,
    ROUND((ST_Area(geom::geography) / 1000000)::numeric, 2) AS area_km2
FROM buffer_bogota_200km;
```

El área reportada es el área de la **aproximación poligonal** obtenida; el radio de entrada fue 200 km. No se afirma que el resultado tenga exactamente el área matemática de un círculo ideal.

![Evidencia del buffer de 200 km y su área](evidencias/capitulo-03/02_buffer_bogota.png)

## 6. Creación y verificación del índice espacial GiST

```sql
CREATE INDEX IF NOT EXISTS idx_ciudades_geom
ON ciudades USING GIST (geom);
```

La consulta al catálogo `pg_indexes` confirmó dos índices en la tabla `ciudades`:

- `ciudades_pkey`: índice único B-tree sobre `id`.
- `idx_ciudades_geom`: **índice espacial GiST** sobre `geom`.

![Evidencia de los índices de la tabla ciudades](evidencias/capitulo-03/01_indice_gist.png)

## 7. Comprobación final y conclusiones

Se ejecutó una consulta de consolidación con subconsultas de conteo. La respuesta observada fue:

| Indicador | Total |
|---|---:|
| Registros de `ciudades` | **5** |
| Registros de `buffer_bogota_200km` | **1** |
| Índice espacial `idx_ciudades_geom` | **1** |

![Evidencia de la comprobación final](evidencias/capitulo-03/04_verificacion_final.png)

Se cumplió el ejercicio práctico del Capítulo 3: verificación del servicio PostGIS en Docker, uso de `taller_gis`, carga de cinco geometrías puntuales, análisis de diez distancias, buffer espacial de 200 km e índice GiST. Los resultados fueron verificados mediante salidas reales de PostgreSQL compartidas durante el desarrollo del taller.

**Alcance de evidencia:** las capturas incluidas documentan las operaciones descritas. No se adjuntan respaldos exportados de las tablas ni una base de datos completa. El apartado de pgAdmin de la guía es explicativo y no se presenta como una conexión a pgAdmin efectivamente comprobada en esta entrega.

## 8. Fuentes

- [Guía del profesor — Repositorio Servicios SIG y Websites](https://github.com/epiragauta/servicios_sig_y_websites/tree/main/taller)
- [PostgreSQL 16 — Documentación](https://www.postgresql.org/docs/16/)
- [PostGIS — Documentación](https://postgis.net/documentation/)

---
**Producto:** `capitulo-03-postgis.md` con evidencias relativas en `evidencias/capitulo-03/`, preparado para su incorporación al repositorio personal del curso.
