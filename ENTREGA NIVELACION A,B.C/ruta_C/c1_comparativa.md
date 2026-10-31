# Ruta C — C1: Comparativa de estándares y servicios geográficos

## 1. Objetivo

Comparar los servicios WMS, WFS, ArcGIS FeatureServer y OGC API Features, identificando los formatos de respuesta, los mecanismos de filtrado y las opciones de paginación.

## 2. Servicio WMS del DANE

Se consultó GetCapabilities del servicio MGN 2024 del DANE.

Resultados:

- Estado HTTP: 200.
- Capas identificadas con nombre: 10.
- CRS declarados: CRS:84, EPSG:102100, EPSG:3857 y EPSG:4326.

Fuente:
https://geoportal.dane.gov.co/mparcgis/services/MGN2024/Serv_CapasMGN_2024/MapServer/WMSServer?service=WMS&request=GetCapabilities

## 3. Comparación de servicios

| Estándar o servicio | Qué entrega | Cómo se filtra | Cómo se pagina |
|---|---|---|---|
| WMS | Imágenes de mapas, por ejemplo PNG o JPEG | Parámetros como LAYERS, BBOX, CRS, WIDTH y HEIGHT; el filtrado de entidades no es una función general del estándar | No utiliza paginación de entidades; las solicitudes delimitan el área y tamaño de imagen |
| WFS | Entidades vectoriales con geometría y atributos | GetFeature, typeNames, BBOX y filtros compatibles con la versión del servicio | Puede usar STARTINDEX y COUNT en WFS 2.0, si el servidor lo admite |
| ArcGIS FeatureServer | Entidades vectoriales mediante REST, JSON o GeoJSON | WHERE, OUTFIELDS, OUTSR y filtros espaciales | RESULTOFFSET y RESULTRECORDCOUNT |
| OGC API Features | Colecciones de entidades vectoriales mediante rutas REST y respuestas GeoJSON/JSON | Parámetros como BBOX y consultas admitidas por cada colección o servidor | LIMIT y enlaces de navegación, cuando están disponibles |

## 4. Consulta de tres entidades

### 4.1. ArcGIS FeatureServer — Veredas de Boyacá

Servicio:
https://services6.arcgis.com/Ex2fmFOuTOHRZtML/ArcGIS/rest/services/Veredas_Boyaca_2024/FeatureServer/0/query

Parámetros utilizados:
- where=1=1
- outFields=*
- resultRecordCount=3
- outSR=4326
- f=geojson

Resultados:
- HTTP: 200.
- Tipo: FeatureCollection.
- Entidades recibidas: 3.
- Geometría: Polygon.
- Claves principales: type, crs, properties, features.
- Sin claves principales links, numberMatched ni numberReturned.

### 4.2. OGC API Features — Demo pygeoapi

Colección consultada:
https://demo.pygeoapi.io/master/collections/lakes/items?f=json&limit=3

Nota: esta colección contiene lagos, no veredas de Boyacá; se utiliza para comparar la estructura de las respuestas.

Resultados:
- HTTP: 200.
- Tipo: FeatureCollection.
- Entidades recibidas: 3.
- Geometría: Polygon.
- Claves principales: type, features, numberMatched, numberReturned, links y timeStamp.
- Incluye metadatos de conteo y enlaces.

## 5. Análisis comparativo

Las dos consultas de entidades devolvieron respuestas GeoJSON de tipo FeatureCollection, con una lista de features, geometrías y atributos.

La principal diferencia observada fue que la respuesta de pygeoapi incorporó las claves links, numberMatched y numberReturned, mientras que la respuesta consultada de ArcGIS FeatureServer no las incluyó.

WMS tiene un propósito diferente: entrega representaciones cartográficas renderizadas y no una lista GeoJSON de entidades.

WFS, FeatureServer y OGC API Features permiten consultar información vectorial, pero emplean convenciones de solicitud y mecanismos de paginación diferentes.

## 6. Conclusión

Los estándares OGC y las APIs REST facilitan la interoperabilidad geográfica. La elección depende de si se necesitan imágenes cartográficas, datos vectoriales con atributos o interfaces web modernas para consultar colecciones.

Esta comparación se basa en los resultados efectivos de las consultas y en el comportamiento documentado de cada estándar o servicio.
