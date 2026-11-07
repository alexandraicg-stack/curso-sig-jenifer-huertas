# Capítulo 7 — Carga de datos geográficos a PostgreSQL/PostGIS

**Taller:** Servicios SIG y sitios web · **Entorno:** Windows PowerShell, Docker, PostgreSQL 16/PostGIS 3.4, QGIS 3.40.15/GDAL · **Base:** `taller_gis` · **Contenedor:** `curso_postgis` · **Conexión local:** puerto `5433`.

## 1. Objetivo y metodología

Se desarrollaron los diez ejercicios de la guía del profesor: carga de datos geográficos, revisión de registros, validación de geometrías, índices espaciales, áreas, análisis municipal, intersección con un punto, mantenimiento y exportación. Los resultados se obtuvieron mediante comandos ejecutados en PowerShell y SQL consultado en PostGIS; las imágenes muestran las salidas reales de esos comandos.

### Ajuste técnico aplicado

La guía propone `shp2pgsql`, pero en `curso_postgis` se comprobó que el ejecutable **no está instalado** (`shp2pgsql: command not found`). No se instaló ni reconstruyó el contenedor: se utilizó el ejecutable `ogr2ogr.exe` incluido en `C:\Program Files\QGIS 3.40.15\bin`, alternativa también prevista por el capítulo.

Los shapefiles estaban en el directorio `data` del repositorio del profesor en Windows, pero **no en `/data`** del contenedor. Se copiaron los archivos asociados a `/tmp/datos_capitulo_07` para revisar sus metadatos. Finalmente la importación se hizo directamente **desde los archivos de Windows** mediante GDAL, apuntando al puerto publicado `5433`.

Se inspeccionaron los archivos `.prj`: `departamentos.shp` usa **MAGNA-SIRGAS geográfico, EPSG:4686**, mientras `municipios.shp` usa **WGS 84, EPSG:4326**. Se respetaron esos SRID originales, en lugar de asignar 4326 a ambas capas. El archivo `departamentos.cpg` reportó UTF-8. No se conserva evidencia concluyente de la lectura de `municipios.cpg`.

## 2. Carga de datos

Se utilizaron comandos equivalentes a los siguientes, sin `-overwrite`:

```powershell
$ogr = "C:\Program Files\QGIS 3.40.15\bin\ogr2ogr.exe"
$base = "C:\Users\Alexa\Downloads\SERVICIOS SIG\servicios_sig_y_websites\data"
$conexion = "PG:host=localhost port=5433 dbname=taller_gis user=postgres password=postgres"

& $ogr -f PostgreSQL $conexion "$base\departamentos.shp" `
  -nln public.departamentos -nlt PROMOTE_TO_MULTI -a_srs EPSG:4686 `
  -lco GEOMETRY_NAME=geom -lco SPATIAL_INDEX=GIST -progress

& $ogr -f PostgreSQL $conexion "$base\municipios.shp" `
  -nln public.municipios -nlt PROMOTE_TO_MULTI -a_srs EPSG:4326 `
  -lco GEOMETRY_NAME=geom -lco SPATIAL_INDEX=GIST -progress
```

Ambos procesos reportaron `100 - done.`. La comprobación mediante SQL confirmó:

| Tabla | Registros | SRID | Tipo geométrico |
|---|---:|---:|---|
| `public.departamentos` | **33** | **4686** | `ST_MultiPolygon` |
| `public.municipios` | **1.121** | **4326** | `ST_MultiPolygon` |
| **Total** | **1.154** | — | — |

```sql
SELECT COUNT(*) AS total, ST_SRID(geom) AS srid,
       ST_GeometryType(geom) AS geometria
FROM public.departamentos
GROUP BY ST_SRID(geom), ST_GeometryType(geom);
-- Repetir sustituyendo public.departamentos por public.municipios
```

![Comprobación de departamentos](evidencias/capitulo-07/01_departamentos_importados.png)

![Comprobación de municipios](evidencias/capitulo-07/02_municipios_importados.png)

## 3. Integridad de geometrías e índices

```sql
SELECT 'departamentos' AS capa, COUNT(*) AS total,
       COUNT(*) FILTER (WHERE NOT ST_IsValid(geom)) AS invalidas,
       COUNT(*) FILTER (WHERE geom IS NULL) AS nulas
FROM public.departamentos
UNION ALL
SELECT 'municipios', COUNT(*),
       COUNT(*) FILTER (WHERE NOT ST_IsValid(geom)),
       COUNT(*) FILTER (WHERE geom IS NULL)
FROM public.municipios;

SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname='public'
  AND tablename IN ('departamentos','municipios')
  AND indexdef ILIKE '%gist%';
```

Se obtuvieron **0 geometrías inválidas y 0 nulas** en las dos tablas. Los índices espaciales ya estaban creados: `departamentos_geom_geom_idx` y `municipios_geom_geom_idx`, ambos de tipo **GiST sobre `geom`**. No fue necesario recrearlos ni ejecutar reparaciones.

![Geometrías e índices verificados](evidencias/capitulo-07/03_validacion_indices.png)

## 4. Departamento con mayor área

Se transformó la geometría de departamentos a EPSG:4326 y se utilizó `geography` para calcular el área geodésica en kilómetros cuadrados:

```sql
SELECT dpto_cnmbr AS departamento,
       ROUND((ST_Area(ST_Transform(geom,4326)::geography)/1000000)::numeric,2) AS area_km2
FROM public.departamentos
ORDER BY area_km2 DESC
LIMIT 5;
```

| Posición | Departamento | Área calculada (km²) |
|---:|---|---:|
| 1 | **AMAZONAS** | **109.221,32** |
| 2 | VICHADA | 99.376,84 |
| 3 | CAQUETÁ | 92.795,70 |
| 4 | META | 82.765,91 |
| 5 | GUAINÍA | 70.666,24 |

*Los valores provienen de las geometrías del ejercicio; no se presentan como áreas catastrales oficiales.*

![Cinco departamentos con mayor área](evidencias/capitulo-07/04_areas_departamentos.png)

## 5. Departamentos con mayor número de municipios

La inspección de los campos confirmó que `municipios` contiene `dpto_ccdgo`, `dpto_cnmbr` y `mpio_cnmbr`, por lo que el conteo se hizo por atributos, sin un cruce espacial innecesario.

```sql
SELECT dpto_ccdgo AS codigo, dpto_cnmbr AS departamento,
       COUNT(*) AS total_municipios
FROM public.municipios
GROUP BY dpto_ccdgo, dpto_cnmbr
ORDER BY total_municipios DESC
LIMIT 5;
```

| Código | Departamento | Municipios |
|---|---|---:|
| 05 | ANTIOQUIA | **125** |
| 15 | BOYACÁ | **123** |
| 25 | CUNDINAMARCA | **116** |
| 68 | SANTANDER | **87** |
| 52 | NARIÑO | **64** |

![Campos disponibles](evidencias/capitulo-07/05_campos_tablas.png)

![Conteo por departamento](evidencias/capitulo-07/06_departamentos_mas_municipios.png)

## 6. Municipio correspondiente al punto de Bogotá

Se consultó el punto longitud **−74.0721**, latitud **4.7110** con SRID **4326**, coincidente con el de la capa municipal:

```sql
SELECT mpio_cnmbr AS municipio, dpto_cnmbr AS departamento,
       mpio_cdpmp AS codigo
FROM public.municipios
WHERE ST_Intersects(
  geom, ST_SetSRID(ST_MakePoint(-74.0721,4.7110),4326)
);
```

**Resultado:** `BOGOTÁ, D.C.`; departamento `BOGOTÁ, D.C.`; código **11001**; un registro.

![Intersección del punto de Bogotá](evidencias/capitulo-07/07_punto_bogota.png)

## 7. Estadísticas y mantenimiento

Se ejecutaron satisfactoriamente:

```sql
VACUUM ANALYZE public.departamentos;
VACUUM ANALYZE public.municipios;
```

Las dos ejecuciones devolvieron `VACUUM`. Esta operación actualiza estadísticas y realiza mantenimiento de tablas; no eliminó los registros.

![Mantenimiento de ambas tablas](evidencias/capitulo-07/08_vacuum_analyze.png)

## 8. Exportación de departamentos a GeoJSON

Se exportó la tabla departamental desde PostGIS a un archivo local en WGS 84 (EPSG:4326), mediante `ogr2ogr`:

```powershell
$ogr = "C:\Program Files\QGIS 3.40.15\bin\ogr2ogr.exe"
$conexion = "PG:host=localhost port=5433 dbname=taller_gis user=postgres password=postgres"
$salida = "$HOME\curso-sig-jenifer-huertas\departamentos_export.geojson"
& $ogr -f GeoJSON $salida $conexion public.departamentos -t_srs EPSG:4326 -progress
```

El archivo generado mide **2.162.123 bytes**. Se comprobó mediante `ConvertFrom-Json` que contiene `type = FeatureCollection`, **33 entidades**, y que el primer registro reportado es **ANTIOQUIA**.

```powershell
$geojson = Get-Content "$HOME\curso-sig-jenifer-huertas\departamentos_export.geojson" -Raw -Encoding UTF8 | ConvertFrom-Json
$geojson.type
$geojson.features.Count
$geojson.features[0].properties.dpto_cnmbr
```

![Archivo de exportación creado](evidencias/capitulo-07/09_archivo_exportado.png)

![GeoJSON validado desde PowerShell](evidencias/capitulo-07/10_geojson_verificado.png)

## 9. Conclusiones y trazabilidad

1. Las dos capas del curso se incorporaron a `taller_gis` mediante **GDAL/OGR**, tras verificar que `shp2pgsql` no estaba disponible en el contenedor.
2. Se respetaron los SRID de origen: departamentos **4686** y municipios **4326**; las consultas entre capas con diferentes sistemas deberán transformar una de ellas explícitamente.
3. Las **1.154 entidades** importadas están presentes; no se detectaron geometrías inválidas ni nulas y ambos índices espaciales GiST fueron comprobados.
4. Las consultas de áreas, agrupación por departamento e intersección con Bogotá devolvieron resultados verificables, documentados con capturas.
5. La exportación final a GeoJSON fue comprobada con una colección de **33 entidades**.

**Entregables del capítulo:** este informe, las diez capturas en `evidencias/capitulo-07/` y el archivo `departamentos_export.geojson`, que se debe añadir al commit desde el repositorio local de la estudiante (no se incorpora al ZIP porque permanece en su equipo).

**Referencia metodológica:** Guía del profesor, *Capítulo 7: Carga de Datos a PostgreSQL*, secciones 7.1–7.9 y ejercicio práctico.
