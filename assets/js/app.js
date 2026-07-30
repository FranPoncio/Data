/* ============================================================
   Rutas Argentinas — lógica de la aplicación
   ============================================================ */

const VALHALLA_URL = "https://valhalla1.openstreetmap.de/route";

// ------- Estado global -------
const estado = {
  localidad: null,   // objeto localidad seleccionado
  destino: null,     // punto turístico destino
  modo: MODOS[0],    // modo de transporte
  origen: null,      // [lat, lng] del usuario
  rutas: [],         // rutas calculadas
};

// ------- Referencias al mapa -------
let map;
let capaPines = null;      // LayerGroup de pines turísticos
let capaRutas = null;      // LayerGroup de polilíneas de rutas
let marcadorOrigen = null;

// =====================================================================
//  INICIALIZACIÓN DEL MAPA
// =====================================================================
function initMapa() {
  map = L.map("map", { zoomControl: true }).setView([-38.4, -63.6], 5); // Argentina completa

  L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    attribution: '© OpenStreetMap · © CARTO',
    subdomains: "abcd",
    maxZoom: 19,
  }).addTo(map);

  capaPines = L.layerGroup().addTo(map);
  capaRutas = L.layerGroup().addTo(map);

  // Requisito: hacer clic en el mapa fija el punto de salida.
  map.on("click", (e) => setOrigen([e.latlng.lat, e.latlng.lng], "Punto marcado en el mapa"));
}

// =====================================================================
//  PINES / MARCADORES
// =====================================================================
function iconoPin(tipo, emoji) {
  return L.divIcon({
    className: "",
    html: `<div class="pin ${tipo}"><div class="pin-body"><span>${emoji}</span></div></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
}

// Popup con foto + sinopsis histórica (requisito 5).
function popupPunto(p) {
  const cont = document.createElement("div");
  cont.className = "poi";
  cont.innerHTML = `
    <img class="poi-foto" src="${p.img}" alt="${p.nombre}" />
    <div class="poi-info">
      <div class="poi-cat">${p.categoria}</div>
      <h3>${p.nombre}</h3>
      <p>${p.sinopsis}</p>
      <div class="poi-loc">📍 ${p.localidadNombre || ""}${p.provincia ? " · " + p.provincia : ""}</div>
    </div>`;
  // Fallback elegante si la imagen no carga.
  const img = cont.querySelector("img");
  img.addEventListener("error", () => {
    const ph = document.createElement("div");
    ph.className = "poi-foto-fallback";
    ph.textContent = p.nombre;
    img.replaceWith(ph);
  });
  return cont;
}

// Dibuja los pines de la localidad seleccionada.
function dibujarPines() {
  capaPines.clearLayers();
  if (!estado.localidad) return;

  estado.localidad.puntos.forEach((p) => {
    const esDestino = estado.destino && p.id === estado.destino.id;
    const punto = { ...p, localidadNombre: estado.localidad.nombre, provincia: estado.localidad.provincia };
    const m = L.marker([p.lat, p.lng], {
      icon: iconoPin(esDestino ? "destino" : "", esDestino ? "★" : "•"),
      zIndexOffset: esDestino ? 1000 : 0,
    });
    m.bindPopup(popupPunto(punto), { closeButton: true });
    capaPines.addLayer(m);
  });
}

// =====================================================================
//  ORIGEN DEL USUARIO
// =====================================================================
function setOrigen(coords, etiqueta) {
  estado.origen = coords;
  document.getElementById("origen-estado").textContent = `✔ Salida: ${etiqueta} (${coords[0].toFixed(4)}, ${coords[1].toFixed(4)})`;

  if (marcadorOrigen) capaPines.removeLayer(marcadorOrigen);
  marcadorOrigen = L.marker(coords, { icon: iconoPin("origen", "🧍"), zIndexOffset: 1200 })
    .bindPopup("<b>Tu punto de salida</b>");
  capaPines.addLayer(marcadorOrigen);

  actualizarBotonCrear();
}

function usarGeolocalizacion() {
  const btn = document.getElementById("btn-ubicacion");
  if (!navigator.geolocation) {
    document.getElementById("origen-estado").textContent = "Tu navegador no soporta geolocalización. Hacé clic en el mapa.";
    return;
  }
  btn.textContent = "📍 Obteniendo ubicación…";
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      setOrigen([pos.coords.latitude, pos.coords.longitude], "Mi ubicación");
      btn.textContent = "📍 Ubicación detectada";
      btn.classList.add("ok");
      map.setView([pos.coords.latitude, pos.coords.longitude], 12);
    },
    () => {
      btn.textContent = "📍 Usar mi ubicación";
      document.getElementById("origen-estado").textContent =
        "No pudimos acceder a tu ubicación. Hacé clic en el mapa para marcar tu salida.";
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

// =====================================================================
//  GEOMETRÍA / UTILIDADES
// =====================================================================
function haversine(a, b) {
  const R = 6371; // km
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const la1 = (a[0] * Math.PI) / 180;
  const la2 = (b[0] * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Decodifica la geometría de Valhalla (polyline con precisión 1e6).
function decodePolyline(str, precision = 6) {
  let index = 0, lat = 0, lng = 0;
  const coords = [];
  const factor = Math.pow(10, precision);
  while (index < str.length) {
    let result = 1, shift = 0, b;
    do { b = str.charCodeAt(index++) - 63 - 1; result += b << shift; shift += 5; } while (b >= 0x1f);
    lat += result & 1 ? ~(result >> 1) : result >> 1;
    result = 1; shift = 0;
    do { b = str.charCodeAt(index++) - 63 - 1; result += b << shift; shift += 5; } while (b >= 0x1f);
    lng += result & 1 ? ~(result >> 1) : result >> 1;
    coords.push([lat / factor, lng / factor]);
  }
  return coords;
}

function fmtDuracion(seg) {
  const min = Math.round(seg / 60);
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  return `${h} h ${min % 60} min`;
}

// =====================================================================
//  RUTEO (Valhalla + fallback)
// =====================================================================
async function valhalla(locations, costing) {
  const body = {
    locations: locations.map((l) => ({ lat: l[0], lon: l[1] })),
    costing,
    alternates: 1,
    directions_options: { units: "kilometers" },
  };
  // Se usa GET con el JSON en query param: es una petición "simple" y evita el
  // preflight de CORS, más robusto para correr desde el navegador.
  const url = `${VALHALLA_URL}?json=${encodeURIComponent(JSON.stringify(body))}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error("Valhalla " + res.status);
  return res.json();
}

// Convierte un "trip" de Valhalla en nuestro formato de ruta.
function tripARuta(trip, meta) {
  const coords = [];
  trip.legs.forEach((leg) => decodePolyline(leg.shape).forEach((c) => coords.push(c)));
  return {
    coords,
    distancia: trip.summary.length,          // km
    duracion: trip.summary.time,             // seg
    ...meta,
  };
}

// Elige un punto turístico "de camino" entre origen y destino (prioridad 2).
function elegirPuntoEscenico(origen, destino) {
  const directo = haversine(origen, destino);
  let mejor = null;
  let mejorDesvio = Infinity;

  TODOS_LOS_PUNTOS.forEach((p) => {
    const c = [p.lat, p.lng];
    // Excluir el propio destino.
    if (Math.abs(c[0] - destino[0]) < 0.01 && Math.abs(c[1] - destino[1]) < 0.01) return;
    const desvio = haversine(origen, c) + haversine(c, destino) - directo;
    // Debe sumar algo (que sea un desvío real) pero no disparatado.
    if (desvio > 0.3 && desvio < directo * 0.8 && desvio < mejorDesvio) {
      mejorDesvio = desvio;
      mejor = p;
    }
  });
  return mejor;
}

// Fallback: línea geodésica + estimación por velocidad del modo.
function rutaEstimada(waypoints, meta) {
  let dist = 0;
  for (let i = 1; i < waypoints.length; i++) dist += haversine(waypoints[i - 1], waypoints[i]);
  return {
    coords: waypoints,
    distancia: dist,
    duracion: (dist / estado.modo.velocidad) * 3600,
    estimada: true,
    ...meta,
  };
}

async function crearRutas() {
  if (!estado.origen || !estado.destino) return;
  mostrarLoader(true, "Calculando las mejores rutas…");

  const origen = estado.origen;
  const destino = [estado.destino.lat, estado.destino.lng];
  const costing = estado.modo.costing;
  const rutas = [];

  // ---- Prioridad 1: ruta directa más corta ----
  try {
    const data = await valhalla([origen, destino], costing);
    const principal = tripARuta(data.trip, {
      nombre: "Ruta más corta",
      tag: "Prioridad 1",
      tipo: "corta",
    });
    rutas.push(principal);

    // Alternativa que devuelve Valhalla (si la hay).
    if (data.alternates && data.alternates.length) {
      const alt = tripARuta(data.alternates[0].trip, {
        nombre: "Ruta alternativa",
        tag: "Alternativa",
        tipo: "alternativa",
      });
      // Sólo la agregamos si es sensiblemente distinta.
      if (Math.abs(alt.distancia - principal.distancia) > 0.5) rutas.push(alt);
    }
  } catch (e) {
    rutas.push(rutaEstimada([origen, destino], { nombre: "Ruta más corta (estimada)", tag: "Prioridad 1", tipo: "corta" }));
  }

  // ---- Prioridad 2: ruta escénica pasando por un punto turístico ----
  const escenico = elegirPuntoEscenico(origen, destino);
  if (escenico) {
    const via = [escenico.lat, escenico.lng];
    try {
      const data = await valhalla([origen, via, destino], costing);
      rutas.push(tripARuta(data.trip, {
        nombre: "Ruta escénica",
        tag: "Prioridad 2",
        tipo: "escenica",
        via: escenico.nombre,
      }));
    } catch (e) {
      rutas.push(rutaEstimada([origen, via, destino], {
        nombre: "Ruta escénica (estimada)", tag: "Prioridad 2", tipo: "escenica", via: escenico.nombre,
      }));
    }
  }

  estado.rutas = rutas;
  mostrarLoader(false);
  renderResultados();
  dibujarRuta(0);
}

// =====================================================================
//  DIBUJO DE RUTAS
// =====================================================================
function dibujarRuta(indice) {
  capaRutas.clearLayers();
  const r = estado.rutas[indice];
  if (!r) return;

  const color = r.tipo === "escenica" ? "#c084fc" : r.tipo === "alternativa" ? "#74acdf" : "#f6b40e";

  // Sombra + línea principal para dar profundidad.
  L.polyline(r.coords, { color: "#000", weight: 8, opacity: 0.25 }).addTo(capaRutas);
  L.polyline(r.coords, { color, weight: 5, opacity: 0.95, lineJoin: "round" }).addTo(capaRutas);

  // Marcar tarjeta activa.
  document.querySelectorAll(".ruta-card").forEach((el, i) =>
    el.classList.toggle("activa", i === indice)
  );

  map.fitBounds(L.latLngBounds(r.coords).pad(0.15));
}

// =====================================================================
//  RENDER DE UI
// =====================================================================
function renderLocalidades() {
  const sel = document.getElementById("sel-localidad");
  sel.innerHTML = '<option value="">— Elegí una localidad —</option>';
  // Agrupar por provincia.
  const porProvincia = {};
  LOCALIDADES.forEach((l) => (porProvincia[l.provincia] ||= []).push(l));
  Object.keys(porProvincia).sort().forEach((prov) => {
    const grupo = document.createElement("optgroup");
    grupo.label = prov;
    porProvincia[prov].forEach((l) => {
      const opt = document.createElement("option");
      opt.value = l.id;
      opt.textContent = l.nombre;
      grupo.appendChild(opt);
    });
    sel.appendChild(grupo);
  });
}

function renderDestinos() {
  const sel = document.getElementById("sel-destino");
  sel.innerHTML = "";
  if (!estado.localidad) {
    sel.innerHTML = '<option value="">— Elegí primero una localidad —</option>';
    return;
  }
  estado.localidad.puntos.forEach((p, i) => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = `${p.nombre} · ${p.categoria}`;
    sel.appendChild(opt);
  });
  estado.destino = estado.localidad.puntos[0];
}

function renderModos() {
  const cont = document.getElementById("modos");
  cont.innerHTML = "";
  MODOS.forEach((m) => {
    const el = document.createElement("div");
    el.className = "modo" + (m.id === estado.modo.id ? " activo" : "");
    el.innerHTML = `<span class="ico">${m.icon}</span><span class="txt">${m.nombre}</span>`;
    el.addEventListener("click", () => {
      estado.modo = m;
      renderModos();
      // Si ya hay rutas, recalcular con el nuevo modo.
      if (estado.rutas.length && estado.origen && estado.destino) crearRutas();
    });
    cont.appendChild(el);
  });
}

function renderResultados() {
  const cont = document.getElementById("resultados");
  const lista = document.getElementById("lista-rutas");
  const hint = document.getElementById("resultados-hint");
  cont.classList.remove("hidden");
  lista.innerHTML = "";

  const alguno = estado.rutas.some((r) => r.estimada);
  hint.textContent = `${estado.modo.icon} ${estado.modo.nombre} · hacia ${estado.destino.nombre}` +
    (alguno ? " · (algunas rutas son estimadas por falta de conexión al ruteador)" : "");

  estado.rutas.forEach((r, i) => {
    const card = document.createElement("div");
    card.className = "ruta-card" + (r.tipo === "escenica" ? " escenica" : "");
    card.innerHTML = `
      <div class="titulo">
        ${r.nombre}
        <span class="ruta-tag ${r.tipo === "escenica" ? "escenica" : ""}">${r.tag}</span>
      </div>
      <div class="datos">
        <div class="dato"><b>${r.distancia.toFixed(1)}</b><small>km</small></div>
        <div class="dato"><b>${fmtDuracion(r.duracion)}</b><small>tiempo est.</small></div>
      </div>
      ${r.via ? `<div class="via">✨ Pasás por: ${r.via}</div>` : ""}`;
    card.addEventListener("click", () => dibujarRuta(i));
    lista.appendChild(card);
  });
}

function actualizarBotonCrear() {
  document.getElementById("btn-crear").disabled = !(estado.origen && estado.destino);
}

function mostrarLoader(mostrar, texto) {
  const l = document.getElementById("loader");
  if (texto) document.getElementById("loader-text").textContent = texto;
  l.classList.toggle("hidden", !mostrar);
}

// =====================================================================
//  EVENTOS
// =====================================================================
function bindEventos() {
  document.getElementById("sel-localidad").addEventListener("change", (e) => {
    estado.localidad = LOCALIDADES.find((l) => l.id === e.target.value) || null;
    estado.rutas = [];
    capaRutas.clearLayers();
    document.getElementById("resultados").classList.add("hidden");
    renderDestinos();
    dibujarPines();
    if (estado.localidad) map.setView(estado.localidad.center, estado.localidad.zoom);
    actualizarBotonCrear();
  });

  document.getElementById("sel-destino").addEventListener("change", (e) => {
    estado.destino = estado.localidad.puntos.find((p) => p.id === e.target.value) || null;
    dibujarPines();
    actualizarBotonCrear();
  });

  document.getElementById("btn-ubicacion").addEventListener("click", usarGeolocalizacion);
  document.getElementById("btn-crear").addEventListener("click", crearRutas);
}

// =====================================================================
//  ARRANQUE
// =====================================================================
function main() {
  initMapa();
  renderLocalidades();
  renderDestinos();
  renderModos();
  bindEventos();
}

document.addEventListener("DOMContentLoaded", main);
