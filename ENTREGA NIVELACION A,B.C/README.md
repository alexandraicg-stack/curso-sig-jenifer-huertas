# NIVELACIÓN EN SISTEMAS DE INFORMACIÓN GEOGRÁFICA

**Autora:** Jenifer Alexandra Huertas López  
**Formación:** Ingeniería Catastral y Geodesia  
**Área académica:** Sistemas de Información Geográfica  
**Área de estudio:** Boyacá, Colombia  
**Fecha de elaboración:** Noviembre de 2026  
**Fecha de entrega:** Noviembre de 2026

---

## Presentación

Este repositorio reúne el desarrollo del Módulo 0 de Nivelación en Sistemas de Información Geográfica, organizado en tres rutas de aprendizaje: A, B y C.

Las actividades integran manejo de información geoespacial, programación, herramientas SIG de escritorio, bases de datos espaciales, servicios web geográficos y visualización cartográfica.

Cada ruta cuenta con su propia documentación técnica, los resultados obtenidos y las evidencias gráficas correspondientes.

## Acceso a las tres rutas

| Ruta | Enfoque | Actividades | Evidencias | Documentación |
|---|---|---|---|---|
| **A** | Fundamentos SIG, terminal, Python y QGIS | A1–A5 | 7 capturas | [Abrir Ruta A](ruta_A/README.md) |
| **B** | GeoPandas, APIs, Docker y desarrollo web | B1–B4 | 5 capturas | [Abrir Ruta B](ruta_B/README.md) |
| **C** | Estándares OGC, infraestructura espacial y Leaflet | C1–C3 | 4 capturas | [Abrir Ruta C](ruta_C/README.md) |

**Total: 12 actividades y 16 evidencias gráficas.**

---

## RUTA A — FUNDAMENTOS Y HERRAMIENTAS SIG

**[CONSULTAR DESARROLLO COMPLETO DE LA RUTA A](ruta_A/README.md)**

Esta ruta comprende cinco actividades:

- **A1. Archivos y terminal:** organización y gestión de información geográfica.
- **A2. Git y GitHub:** control de versiones y administración del repositorio.
- **A3. Python y pandas:** procesamiento y conteo de municipios por provincia.
- **A4. Web y JSON:** consultas a servicios web y análisis de respuestas GeoJSON.
- **A5. QGIS y GeoPackage:** exploración y exportación de información espacial.

### Resultados principales

Se documentó el trabajo con 123 municipios de Boyacá y 1.713 veredas, además de la comprobación de conteos mediante Python y pandas.

Se realizaron consultas web de información vectorial y procedimientos de manejo de capas mediante QGIS.

**Evidencias:** siete imágenes incorporadas directamente en el README de la Ruta A.

---

## RUTA B — ANÁLISIS ESPACIAL Y SERVICIOS

**[CONSULTAR DESARROLLO COMPLETO DE LA RUTA B](ruta_B/README.md)**

Esta ruta comprende cuatro actividades:

- **B1. GeoPandas:** análisis espacial de veredas de Boyacá y cálculo de superficies.
- **B2. APIs y paginación:** recuperación de registros mediante consultas paginadas.
- **B3. Docker y PostGIS:** ejecución de servicios geoespaciales y conexión con QGIS.
- **B4. Visual Studio Code:** ajustes y ejecución local de un visor web.

### Resultados principales

Se procesaron 1.713 veredas de Boyacá mediante herramientas de análisis espacial y servicios web.

Se documentó la recuperación paginada de información y se verificó la conectividad con PostGIS y GeoServer.

También se ejecutó un visor local orientado hacia Boyacá.

### Código fuente

- [Script de análisis de veredas — B1](ruta_B/b1_veredas.py)
- [Script de paginación — B2](ruta_B/b2_paginacion.py)

**Evidencias:** cinco imágenes incorporadas directamente en el README de la Ruta B.

---

## RUTA C — INTEROPERABILIDAD Y CARTOGRAFÍA WEB

**[CONSULTAR DESARROLLO COMPLETO DE LA RUTA C](ruta_C/README.md)**

Esta ruta comprende tres actividades:

- **C1. Estándares geográficos:** comparación de WMS, WFS, ArcGIS FeatureServer y OGC API Features.
- **C2. Infraestructura espacial:** PostGIS, GeoServer y pg_tileserv.
- **C3. Leaflet:** desarrollo y publicación de un visor cartográfico de veredas de Boyacá.

### Resultados principales

Se documentó la comparación técnica de servicios geográficos y la implementación de infraestructura espacial.

PostGIS reconoció 123 municipios de Boyacá y pg_tileserv permitió consultar el catálogo de teselas vectoriales.

El visor Leaflet representó 1.713 geometrías de veredas en la prueba registrada.

### Archivos principales

- [Comparativa técnica de estándares — C1](ruta_C/c1_comparativa.md)
- [Código del visor Leaflet — C3](ruta_C/index.html)
- [Documentación y capturas de la Ruta C](ruta_C/README.md)

**Evidencias:** cuatro imágenes incorporadas directamente en el README de la Ruta C.

---

## Información geográfica y archivos de apoyo

La nivelación se desarrolló utilizando información de Boyacá, incluyendo recursos del Marco Geoestadístico Nacional del DANE y servicios de entidades geográficas.

Los archivos y documentos de apoyo se encuentran organizados en:

- [Datos y documentación geográfica](datos/README.md)
- [Ficha técnica DANE](datos/ficha_datos_dane.md)
- [Municipios de Boyacá en GeoJSON](datos/municipios_boyaca.geojson)
- [Proyecto de QGIS](datos/Nivelacion_Boyaca.qgz)
- [Checklist del entorno](00_checklist_entorno.md)
- [Guías originales del curso](GUIAS_ORIGINALES/)

## Evidencias

Las capturas se encuentran organizadas dentro de cada ruta y están incrustadas mediante enlaces Markdown.

| Ruta | Ubicación de evidencias |
|---|---|
| A | [Ver las 7 figuras](ruta_A/README.md) |
| B | [Ver las 5 figuras](ruta_B/README.md) |
| C | [Ver las 4 figuras](ruta_C/README.md) |

De esta manera, las imágenes se visualizan dentro de cada documento técnico en GitHub, junto a su explicación y resultado.

## Conclusiones generales

El desarrollo de las tres rutas permitió abordar progresivamente la organización de datos, su análisis espacial, la integración de servicios geográficos y su visualización web.

La Ruta A consolidó los procedimientos básicos de manejo de información y herramientas SIG.

La Ruta B incorporó análisis mediante programación, consumo de APIs y servicios geoespaciales.

La Ruta C integró estándares de interoperabilidad, infraestructura espacial y representación cartográfica mediante Leaflet.

En conjunto, las actividades constituyen una entrega documentada y reproducible en los componentes respaldados por código, datos y evidencias disponibles.

---

**Jenifer Alexandra Huertas López**  
**Noviembre de 2026**