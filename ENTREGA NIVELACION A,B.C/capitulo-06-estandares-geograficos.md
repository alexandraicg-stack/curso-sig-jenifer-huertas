# Capítulo 6 — Estándares para información geográfica

**Taller práctico | Servicios SIG y aplicaciones web geográficas**  
**Componentes:** GeoJSON y Styled Layer Descriptor (SLD)  
**Datos de trabajo:** departamentos de Colombia, archivos proporcionados en el repositorio del curso  
**Entorno de validación:** PowerShell y GeoServer local (`localhost:8081`)

---

## 1. Objetivo

Reconocer la estructura de un archivo GeoJSON y personalizar la representación cartográfica de departamentos a través de un estilo SLD, manteniendo el archivo original sin alteraciones y verificando el nuevo estilo en GeoServer.

## 2. Identificación de insumos

Se localizaron en la carpeta `data` del repositorio del profesor los archivos `departamentos.geojson`, `departamentos.sld` y los componentes de un Shapefile (`.shp`, `.shx`, `.dbf`, `.prj`, `.cpg`), además de un archivo de proyecto QGIS (`.qmd`).

![Archivos disponibles de departamentos](evidencias/capitulo-06/01_archivos_departamentos.png)

*Evidencia 1. Consulta de los archivos de departamentos disponibles en la carpeta del profesor.*

## 3. Análisis del GeoJSON

El archivo `departamentos.geojson` se leyó desde PowerShell mediante `ConvertFrom-Json`. La verificación devolvió:

| Elemento | Resultado observado |
|---|---|
| Tipo raíz | `FeatureCollection` |
| Número de entidades | **33** |
| Tipo de geometría de la primera entidad | `MultiPolygon` |
| Campos de propiedades | `dpto_ccdgo`, `dpto_cnmbr` |

`FeatureCollection` agrupa las entidades (`Feature`); cada entidad dispone de una geometría y sus propiedades. Los campos identificados representan el código y nombre de departamento, respectivamente.

![Validación de estructura y conteo GeoJSON](evidencias/capitulo-06/04_validacion_geojson.png)

*Evidencia 2. Salida de PowerShell: 33 entidades, geometría MultiPolygon y atributos del archivo.*

**Nota de interpretación:** el total de 33 corresponde al contenido del archivo consultado. No se interpreta como 33 departamentos administrativos distintos sin comprobar los valores de `dpto_ccdgo`.

## 4. Inspección del SLD original

Se identificaron en `departamentos.sld` los parámetros de simbología antes de cualquier modificación:

| Parámetro | Valor original |
|---|---|
| Relleno de polígonos (`fill`) | `#e8f881` |
| Contorno (`stroke`) | `#232323` |
| Tamaño de fuente (`font-size`) | `13` |
| Color de etiquetas (`fill` de texto) | `#323232` |

![Parámetros originales del SLD](evidencias/capitulo-06/02_sld_original.png)

*Evidencia 3. Colores y tamaño de fuente identificados en el archivo SLD original.*

## 5. Modificación del estilo cartográfico

Se creó una copia denominada `departamentos_dorado.sld`, sin reemplazar el archivo `departamentos.sld`. Se aplicaron únicamente los cambios exigidos en el ejercicio:

| Parámetro | Antes | Después |
|---|---|---|
| Relleno de los polígonos | `#e8f881` | **`#FFD700`** (dorado) |
| Borde | `#232323` | `#232323` (sin cambio) |
| Tamaño de etiquetas | `13` | **`16`** |
| Color de etiquetas | `#323232` | `#323232` (sin cambio) |

![Comprobación del estilo modificado](evidencias/capitulo-06/03_sld_modificado.png)

*Evidencia 4. Verificación de parámetros modificados por lectura XML en PowerShell.*

Tras identificar la ubicación correcta del archivo, se confirmó la existencia de la copia `departamentos_dorado.sld` dentro de `data` del material local del curso.

![Archivo SLD creado en ubicación local](evidencias/capitulo-06/05_archivo_sld_local.png)

*Evidencia 5. Comprobación del nombre y ruta del SLD modificado.*

## 6. Validación en GeoServer

El SLD modificado se cargó en el editor de estilos de GeoServer. La validación realizada por la usuaria devolvió el mensaje **`No validation errors`**; posteriormente se guardó el estilo.

La lista de estilos de GeoServer mostró el registro `departamentos_dorado` con formato **SLD 1.1**.

![Estilo registrado en GeoServer](evidencias/capitulo-06/06_estilo_publicado_geoserver.png)

*Evidencia 6. Estilo `departamentos_dorado` registrado en el catálogo de GeoServer.*

**Alcance de esta prueba:** se comprobó la validez sintáctica y el registro del estilo, pero **no se verificó todavía su representación aplicada a una capa publicada**. Ese paso corresponde al ejercicio posterior de publicación.

## 7. Conclusiones

El ejercicio permitió identificar y verificar la estructura del GeoJSON de departamentos, distinguir sus geometrías y propiedades, y modificar la simbología SLD mediante parámetros específicos. El nuevo estilo presenta relleno dorado `#FFD700` y etiquetas de tamaño `16`, conservando los valores de contorno y color de texto originales.

La validación en GeoServer se completó sin errores y el estilo fue registrado. Se mantuvo separado el archivo SLD original para conservar la trazabilidad de los cambios.

## Referencias

- [Repositorio del curso — servicios_sig_y_websites](https://github.com/epiragauta/servicios_sig_y_websites)
- [RFC 7946 — GeoJSON](https://www.rfc-editor.org/rfc/rfc7946)
- [Documentación GeoServer — Styling](https://docs.geoserver.org/stable/en/user/styling/)
