# 🔁 Automatización · El loop Make → Power BI

[⬅️ Volver al índice](../README.md)

Acá vive la parte que **mueve los datos sola**. El [agente](../agente-ia/) diseña el modelo una vez; este loop lo alimenta todos los días.

<p align="center"><img src="../assets/img/flujo-agente.svg" alt="Flujo del agente" width="880"></p>

---

## La idea

> **El agente construye el modelo una sola vez. Lo único que se repite es refrescar los datos.**

Esa distinción es todo el diseño. Un informe de Power BI no se "regenera" cada día — se **refresca**. El modelo estrella y las medidas DAX quedan quietos; lo que cambia es la tabla de origen.

## Estado actual

| Pieza | Estado |
|---|---|
| Escenario en Make | ✅ Creado — `Radar IA · Hacker News → Sheet` |
| Conexión Google | ✅ Ya autorizada |
| Sheet destino | ✅ `RadarIA` en Drive |
| Mapeo de campos | ⏳ Falta el primer run (ver abajo) |
| Conexión Power BI | ❌ Bloqueada — requiere cuenta organizacional |
| `refreshADataset` | ❌ Pendiente de lo anterior |

**Por eso arrancamos por la mitad de captura**, que funciona hoy y no depende de ninguna licencia:

```
Scheduler (diario 08:00) → HTTP: GET Hacker News → Sheets: Bulk Add Rows
```

Cuando haya cuenta organizacional se le agrega el cuarto módulo (`refreshADataset`) y el loop queda cerrado.

---

## ⚠️ Dos cosas antes de activarlo

### 1. Hay que correrlo una vez a mano

El módulo HTTP tiene `parseResponse: true`, pero Make **no conoce la forma del JSON hasta que lo ve una vez**. Es el comportamiento documentado del módulo:

> *"Before you can use parsed JSON or XML content, run the module once manually so that the module can recognize the response content."*

Por eso el mapeo de `rows` en el módulo de Sheets **quedó vacío a propósito**. El orden correcto es:

1. Abrí el escenario en Make.
2. **Run once** (botón de abajo a la izquierda).
3. Mirá la salida del módulo HTTP — vas a ver el array `data.hits`.
4. Recién ahí mapeás los campos en Bulk Add Rows.

Mapearlo a ciegas antes de eso genera referencias rotas.

### 2. Nunca iterar fila por fila

Esta es la diferencia entre que entre en el plan Free o no:

| Enfoque | Ops/día | Ops/mes |
|---|---:|---:|
| ❌ Iterar 20 ítems + 1 fila c/u | 42 | **1.260** |
| ✅ Bulk Add Rows (1 sola llamada) | ~4 | **120** |

El plan Free da **1.000 operaciones/mes**. La primera opción te deja sin plan en la primera semana.

---

## Los campos que devuelve Hacker News

El endpoint usado:

```
https://hn.algolia.com/api/v1/search_by_date?query=AI%20agent&tags=story&hitsPerPage=20
```

La respuesta trae un array `hits` donde cada ítem tiene (entre otros):

| Campo de la API | Columna en la Sheet |
|---|---|
| `created_at` | Fecha |
| — (fijo: `HackerNews`) | Fuente |
| — (vacío por ahora) | Tema |
| `title` | Titulo |
| `author` | Autor |
| `points` | Puntos |
| `num_comments` | Comentarios |
| `url` | URL |
| `{{now}}` | CapturadoEn |

> ℹ️ **No pude verificar el endpoint en vivo** desde el entorno donde se armó esto (política de red bloqueó la salida). Make lo llama desde sus propios servidores, así que no afecta al escenario — pero confirmá la forma exacta en el primer run.

---

## El plan por fases

Sumar todo de una es la forma más rápida de no saber qué falló.

| Fase | Qué se agrega | Ops/mes |
|---|---|---:|
| **1** ✅ | Hacker News → Sheet | ~120 |
| **2** | GitHub Search (adopción) | +~90 |
| **3** | Clasificación por tema con IA | +~30 |
| **4** | RSS de medios | +~90 |
| **5** | `refreshADataset` → Power BI | +~30 |

Ver [`fuentes-datos.md`](fuentes-datos.md) para el detalle de cada fuente y por qué esas.

---

## Archivos

| Archivo | Qué es |
|---|---|
| [`fuentes-datos.md`](fuentes-datos.md) | Las APIs candidatas, qué mide cada una y la tesis del informe |
| [`blueprint-radar-ia.json`](blueprint-radar-ia.json) | El blueprint exacto del escenario, importable en Make |
| [`modelo-radar-ia.md`](modelo-radar-ia.md) | Esquema estrella + medidas DAX para estos datos |

---

[⬅️ Índice](../README.md)
