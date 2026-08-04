# ⭐ Modelo y medidas · Radar IA

[⬅️ Automatización](README.md) · [Índice](../README.md)

El modelo de Power BI para los datos que captura el loop. Sigue el mismo esquema estrella del resto del repo ([doc 05](../docs/05-modelo-estrella.md)).

---

## El grano

Las tres fuentes (Hacker News, GitHub, RSS) colapsan al **mismo grano**:

> **Un ítem publicado, capturado en una fecha.**

Por eso es **una sola tabla de hechos**, no tres. Eso es lo que permite compararlas entre sí — que es donde está el análisis.

## La tabla de origen (Sheet `RadarIA`)

| Columna | Tipo | Origen |
|---|---|---|
| `Fecha` | fecha | `created_at` de la API |
| `Fuente` | texto | fijo por escenario: `HackerNews`, `GitHub`, `TechCrunch`… |
| `Tema` | texto | clasificado por IA (fase 3) |
| `Titulo` | texto | `title` |
| `Autor` | texto | `author` |
| `Puntos` | entero | `points` (HN) · `stargazers_count` (GitHub) |
| `Comentarios` | entero | `num_comments` |
| `URL` | texto | `url` |
| `CapturadoEn` | fecha/hora | `{{now}}` al momento de la corrida |

## El modelo

```
        Dim_Calendario
              │
              ▼
Dim_Fuente ─► Hechos_Items ◄─ Dim_Tema
```

- **`Hechos_Items`** — la Sheet completa.
- **`Dim_Calendario`** — tabla de fechas propia (ver [doc 06](../docs/06-medidas-dax.md)).
- **`Dim_Fuente`** — una fila por fuente, con su categoría (`atención` / `adopción` / `anuncios`).
- **`Dim_Tema`** — una fila por tema.

> 💡 `Dim_Fuente` y `Dim_Tema` se pueden generar en Power Query con **Referencia → Quitar duplicados** sobre la columna correspondiente. No hace falta mantenerlas a mano.

---

## Medidas DAX

```dax
// ---------- Base ----------

// Cantidad de ítems capturados. Formato: #,0
Items = COUNTROWS(Hechos_Items)

// Suma de puntos (score en HN, stars en GitHub). Formato: #,0
Puntos = SUM(Hechos_Items[Puntos])

// Suma de comentarios. Formato: #,0
Comentarios = SUM(Hechos_Items[Comentarios])

// Puntos promedio por ítem — mide qué tan fuerte pega cada publicación. Formato: #,0.0
Puntos promedio = DIVIDE([Puntos], [Items])


// ---------- Señales de interés ----------

// Comentarios por punto: alto = tema que genera DEBATE, no sólo aprobación. Formato: 0.00
Ratio conversación = DIVIDE([Comentarios], [Puntos])

// Participación de la selección sobre el total. Formato: 0.0%
% del total = DIVIDE([Items], CALCULATE([Items], REMOVEFILTERS()))


// ---------- Tendencia ----------

// Ítems de los últimos 7 días. Formato: #,0
Items últimos 7d =
CALCULATE(
    [Items],
    DATESINPERIOD(Dim_Calendario[Date], MAX(Dim_Calendario[Date]), -7, DAY)
)

// Ítems de los 7 días anteriores a esos. Formato: #,0
Items 7d previos =
CALCULATE(
    [Items],
    DATESINPERIOD(Dim_Calendario[Date], MAX(Dim_Calendario[Date]) - 7, -7, DAY)
)

// Crecimiento semanal del tema. Formato: 0.0%
Variación % semanal =
DIVIDE([Items últimos 7d] - [Items 7d previos], [Items 7d previos])


// ---------- Ranking ----------

// Posición del tema por cantidad de ítems. Formato: #,0
Ranking de tema =
RANKX(ALL(Dim_Tema[Tema]), [Items], , DESC)

// Puntos del ítem más fuerte del período. Formato: #,0
Pico de atención = MAXX(Hechos_Items, Hechos_Items[Puntos])
```

---

## La medida que justifica todo el diseño

Cuando estén **HN y GitHub** cargando a la misma tabla (fase 2), esta medida es el corazón del informe:

```dax
// Atención (HN) vs. adopción (GitHub) del mismo tema.
// > 1 = se habla más de lo que se usa → señal de hype.
// < 1 = se usa más de lo que se habla → tecnología madurando en silencio.
// Formato: 0.00
Índice de hype =
VAR atencion  = CALCULATE([Items], Dim_Fuente[Categoria] = "atención")
VAR adopcion  = CALCULATE([Items], Dim_Fuente[Categoria] = "adopción")
RETURN DIVIDE(atencion, adopcion)
```

Ese número es lo que **ninguna de las fuentes te da por separado**. Es la razón de usar tres y no una.

---

## Visuales sugeridos

| Zona | Visual | Campos |
|---|---|---|
| Fila superior | **Tarjetas** | `Items`, `Puntos promedio`, `Variación % semanal`, `Índice de hype` |
| Centro | **Líneas** | Eje `Dim_Calendario[Date]` · Valor `Items` · Leyenda `Dim_Tema[Tema]` |
| Derecha | **Barras ordenadas** | Eje `Dim_Tema[Tema]` · Valor `Puntos` |
| Abajo-izq | **Dispersión** | X `Puntos` · Y `Comentarios` · Detalle `Titulo` → separa lo consensuado de lo polémico |
| Abajo-der | **Tabla** | Top 10 por `Puntos`, con `Titulo`, `Fuente`, `URL` |

> El gráfico de dispersión es el más revelador: arriba-derecha están los temas que **generan debate y atención**; abajo-derecha, los que todos aprueban sin discutir.

---

[⬅️ Automatización](README.md) · [Índice](../README.md)
