cd "$HOME\\curso-sig-jenifer-huertas"



@'

\# Capítulo 3 — PostgreSQL y PostGIS



\*\*Curso:\*\* Servicios SIG y aplicaciones web geográficas  

\*\*Base de datos:\*\* taller\_gis  

\*\*Entorno:\*\* Docker, PostgreSQL 16 y PostGIS 3.4



\## 1. Verificación del entorno



Se utilizó el contenedor `curso\_postgis`, correspondiente al entorno del curso, sin modificar los servicios del proyecto Amazonas.



La consulta de verificación confirmó:



\- Base de datos: `taller\_gis`

\- PostGIS: `3.4 USE\_GEOS=1 USE\_PROJ=1 USE\_STATS=1`

\- Acceso: `psql` desde Docker



\## 2. Creación de datos espaciales



Se creó la tabla `ciudades` con cinco registros correspondientes a:



\- Bogotá

\- Medellín

\- Cali

\- Barranquilla

\- Cartagena



Los registros contienen identificador, nombre, población y geometría `POINT` con SRID 4326.



Las geometrías se construyeron utilizando `ST\_MakePoint` y `ST\_SetSRID`.



\## 3. Cálculo de distancias geodésicas



Se utilizó `ST\_Distance` con conversión a `geography` para calcular distancias entre las cinco ciudades.



| Origen | Destino | Distancia (km) |

|---|---|---:|

| Barranquilla | Bogotá | 696.46 |

| Barranquilla | Cali | 853.24 |

| Barranquilla | Cartagena | 102.53 |

| Barranquilla | Medellín | 529.55 |

| Bogotá | Cali | 305.65 |

| Bogotá | Cartagena | 648.01 |

| Bogotá | Medellín | 236.77 |

| Cali | Cartagena | 775.47 |

| Cali | Medellín | 326.61 |

| Medellín | Cartagena | 458.66 |



\*\*Resultado:\*\* 10 pares únicos de ciudades.



Las distancias corresponden a cálculos geodésicos, no a recorridos por carretera.



\## 4. Buffer de 200 km alrededor de Bogotá



Se generó una geometría mediante:



`ST\_Buffer(geom::geography, 200000)::geometry`



\*\*Resultados verificados:\*\*



| Parámetro | Resultado |

|---|---|

| Ciudad | Bogotá |

| Radio solicitado | 200 km |

| Geometría | ST\_Polygon |

| SRID | 4326 |

| Área calculada | 124894.68 km² |

| Registros | 1 |



La geometría se almacenó en la tabla `buffer\_bogota\_200km`.



La superficie calculada corresponde a la representación poligonal aproximada del buffer.



\## 5. Índice espacial



Se creó el índice espacial GiST sobre la columna geométrica:



```sql

CREATE INDEX IF NOT EXISTS idx\_ciudades\_geom

ON ciudades USING GIST (geom);


```

La consulta al catalogo pg_indexes confirmo dos indices:
- ciudades_pkey: indice B-tree sobre el identificador.
- idx_ciudades_geom: indice espacial GiST sobre la geometria.

## 6. Verificacion final de resultados

La consulta final a PostgreSQL confirmo:

| Elemento | Cantidad |
|---|---:|
| Ciudades registradas | 5 |
| Buffers generados | 1 |
| Indices espaciales GiST | 1 |
| Pares de ciudades analizados | 10 |

El buffer de Bogota tiene un radio solicitado de 200 km y una superficie aproximada de 124894.68 km2.

## 7. Conclusiones

Se verifico el funcionamiento de PostgreSQL 16 y PostGIS 3.4 mediante Docker, utilizando la base taller_gis.

Se crearon cinco geometrías puntuales con SRID 4326, se calcularon diez distancias geodesicas, se genero un buffer de 200 km alrededor de Bogota y se creo un indice espacial GiST.

Se corrigio un problema de codificacion de caracteres en los nombres de Bogota y Medellin, que inicialmente impedia obtener el buffer mediante la busqueda por nombre.

Los resultados fueron comprobados mediante consultas SQL ejecutadas desde PowerShell.

## Referencia

Repositorio del profesor:
https://github.com/epiragauta/servicios_sig_y_websites


