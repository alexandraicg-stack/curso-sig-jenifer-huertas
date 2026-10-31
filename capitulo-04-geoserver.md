# Capítulo 4 — Instalación y configuración de GeoServer

**Taller práctico:** Servicios SIG y aplicaciones web geográficas  
**Entorno:** Docker · GeoServer 2.25.3  
**Contenedor:** `curso_geoserver`  
**Acceso local:** `http://localhost:8081/geoserver`  
**Estado:** actividades prácticas ejecutadas y verificadas

---

## 1. Objetivo

Comprobar el funcionamiento de GeoServer mediante Docker, acceder a su administración, explorar las capas de demostración, verificar el directorio de datos y el estado del servidor, y actualizar la contraseña predeterminada del administrador.

## 2. Inicio del contenedor y revisión de logs

Se inició el contenedor `curso_geoserver`, correspondiente al curso principal. La imagen registrada es `docker.osgeo.org/geoserver:2.25.3`; el puerto interno `8080` está publicado en Windows mediante `8081`, sin interferir con el GeoServer del proyecto anterior que utiliza el puerto `8080`.

![Contenedor GeoServer levantado en Docker](evidencias/capitulo-04/01_contenedor_docker.png)

**Figura 1.** Verificación del contenedor y asignación de puertos.

La salida del arranque confirmó la inicialización de Tomcat: `Server startup in [14707] milliseconds`, y la carga de 28 capas de caché de GeoWebCache. Los logs también identificaron `GEOSERVER_DATA_DIR=/opt/geoserver_data/`. Aparecieron advertencias no bloqueantes relativas a la lectura de configuraciones de cuota de caché y lectores TIFF.

**Nota:** la salida de logs se verificó en consola, aunque no se dispone aquí de una imagen específica de esa salida.

## 3. Acceso a la administración

Se ingresó a la interfaz administrativa como usuario `admin` en la dirección local `http://localhost:8081/geoserver`. La pantalla inicial mostró los accesos a datos, servicios OGC, seguridad y administración. En el resumen del panel se observaron 24 capas, cuatro grupos de capas, diez almacenes y ocho espacios de trabajo.

![Pantalla principal de GeoServer](evidencias/capitulo-04/02_panel_administracion.png)

**Figura 2.** Panel de bienvenida y acceso de administración de GeoServer.

## 4. Exploración de capas de demostración

Se inspeccionó el catálogo publicado mediante una petición WMS `GetCapabilities`. Aunque la guía usa el ejemplo `sf:states`, esta instalación anunció la capa **`topp:states`**. Por ello se seleccionó la capa existente como alternativa para el ejercicio. La consulta también anunció capas de los espacios `sf`, `topp`, `nurc`, `tiger` y `ne`.

**URL de catálogo local:** `http://localhost:8081/geoserver/ows?service=WMS&version=1.3.0&request=GetCapabilities`

Se visualizó `topp:states` mediante OpenLayers, observando los límites estatales de Estados Unidos, las abreviaturas y la simbología temática.

![Visualización de la capa topp:states en OpenLayers](evidencias/capitulo-04/03_mapa_openlayers.png)

**Figura 3.** Visualización interactiva de la capa de demostración `topp:states`.

## 5. Inspección del directorio de datos

Se ejecutó la instrucción:

```bash
docker exec curso_geoserver ls -la /opt/geoserver_data
```

Se verificó la existencia del directorio y de los siguientes componentes:

| Elemento | Función |
|---|---|
| `workspaces/` | Espacios de trabajo y configuración de capas |
| `styles/` | Estilos cartográficos |
| `security/` | Configuración de autenticación y permisos |
| `logs/` | Registros del servidor |
| `data/` y `coverages/` | Datos de ejemplo y coberturas |
| `gwc/` y `gwc-layers/` | Configuración de caché de teselas |
| `global.xml` | Configuración general |
| `wms.xml`, `wfs.xml`, `wcs.xml`, `wmts.xml` | Configuración de servicios OGC |

Esta inspección confirmó la estructura esperada de archivos, sin necesidad de modificarlos.

## 6. Verificación de Server Status

Desde **About & Status → Server Status** se comprobó la información visible del servidor:

| Parámetro | Valor observado |
|---|---|
| Directorio de datos | `/opt/geoserver_data` |
| Conexiones reportadas | 10 |
| Memoria JVM utilizada / asignada | 171 MB / 1.024 MB |
| JVM | OpenJDK 11.0.22, 64 bits |
| Bloqueos | 0 |
| Resource Cache | 72 |
| Update Sequence | 294 |

![Estado del servidor GeoServer](evidencias/capitulo-04/04_server_status.png)

**Figura 4.** Información de estado, memoria y directorio de datos.

Los valores reflejan el momento de la captura y pueden variar entre sesiones.

## 7. Configuración de seguridad

En la pantalla de bienvenida aparecieron advertencias sobre las contraseñas predeterminadas. Se accedió a **Security → Users, Groups, Roles → Users/Groups** y se identificó al usuario administrador habilitado.

![Administración de usuarios de GeoServer](evidencias/capitulo-04/05_usuarios_grupos.png)

**Figura 5.** Localización del usuario administrativo dentro de la configuración de seguridad.

Se realizó el cambio de contraseña del usuario `admin`. La persona que ejecutó el procedimiento confirmó que pudo volver a iniciar sesión con la nueva contraseña. **No se almacenan ni publican contraseñas en este informe.**

La advertencia independiente relacionada con la contraseña maestra se identificó en la pantalla inicial; **no consta en las evidencias que esa contraseña también se haya cambiado**, por lo que no se presenta como actividad realizada.

## 8. Balance de actividades

| Actividad de la guía | Evidencia o resultado |
|---|---|
| Levantar GeoServer en Docker | Contenedor iniciado, puerto 8081 |
| Revisar logs de arranque | Inicio de Tomcat y GeoWebCache confirmado |
| Acceder a la administración | Acceso como `admin` verificado |
| Cambiar contraseña de `admin` | Cambio y nuevo acceso confirmados |
| Explorar capas de demostración | Catálogo WMS consultado |
| Abrir la capa de estados en OpenLayers | `topp:states` visualizada |
| Inspeccionar `data_dir` | Directorio y archivos listados |
| Verificar Server Status | Parámetros y memoria documentados |

## 9. Conclusiones

El ejercicio permitió verificar la operación de GeoServer dentro de Docker, la disponibilidad de su interfaz administrativa, la consulta del catálogo de capas y la visualización de una capa WMS en OpenLayers. Se comprobó además la estructura persistente del directorio de datos y el estado de la JVM.

La instalación del curso usa el puerto `8081` en Windows para evitar conflictos con otro entorno GeoServer. La capa `sf:states` citada en la guía no apareció bajo ese nombre y se utilizó la alternativa existente `topp:states`, dejando documentada la diferencia.

## Referencia

[Repositorio del profesor — Servicios SIG y Websites](https://github.com/epiragauta/servicios_sig_y_websites/tree/main/taller)
