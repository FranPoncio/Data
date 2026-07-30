/* ============================================================
   Rutas Argentinas — lógica de la aplicación
   ============================================================ */

const VALHALLA_URL = "https://valhalla1.openstreetmap.de/route";

// Bases de mapa grises, según el tema.
const TILES = {
  light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
};

// ------- Estado global -------
const estado = {
  localidad: null,
  destino: null,
  modo: MODOS[0],
  origen: null,
  rutas: [],
  actividades: new Set(), // vacío = todas
};

// ------- Mapa -------
let map, capaPines, capaRutas, marcadorOrigen, capaTiles;

// =====================================================================
//  TEMA CLARO / OSCURO
// =====================================================================
function temaActual() {
  const guardado = localStorage.getItem("tema");
  if (guardado === "light" || guardado === "dark") return guardado;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function aplicarTema(tema) {
  document.documentElement.dataset.theme = tema;
  const btn = document.getElementById("theme-toggle");
  if (btn) btn.textContent = tema === "dark" ? "☀️" : "🌙";
  // Cambiar la base del mapa si ya está creado.
  if (map) {
    if (capaTiles) map.removeLayer(capaTiles);
    capaTiles = L.tileLayer(TILES[tema], {
      attribution: "© OpenStreetMap · © CARTO",
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);
    capaTiles.bringToBack();
  }
}

function toggleTema() {
  const nuevo = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("tema", nuevo);
  aplicarTema(nuevo);
}

// =====================================================================
//  MAPA
// =====================================================================
function initMapa() {
  map = L.map("map", { zoomControl: true }).setView([-38.4, -63.6], 5);
  aplicarTema(document.documentElement.dataset.theme || temaActual());
  capaPines = L.layerGroup().addTo(map);
  capaRutas = L.layerGroup().addTo(map);
  map.on("click", (e) => setOrigen([e.latlng.lat, e.latlng.lng], "Punto marcado en el mapa"));
}

function iconoPin(tipo, emoji) {
  return L.divIcon({
    className: "",
    html: `<div class="pin ${tipo}"><div class="pin-body"><span>${emoji}</span></div></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
}

// Popup con foto, badges, sinopsis, entrada y transporte (requisitos 5, 4 y 8).
function popupPunto(p) {
  const act = ACTIVIDAD_POR_ID[p.actividad];
  const cont = document.createElement("div");
  cont.className = "poi";
  cont.innerHTML = `
    <img class="poi-foto" src="${p.img}" alt="${p.nombre}" />
    <div class="poi-info">
      <div class="poi-badges">
        <span class="poi-badge" style="background:${act.color}">${act.icon} ${act.nombre}</span>
        <span class="poi-badge" style="background:#64748b">${p.categoria}</span>
      </div>
      <h3>${p.nombre}</h3>
      <p>${p.sinopsis}</p>
      <div class="poi-row"><span class="ic">🎫</span><span><b>Entrada:</b> ${p.entrada}</span></div>
      <div class="poi-row"><span class="ic">🚌</span><span><b>Transporte público:</b> ${p.transporte}</span></div>
      <div class="poi-loc">📍 ${p.localidadNombre || ""}${p.provincia ? " · " + p.provincia : ""}</div>
    </div>`;
  const img = cont.querySelector("img");
  img.addEventListener("error", () => {
    const ph = document.createElement("div");
    ph.className = "poi-foto-fallback";
    ph.textContent = p.nombre;
    img.replaceWith(ph);
  });
  return cont;
}

// ¿Pasa el punto el filtro de actividad?
function pasaFiltro(p) {
  return estado.actividades.size === 0 || estado.actividades.has(p.actividad);
}

// Puntos de la localidad actual que pasan el filtro.
function puntosVisibles() {
  if (!estado.localidad) return [];
  return estado.localidad.puntos.filter(pasaFiltro);
}

function dibujarPines() {
  capaPines.clearLayers();
  if (marcadorOrigen) capaPines.addLayer(marcadorOrigen);
  if (!estado.localidad) return;

  puntosVisibles().forEach((p) => {
    const esDestino = estado.destino && p.id === estado.destino.id;
    const punto = {
      ...p,
      localidadNombre: estado.localidad.nombre,
      provincia: estado.localidad.provincia,
    };
    const m = L.marker([p.lat, p.lng], {
      icon: iconoPin(esDestino ? "destino" : "", esDestino ? "★" : "•"),
      zIndexOffset: esDestino ? 1000 : 0,
    });
    m.bindPopup(popupPunto(punto), { closeButton: true });
    capaPines.addLayer(m);
  });
}

// =====================================================================
//  ORIGEN
// =====================================================================
function setOrigen(coords, etiqueta) {
  estado.origen = coords;
  document.getElementById("origen-estado").textContent =
    `✔ Salida: ${etiqueta} (${coords[0].toFixed(4)}, ${coords[1].toFixed(4)})`;
  if (marcadorOrigen) capaPines.removeLayer(marcadorOrigen);
  marcadorOrigen = L.marker(coords, {
    icon: iconoPin("origen", "🧍"),
    zIndexOffset: 1200,
  }).bindPopup("<b>Tu punto de salida</b>");
  capaPines.addLayer(marcadorOrigen);
  actualizarBotonCrear();
}

function usarGeolocalizacion() {
  const btn = document.getElementById("btn-ubicacion");
  if (!navigator.geolocation) {
    document.getElementById("origen-estado").textContent =
      "Tu navegador no soporta geolocalización. Hacé clic en el mapa.";
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
//  GEOMETRÍA / RUTEO
// =====================================================================
function haversine(a, b) {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const la1 = (a[0] * Math.PI) / 180,
    la2 = (b[0] * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function decodePolyline(str, precision = 6) {
  let index = 0,
    lat = 0,
    lng = 0;
  const coords = [],
    factor = Math.pow(10, precision);
  while (index < str.length) {
    let result = 1,
      shift = 0,
      b;
    do {
      b = str.charCodeAt(index++) - 63 - 1;
      result += b << shift;
      shift += 5;
    } while (b >= 0x1f);
    lat += result & 1 ? ~(result >> 1) : result >> 1;
    result = 1;
    shift = 0;
    do {
      b = str.charCodeAt(index++) - 63 - 1;
      result += b << shift;
      shift += 5;
    } while (b >= 0x1f);
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

async function valhalla(locations, costing) {
  const body = {
    locations: locations.map((l) => ({ lat: l[0], lon: l[1] })),
    costing,
    alternates: 1,
    directions_options: { units: "kilometers" },
  };
  const url = `${VALHALLA_URL}?json=${encodeURIComponent(JSON.stringify(body))}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error("Valhalla " + res.status);
  return res.json();
}

function tripARuta(trip, meta) {
  const coords = [];
  trip.legs.forEach((leg) => decodePolyline(leg.shape).forEach((c) => coords.push(c)));
  return { coords, distancia: trip.summary.length, duracion: trip.summary.time, ...meta };
}

// Punto turístico "de camino" para la ruta escénica (prioridad 2).
function elegirPuntoEscenico(origen, destino) {
  const directo = haversine(origen, destino);
  let mejor = null,
    mejorDesvio = Infinity;
  TODOS_LOS_PUNTOS.forEach((p) => {
    const c = [p.lat, p.lng];
    if (Math.abs(c[0] - destino[0]) < 0.01 && Math.abs(c[1] - destino[1]) < 0.01) return;
    const desvio = haversine(origen, c) + haversine(c, destino) - directo;
    if (desvio > 0.3 && desvio < directo * 0.8 && desvio < mejorDesvio) {
      mejorDesvio = desvio;
      mejor = p;
    }
  });
  return mejor;
}

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

  try {
    const data = await valhalla([origen, destino], costing);
    const principal = tripARuta(data.trip, {
      nombre: "Ruta más corta",
      tag: "Prioridad 1",
      tipo: "corta",
    });
    rutas.push(principal);
    if (data.alternates && data.alternates.length) {
      const alt = tripARuta(data.alternates[0].trip, {
        nombre: "Ruta alternativa",
        tag: "Alternativa",
        tipo: "alternativa",
      });
      if (Math.abs(alt.distancia - principal.distancia) > 0.5) rutas.push(alt);
    }
  } catch (e) {
    rutas.push(
      rutaEstimada([origen, destino], {
        nombre: "Ruta más corta (estimada)",
        tag: "Prioridad 1",
        tipo: "corta",
      })
    );
  }

  const escenico = elegirPuntoEscenico(origen, destino);
  if (escenico) {
    const via = [escenico.lat, escenico.lng];
    try {
      const data = await valhalla([origen, via, destino], costing);
      rutas.push(
        tripARuta(data.trip, {
          nombre: "Ruta escénica",
          tag: "Prioridad 2",
          tipo: "escenica",
          via: escenico.nombre,
        })
      );
    } catch (e) {
      rutas.push(
        rutaEstimada([origen, via, destino], {
          nombre: "Ruta escénica (estimada)",
          tag: "Prioridad 2",
          tipo: "escenica",
          via: escenico.nombre,
        })
      );
    }
  }

  estado.rutas = rutas;
  mostrarLoader(false);
  renderResultados();
  dibujarRuta(0);
}

function dibujarRuta(indice) {
  capaRutas.clearLayers();
  const r = estado.rutas[indice];
  if (!r) return;
  const color =
    r.tipo === "escenica" ? "#c084fc" : r.tipo === "alternativa" ? "#74acdf" : "#f6b40e";
  L.polyline(r.coords, { color: "#000", weight: 8, opacity: 0.22 }).addTo(capaRutas);
  L.polyline(r.coords, { color, weight: 5, opacity: 0.95, lineJoin: "round" }).addTo(capaRutas);
  document
    .querySelectorAll(".ruta-card")
    .forEach((el, i) => el.classList.toggle("activa", i === indice));
  map.fitBounds(L.latLngBounds(r.coords).pad(0.15));
}

// =====================================================================
//  DROPDOWN CUSTOM
// =====================================================================
function cerrarDropdowns(excepto) {
  document.querySelectorAll(".dropdown.abierto").forEach((d) => {
    if (d !== excepto) d.classList.remove("abierto");
  });
}

// options: [{value, label, sublabel, emoji, group}]
function construirDropdown(cont, { placeholder, options, valorSel, onSelect }) {
  const sel = options.find((o) => o.value === valorSel);
  let menuHTML = "";
  let grupoActual = null;
  options.forEach((o) => {
    if (o.group && o.group !== grupoActual) {
      grupoActual = o.group;
      menuHTML += `<div class="dropdown-group">${o.group}</div>`;
    }
    menuHTML += `<div class="dropdown-option ${o.value === valorSel ? "sel" : ""}" data-value="${o.value}">
      ${o.emoji ? `<span class="emoji">${o.emoji}</span>` : ""}
      <span>${o.label}${o.sublabel ? ` <small>· ${o.sublabel}</small>` : ""}</span></div>`;
  });
  cont.innerHTML = `
    <button type="button" class="dropdown-toggle ${sel ? "" : "placeholder"}">
      ${sel && sel.emoji ? `<span class="emoji">${sel.emoji}</span>` : ""}
      <span>${sel ? sel.label : placeholder}</span>
    </button>
    <div class="dropdown-menu">${menuHTML}</div>`;

  cont.querySelector(".dropdown-toggle").addEventListener("click", (e) => {
    e.stopPropagation();
    const abierto = cont.classList.contains("abierto");
    cerrarDropdowns(cont);
    cont.classList.toggle("abierto", !abierto);
  });
  cont.querySelectorAll(".dropdown-option").forEach((op) => {
    op.addEventListener("click", (e) => {
      e.stopPropagation();
      cont.classList.remove("abierto");
      onSelect(op.dataset.value);
    });
  });
}

function renderDropdownLocalidad() {
  const porProvincia = {};
  LOCALIDADES.forEach((l) => (porProvincia[l.provincia] ||= []).push(l));
  const options = [];
  Object.keys(porProvincia)
    .sort()
    .forEach((prov) => {
      porProvincia[prov].forEach((l) =>
        options.push({ value: l.id, label: l.nombre, group: prov, emoji: "📍" })
      );
    });
  construirDropdown(document.getElementById("dd-localidad"), {
    placeholder: "— Elegí una localidad —",
    options,
    valorSel: estado.localidad?.id,
    onSelect: (id) => seleccionarLocalidad(id),
  });
}

function renderDropdownDestino() {
  const cont = document.getElementById("dd-destino");
  if (!estado.localidad) {
    construirDropdown(cont, {
      placeholder: "— Elegí primero una localidad —",
      options: [],
      onSelect: () => {},
    });
    return;
  }
  const vis = puntosVisibles();
  const options = vis.map((p) => {
    const act = ACTIVIDAD_POR_ID[p.actividad];
    return { value: p.id, label: p.nombre, sublabel: act.nombre, emoji: act.icon };
  });
  construirDropdown(cont, {
    placeholder: vis.length ? "— Elegí un destino —" : "Sin puntos para ese filtro",
    options,
    valorSel: estado.destino?.id,
    onSelect: (id) => seleccionarDestino(id),
  });
}

// =====================================================================
//  CHIPS DE ACTIVIDAD
// =====================================================================
function renderChips() {
  const cont = document.getElementById("chips-actividad");
  cont.innerHTML = "";
  ACTIVIDADES.forEach((a) => {
    const activo = estado.actividades.has(a.id);
    const el = document.createElement("button");
    el.type = "button";
    el.className = "chip" + (activo ? " activo" : "");
    if (activo) el.style.background = a.color;
    el.innerHTML = `<span class="ico">${a.icon}</span>${a.nombre}`;
    el.addEventListener("click", () => {
      if (estado.actividades.has(a.id)) estado.actividades.delete(a.id);
      else estado.actividades.add(a.id);
      aplicarFiltroActividad();
    });
    cont.appendChild(el);
  });
}

function aplicarFiltroActividad() {
  renderChips();
  // Si el destino actual ya no pasa el filtro, elegir el primero visible.
  if (estado.destino && !pasaFiltro(estado.destino)) {
    const vis = puntosVisibles();
    estado.destino = vis[0] || null;
  }
  renderDropdownDestino();
  dibujarPines();
  actualizarBotonCrear();
}

// =====================================================================
//  SELECCIONES
// =====================================================================
function seleccionarLocalidad(id) {
  estado.localidad = LOCALIDADES.find((l) => l.id === id) || null;
  estado.rutas = [];
  capaRutas.clearLayers();
  document.getElementById("resultados").classList.add("hidden");
  const vis = puntosVisibles();
  estado.destino = vis[0] || null;
  renderDropdownLocalidad();
  renderDropdownDestino();
  dibujarPines();
  if (estado.localidad) map.setView(estado.localidad.center, estado.localidad.zoom);
  actualizarBotonCrear();
}

function seleccionarDestino(id) {
  estado.destino = estado.localidad.puntos.find((p) => p.id === id) || null;
  renderDropdownDestino();
  dibujarPines();
  actualizarBotonCrear();
}

// =====================================================================
//  MODOS
// =====================================================================
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
      if (estado.rutas.length && estado.origen && estado.destino) crearRutas();
    });
    cont.appendChild(el);
  });
}

// =====================================================================
//  RESULTADOS
// =====================================================================
function renderResultados() {
  const cont = document.getElementById("resultados");
  const lista = document.getElementById("lista-rutas");
  const hint = document.getElementById("resultados-hint");
  cont.classList.remove("hidden");
  lista.innerHTML = "";
  const alguna = estado.rutas.some((r) => r.estimada);
  hint.textContent =
    `${estado.modo.icon} ${estado.modo.nombre} · hacia ${estado.destino.nombre}` +
    (alguna ? " · (algunas rutas son estimadas por falta de conexión al ruteador)" : "");
  estado.rutas.forEach((r, i) => {
    const card = document.createElement("div");
    card.className = "ruta-card" + (r.tipo === "escenica" ? " escenica" : "");
    card.innerHTML = `
      <div class="titulo">${r.nombre}
        <span class="ruta-tag ${r.tipo === "escenica" ? "escenica" : ""}">${r.tag}</span></div>
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
//  ARRANQUE
// =====================================================================
function main() {
  aplicarTema(temaActual());
  initMapa();
  renderChips();
  renderDropdownLocalidad();
  renderDropdownDestino();
  renderModos();

  document.getElementById("theme-toggle").addEventListener("click", toggleTema);
  document.getElementById("btn-ubicacion").addEventListener("click", usarGeolocalizacion);
  document.getElementById("btn-crear").addEventListener("click", crearRutas);
  document.addEventListener("click", () => cerrarDropdowns(null));
}

document.addEventListener("DOMContentLoaded", main);
