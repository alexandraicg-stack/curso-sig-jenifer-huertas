from pathlib import Path
import requests
import geopandas as gpd
import pandas as pd

DATOS = Path.home() / "curso-sig" / "datos"
ARCHIVO = DATOS / "veredas_boyaca.geojson"

URL = (
    "https://services6.arcgis.com/Ex2fmFOuTOHRZtML/"
    "ArcGIS/rest/services/Veredas_Boyaca_2024/"
    "FeatureServer/0"
)

print("\n=== B1.1 VEREDAS DE TUNJA - CONSULTA REST ===")

# Consultar metadatos para comprobar el campo municipal
meta = requests.get(
    URL, params={"f": "json"}, timeout=60
)
meta.raise_for_status()
campos = [c["name"] for c in meta.json()["fields"]]

campo_mpio = next(
    (c for c in campos if c.upper() == "NOMB_MPIO"),
    None
)

if campo_mpio is None:
    raise ValueError(
        "No se encontró NOMB_MPIO en el servicio. "
        f"Campos disponibles: {campos}"
    )

respuesta = requests.get(
    URL + "/query",
    params={
        "where": f"{campo_mpio} = 'TUNJA'",
        "outFields": "*",
        "outSR": 4326,
        "f": "geojson"
    },
    timeout=120
)
respuesta.raise_for_status()
geojson_tunja = respuesta.json()

if geojson_tunja.get("type") != "FeatureCollection":
    raise ValueError(f"Respuesta inesperada: {geojson_tunja}")

veredas_tunja = geojson_tunja["features"]
print("Veredas descargadas directamente de Tunja:", len(veredas_tunja))

salida_tunja = DATOS / "veredas_tunja.geojson"
import json
with open(salida_tunja, "w", encoding="utf-8") as f:
    json.dump(geojson_tunja, f, ensure_ascii=False)

print("Archivo guardado:", salida_tunja)

print("\n=== B1.2 TOP 10 MUNICIPIOS POR VEREDAS ===")

gdf = gpd.read_file(ARCHIVO)

print("Total de veredas en el archivo:", len(gdf))

top10 = (
    gdf.groupby("NOMB_MPIO")
    .size()
    .sort_values(ascending=False)
    .head(10)
)
print(top10.to_string())

print("\n=== B1.3 CINCO VEREDAS MAS GRANDES ===")

# Calcular superficies en metros cuadrados con CRS proyectado
gdf_metros = gdf.to_crs(epsg=9377)
gdf_metros["area_ha"] = gdf_metros.geometry.area / 10000

campo_nombre = next(
    (
        c for c in [
            "NOMB_VER", "NOM_VEREDA", "NOMBRE_VER",
            "NOM_VER", "NOMBRE", "NOMB_VERE"
        ]
        if c in gdf_metros.columns
    ),
    None
)

columnas = ["NOMB_MPIO"]
if campo_nombre:
    columnas.append(campo_nombre)
columnas.append("area_ha")

top5 = gdf_metros.nlargest(5, "area_ha")
print(top5[columnas].to_string(index=False))

print("\nCRS de calculo:", gdf_metros.crs)
print("B1 FINALIZADO")
