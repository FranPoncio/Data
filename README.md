# 🇦🇷 Rutas Argentinas

Aplicación web para **planificar viajes a los puntos más turísticos de Argentina**,
calculando las mejores rutas según tu ubicación y tu medio de transporte.

![Rutas Argentinas](https://commons.wikimedia.org/wiki/Special:FilePath/Obelisco_de_Buenos_Aires_2021.jpg?width=800)

## ✨ Qué hace

1. **Menú de destino.** Elegís la **localidad / región** (agrupada por provincia) y el **punto turístico** exacto al que querés ir.
2. **Rutas según tu ubicación, con prioridades.**
   - **Prioridad 1:** la ruta **más corta** desde tu punto de salida al destino.
   - **Prioridad 2:** una ruta **escénica** que pasa por otro punto turístico ubicado *de camino* entre la salida y la llegada.
3. **Alternativas por medio de transporte.** Auto 🚗, moto 🏍️, bicicleta 🚲, monopatín 🛴, transporte público 🚌 o caminando 🚶. Cada modo recalcula distancia y tiempo con su propio perfil de ruteo.
4. **Mapa con estilo propio.** Base gris de OpenStreetMap (tiles CARTO Positron/Dark Matter según el tema) con filtro propio + pines personalizados.
5. **Pines interactivos.** Al hacer clic en cualquier pin se abre una ficha con **foto**, **reseña histórica**, **precio de entrada** y cómo llegar en **transporte público**.

### Además

- 🎨 **Tema claro/oscuro** con botón que respeta la preferencia de tu sistema (se recuerda tu elección).
- 🔤 **Tipografías modernas** (Fredoka + Nunito) vendorizadas localmente.
- 🏷️ **Filtro por tipo de actividad**: naturaleza y miradores, trekking, museos, histórico, shopping y paseos/peatonal.
- 🎫 **Precio de entrada** de cada lugar (o si es gratis) — *orientativo*.
- 🚌 **Info de transporte público** para llegar a cada punto — *orientativa*.
- 📚 **76 puntos turísticos** en 14 localidades/regiones, incluyendo los valles cordobeses de **Punilla** y **Calamuchita**.

> ⚠ Los precios de entrada y la información de transporte son **orientativos**: Argentina tiene alta inflación y las líneas de colectivo cambian. Sirven como guía, no como dato oficial.

## 🗺️ Cómo funciona el ruteo

- El ruteo real usa el servidor público **[Valhalla](https://valhalla.readthedocs.io/) de OpenStreetMap** (`valhalla1.openstreetmap.de`), que no requiere API key y soporta justamente los 6 perfiles de transporte (`auto`, `motorcycle`, `bicycle`, `motor_scooter`, `bus`, `pedestrian`).
- La ubicación del usuario se obtiene con la **Geolocation API** del navegador. También podés **hacer clic en el mapa** para fijar el punto de salida.
- Si no hay conexión al ruteador, la app degrada con elegancia y muestra una **ruta estimada** (línea + tiempo según la velocidad típica del modo).

## 🚀 Cómo ejecutarla

No necesita build. Al usar geolocalización y `fetch`, conviene servirla por HTTP (no abrir el archivo directamente):

```bash
# Desde la raíz del proyecto:
python3 -m http.server 8000
# luego abrí http://localhost:8000 en el navegador
```

> La geolocalización requiere `localhost` o HTTPS. En `localhost` funciona sin problemas.

## 📁 Estructura

```
.
├── index.html            # Estructura de la app
├── assets/
│   ├── css/style.css     # Estilos + estilo propio del mapa y los pines
│   └── js/
│       ├── data.js       # Dataset de localidades, puntos turísticos y modos
│       └── app.js        # Lógica: mapa, ruteo, prioridades, UI
└── README.md
```

## 🧭 Cómo agregar más lugares

Editá `assets/js/data.js`. Cada localidad tiene un arreglo `puntos`; agregá un objeto con
`id`, `nombre`, `categoria`, `lat`, `lng`, `img` (nombre de archivo en Wikimedia Commons vía el helper `wiki()`) y `sinopsis`.

## 🙌 Créditos de datos

- Cartografía: © OpenStreetMap contributors · © CARTO.
- Ruteo: proyecto Valhalla / OpenStreetMap.
- Imágenes: Wikimedia Commons (con *fallback* automático si alguna no carga).
