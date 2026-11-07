const mapa = L.map("mapa").setView([4.6, -74.1], 6);

// MAPA BASE
const mapaBase = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19
    }
).addTo(mapa);

// SERVIDOR GEOSERVER
const servidorWMS = "http://localhost:8081/geoserver/taller/wms";

// DEPARTAMENTOS - ESTILO DORADO
const departamentosWMS = L.tileLayer.wms(servidorWMS, {
    layers: "taller:departamentos",
    styles: "departamentos_dorado",
    format: "image/png",
    transparent: true,
    version: "1.1.1",
    attribution: "GeoServer | Departamentos de Colombia"
}).addTo(mapa);

// MUNICIPIOS - SOLO CONTORNOS
const municipiosWMS = L.tileLayer.wms(servidorWMS, {
    layers: "taller:municipios",
    styles: "municipios_contornos",
    minZoom: 8,
    format: "image/png",
    transparent: true,
    version: "1.1.1",
    attribution: "GeoServer | Municipios de Colombia"
}).addTo(mapa);

// CONTROL DE CAPAS
L.control.layers(
    {
        "OpenStreetMap": mapaBase
    },
    {
        "Departamentos - GeoServer WMS": departamentosWMS,
        "Municipios - contornos": municipiosWMS
    },
    {
        collapsed: false
    }
).addTo(mapa);

// ESCALA GRAFICA
L.control.scale({
    metric: true,
    imperial: false
}).addTo(mapa);
// LEYENDA CARTOGRAFICA
const leyenda = L.control({position: "bottomright"});

leyenda.onAdd = function () {
    const div = L.DomUtil.create("div", "leyenda");

    div.innerHTML = `
        <strong>Convenciones</strong>
        <div><span class="simbolo departamento"></span>Departamentos</div>
        <div><span class="simbolo municipio"></span>Limites municipales</div>
    `;

    return div;
};

leyenda.addTo(mapa);

// CONSULTA INTERACTIVA WMS GETFEATUREINFO
mapa.on("click", async function (evento) {

    const punto = mapa.latLngToContainerPoint(evento.latlng);
    const tamano = mapa.getSize();
    const limites = mapa.getBounds();

    const parametros = new URLSearchParams({
        service: "WMS",
        version: "1.1.1",
        request: "GetFeatureInfo",
        layers: "taller:departamentos",
        query_layers: "taller:departamentos",
        styles: "departamentos_dorado",
        bbox: [
            limites.getWest(),
            limites.getSouth(),
            limites.getEast(),
            limites.getNorth()
        ].join(","),
        srs: "EPSG:4326",
        width: Math.round(tamano.x),
        height: Math.round(tamano.y),
        x: Math.round(punto.x),
        y: Math.round(punto.y),
        info_format: "application/json",
        feature_count: 1
    });

    const url = "http://localhost:8081/geoserver/taller/wms?" +
        parametros.toString();

    try {
        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error("HTTP " + respuesta.status);
        }

        const datos = await respuesta.json();

        if (!datos.features || datos.features.length === 0) {
            L.popup()
                .setLatLng(evento.latlng)
                .setContent("No se encontró un departamento en este punto.")
                .openOn(mapa);
            return;
        }

        const atributos = datos.features[0].properties;

        const nombre =
            atributos.dpto_cnmbr ||
            atributos.DPTO_CNMBR ||
            atributos.nombre ||
            "Departamento consultado";

        L.popup()
            .setLatLng(evento.latlng)
            .setContent(
                "<strong>Departamento:</strong> " +
                String(nombre).replaceAll("<", "&lt;").replaceAll(">", "&gt;")
            )
            .openOn(mapa);

    } catch (error) {
        console.error("Error GetFeatureInfo:", error);

        L.popup()
            .setLatLng(evento.latlng)
            .setContent("No fue posible consultar GeoServer. Revisa la consola.")
            .openOn(mapa);
    }
});
