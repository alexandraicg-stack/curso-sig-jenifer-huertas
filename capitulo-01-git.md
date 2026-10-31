# Capítulo 1 — Introducción a Git

**Curso:** Servicios SIG y aplicaciones web geográficas  
**Guía:** `taller/capitulo-01-git.md`, repositorio del profesor  
**Repositorio de trabajo:** [curso-sig-jenifer-huertas](https://github.com/alexandraicg-stack/curso-sig-jenifer-huertas)

## 1. Objetivo

Aplicar un flujo básico de control de versiones con Git: explorar el repositorio local, elaborar un archivo de observaciones, prepararlo con `git add`, confirmar los cambios mediante `commit` y verificar el historial y la publicación remota.

## 2. Desarrollo

Se trabajó sobre una copia local del repositorio personal, sin modificar el repositorio del profesor. Se comprobó la existencia de información geográfica en la carpeta `datos`, que contenía el archivo `hospitales_boyaca.geojson`.

Se elaboró `notas.txt` con cinco observaciones sobre control de versiones, GitHub y manejo de archivos GeoJSON.

### Operaciones utilizadas

```powershell
Get-ChildItem .\datos -File
git add notas.txt
git commit -m "Agregar mis notas del curso"
git log --oneline -5
git push origin main
```

## 3. Resultados comprobados

| Verificación | Resultado |
|---|---|
| Archivo creado | [`notas.txt`](https://github.com/alexandraicg-stack/curso-sig-jenifer-huertas/blob/main/notas.txt) |
| Commit | `52daa35` |
| Mensaje | `Agregar mis notas del curso` |
| Rama | `main` |
| Publicación | `git push origin main`, confirmado |

### Evidencia — archivo y commit publicados en GitHub

![Archivo notas.txt y commit 52daa35 en GitHub](evidencias/capitulo-01/01_git_publicado.png)

*La captura muestra el archivo `notas.txt` y el commit publicado en la rama principal.*

## 4. Conclusión

Se completó el flujo solicitado: exploración de datos, elaboración de notas, preparación, confirmación, revisión del historial y publicación. La advertencia de conversión LF/CRLF observada en Windows no impidió el commit ni el envío al repositorio.

**Referencia:** [Material del curso](https://github.com/epiragauta/servicios_sig_y_websites)
