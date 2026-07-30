/*
 * Rutas Argentinas — Base de datos de puntos turísticos
 * ------------------------------------------------------
 * Cada localidad agrupa varios puntos turísticos. Cada punto tiene:
 *   id, nombre, categoria, lat, lng, img (Wikimedia Commons), sinopsis histórica.
 *
 * Las imágenes usan Special:FilePath de Wikimedia (URLs estables). Si alguna
 * fallara, la app muestra un placeholder con degradado + el nombre del lugar.
 */

// Helper para armar URLs de imágenes de Wikimedia Commons a un ancho dado.
function wiki(file, width = 600) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
}

const LOCALIDADES = [
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
        lat: -34.6037, lng: -58.3816,
        img: wiki("Obelisco_de_Buenos_Aires_2021.jpg"),
        sinopsis:
          "Inaugurado en 1936 para conmemorar el cuarto centenario de la primera fundación de la ciudad. Con 67,5 metros, se levantó en apenas 31 días y hoy es el ícono más reconocible de Buenos Aires, en el cruce de las avenidas Corrientes y 9 de Julio.",
      },
      {
        id: "casa-rosada",
        nombre: "Casa Rosada",
        categoria: "Histórico",
        lat: -34.6081, lng: -58.3702,
        img: wiki("Casa_Rosada_-_Buenos_Aires.jpg"),
        sinopsis:
          "Sede del Poder Ejecutivo argentino desde el siglo XIX. Su característico color rosado, según la tradición, buscó fusionar el blanco y el rojo de las divisas políticas del siglo XIX. Frente a ella se extiende la histórica Plaza de Mayo.",
      },
      {
        id: "caminito",
        nombre: "Caminito (La Boca)",
        categoria: "Barrio típico",
        lat: -34.6395, lng: -58.3625,
        img: wiki("Caminito_-_La_Boca_-_Buenos_Aires.jpg"),
        sinopsis:
          "Museo a cielo abierto en el barrio de La Boca, poblado por inmigrantes genoveses. Sus casas de chapa pintadas con colores vivos nacieron del ingenio de usar sobras de pintura de los barcos. Debe su nombre al tango homónimo de 1926.",
      },
      {
        id: "teatro-colon",
        nombre: "Teatro Colón",
        categoria: "Cultura",
        lat: -34.6011, lng: -58.3835,
        img: wiki("Teatro_Colón_(Buenos_Aires).jpg"),
        sinopsis:
          "Inaugurado en 1908, es considerado uno de los mejores teatros líricos del mundo por su acústica. Su construcción demandó casi veinte años y en su escenario pasaron figuras como Toscanini, Callas y Pavarotti.",
      },
      {
        id: "recoleta",
        nombre: "Cementerio de la Recoleta",
        categoria: "Histórico",
        lat: -34.5875, lng: -58.3925,
        img: wiki("Recoleta_Cemetery.jpg"),
        sinopsis:
          "Abierto en 1822, fue el primer cementerio público de la ciudad. Sus bóvedas monumentales albergan a próceres, presidentes y a Eva Perón. Es reconocido como uno de los cementerios más bellos del mundo por su arquitectura funeraria.",
      },
      {
        id: "puerto-madero",
        nombre: "Puente de la Mujer",
        categoria: "Arquitectura",
        lat: -34.6099, lng: -58.3626,
        img: wiki("Puente_de_la_Mujer,_Buenos_Aires.jpg"),
        sinopsis:
          "Diseñado por Santiago Calatrava e inaugurado en 2001, este puente giratorio de Puerto Madero evoca la silueta de una pareja bailando tango. Es el emblema moderno del barrio más nuevo de la ciudad, sobre los antiguos diques del puerto.",
      },
    ],
  },
  {
    id: "bariloche",
    nombre: "San Carlos de Bariloche",
    provincia: "Río Negro",
    center: [-41.1335, -71.3103],
    zoom: 12,
    puntos: [
      {
        id: "centro-civico",
        nombre: "Centro Cívico",
        categoria: "Histórico",
        lat: -41.1335, lng: -71.3103,
        img: wiki("Centro_Cívico_de_Bariloche.jpg"),
        sinopsis:
          "Conjunto arquitectónico inaugurado en 1940, obra de Ernesto de Estrada, construido en piedra y madera al estilo alpino que definió la identidad de la ciudad. Es Monumento Histórico Nacional y corazón de Bariloche.",
      },
      {
        id: "campanario",
        nombre: "Cerro Campanario",
        categoria: "Naturaleza",
        lat: -41.0833, lng: -71.4333,
        img: wiki("Cerro_Campanario,_Bariloche.jpg"),
        sinopsis:
          "Con 1.050 msnm, su cima —accesible por aerosilla desde 1962— fue elegida por National Geographic entre las mejores vistas del mundo. Domina el lago Nahuel Huapi, la península Llao Llao y los cerros circundantes.",
      },
      {
        id: "catedral",
        nombre: "Cerro Catedral",
        categoria: "Naturaleza",
        lat: -41.1667, lng: -71.45,
        img: wiki("Cerro_Catedral_Bariloche.jpg"),
        sinopsis:
          "Uno de los centros de esquí más grandes de Sudamérica, en funcionamiento desde la década de 1930. Su nombre proviene de las agujas rocosas que recuerdan a las torres de una catedral gótica.",
      },
      {
        id: "llao-llao",
        nombre: "Hotel Llao Llao",
        categoria: "Arquitectura",
        lat: -41.0533, lng: -71.5333,
        img: wiki("Llao_Llao_Hotel.jpg"),
        sinopsis:
          "Inaugurado en 1938 según proyecto de Alejandro Bustillo, se emplaza en un istmo entre los lagos Nahuel Huapi y Moreno. Tras un incendio, fue reconstruido en piedra y madera y hoy es uno de los hoteles más emblemáticos de la Patagonia.",
      },
    ],
  },
  {
    id: "mendoza",
    nombre: "Mendoza",
    provincia: "Mendoza",
    center: [-32.8895, -68.8458],
    zoom: 13,
    puntos: [
      {
        id: "parque-san-martin",
        nombre: "Parque General San Martín",
        categoria: "Naturaleza",
        lat: -32.8908, lng: -68.8772,
        img: wiki("Portones_del_Parque_General_San_Martín.jpg"),
        sinopsis:
          "Diseñado por Carlos Thays en 1896, cubre casi 400 hectáreas. Sus portones de hierro forjado fueron traídos desde Escocia. Es el pulmón verde de Mendoza y refugio frente al clima semidesértico de la región.",
      },
      {
        id: "cerro-gloria",
        nombre: "Cerro de la Gloria",
        categoria: "Monumento",
        lat: -32.8897, lng: -68.8878,
        img: wiki("Monumento_al_Ejército_de_los_Andes.jpg"),
        sinopsis:
          "Alberga el Monumento al Ejército de los Andes, inaugurado en 1914 y esculpido por Juan Manuel Ferrari. Homenajea la epopeya de San Martín y el cruce de la cordillera de 1817 para liberar Chile y Perú.",
      },
      {
        id: "plaza-independencia",
        nombre: "Plaza Independencia",
        categoria: "Histórico",
        lat: -32.8895, lng: -68.8458,
        img: wiki("Plaza_Independencia_Mendoza.jpg"),
        sinopsis:
          "Corazón geográfico de la ciudad reconstruida tras el terremoto de 1861. Forma parte del ingenioso trazado de plazas y calles anchas pensado como sistema antisísmico, que convirtió a Mendoza en un modelo urbano.",
      },
      {
        id: "puente-inca",
        nombre: "Puente del Inca",
        categoria: "Naturaleza",
        lat: -32.8236, lng: -69.9111,
        img: wiki("Puente_del_Inca,_Mendoza.jpg"),
        sinopsis:
          "Formación natural de roca sobre el río Las Cuevas, teñida de ocre por las aguas termales ricas en minerales. Fue paso obligado en la ruta hacia Chile y albergó un antiguo hotel termal, del que hoy quedan ruinas.",
      },
    ],
  },
  {
    id: "cordoba",
    nombre: "Córdoba",
    provincia: "Córdoba",
    center: [-31.4201, -64.1888],
    zoom: 14,
    puntos: [
      {
        id: "manzana-jesuitica",
        nombre: "Manzana Jesuítica",
        categoria: "Patrimonio UNESCO",
        lat: -31.4197, lng: -64.1889,
        img: wiki("Manzana_Jesuítica_Córdoba.jpg"),
        sinopsis:
          "Conjunto del siglo XVII que incluye la Universidad Nacional de Córdoba —la más antigua del país (1613)—, el Colegio Monserrat y la Iglesia de la Compañía. Declarado Patrimonio de la Humanidad por la UNESCO en 2000.",
      },
      {
        id: "catedral-cordoba",
        nombre: "Catedral de Córdoba",
        categoria: "Histórico",
        lat: -31.4201, lng: -64.1888,
        img: wiki("Catedral_de_Córdoba,_Argentina.jpg"),
        sinopsis:
          "El templo más antiguo en funcionamiento del país: su construcción se extendió por casi dos siglos, desde fines del XVI. Combina estilos renacentista, barroco y neoclásico, con detalles de arte indígena en su decoración.",
      },
      {
        id: "carlos-paz",
        nombre: "Reloj Cucú (Villa Carlos Paz)",
        categoria: "Ícono",
        lat: -31.4241, lng: -64.4978,
        img: wiki("Reloj_Cucú_Villa_Carlos_Paz.jpg"),
        sinopsis:
          "Inaugurado en 1958, es el reloj de estilo alemán símbolo de la villa turística serrana. Cada hora, un pájaro asoma con su canto y se convirtió en la postal más fotografiada del valle de Punilla.",
      },
    ],
  },
  {
    id: "salta",
    nombre: "Salta",
    provincia: "Salta",
    center: [-24.7905, -65.4108],
    zoom: 13,
    puntos: [
      {
        id: "cerro-san-bernardo",
        nombre: "Cerro San Bernardo",
        categoria: "Naturaleza",
        lat: -24.79, lng: -65.3947,
        img: wiki("Cerro_San_Bernardo,_Salta.jpg"),
        sinopsis:
          "Domina la ciudad desde 1.454 msnm. Accesible por teleférico, escalinata o el sendero histórico, ofrece la mejor vista del valle de Lerma. En su cima hay jardines aterrazados y una gran cruz.",
      },
      {
        id: "cabildo-salta",
        nombre: "Cabildo de Salta",
        categoria: "Histórico",
        lat: -24.7905, lng: -65.4108,
        img: wiki("Cabildo_de_Salta.jpg"),
        sinopsis:
          "El cabildo colonial mejor conservado de Argentina, de fines del siglo XVIII. Su galería de arcos frente a la plaza 9 de Julio es emblema de la 'Salta la Linda'. Hoy funciona como Museo Histórico del Norte.",
      },
      {
        id: "cafayate",
        nombre: "Cafayate",
        categoria: "Enoturismo",
        lat: -26.0731, lng: -65.9761,
        img: wiki("Cafayate,_Salta.jpg"),
        sinopsis:
          "Capital de los Valles Calchaquíes y cuna del vino Torrontés. A más de 1.600 msnm, sus bodegas centenarias y la vecina Quebrada de las Conchas, con formaciones rojizas esculpidas por el viento, la hacen inolvidable.",
      },
    ],
  },
  {
    id: "ushuaia",
    nombre: "Ushuaia",
    provincia: "Tierra del Fuego",
    center: [-54.8019, -68.303],
    zoom: 11,
    puntos: [
      {
        id: "pn-tierra-fuego",
        nombre: "P. N. Tierra del Fuego",
        categoria: "Naturaleza",
        lat: -54.8386, lng: -68.5747,
        img: wiki("Tierra_del_Fuego_National_Park.jpg"),
        sinopsis:
          "Único parque nacional costero-marino de Argentina, creado en 1960. Aquí termina la mítica Ruta Nacional 3, a 3.079 km de Buenos Aires. Bosques subantárticos, turberas y la bahía Lapataia marcan el fin del continente.",
      },
      {
        id: "faro-eclaireurs",
        nombre: "Faro Les Éclaireurs",
        categoria: "Ícono",
        lat: -54.8722, lng: -68.0819,
        img: wiki("Les_Eclaireurs_Lighthouse.jpg"),
        sinopsis:
          "Encendido en 1920 sobre un islote del canal Beagle, se lo conoce popularmente —aunque por error— como 'el faro del fin del mundo'. Sus franjas rojas y blancas guían a los barcos entre las aguas más australes.",
      },
      {
        id: "tren-fin-mundo",
        nombre: "Tren del Fin del Mundo",
        categoria: "Histórico",
        lat: -54.8167, lng: -68.4667,
        img: wiki("Tren_del_Fin_del_Mundo.jpg"),
        sinopsis:
          "Recrea el ferrocarril que usaban los presos del penal de Ushuaia para transportar leña a principios del siglo XX. Es el ferrocarril en operación más austral del mundo y recorre el ingreso al parque nacional.",
      },
    ],
  },
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
        categoria: "Naturaleza",
        lat: -25.6866, lng: -54.4442,
        img: wiki("Garganta_del_Diablo,_Iguazú.jpg"),
        sinopsis:
          "La más imponente de las 275 cascadas de las Cataratas del Iguazú: un abismo en U de 80 metros de caída y niebla perpetua. El conjunto, compartido con Brasil, es Patrimonio de la Humanidad y una de las Siete Maravillas Naturales.",
      },
      {
        id: "cataratas",
        nombre: "Cataratas del Iguazú",
        categoria: "Naturaleza",
        lat: -25.6953, lng: -54.4367,
        img: wiki("Iguazu_Falls.jpg"),
        sinopsis:
          "Descubiertas para Europa por Álvar Núñez Cabeza de Vaca en 1542, se extienden casi 3 km en plena selva paranaense. Los circuitos superior e inferior y la pasarela sobre el río Iguazú permiten vivirlas desde todos los ángulos.",
      },
      {
        id: "hito-tres-fronteras",
        nombre: "Hito Tres Fronteras",
        categoria: "Mirador",
        lat: -25.5997, lng: -54.5811,
        img: wiki("Hito_Tres_Fronteras,_Puerto_Iguazú.jpg"),
        sinopsis:
          "Balcón sobre la confluencia de los ríos Iguazú y Paraná, donde se encuentran Argentina, Brasil y Paraguay. Cada país marcó el punto con un obelisco pintado con sus colores patrios.",
      },
    ],
  },
  {
    id: "calafate",
    nombre: "El Calafate",
    provincia: "Santa Cruz",
    center: [-50.3379, -72.2648],
    zoom: 10,
    puntos: [
      {
        id: "perito-moreno",
        nombre: "Glaciar Perito Moreno",
        categoria: "Naturaleza",
        lat: -50.4967, lng: -73.1377,
        img: wiki("Perito_Moreno_Glacier.jpg"),
        sinopsis:
          "Parte del Parque Nacional Los Glaciares (Patrimonio de la Humanidad, 1981). Con un frente de 5 km y 60 metros de altura, es uno de los pocos glaciares del mundo en equilibrio. Sus rupturas cíclicas del dique de hielo son un espectáculo mundial.",
      },
      {
        id: "lago-argentino",
        nombre: "Lago Argentino",
        categoria: "Naturaleza",
        lat: -50.3379, lng: -72.2648,
        img: wiki("Lago_Argentino.jpg"),
        sinopsis:
          "El mayor lago de Argentina, de origen glaciar y aguas turquesas por la 'harina glaciar'. En sus orillas creció El Calafate, cuyo nombre proviene del arbusto patagónico cuya leyenda promete el regreso a quien prueba su fruto.",
      },
    ],
  },
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
        lat: -32.9476, lng: -60.6304,
        img: wiki("Monumento_a_la_Bandera,_Rosario.jpg"),
        sinopsis:
          "Inaugurado en 1957 en el sitio donde Manuel Belgrano izó por primera vez la bandera argentina en 1812, a orillas del Paraná. Su torre de 70 metros y la cripta de la Patria lo hacen el homenaje cívico más importante del país.",
      },
      {
        id: "parque-independencia",
        nombre: "Parque de la Independencia",
        categoria: "Naturaleza",
        lat: -32.9667, lng: -60.6667,
        img: wiki("Parque_Independencia_Rosario.jpg"),
        sinopsis:
          "Inaugurado en 1902 y diseñado por Carlos Thays, es el gran parque de Rosario. Alberga el Rosedal, lagos, museos y el estadio de Newell's, integrando naturaleza, deporte y cultura en el centro de la ciudad.",
      },
    ],
  },
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
        lat: -38.0055, lng: -57.5426,
        img: wiki("Casino_Central_Mar_del_Plata.jpg"),
        sinopsis:
          "El complejo Rambla Casino y Hotel Provincial, obra de Alejandro Bustillo inaugurada en 1939, definió la identidad de 'La Feliz'. Sus lobos marinos de piedra custodian la playa Bristol, epicentro del turismo argentino desde el siglo XIX.",
      },
      {
        id: "torre-tanque",
        nombre: "Torre Tanque",
        categoria: "Arquitectura",
        lat: -38.0089, lng: -57.5417,
        img: wiki("Torre_Tanque_Mar_del_Plata.jpg"),
        sinopsis:
          "Torre de estilo Tudor inaugurada en 1943 sobre la loma de Stella Maris. Además de tanque de agua funcional, su mirador a 88 msnm regala una vista de 360° de la ciudad y el mar.",
      },
      {
        id: "puerto-mdp",
        nombre: "Puerto de Mar del Plata",
        categoria: "Cultura",
        lat: -38.0333, lng: -57.5333,
        img: wiki("Puerto_de_Mar_del_Plata.jpg"),
        sinopsis:
          "Uno de los puertos pesqueros más importantes del país. Su Banquina de Pescadores, con la flota amarilla de barcos y la colonia de lobos marinos, es una postal viva de la tradición marinera de la ciudad.",
      },
    ],
  },
  {
    id: "purmamarca",
    nombre: "Purmamarca / Quebrada de Humahuaca",
    provincia: "Jujuy",
    center: [-23.7451, -65.4986],
    zoom: 11,
    puntos: [
      {
        id: "siete-colores",
        nombre: "Cerro de los Siete Colores",
        categoria: "Naturaleza",
        lat: -23.7451, lng: -65.4986,
        img: wiki("Cerro_de_los_Siete_Colores,_Purmamarca.jpg"),
        sinopsis:
          "Telón de fondo del pueblo de Purmamarca, sus franjas de colores son millones de años de sedimentos marinos y minerales. Forma parte de la Quebrada de Humahuaca, Patrimonio de la Humanidad y milenaria ruta andina.",
      },
      {
        id: "salinas-grandes",
        nombre: "Salinas Grandes",
        categoria: "Naturaleza",
        lat: -23.6167, lng: -65.9833,
        img: wiki("Salinas_Grandes,_Jujuy.jpg"),
        sinopsis:
          "Enorme desierto de sal a 3.450 msnm, compartido entre Jujuy y Salta. Se accede por la vertiginosa cuesta de Lipán. Explotadas artesanalmente, sus geometrías blancas frente al cielo andino son de las imágenes más impactantes del norte.",
      },
      {
        id: "hornocal",
        nombre: "Serranía de Hornocal",
        categoria: "Mirador",
        lat: -23.1667, lng: -65.1667,
        img: wiki("Serranía_de_Hornocal.jpg"),
        sinopsis:
          "El 'cerro de los 14 colores', a más de 4.300 msnm sobre Humahuaca. Su cresta dentada de calcáreos plegados hace 80 millones de años es el mirador más espectacular de toda la Quebrada.",
      },
    ],
  },
  {
    id: "sietelagos",
    nombre: "San Martín de los Andes",
    provincia: "Neuquén",
    center: [-40.158, -71.353],
    zoom: 11,
    puntos: [
      {
        id: "smandes",
        nombre: "San Martín de los Andes",
        categoria: "Naturaleza",
        lat: -40.158, lng: -71.353,
        img: wiki("San_Martín_de_los_Andes.jpg"),
        sinopsis:
          "Fundada en 1898 a orillas del lago Lácar, es la puerta de la Ruta de los Siete Lagos y del cerro Chapelco. Su arquitectura de montaña en madera y piedra la convierten en una de las villas más pintorescas de la Patagonia.",
      },
      {
        id: "villa-angostura",
        nombre: "Villa La Angostura",
        categoria: "Naturaleza",
        lat: -40.7639, lng: -71.6417,
        img: wiki("Villa_La_Angostura.jpg"),
        sinopsis:
          "El 'Jardín de la Patagonia', extremo sur de la Ruta de los Siete Lagos. Cerca está el Parque Nacional Los Arrayanes, único bosque de arrayanes del mundo que, según la leyenda, inspiró a Walt Disney para 'Bambi'.",
      },
    ],
  },
];

// Modos de transporte -> costing de Valhalla + metadatos de UI.
const MODOS = [
  { id: "auto",         nombre: "Auto",              costing: "auto",          icon: "🚗", velocidad: 70 },
  { id: "moto",         nombre: "Moto",              costing: "motorcycle",    icon: "🏍️", velocidad: 65 },
  { id: "bicicleta",    nombre: "Bicicleta",         costing: "bicycle",       icon: "🚲", velocidad: 16 },
  { id: "monopatin",    nombre: "Monopatín",         costing: "motor_scooter", icon: "🛴", velocidad: 22 },
  { id: "publico",      nombre: "Transporte público",costing: "bus",           icon: "🚌", velocidad: 28 },
  { id: "caminando",    nombre: "Caminando",         costing: "pedestrian",    icon: "🚶", velocidad: 4.8 },
];

// Lista plana de todos los puntos (útil para búsquedas globales / rutas escénicas).
const TODOS_LOS_PUNTOS = LOCALIDADES.flatMap((l) =>
  l.puntos.map((p) => ({ ...p, localidadId: l.id, localidadNombre: l.nombre, provincia: l.provincia }))
);
