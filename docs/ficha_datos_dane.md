# Ficha técnica de datos — Municipios de Boyacá (DANE, MGN 2024)

**Fecha de consulta y elaboración:** 24 de octubre de 2026.  
**Entidad responsable:** Departamento Administrativo Nacional de Estadística (DANE).  
**Conjunto de datos:** Marco Geoestadístico Nacional (MGN), versión 2024, capa Municipio (ID 317).  
**Ámbito de extracción:** departamento de Boyacá, código DANE `15`.  
**Cobertura de la extracción comprobada:** 123 entidades municipales.  
**Geometría:** polígono.  
**Formato consultado:** servicio ArcGIS FeatureServer, con posibilidad de respuesta en GeoJSON.  
**Formato de trabajo:** GeoJSON, exportado por consulta con `outSR=4326`; también GeoPackage de Tunja y tabla PostgreSQL para las prácticas.  
**SRC:** el servicio DANE declara referencia espacial Web Mercator 102100 (equivalente operativo a EPSG:3857); la extracción se solicitó en **EPSG:4326**. En QGIS también se verificó este último CRS.  
**Fuente oficial:** https://geoportal.dane.gov.co/mparcgis/rest/services/MGN2024/Serv_CapasMGN_2024/FeatureServer/317  
**Licencias y condiciones:** https://geoportal.dane.gov.co/acerca-del-geoportal/licencia-y-condiciones-de-uso/

## Procedencia y método de obtención

Se consultó el FeatureServer del MGN2024, capa `Municipio` (317), filtrando `dpto_ccdgo = '15'` y solicitando geometrías GeoJSON con salida `outSR=4326`. Se comprobó un conjunto de 123 entidades. Durante A5, la capa de municipios se visualizó en QGIS y se extrajo Tunja a `tunja.gpkg`. Durante C2, se cargaron 123 registros a `public.municipios_boyaca` de PostgreSQL/PostGIS, publicados mediante pg_tileserv.

## Campos y codificación

| Campo | Significado / cautela |
|---|---|
| `dpto_ccdgo` | Código departamental, texto; Boyacá = `15`. |
| `mpio_ccdgo` | Código municipal de **tres caracteres** en la estructura oficial de la capa. No contiene por sí mismo el prefijo departamental; ejemplos observados `572` (Puerto Boyacá), `223` (Cubará). |
| `mpio_cdpmp` | Código concatenado departamento + municipio, de cinco caracteres (por ejemplo, prefijo `15` para Boyacá). No se debe inferir que `mpio_ccdgo` comienza por `15`. |
| `mpio_cnmbr` | Nombre del municipio. |
| `mpio_narea` | Área municipal informada por la capa, en km² según los valores observados y su definición; para Puerto Boyacá se identificó `1513.60103672`. |

**Nota de consistencia:** la pregunta orientativa de A5 afirma que `mpio_ccdgo` concatena el `15`; esto no coincide con los valores observados ni con la definición oficial del campo. El campo concatenado es `mpio_cdpmp`.

## Calidad y limitaciones

- Los 123 registros representan municipios de Boyacá en la extracción examinada, no provincias. 
- La denominación y clasificación provienen del MGN 2024; no deben presentarse como levantamiento predial, definición jurídica de linderos ni actualización catastral de 2026.
- Una consulta con `outSR=4326` transforma las coordenadas de salida; no significa que el servicio fuente esté almacenado en ese CRS.
- El tamaño y la complejidad del GeoJSON hacen poco conveniente publicarlo completo en GitHub para un mapa web.
- La licencia general publicada por el Geoportal DANE contempla reutilización bajo condiciones Creative Commons y atribución; debe revisarse la página oficial y cualquier restricción particular antes de redistribuir productos derivados.
- **Atribución recomendada por DANE:** «Departamento Administrativo Nacional de Estadística - DANE: www.dane.gov.co».

## Usos en la nivelación

A1: descarga y organización; A5: filtrado, GeoPackage de Tunja; C1: análisis de servicios; C2: carga y exposición en PostGIS/pg_tileserv. El visor público C3 corresponde a **veredas del IDE Boyacá**, no a esta capa municipal del DANE.

## Recursos adicionales

- Servicio MGN2024 FeatureServer: https://geoportal.dane.gov.co/mparcgis/rest/services/MGN2024/Serv_CapasMGN_2024/FeatureServer
- Licencia y condiciones de uso: https://geoportal.dane.gov.co/acerca-del-geoportal/licencia-y-condiciones-de-uso/
- Repositorio del curso: https://github.com/alexandraicg-stack/curso-sig-jenifer-huertas
