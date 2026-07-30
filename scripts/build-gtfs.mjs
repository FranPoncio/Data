#!/usr/bin/env node
/*
 * build-gtfs.mjs — Pipeline GTFS -> transporte real por punto turístico
 * ---------------------------------------------------------------------
 * Ingiere uno o más feeds GTFS (carpetas locales con .txt y/o zips remotos)
 * y, para cada punto turístico de assets/js/data.js, calcula las PARADAS y
 * LÍNEAS reales que pasan cerca (dentro de un radio configurable).
 *
 * Salida: assets/data/transporte-gtfs.json
 *   { "<pointId>": { lines, modes, stops, nearestM, nearestStop, sources } }
 *
 * Uso:
 *   node scripts/build-gtfs.mjs
 * Config: scripts/gtfs-sources.json
 *
 * Los feeds remotos (url) se descargan solo si hay internet; si fallan, se
 * omiten sin romper el build (la app usa el texto curado como respaldo).
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ---------- Utilidades ----------
function haversineM(aLat, aLon, bLat, bLon) {
  const R = 6371000;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLon = ((bLon - aLon) * Math.PI) / 180;
  const la1 = (aLat * Math.PI) / 180;
  const la2 = (bLat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Parser CSV mínimo pero robusto (comillas, comas internas, CRLF, BOM).
function parseCSV(text) {
  text = text.replace(/^﻿/, "");
  const rows = [];
  let row = [],
    field = "",
    inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c === "\r") {
      // ignorar; el \n cierra la fila
    } else field += c;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  if (!rows.length) return [];
  const header = rows[0].map((h) => h.trim());
  return rows
    .slice(1)
    .filter((r) => r.length && !(r.length === 1 && r[0] === ""))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? "").trim()])));
}

// route_type GTFS -> etiqueta de modo.
function modoDeRouteType(t) {
  const n = parseInt(t, 10);
  if (n === 0) return "tranvía";
  if (n === 1) return "subte";
  if (n === 2) return "tren";
  if (n === 3) return "colectivo";
  if (n === 4) return "ferry";
  if (n === 5 || n === 6 || n === 7) return "cable";
  if (n >= 100 && n < 200) return "tren";
  if (n >= 700 && n < 800) return "colectivo";
  if (n >= 900 && n < 1000) return "tranvía";
  return "transporte";
}

// ---------- Carga de puntos turísticos desde data.js ----------
function cargarPuntos() {
  const src = readFileSync(join(ROOT, "assets/js/data.js"), "utf8");
  // data.js define globals con const; los exponemos vía Function.
  const fn = new Function(`${src}\n;return { TODOS_LOS_PUNTOS, LOCALIDADES };`);
  const { TODOS_LOS_PUNTOS } = fn();
  return TODOS_LOS_PUNTOS;
}

// ---------- Lectura de un feed GTFS (carpeta de .txt) ----------
function leerGTFSDir(dir) {
  const read = (f) => {
    const p = join(dir, f);
    return existsSync(p) ? parseCSV(readFileSync(p, "utf8")) : [];
  };
  return {
    stops: read("stops.txt"),
    routes: read("routes.txt"),
    trips: read("trips.txt"),
    stop_times: read("stop_times.txt"),
  };
}

// Construye el índice stop -> líneas a partir de un feed.
function indexarFeed(gtfs, sourceId) {
  const routeById = new Map();
  gtfs.routes.forEach((r) => {
    routeById.set(r.route_id, {
      short: r.route_short_name || r.route_long_name || r.route_id,
      modo: modoDeRouteType(r.route_type),
    });
  });
  const routeByTrip = new Map();
  gtfs.trips.forEach((t) => routeByTrip.set(t.trip_id, t.route_id));

  // stop_id -> Set(route_id) usando qué trips paran en cada parada.
  const routesPorStop = new Map();
  gtfs.stop_times.forEach((st) => {
    const rid = routeByTrip.get(st.trip_id);
    if (!rid) return;
    if (!routesPorStop.has(st.stop_id)) routesPorStop.set(st.stop_id, new Set());
    routesPorStop.get(st.stop_id).add(rid);
  });

  const stops = gtfs.stops
    .filter((s) => s.stop_lat && s.stop_lon)
    .map((s) => {
      const rids = routesPorStop.get(s.stop_id) || new Set();
      const lineas = [],
        modos = new Set();
      rids.forEach((rid) => {
        const r = routeById.get(rid);
        if (r) {
          lineas.push(r.short);
          modos.add(r.modo);
        }
      });
      return {
        name: s.stop_name,
        lat: parseFloat(s.stop_lat),
        lon: parseFloat(s.stop_lon),
        lineas: [...new Set(lineas)],
        modos: [...modos],
        source: sourceId,
      };
    })
    .filter((s) => s.lineas.length); // solo paradas con servicio
  return stops;
}

// ---------- Descarga opcional de feeds remotos (zip) ----------
async function leerGTFSRemoto(url) {
  // Import dinámico de fflate solo si se necesita (evita dependencia dura).
  let unzipSync;
  try {
    ({ unzipSync } = await import("fflate"));
  } catch {
    console.warn(
      "  ⚠ 'fflate' no está instalado; no puedo descomprimir zips remotos. `npm i -D fflate`."
    );
    return null;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error("HTTP " + res.status);
  const buf = new Uint8Array(await res.arrayBuffer());
  const files = unzipSync(buf);
  const dec = new TextDecoder("utf8");
  const get = (name) => {
    const key = Object.keys(files).find((k) => k.endsWith(name));
    return key ? parseCSV(dec.decode(files[key])) : [];
  };
  return {
    stops: get("stops.txt"),
    routes: get("routes.txt"),
    trips: get("trips.txt"),
    stop_times: get("stop_times.txt"),
  };
}

// ---------- Main ----------
async function main() {
  const cfg = JSON.parse(readFileSync(join(ROOT, "scripts/gtfs-sources.json"), "utf8"));
  const radio = cfg.radiusMeters || 650;
  const puntos = cargarPuntos();
  console.log(`Puntos turísticos: ${puntos.length} · radio de búsqueda: ${radio} m`);

  let stops = [];

  for (const s of cfg.sources || []) {
    const dir = join(ROOT, s.dir);
    if (!existsSync(dir)) {
      console.warn(`  ⚠ fuente '${s.id}': no existe ${s.dir}`);
      continue;
    }
    const feed = indexarFeed(leerGTFSDir(dir), s.id);
    console.log(`  ✔ ${s.id}: ${feed.length} paradas con servicio`);
    stops = stops.concat(feed);
  }

  for (const r of cfg.remote || []) {
    if (!r.url) continue;
    try {
      console.log(`  … descargando ${r.id}: ${r.url}`);
      const gtfs = await leerGTFSRemoto(r.url);
      if (gtfs) {
        const feed = indexarFeed(gtfs, r.id);
        console.log(`  ✔ ${r.id}: ${feed.length} paradas con servicio`);
        stops = stops.concat(feed);
      }
    } catch (e) {
      console.warn(`  ⚠ ${r.id}: no se pudo descargar (${e.message}). Se omite.`);
    }
  }

  // Para cada punto, buscar paradas dentro del radio.
  const salida = {};
  let conCobertura = 0;
  for (const p of puntos) {
    const cerca = [];
    for (const s of stops) {
      const d = haversineM(p.lat, p.lng, s.lat, s.lon);
      if (d <= radio) cerca.push({ ...s, d });
    }
    if (!cerca.length) continue;
    cerca.sort((a, b) => a.d - b.d);
    const lineas = [...new Set(cerca.flatMap((s) => s.lineas))].sort((a, b) =>
      a.localeCompare(b, "es", { numeric: true })
    );
    const modos = [...new Set(cerca.flatMap((s) => s.modos))];
    const fuentes = [...new Set(cerca.map((s) => s.source))];
    salida[p.id] = {
      lines: lineas,
      modes: modos,
      stops: cerca.length,
      nearestM: Math.round(cerca[0].d),
      nearestStop: cerca[0].name,
      sources: fuentes,
    };
    conCobertura++;
  }

  const outPath = join(ROOT, "assets/data/transporte-gtfs.json");
  writeFileSync(outPath, JSON.stringify(salida, null, 2) + "\n", "utf8");
  console.log(`\n✅ ${conCobertura}/${puntos.length} puntos con cobertura GTFS.`);
  console.log(`   Escrito: assets/data/transporte-gtfs.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
