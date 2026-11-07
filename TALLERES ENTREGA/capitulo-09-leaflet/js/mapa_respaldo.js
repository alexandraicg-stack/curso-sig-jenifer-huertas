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