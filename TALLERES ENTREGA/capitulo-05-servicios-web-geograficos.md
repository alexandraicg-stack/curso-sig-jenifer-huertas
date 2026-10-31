# Capítulo 5 — Servicios Web Geográficos

**Taller práctico | Servicios SIG y aplicaciones web geográficas**  
**Entorno:** GeoServer 2.25.3 en Docker (`curso_geoserver`)  
**Acceso local:** `http://localhost:8081/geoserver`  
**Capa de demostración:** `topp:states`

## 1. Objetivo

Consultar y comparar los servicios **WMS** y **WFS** de GeoServer mediante operaciones OGC, obtener información de entidades, aplicar un filtro CQL y contrastar los tamaños de las respuestas. Todas las operaciones se realizaron contra el servicio local del curso, sin modificar el entorno anterior de Amazonas.

> **Adaptación a la guía:** la capa citada como `sf:states` no figuraba en el catálogo de esta instalación; se identificó y utilizó `topp:states` mediante GetCapabilities. Se empleó el puerto externo `8081` porque `8080` correspondía a otro servicio local.

## 2. Consulta de capacidades WMS y WFS

Se descargaron ambas respuestas XML y se comprobó su estructura. La capa `topp:states` aparece anunciada en ambos servicios.

| Comprobación | WMS | WFS |
|---|---|---|
| Petición | GetCapabilities | GetCapabilities |
| Elemento XML principal | `WMS_Capabilities` | `WFS_Capabilities` |
| Tamaño del documento | 246.991 bytes | 104.466 bytes |
| Capa `topp:states` disponible | Sí | Sí |

**Peticiones:**

- [WMS GetCapabilities](http://localhost:8081/geoserver/wms?service=WMS&version=1.3.0&request=GetCapabilities)
- [WFS GetCapabilities](http://localhost:8081/geoserver/wfs?service=WFS&version=2.0.0&request=GetCapabilities)

![Evidencia de consultas GetCapabilities y tamaños de los XML](evidencias/capitulo-05/01_capabilities.png)

## 3. WMS — GetMap

Se solicitó una representación cartográfica de los estados de Estados Unidos en formato PNG. La respuesta se guardó como `wms_estados_unidos.png` y se abrió correctamente en el visor de imágenes.

| Parámetro | Valor |
|---|---|
| Servicio / versión | WMS 1.1.1 |
| Operación | `GetMap` |
| Capa | `topp:states` |
| Sistema de referencia | `EPSG:4326` (`SRS`) |
| BBOX (lon/lat) | `-124.73,24.96,-66.97,49.37` |
| Dimensiones | 1000 × 600 píxeles |
| Formato | `image/png` |
| Tamaño comprobado | **107.615 bytes** |

[URL de la petición GetMap](http://localhost:8081/geoserver/wms?service=WMS&version=1.1.1&request=GetMap&layers=topp:states&styles=&srs=EPSG:4326&bbox=-124.73,24.96,-66.97,49.37&width=1000&height=600&format=image/png)

![Mapa WMS generado por GeoServer](evidencias/capitulo-05/02_getmap.png)

## 4. WMS — GetFeatureInfo

Con el mismo `BBOX`, ancho y alto del mapa, se realizó una consulta en el píxel **x=450, y=300** usando `GetFeatureInfo` con salida JSON.

**Resultado:** una entidad correspondiente a **Kansas**.

| Atributo | Valor retornado |
|---|---|
| `STATE_NAME` | Kansas |
| `STATE_ABBR` | KS |
| `STATE_FIPS` | 20 |
| `LAND_KM` | 211921,641 |
| `PERSONS` | 2477574 |
| Entidades encontradas | 1 |

Estos atributos pertenecen al conjunto de demostración del servidor y no deben presentarse como estadísticas actuales.

[URL de la petición GetFeatureInfo](http://localhost:8081/geoserver/wms?service=WMS&version=1.1.1&request=GetFeatureInfo&layers=topp:states&query_layers=topp:states&styles=&srs=EPSG:4326&bbox=-124.73,24.96,-66.97,49.37&width=1000&height=600&format=image/png&x=450&y=300&info_format=application/json&feature_count=5)

![Atributos devueltos por GetFeatureInfo para Kansas](evidencias/capitulo-05/03_featureinfo.png)

## 5. WFS — GetFeature

Se consultó la misma capa mediante **WFS 2.0.0** solicitando cinco entidades en formato `application/json` (GeoJSON). El archivo se guardó como `wfs_estados.geojson`.

| Estado | Código | Tipo de geometría |
|---|---|---|
| Illinois | IL | MultiPolygon |
| District of Columbia | DC | MultiPolygon |
| Delaware | DE | MultiPolygon |
| West Virginia | WV | MultiPolygon |
| Maryland | MD | MultiPolygon |

**Resultado:** cinco entidades vectoriales, archivo de **26.562 bytes**.

[URL GetFeature](http://localhost:8081/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=topp:states&outputFormat=application/json&count=5)

![Resultado de GetFeature en GeoJSON](evidencias/capitulo-05/04_getfeature.png)

## 6. WFS — Filtro CQL

Se aplicó un filtro alfanumérico por la abreviatura del estado:

```sql
STATE_ABBR='KS'
```

La respuesta GeoJSON devolvió **un elemento**: **Kansas (KS)**, con geometría `MultiPolygon`.

[URL GetFeature con CQL](http://localhost:8081/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=topp:states&outputFormat=application/json&CQL_FILTER=STATE_ABBR%3D%27KS%27)

![Resultado de la consulta WFS con filtro CQL](evidencias/capitulo-05/05_filtro_cql.png)

## 7. Comparación de tamaños WMS y WFS

Se compararon los archivos generados, usando sus tamaños reportados por PowerShell:

| Archivo | Servicio | Tamaño exacto |
|---|---|---:|
| `wms_estados_unidos.png` | WMS GetMap | **107.615 bytes** |
| `wfs_estados.geojson` | WFS GetFeature | **26.562 bytes** |

El archivo PNG resultó aproximadamente **4,05 veces** más grande que el GeoJSON de cinco entidades. **No es una prueba de rendimiento general**: el WMS representa un mapa completo renderizado, mientras que el WFS solicitado contiene únicamente cinco geometrías y sus atributos.

![Comparación del tamaño de las respuestas WMS y WFS](evidencias/capitulo-05/06_tamanos.png)

## 8. Resultados y conclusiones

Se completaron las ocho actividades prácticas del capítulo: consultas GetCapabilities WMS/WFS, identificación de la capa real, GetMap, GetFeatureInfo, GetFeature, filtro CQL y comparación de tamaños. Se evidenció que **WMS** entrega imágenes renderizadas y permite consultar atributos con `GetFeatureInfo`, mientras que **WFS** entrega geometrías y atributos aptos para procesamiento vectorial.

Las seis capturas integradas proceden de las salidas reales observadas durante el desarrollo del ejercicio. Las URLs locales solo pueden abrirse cuando los contenedores del curso están en ejecución y GeoServer está disponible en el puerto 8081.

**Material de referencia:** [Capítulo 5 del repositorio del profesor](https://github.com/epiragauta/servicios_sig_y_websites/blob/main/taller/capitulo-05-servicios-web-geograficos.md).
