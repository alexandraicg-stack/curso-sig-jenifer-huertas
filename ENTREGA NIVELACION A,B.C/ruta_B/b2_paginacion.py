import requests

URL = (
    "https://services6.arcgis.com/Ex2fmFOuTOHRZtML/"
    "ArcGIS/rest/services/Veredas_Boyaca_2024/FeatureServer/0/query"
)

BASE = {
    "where": "1=1",
    "outFields": "NOMB_MPIO,NOMBRE_VER",
    "outSR": "4326",
    "f": "geojson"
}

def descargar_veredas(bloque):
    features = []
    offset = 0
    vueltas = 0

    while True:
        parametros = {
            **BASE,
            "resultOffset": offset,
            "resultRecordCount": bloque
        }

        respuesta = requests.get(
            URL, params=parametros, timeout=120
        )
        respuesta.raise_for_status()
        datos = respuesta.json()

        if "error" in datos:
            raise RuntimeError(datos["error"])

        if datos.get("type") != "FeatureCollection":
            raise RuntimeError("La respuesta no es un GeoJSON válido")

        nuevos = datos.get("features", [])
        features.extend(nuevos)
        vueltas += 1

        print(
            f"offset {offset}: +{len(nuevos)} "
            f"(acumulado {len(features)})"
        )

        if len(nuevos) < bloque:
            break

        offset += bloque

    municipios = {
        f["properties"]["NOMB_MPIO"]
        for f in features
        if f["properties"].get("NOMB_MPIO")
    }

    print("TOTAL VEREDAS:", len(features))
    print("MUNICIPIOS DISTINTOS:", len(municipios))
    print("VUELTAS DEL BUCLE:", vueltas)

    return len(features), len(municipios), vueltas


print("=== B2.1 PAGINACION CON BLOQUES DE 1000 ===")
total_1000, municipios_1000, vueltas_1000 = descargar_veredas(1000)

print("\n=== B2.2 PAGINACION CON BLOQUES DE 500 ===")
total_500, municipios_500, vueltas_500 = descargar_veredas(500)

print("\n=== B2.3 COMPARACION ===")
print("Total con 1000:", total_1000)
print("Total con 500:", total_500)
print("Municipios con 1000:", municipios_1000)
print("Municipios con 500:", municipios_500)
print("Vueltas con 1000:", vueltas_1000)
print("Vueltas con 500:", vueltas_500)

if total_1000 == total_500 == 1713 and municipios_1000 == municipios_500:
    print("RESULTADO: PAGINACION CORRECTA")
else:
    print("RESULTADO: REVISAR DIFERENCIAS")
