/*
 * Rutas Argentinas — Base de datos de puntos turísticos
 * ------------------------------------------------------
 * Cada localidad agrupa varios puntos turísticos. Cada punto tiene:
 *   id, nombre, categoria, actividad, lat, lng, img,
 *   entrada  -> costo de acceso (orientativo) o "Gratis"
 *   transporte -> cómo llegar en transporte público (orientativo)
 *   sinopsis -> breve reseña histórica
 *
 * Las imágenes usan Special:FilePath de Wikimedia (URLs estables). Si alguna
 * fallara, la app muestra un placeholder con degradado + el nombre del lugar.
 *
 * ⚠ Precios y transporte son ORIENTATIVOS (Argentina tiene alta inflación y
 *   las líneas de colectivo cambian). Sirven como guía, no como dato oficial.
 */

function wiki(file, width = 600) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
}

// Tipos de actividad para filtrar (requisito: dividir por tipo de actividad).
const ACTIVIDADES = [
  { id: "naturaleza", nombre: "Naturaleza y miradores", icon: "🏞️", color: "#34d399" },
  { id: "trekking", nombre: "Trekking y aventura", icon: "🥾", color: "#fb923c" },
  { id: "museo", nombre: "Museos y cultura", icon: "🏛️", color: "#60a5fa" },
  { id: "historico", nombre: "Histórico", icon: "🏰", color: "#f6b40e" },
  { id: "shopping", nombre: "Shopping", icon: "🛍️", color: "#f472b6" },
  { id: "paseo", nombre: "Paseos y peatonal", icon: "🚶", color: "#c084fc" },
];

const LOCALIDADES = [
  // ===================== CABA =====================
  {
    id: "caba",
    nombre: "Ciudad de Buenos Aires",
    provincia: "CABA",
    center: [-34.6037, -58.3816],
    zoom: 13,
    puntos: [
      {
        id: "obelisco",
        nombre: "Obelisco",
        categoria: "Monumento",
        actividad: "historico",
        lat: -34.6037,
        lng: -58.3816,
        img: wiki("Obelisco_de_Buenos_Aires_2021.jpg"),
        entrada: "Gratis",
        transporte:
          "Subte B y D (Carlos Pellegrini / 9 de Julio); decenas de colectivos por Corrientes y 9 de Julio.",
        sinopsis:
          "Inaugurado en 1936 por el cuarto centenario de la ciudad; se levantó en 31 días y es el ícono máximo de Buenos Aires.",
      },
      {
        id: "casa-rosada",
        nombre: "Casa Rosada",
        categoria: "Histórico",
        actividad: "historico",
        lat: -34.6081,
        lng: -58.3702,
        img: wiki("Casa_Rosada_-_Buenos_Aires.jpg"),
        entrada: "Gratis (visitas guiadas gratuitas los fines de semana con reserva)",
        transporte: "Subte A, D y E (Plaza de Mayo / Bolívar); múltiples colectivos.",
        sinopsis:
          "Sede del Poder Ejecutivo desde el siglo XIX; su color rosado buscó fusionar las divisas políticas del país. Frente a ella, la Plaza de Mayo.",
      },
      {
        id: "caminito",
        nombre: "Caminito (La Boca)",
        categoria: "Barrio típico",
        actividad: "paseo",
        lat: -34.6395,
        lng: -58.3625,
        img: wiki("Caminito_-_La_Boca_-_Buenos_Aires.jpg"),
        entrada: "Gratis",
        transporte: "Colectivos 29, 53, 64, 152 y 168 (no hay subte cercano).",
        sinopsis:
          "Museo a cielo abierto de La Boca: casas de chapa pintadas con sobras de pintura de los barcos. Debe su nombre al tango de 1926.",
      },
      {
        id: "teatro-colon",
        nombre: "Teatro Colón",
        categoria: "Cultura",
        actividad: "museo",
        lat: -34.6011,
        lng: -58.3835,
        img: wiki("Teatro_Colón_(Buenos_Aires).jpg"),
        entrada: "Visita guiada AR$ ~15.000 (funciones aparte)",
        transporte: "Subte D (Tribunales); colectivos por 9 de Julio.",
        sinopsis:
          "Inaugurado en 1908, es uno de los mejores teatros líricos del mundo por su acústica. Pasaron Toscanini, Callas y Pavarotti.",
      },
      {
        id: "recoleta",
        nombre: "Cementerio de la Recoleta",
        categoria: "Histórico",
        actividad: "historico",
        lat: -34.5875,
        lng: -58.3925,
        img: wiki("Recoleta_Cemetery.jpg"),
        entrada: "AR$ ~10.000 (residentes reducido)",
        transporte: "Colectivos 10, 37, 59, 60, 92 y 110.",
        sinopsis:
          "Primer cementerio público de la ciudad (1822). Sus bóvedas monumentales guardan próceres y a Eva Perón.",
      },
      {
        id: "puerto-madero",
        nombre: "Puente de la Mujer",
        categoria: "Arquitectura",
        actividad: "paseo",
        lat: -34.6099,
        lng: -58.3626,
        img: wiki("Puente_de_la_Mujer,_Buenos_Aires.jpg"),
        entrada: "Gratis",
        transporte: "Colectivos 4, 130 y 152; a pie desde el microcentro.",
        sinopsis:
          "Puente giratorio de Santiago Calatrava (2001) que evoca una pareja bailando tango. Emblema moderno de Puerto Madero.",
      },
      {
        id: "malba",
        nombre: "MALBA",
        categoria: "Museo de arte",
        actividad: "museo",
        lat: -34.5772,
        lng: -58.4036,
        img: wiki("MALBA,_Buenos_Aires.jpg"),
        entrada: "AR$ ~12.000 (miércoles reducido)",
        transporte: "Colectivos 67, 102 y 130; Subte D (Plaza Italia) + 10 min a pie.",
        sinopsis:
          "Museo de Arte Latinoamericano (2001) con obras de Frida Kahlo, Berni y Xul Solar. Referente cultural de Palermo.",
      },
      {
        id: "bellas-artes",
        nombre: "Museo Nac. de Bellas Artes",
        categoria: "Museo de arte",
        actividad: "museo",
        lat: -34.5836,
        lng: -58.3928,
        img: wiki("Museo_Nacional_de_Bellas_Artes_(Buenos_Aires).jpg"),
        entrada: "Gratis",
        transporte: "Colectivos 17, 61, 62, 67, 92, 110 y 130.",
        sinopsis:
          "El museo de arte más importante del país, con el mayor acervo de arte argentino y obras de Rembrandt, Goya y Van Gogh.",
      },
      {
        id: "florida",
        nombre: "Calle Florida y Galerías Pacífico",
        categoria: "Compras",
        actividad: "shopping",
        lat: -34.5997,
        lng: -58.3747,
        img: wiki("Galerías_Pacífico,_Buenos_Aires.jpg"),
        entrada: "Gratis (ingreso)",
        transporte: "Subte B (Florida) y C (Lavalle); peatonal en pleno centro.",
        sinopsis:
          "Arteria peatonal comercial por excelencia; las Galerías Pacífico (1891) lucen frescos de Berni, Spilimbergo y Castagnino.",
      },
      {
        id: "bosques-palermo",
        nombre: "Bosques de Palermo",
        categoria: "Parque",
        actividad: "paseo",
        lat: -34.5711,
        lng: -58.4172,
        img: wiki("Rosedal_de_Palermo.jpg"),
        entrada: "Gratis",
        transporte: "Subte D (Plaza Italia); colectivos 10, 34, 37 y 130.",
        sinopsis:
          "Gran pulmón verde con el Rosedal, lagos y botes. Diseñado a fines del siglo XIX sobre las tierras de Rosas.",
      },
      {
        id: "jardin-japones",
        nombre: "Jardín Japonés",
        categoria: "Jardín",
        actividad: "paseo",
        lat: -34.5772,
        lng: -58.4108,
        img: wiki("Jardín_Japonés_de_Buenos_Aires.jpg"),
        entrada: "AR$ ~6.000",
        transporte: "Subte D (Plaza Italia); colectivos 10, 37, 60 y 130.",
        sinopsis:
          "Inaugurado en 1967 por la visita de los príncipes de Japón; uno de los jardines japoneses más grandes fuera de ese país.",
      },
      {
        id: "distrito-arcos",
        nombre: "Distrito Arcos",
        categoria: "Compras",
        actividad: "shopping",
        lat: -34.5766,
        lng: -58.4283,
        img: wiki("Distrito_Arcos,_Buenos_Aires.jpg"),
        entrada: "Gratis (ingreso)",
        transporte: "Subte D (Palermo); colectivos 15, 39, 55 y 152.",
        sinopsis:
          "Outlet a cielo abierto montado bajo los antiguos arcos del ferrocarril en Palermo; paseo de compras de marcas al aire libre.",
      },
    ],
  },

  // ===================== BARILOCHE =====================
  {
    id: "bariloche",
    nombre: "San Carlos de Bariloche",
    provincia: "Río Negro",
    center: [-41.1335, -71.3103],
    zoom: 11,
    puntos: [
      {
        id: "centro-civico",
        nombre: "Centro Cívico",
        categoria: "Histórico",
        actividad: "historico",
        lat: -41.1335,
        lng: -71.3103,
        img: wiki("Centro_Cívico_de_Bariloche.jpg"),
        entrada: "Gratis",
        transporte: "En pleno centro, a pie; todas las líneas urbanas confluyen ahí.",
        sinopsis:
          "Conjunto de piedra y madera al estilo alpino (1940), Monumento Histórico Nacional y corazón de la ciudad.",
      },
      {
        id: "campanario",
        nombre: "Cerro Campanario",
        categoria: "Mirador",
        actividad: "naturaleza",
        lat: -41.0833,
        lng: -71.4333,
        img: wiki("Cerro_Campanario,_Bariloche.jpg"),
        entrada: "Aerosilla AR$ ~18.000",
        transporte: "Líneas 10, 11 y 20 (sentido Llao Llao), bajada km 17,5.",
        sinopsis:
          "Elegido por National Geographic entre las mejores vistas del mundo: domina el Nahuel Huapi y la península Llao Llao.",
      },
      {
        id: "catedral",
        nombre: "Cerro Catedral",
        categoria: "Montaña",
        actividad: "trekking",
        lat: -41.1667,
        lng: -71.45,
        img: wiki("Cerro_Catedral_Bariloche.jpg"),
        entrada: "Medios de elevación aranceados (varía por temporada)",
        transporte: "Línea 55 desde el centro (~40 min).",
        sinopsis:
          "Uno de los centros de esquí más grandes de Sudamérica desde los años '30; en verano, base de trekkings de altura.",
      },
      {
        id: "llao-llao",
        nombre: "Circuito Chico y Llao Llao",
        categoria: "Paseo",
        actividad: "paseo",
        lat: -41.0533,
        lng: -71.5333,
        img: wiki("Llao_Llao_Hotel.jpg"),
        entrada: "Gratis (miradores)",
        transporte: "Línea 20 hasta Llao Llao.",
        sinopsis:
          "El emblemático hotel de Bustillo (1938) entre los lagos Nahuel Huapi y Moreno, punto alto del Circuito Chico.",
      },
      {
        id: "tronador",
        nombre: "Cerro Tronador y Pampa Linda",
        categoria: "Glaciar",
        actividad: "trekking",
        lat: -41.1553,
        lng: -71.8853,
        img: wiki("Monte_Tronador.jpg"),
        entrada: "Ingreso PN Nahuel Huapi",
        transporte: "Sin transporte público: excursión o auto (camino de ripio de mano única).",
        sinopsis:
          "El pico más alto del parque (3.478 m). En su base, el Ventisquero Negro y cascadas de deshielo.",
      },
      {
        id: "colonia-suiza",
        nombre: "Colonia Suiza",
        categoria: "Pueblo",
        actividad: "paseo",
        lat: -41.0972,
        lng: -71.5019,
        img: wiki("Colonia_Suiza,_Bariloche.jpg"),
        entrada: "Gratis",
        transporte: "Líneas 10 y 11.",
        sinopsis:
          "Aldea fundada por colonos suizos; famosa por su feria artesanal y el curanto cocido bajo tierra.",
      },
    ],
  },

  // ===================== MENDOZA =====================
  {
    id: "mendoza",
    nombre: "Mendoza",
    provincia: "Mendoza",
    center: [-32.8895, -68.8458],
    zoom: 12,
    puntos: [
      {
        id: "parque-san-martin",
        nombre: "Parque General San Martín",
        categoria: "Parque",
        actividad: "paseo",
        lat: -32.8908,
        lng: -68.8772,
        img: wiki("Portones_del_Parque_General_San_Martín.jpg"),
        entrada: "Gratis",
        transporte: "Colectivos líneas 100 (grupo Ciudad); trolebuses hacia el oeste.",
        sinopsis:
          "Diseñado por Carlos Thays en 1896; sus portones de hierro vinieron de Escocia. Pulmón verde de la ciudad.",
      },
      {
        id: "cerro-gloria",
        nombre: "Cerro de la Gloria",
        categoria: "Monumento",
        actividad: "historico",
        lat: -32.8897,
        lng: -68.8878,
        img: wiki("Monumento_al_Ejército_de_los_Andes.jpg"),
        entrada: "Gratis",
        transporte: "Micro interno del parque o caminata desde los Portones.",
        sinopsis:
          "Monumento al Ejército de los Andes (1914) que homenajea el cruce sanmartiniano de 1817.",
      },
      {
        id: "plaza-independencia",
        nombre: "Plaza Independencia",
        categoria: "Plaza",
        actividad: "paseo",
        lat: -32.8895,
        lng: -68.8458,
        img: wiki("Plaza_Independencia_Mendoza.jpg"),
        entrada: "Gratis",
        transporte: "Centro, caminando; todas las líneas del microcentro.",
        sinopsis:
          "Corazón de la ciudad reconstruida tras el terremoto de 1861, con su ingenioso trazado antisísmico de plazas y calles anchas.",
      },
      {
        id: "caminos-vino",
        nombre: "Caminos del Vino (Maipú)",
        categoria: "Enoturismo",
        actividad: "paseo",
        lat: -32.9836,
        lng: -68.7897,
        img: wiki("Viñedos_de_Mendoza.jpg"),
        entrada: "Degustaciones aranceadas (varía por bodega)",
        transporte: "Colectivo 171/173 a Maipú y bicicletas de alquiler entre bodegas.",
        sinopsis:
          "Circuito de bodegas centenarias en Maipú y Luján de Cuyo, cuna del Malbec argentino reconocido en el mundo.",
      },
      {
        id: "puente-inca",
        nombre: "Puente del Inca",
        categoria: "Naturaleza",
        actividad: "naturaleza",
        lat: -32.8236,
        lng: -69.9111,
        img: wiki("Puente_del_Inca,_Mendoza.jpg"),
        entrada: "Gratis (mirador)",
        transporte: "Sin transporte público directo; excursión de alta montaña o auto por RN7.",
        sinopsis:
          "Formación natural teñida de ocre por aguas termales; paso histórico hacia Chile con ruinas de un antiguo hotel termal.",
      },
      {
        id: "aconcagua",
        nombre: "Parque Provincial Aconcagua",
        categoria: "Montaña",
        actividad: "trekking",
        lat: -32.6533,
        lng: -70.0111,
        img: wiki("Aconcagua.jpg"),
        entrada: "Ingreso al parque (trekking y ascenso aranceados)",
        transporte: "Sin transporte público; excursión o auto hasta Laguna de Horcones (RN7).",
        sinopsis:
          "El techo de América (6.960,8 m), la montaña más alta fuera de Asia; meca del andinismo mundial.",
      },
    ],
  },

  // ===================== CÓRDOBA CAPITAL =====================
  {
    id: "cordoba",
    nombre: "Córdoba Capital",
    provincia: "Córdoba",
    center: [-31.4201, -64.1888],
    zoom: 14,
    puntos: [
      {
        id: "manzana-jesuitica",
        nombre: "Manzana Jesuítica",
        categoria: "Patrimonio UNESCO",
        actividad: "historico",
        lat: -31.4197,
        lng: -64.1889,
        img: wiki("Manzana_Jesuítica_Córdoba.jpg"),
        entrada: "Museo AR$ ~3.000 (iglesia gratis)",
        transporte: "Centro, caminando; múltiples colectivos urbanos.",
        sinopsis:
          "Conjunto del siglo XVII con la universidad más antigua del país (1613) y la Iglesia de la Compañía. Patrimonio de la Humanidad.",
      },
      {
        id: "catedral-cordoba",
        nombre: "Catedral de Córdoba",
        categoria: "Histórico",
        actividad: "historico",
        lat: -31.4201,
        lng: -64.1888,
        img: wiki("Catedral_de_Córdoba,_Argentina.jpg"),
        entrada: "Gratis",
        transporte: "Frente a la Plaza San Martín, en el centro.",
        sinopsis:
          "El templo más antiguo en funcionamiento del país; casi dos siglos de obra que mezclan barroco, neoclásico y arte indígena.",
      },
      {
        id: "capuchinos",
        nombre: "Iglesia de los Capuchinos",
        categoria: "Arquitectura",
        actividad: "historico",
        lat: -31.4256,
        lng: -64.1889,
        img: wiki("Iglesia_de_los_Capuchinos,_Córdoba.jpg"),
        entrada: "Gratis",
        transporte: "Barrio Nueva Córdoba; colectivos y a pie desde el centro.",
        sinopsis:
          "Templo neogótico (1934) célebre por su torre inconclusa, símbolo de la imperfección humana frente a lo divino.",
      },
      {
        id: "palacio-ferreyra",
        nombre: "Museo Evita – Palacio Ferreyra",
        categoria: "Museo de arte",
        actividad: "museo",
        lat: -31.4247,
        lng: -64.1864,
        img: wiki("Palacio_Ferreyra,_Córdoba.jpg"),
        entrada: "AR$ ~2.000 (miércoles gratis)",
        transporte: "Nueva Córdoba, frente al Parque Sarmiento; colectivos.",
        sinopsis:
          "Palacio de estilo Luis XVI (1916) reconvertido en Museo Superior de Bellas Artes Evita.",
      },
      {
        id: "buen-pastor",
        nombre: "Paseo del Buen Pastor",
        categoria: "Paseo",
        actividad: "paseo",
        lat: -31.4256,
        lng: -64.1878,
        img: wiki("Paseo_del_Buen_Pastor,_Córdoba.jpg"),
        entrada: "Gratis",
        transporte: "Nueva Córdoba, a pie; colectivos.",
        sinopsis:
          "Antigua cárcel de mujeres reconvertida en centro cultural con fuentes de aguas danzantes, galerías y bares.",
      },
      {
        id: "parque-sarmiento",
        nombre: "Parque Sarmiento",
        categoria: "Parque",
        actividad: "paseo",
        lat: -31.4267,
        lng: -64.1806,
        img: wiki("Parque_Sarmiento,_Córdoba.jpg"),
        entrada: "Gratis",
        transporte: "Nueva Córdoba; múltiples colectivos.",
        sinopsis:
          "El gran parque de la ciudad, obra de Carlos Thays (1911), con lago, rosedal y el zoológico histórico.",
      },
      {
        id: "patio-olmos",
        nombre: "Patio Olmos Shopping",
        categoria: "Compras",
        actividad: "shopping",
        lat: -31.4213,
        lng: -64.1869,
        img: wiki("Patio_Olmos,_Córdoba.jpg"),
        entrada: "Gratis (ingreso)",
        transporte: "Centro/Nueva Córdoba; múltiples colectivos por bulevar San Juan.",
        sinopsis:
          "Shopping montado en el ex Colegio Nacional (1927), un imponente edificio afrancesado recuperado como centro comercial ícono.",
      },
    ],
  },

  // ===================== VALLE DE PUNILLA =====================
  {
    id: "punilla",
    nombre: "Valle de Punilla",
    provincia: "Córdoba",
    center: [-31.1, -64.5],
    zoom: 9,
    puntos: [
      {
        id: "carlos-paz",
        nombre: "Villa Carlos Paz – Reloj Cucú",
        categoria: "Ícono",
        actividad: "paseo",
        lat: -31.4241,
        lng: -64.4978,
        img: wiki("Reloj_Cucú_Villa_Carlos_Paz.jpg"),
        entrada: "Gratis",
        transporte: "Colectivos interurbanos frecuentes desde Córdoba (terminal Carlos Paz).",
        sinopsis:
          "Reloj de estilo alemán (1958), símbolo de la villa: cada hora asoma un pájaro con su canto. Postal del valle.",
      },
      {
        id: "cosquin",
        nombre: "Cosquín – Plaza del Folklore",
        categoria: "Cultura",
        actividad: "historico",
        lat: -31.2447,
        lng: -64.4653,
        img: wiki("Cosquín,_Córdoba.jpg"),
        entrada: "Gratis (plaza)",
        transporte: "Colectivos interurbanos Córdoba–Cosquín.",
        sinopsis:
          "Sede desde 1961 del Festival Nacional de Folklore en la plaza Próspero Molina, capital nacional del folklore.",
      },
      {
        id: "pan-azucar",
        nombre: "Cerro Pan de Azúcar (Cosquín)",
        categoria: "Mirador",
        actividad: "naturaleza",
        lat: -31.213,
        lng: -64.436,
        img: wiki("Cerro_Pan_de_Azúcar,_Cosquín.jpg"),
        entrada: "Aerosilla arancelada",
        transporte: "Excursión o auto desde Cosquín (7 km) + aerosilla o silletas.",
        sinopsis:
          "A 1.260 m, con aerosilla y una imagen de Cristo. Vista panorámica de todo el valle de Punilla.",
      },
      {
        id: "la-falda-eden",
        nombre: "La Falda – Hotel Edén",
        categoria: "Histórico",
        actividad: "historico",
        lat: -31.0836,
        lng: -64.4869,
        img: wiki("Hotel_Edén,_La_Falda.jpg"),
        entrada: "Visita guiada arancelada",
        transporte: "Colectivos interurbanos por RN38.",
        sinopsis:
          "Lujoso hotel de principios del siglo XX que alojó a la aristocracia europea; hoy sus ruinas se recorren con guía.",
      },
      {
        id: "cuchi-corral",
        nombre: "La Cumbre – Cuchi Corral",
        categoria: "Aventura",
        actividad: "trekking",
        lat: -30.9661,
        lng: -64.5411,
        img: wiki("Cuchi_Corral,_La_Cumbre.jpg"),
        entrada: "Vuelos de parapente aranceados",
        transporte: "Auto o excursión desde La Cumbre (8 km de ripio).",
        sinopsis:
          "Balcón natural sobre el río Pinto, uno de los mejores puntos de parapente del país por sus corrientes térmicas.",
      },
      {
        id: "uritorco",
        nombre: "Capilla del Monte – Cerro Uritorco",
        categoria: "Trekking",
        actividad: "trekking",
        lat: -30.8692,
        lng: -64.4822,
        img: wiki("Cerro_Uritorco.jpg"),
        entrada: "Ingreso AR$ ~10.000",
        transporte: "Colectivo interurbano a Capilla del Monte + caminata/remise a la base.",
        sinopsis:
          "El pico más alto de las Sierras Chicas (1.949 m), rodeado de leyendas sobre ovnis y energías. Ascenso de día completo.",
      },
    ],
  },

  // ===================== VALLE DE CALAMUCHITA =====================
  {
    id: "calamuchita",
    nombre: "Valle de Calamuchita",
    provincia: "Córdoba",
    center: [-31.98, -64.6],
    zoom: 9,
    puntos: [
      {
        id: "villa-gral-belgrano",
        nombre: "Villa General Belgrano",
        categoria: "Pueblo",
        actividad: "paseo",
        lat: -31.9786,
        lng: -64.5586,
        img: wiki("Villa_General_Belgrano.jpg"),
        entrada: "Gratis",
        transporte: "Colectivos interurbanos desde Córdoba (empresas Sarmiento / Pájaro Blanco).",
        sinopsis:
          "Pueblo de impronta centroeuropea fundado por inmigrantes alemanes; sede de la Oktoberfest, la Fiesta Nacional de la Cerveza.",
      },
      {
        id: "la-cumbrecita",
        nombre: "La Cumbrecita",
        categoria: "Pueblo peatonal",
        actividad: "paseo",
        lat: -31.9008,
        lng: -64.7797,
        img: wiki("La_Cumbrecita,_Córdoba.jpg"),
        entrada: "Ingreso vehicular; pueblo 100% peatonal",
        transporte: "Colectivo desde Villa General Belgrano (~1 h).",
        sinopsis:
          "Aldea alpina peatonal fundada por alemanes en los años '30; cascadas, senderos de bosque y arquitectura de montaña.",
      },
      {
        id: "santa-rosa",
        nombre: "Santa Rosa de Calamuchita",
        categoria: "Balneario",
        actividad: "naturaleza",
        lat: -32.0664,
        lng: -64.5389,
        img: wiki("Santa_Rosa_de_Calamuchita.jpg"),
        entrada: "Gratis (balnearios de río)",
        transporte: "Colectivos interurbanos desde Córdoba.",
        sinopsis:
          "Uno de los destinos serranos más elegidos por sus balnearios sobre el río Santa Rosa y su vida nocturna en verano.",
      },
      {
        id: "embalse",
        nombre: "Embalse – Lago de Calamuchita",
        categoria: "Lago",
        actividad: "naturaleza",
        lat: -32.1928,
        lng: -64.4033,
        img: wiki("Embalse,_Córdoba.jpg"),
        entrada: "Gratis",
        transporte: "Colectivos interurbanos; estación de tren de las Sierras.",
        sinopsis:
          "Gran espejo de agua construido en los años '30 para la central hidroeléctrica; deportes náuticos y costanera.",
      },
      {
        id: "los-reartes",
        nombre: "Los Reartes",
        categoria: "Pueblo",
        actividad: "paseo",
        lat: -31.9086,
        lng: -64.59,
        img: wiki("Los_Reartes,_Córdoba.jpg"),
        entrada: "Gratis",
        transporte: "Auto recomendado; frecuencia de colectivos limitada.",
        sinopsis:
          "Pueblo tranquilo a orillas de su río, con una capilla de 1770 y grandes arboledas; ideal para descanso y pesca.",
      },
    ],
  },

  // ===================== SALTA =====================
  {
    id: "salta",
    nombre: "Salta",
    provincia: "Salta",
    center: [-24.7905, -65.4108],
    zoom: 12,
    puntos: [
      {
        id: "cerro-san-bernardo",
        nombre: "Cerro San Bernardo",
        categoria: "Mirador",
        actividad: "naturaleza",
        lat: -24.79,
        lng: -65.3947,
        img: wiki("Cerro_San_Bernardo,_Salta.jpg"),
        entrada: "Teleférico AR$ ~14.000 (sendero gratis)",
        transporte: "Teleférico desde el Parque San Martín, en el centro.",
        sinopsis:
          "Domina la ciudad a 1.454 m; se sube por teleférico, escalinata o sendero. Jardines aterrazados y gran vista del valle de Lerma.",
      },
      {
        id: "cabildo-salta",
        nombre: "Cabildo de Salta",
        categoria: "Museo",
        actividad: "museo",
        lat: -24.7905,
        lng: -65.4108,
        img: wiki("Cabildo_de_Salta.jpg"),
        entrada: "AR$ ~2.000",
        transporte: "Frente a la plaza 9 de Julio, en el centro histórico.",
        sinopsis:
          "El cabildo colonial mejor conservado del país (siglo XVIII); hoy Museo Histórico del Norte.",
      },
      {
        id: "maam",
        nombre: "Museo de Arqueología de Alta Montaña",
        categoria: "Museo",
        actividad: "museo",
        lat: -24.7887,
        lng: -65.4106,
        img: wiki("MAAM_Salta.jpg"),
        entrada: "AR$ ~5.000",
        transporte: "Centro de Salta, a pie desde la plaza.",
        sinopsis:
          "Custodia a los Niños del Llullaillaco, momias incas halladas a 6.700 m; uno de los hallazgos arqueológicos más importantes del mundo.",
      },
      {
        id: "cafayate",
        nombre: "Cafayate y la Quebrada",
        categoria: "Enoturismo",
        actividad: "paseo",
        lat: -26.0731,
        lng: -65.9761,
        img: wiki("Cafayate,_Salta.jpg"),
        entrada: "Bodegas: degustaciones aranceadas",
        transporte: "Colectivo Salta–Cafayate (~3,5 h) por la Quebrada de las Conchas.",
        sinopsis:
          "Capital de los Valles Calchaquíes y cuna del Torrontés; camino jalonado por las formaciones rojizas de la Quebrada de las Conchas.",
      },
      {
        id: "tren-nubes",
        nombre: "Viaducto La Polvorilla",
        categoria: "Histórico",
        actividad: "historico",
        lat: -24.3081,
        lng: -66.5033,
        img: wiki("Viaducto_La_Polvorilla.jpg"),
        entrada: "Excursión Tren a las Nubes (arancel alto)",
        transporte: "Excursión combinada bus+tren desde Salta; sin servicio regular.",
        sinopsis:
          "Viaducto a 4.220 m que corona el mítico Tren a las Nubes, una de las obras ferroviarias más altas del planeta.",
      },
    ],
  },

  // ===================== USHUAIA =====================
  {
    id: "ushuaia",
    nombre: "Ushuaia",
    provincia: "Tierra del Fuego",
    center: [-54.8019, -68.303],
    zoom: 10,
    puntos: [
      {
        id: "pn-tierra-fuego",
        nombre: "P. N. Tierra del Fuego",
        categoria: "Parque Nacional",
        actividad: "trekking",
        lat: -54.8386,
        lng: -68.5747,
        img: wiki("Tierra_del_Fuego_National_Park.jpg"),
        entrada: "Ingreso PN AR$ ~25.000 (extranjeros más)",
        transporte: "Bus turístico regular o Tren del Fin del Mundo desde Ushuaia.",
        sinopsis:
          "Único parque costero-marino del país (1960). Aquí termina la RN3, a 3.079 km de Buenos Aires; senderos y la bahía Lapataia.",
      },
      {
        id: "faro-eclaireurs",
        nombre: "Faro Les Éclaireurs",
        categoria: "Ícono",
        actividad: "naturaleza",
        lat: -54.8722,
        lng: -68.0819,
        img: wiki("Les_Eclaireurs_Lighthouse.jpg"),
        entrada: "Navegación por el canal arancelada",
        transporte: "Excursión en catamarán desde el puerto de Ushuaia.",
        sinopsis:
          "Faro de 1920 sobre un islote del canal Beagle, llamado —por error— 'el faro del fin del mundo'.",
      },
      {
        id: "tren-fin-mundo",
        nombre: "Tren del Fin del Mundo",
        categoria: "Histórico",
        actividad: "historico",
        lat: -54.8167,
        lng: -68.4667,
        img: wiki("Tren_del_Fin_del_Mundo.jpg"),
        entrada: "Pasaje arancelado",
        transporte: "Combis desde Ushuaia hasta la estación del Fin del Mundo.",
        sinopsis:
          "Recrea el ferrocarril de los presos del penal; el tren en operación más austral del mundo, rumbo al parque nacional.",
      },
      {
        id: "glaciar-martial",
        nombre: "Glaciar Martial",
        categoria: "Glaciar",
        actividad: "trekking",
        lat: -54.7833,
        lng: -68.4064,
        img: wiki("Glaciar_Martial,_Ushuaia.jpg"),
        entrada: "Sendero gratis (aerosilla arancelada)",
        transporte: "Taxi o combi 7 km desde el centro hasta la base.",
        sinopsis:
          "Balcón sobre la ciudad y el canal Beagle; sendero de montaña con bosque fueguino y vistas del fin del mundo.",
      },
      {
        id: "museo-fin-mundo",
        nombre: "Museo del Fin del Mundo",
        categoria: "Museo",
        actividad: "museo",
        lat: -54.8069,
        lng: -68.303,
        img: wiki("Museo_del_Fin_del_Mundo,_Ushuaia.jpg"),
        entrada: "AR$ ~4.000",
        transporte: "Centro de Ushuaia, sobre la costanera.",
        sinopsis:
          "Historia natural y humana de Tierra del Fuego: pueblos originarios, naufragios y el pasado penal de la ciudad.",
      },
    ],
  },

  // ===================== PUERTO IGUAZÚ =====================
  {
    id: "iguazu",
    nombre: "Puerto Iguazú",
    provincia: "Misiones",
    center: [-25.6866, -54.4442],
    zoom: 12,
    puntos: [
      {
        id: "garganta-diablo",
        nombre: "Garganta del Diablo",
        categoria: "Cascada",
        actividad: "naturaleza",
        lat: -25.6866,
        lng: -54.4442,
        img: wiki("Garganta_del_Diablo,_Iguazú.jpg"),
        entrada: "Ingreso PN Iguazú AR$ ~35.000",
        transporte: "Tren ecológico dentro del parque hasta la pasarela.",
        sinopsis:
          "Abismo en U de 80 m de caída y niebla perpetua, la más imponente de las 275 cascadas. Una de las Siete Maravillas Naturales.",
      },
      {
        id: "cataratas",
        nombre: "Cataratas – Circuitos",
        categoria: "Cascada",
        actividad: "trekking",
        lat: -25.6953,
        lng: -54.4367,
        img: wiki("Iguazu_Falls.jpg"),
        entrada: "Incluido en el ingreso al PN",
        transporte: "Bus urbano Puerto Iguazú–Cataratas (~40 min).",
        sinopsis:
          "Circuitos Superior e Inferior en plena selva paranaense; Patrimonio de la Humanidad desde 1984.",
      },
      {
        id: "hito-tres-fronteras",
        nombre: "Hito Tres Fronteras",
        categoria: "Mirador",
        actividad: "paseo",
        lat: -25.5997,
        lng: -54.5811,
        img: wiki("Hito_Tres_Fronteras,_Puerto_Iguazú.jpg"),
        entrada: "Gratis",
        transporte: "Colectivo urbano o taxi desde el centro de Puerto Iguazú.",
        sinopsis:
          "Balcón sobre la unión de los ríos Iguazú y Paraná, donde se tocan Argentina, Brasil y Paraguay.",
      },
      {
        id: "aripuca",
        nombre: "La Aripuca",
        categoria: "Cultura",
        actividad: "museo",
        lat: -25.6472,
        lng: -54.5353,
        img: wiki("La_Aripuca,_Misiones.jpg"),
        entrada: "AR$ ~5.000",
        transporte: "Sobre la RN12; taxi o excursión desde Puerto Iguazú.",
        sinopsis:
          "Enorme estructura de troncos que homenajea a los árboles de la selva y a la cultura guaraní.",
      },
    ],
  },

  // ===================== EL CALAFATE =====================
  {
    id: "calafate",
    nombre: "El Calafate",
    provincia: "Santa Cruz",
    center: [-50.3379, -72.2648],
    zoom: 9,
    puntos: [
      {
        id: "perito-moreno",
        nombre: "Glaciar Perito Moreno",
        categoria: "Glaciar",
        actividad: "naturaleza",
        lat: -50.4967,
        lng: -73.1377,
        img: wiki("Perito_Moreno_Glacier.jpg"),
        entrada: "Ingreso PN Los Glaciares AR$ ~45.000",
        transporte: "Buses regulares El Calafate–PN Los Glaciares (~1,5 h).",
        sinopsis:
          "Frente de 5 km y 60 m de alto; uno de los pocos glaciares del mundo en equilibrio. Sus rupturas de hielo son un espectáculo global.",
      },
      {
        id: "laguna-nimez",
        nombre: "Reserva Laguna Nimez",
        categoria: "Reserva",
        actividad: "naturaleza",
        lat: -50.33,
        lng: -72.27,
        img: wiki("Laguna_Nimez,_El_Calafate.jpg"),
        entrada: "AR$ ~5.000",
        transporte: "Caminando desde el centro de El Calafate (~15 min).",
        sinopsis:
          "Humedal a orillas del Lago Argentino con flamencos y decenas de aves; ideal para avistaje al atardecer.",
      },
      {
        id: "glaciarium",
        nombre: "Glaciarium",
        categoria: "Museo",
        actividad: "museo",
        lat: -50.3006,
        lng: -72.3239,
        img: wiki("Glaciarium,_El_Calafate.jpg"),
        entrada: "AR$ ~15.000",
        transporte: "Shuttle gratuito desde el centro (6 km).",
        sinopsis:
          "Museo del hielo patagónico que explica la formación de los glaciares; incluye un bar de hielo.",
      },
    ],
  },

  // ===================== ROSARIO =====================
  {
    id: "rosario",
    nombre: "Rosario",
    provincia: "Santa Fe",
    center: [-32.9476, -60.6304],
    zoom: 13,
    puntos: [
      {
        id: "monumento-bandera",
        nombre: "Monumento a la Bandera",
        categoria: "Monumento",
        actividad: "historico",
        lat: -32.9476,
        lng: -60.6304,
        img: wiki("Monumento_a_la_Bandera,_Rosario.jpg"),
        entrada: "Torre AR$ ~2.000",
        transporte: "Centro, a pie; múltiples colectivos urbanos.",
        sinopsis:
          "Inaugurado en 1957 donde Belgrano izó por primera vez la bandera en 1812; torre de 70 m y cripta de la Patria.",
      },
      {
        id: "parque-independencia",
        nombre: "Parque de la Independencia",
        categoria: "Parque",
        actividad: "paseo",
        lat: -32.9667,
        lng: -60.6667,
        img: wiki("Parque_Independencia_Rosario.jpg"),
        entrada: "Gratis",
        transporte: "Colectivos 101, 107, 112 y otros.",
        sinopsis:
          "Gran parque de 1902 diseñado por Carlos Thays, con el Rosedal, lagos, museos y el estadio de Newell's.",
      },
      {
        id: "costanera-rosario",
        nombre: "Costanera del Paraná",
        categoria: "Paseo",
        actividad: "paseo",
        lat: -32.931,
        lng: -60.628,
        img: wiki("Costanera_de_Rosario.jpg"),
        entrada: "Gratis",
        transporte: "Colectivos hacia la costanera; a pie desde el centro.",
        sinopsis:
          "Ribera recuperada del Paraná con parques, playas urbanas y vista a las islas; orgullo urbanístico de la ciudad.",
      },
      {
        id: "macro",
        nombre: "Museo MACRO",
        categoria: "Museo de arte",
        actividad: "museo",
        lat: -32.917,
        lng: -60.628,
        img: wiki("MACRO_Rosario.jpg"),
        entrada: "AR$ ~2.000",
        transporte: "Colectivos a la costanera norte.",
        sinopsis:
          "Museo de Arte Contemporáneo montado en antiguos silos de colores a la vera del río; ícono visual de Rosario.",
      },
    ],
  },

  // ===================== MAR DEL PLATA =====================
  {
    id: "mardelplata",
    nombre: "Mar del Plata",
    provincia: "Buenos Aires",
    center: [-38.0055, -57.5426],
    zoom: 13,
    puntos: [
      {
        id: "rambla",
        nombre: "Rambla y Casino",
        categoria: "Histórico",
        actividad: "historico",
        lat: -38.0055,
        lng: -57.5426,
        img: wiki("Casino_Central_Mar_del_Plata.jpg"),
        entrada: "Gratis (ingreso)",
        transporte: "Múltiples colectivos al centro/playa Bristol.",
        sinopsis:
          "El complejo Rambla Casino y Hotel Provincial de Bustillo (1939) definió la identidad de 'La Feliz'; sus lobos de piedra son un ícono.",
      },
      {
        id: "torre-tanque",
        nombre: "Torre Tanque",
        categoria: "Mirador",
        actividad: "paseo",
        lat: -38.0089,
        lng: -57.5417,
        img: wiki("Torre_Tanque_Mar_del_Plata.jpg"),
        entrada: "Gratis",
        transporte: "Colectivos al barrio Stella Maris.",
        sinopsis:
          "Torre de estilo Tudor (1943) sobre la loma de Stella Maris; su mirador a 88 m da una vista de 360° de la ciudad y el mar.",
      },
      {
        id: "puerto-mdp",
        nombre: "Puerto y Banquina de Pescadores",
        categoria: "Cultura",
        actividad: "paseo",
        lat: -38.0333,
        lng: -57.5333,
        img: wiki("Puerto_de_Mar_del_Plata.jpg"),
        entrada: "Gratis",
        transporte: "Colectivos 221, 511 y 562 al puerto.",
        sinopsis:
          "Uno de los puertos pesqueros más importantes del país; flota amarilla, lobos marinos y restaurantes de pescado.",
      },
      {
        id: "museo-mar",
        nombre: "Museo MAR",
        categoria: "Museo de arte",
        actividad: "museo",
        lat: -37.985,
        lng: -57.545,
        img: wiki("Museo_MAR,_Mar_del_Plata.jpg"),
        entrada: "AR$ ~3.000",
        transporte: "Colectivos hacia Playa Grande / Av. Constitución.",
        sinopsis:
          "Museo de arte contemporáneo célebre por las esculturas gigantes de Marta Minujín en su explanada.",
      },
    ],
  },

  // ===================== QUEBRADA DE HUMAHUACA =====================
  {
    id: "humahuaca",
    nombre: "Quebrada de Humahuaca",
    provincia: "Jujuy",
    center: [-23.6, -65.4],
    zoom: 9,
    puntos: [
      {
        id: "siete-colores",
        nombre: "Cerro de los Siete Colores",
        categoria: "Naturaleza",
        actividad: "naturaleza",
        lat: -23.7451,
        lng: -65.4986,
        img: wiki("Cerro_de_los_Siete_Colores,_Purmamarca.jpg"),
        entrada: "Paseo de los Colorados AR$ ~2.000 (mirador gratis)",
        transporte: "Colectivos San Salvador de Jujuy–Purmamarca.",
        sinopsis:
          "Telón de Purmamarca; sus franjas son millones de años de sedimentos. Parte de la Quebrada, Patrimonio de la Humanidad.",
      },
      {
        id: "salinas-grandes",
        nombre: "Salinas Grandes",
        categoria: "Salar",
        actividad: "naturaleza",
        lat: -23.6167,
        lng: -65.9833,
        img: wiki("Salinas_Grandes,_Jujuy.jpg"),
        entrada: "Guía comunitaria AR$ ~5.000",
        transporte:
          "Excursión desde Purmamarca por la Cuesta de Lipán; sin transporte público directo.",
        sinopsis:
          "Desierto de sal a 3.450 m entre Jujuy y Salta; geometrías blancas explotadas de forma artesanal frente al cielo andino.",
      },
      {
        id: "hornocal",
        nombre: "Serranía de Hornocal",
        categoria: "Mirador",
        actividad: "naturaleza",
        lat: -23.1667,
        lng: -65.1667,
        img: wiki("Serranía_de_Hornocal.jpg"),
        entrada: "Ingreso AR$ ~4.000",
        transporte: "Excursión o auto 4x4 desde Humahuaca (25 km de altura).",
        sinopsis:
          "El 'cerro de los 14 colores' a más de 4.300 m; cresta dentada de calcáreos plegados, el mirador más espectacular de la Quebrada.",
      },
      {
        id: "tilcara-pucara",
        nombre: "Tilcara – Pucará",
        categoria: "Sitio arqueológico",
        actividad: "historico",
        lat: -23.5833,
        lng: -65.3931,
        img: wiki("Pucará_de_Tilcara.jpg"),
        entrada: "AR$ ~3.000",
        transporte: "Colectivos San Salvador de Jujuy–Tilcara por la RN9.",
        sinopsis:
          "Fortaleza prehispánica de los omaguacas reconstruida a comienzos del siglo XX; domina el valle desde un cerro.",
      },
      {
        id: "maimara",
        nombre: "Maimará – Paleta del Pintor",
        categoria: "Naturaleza",
        actividad: "naturaleza",
        lat: -23.6264,
        lng: -65.4064,
        img: wiki("Maimará,_Jujuy.jpg"),
        entrada: "Gratis",
        transporte: "Colectivos por la RN9 (parada Maimará).",
        sinopsis:
          "Ladera multicolor que parece la paleta de un pintor, con el histórico cementerio en terrazas a sus pies.",
      },
    ],
  },

  // ===================== SIETE LAGOS =====================
  {
    id: "sietelagos",
    nombre: "San Martín de los Andes y Siete Lagos",
    provincia: "Neuquén",
    center: [-40.4, -71.5],
    zoom: 9,
    puntos: [
      {
        id: "smandes",
        nombre: "San Martín de los Andes",
        categoria: "Pueblo",
        actividad: "paseo",
        lat: -40.158,
        lng: -71.353,
        img: wiki("San_Martín_de_los_Andes.jpg"),
        entrada: "Gratis",
        transporte: "Micros urbanos; terminal con conexiones regionales.",
        sinopsis:
          "Villa de montaña fundada en 1898 a orillas del lago Lácar; puerta de la Ruta de los Siete Lagos y del cerro Chapelco.",
      },
      {
        id: "arrayanes",
        nombre: "Villa La Angostura – Arrayanes",
        categoria: "Parque Nacional",
        actividad: "trekking",
        lat: -40.7639,
        lng: -71.6417,
        img: wiki("Bosque_de_Arrayanes.jpg"),
        entrada: "Ingreso PN Los Arrayanes",
        transporte: "Catamarán desde Villa La Angostura o trekking de 12 km.",
        sinopsis:
          "Único bosque de arrayanes del mundo; sus troncos canela habrían inspirado el paisaje de 'Bambi' según la leyenda.",
      },
      {
        id: "lago-espejo",
        nombre: "Ruta de los Siete Lagos",
        categoria: "Mirador",
        actividad: "naturaleza",
        lat: -40.65,
        lng: -71.72,
        img: wiki("Ruta_de_los_Siete_Lagos.jpg"),
        entrada: "Gratis",
        transporte: "Auto o excursión por la RN40; sin transporte público regular entre miradores.",
        sinopsis:
          "Tramo de la RN40 que enlaza siete lagos de aguas cristalinas entre bosques y montañas, uno de los caminos más bellos del país.",
      },
      {
        id: "chapelco",
        nombre: "Cerro Chapelco",
        categoria: "Montaña",
        actividad: "trekking",
        lat: -40.24,
        lng: -71.29,
        img: wiki("Cerro_Chapelco.jpg"),
        entrada: "Medios de elevación aranceados",
        transporte: "Transfer desde San Martín de los Andes (~20 km).",
        sinopsis:
          "Centro de esquí con vista al volcán Lanín; en verano ofrece trekking, tirolesas y actividades de montaña.",
      },
    ],
  },
];

// Modos de transporte -> costing de Valhalla + metadatos de UI.
const MODOS = [
  { id: "auto", nombre: "Auto", costing: "auto", icon: "🚗", velocidad: 70 },
  { id: "moto", nombre: "Moto", costing: "motorcycle", icon: "🏍️", velocidad: 65 },
  { id: "bicicleta", nombre: "Bicicleta", costing: "bicycle", icon: "🚲", velocidad: 16 },
  { id: "monopatin", nombre: "Monopatín", costing: "motor_scooter", icon: "🛴", velocidad: 22 },
  { id: "publico", nombre: "Transporte público", costing: "bus", icon: "🚌", velocidad: 28 },
  { id: "caminando", nombre: "Caminando", costing: "pedestrian", icon: "🚶", velocidad: 4.8 },
];

// Lista plana de todos los puntos (para búsquedas globales / rutas escénicas).
const TODOS_LOS_PUNTOS = LOCALIDADES.flatMap((l) =>
  l.puntos.map((p) => ({
    ...p,
    localidadId: l.id,
    localidadNombre: l.nombre,
    provincia: l.provincia,
  }))
);

// Índice rápido actividad -> metadatos.
const ACTIVIDAD_POR_ID = Object.fromEntries(ACTIVIDADES.map((a) => [a.id, a]));
