# 📡 Fuentes de datos

[⬅️ Automatización](README.md) · [Índice](../README.md)

Para un informe sobre **agentes de IA y novedades de IT**. Todas las opciones son **públicas y sin API key** — condición necesaria para el plan Free de Make, donde cada OAuth es fricción y cada key es un secreto más que administrar.

---

## Primero: qué preguntas tiene que responder

Un informe sólo es **productivo** si contesta algo que hoy no podés ver de un vistazo:

- ¿Qué temas **crecen** y cuáles se enfrían?
- ¿Qué se **usa de verdad** vs. qué es sólo ruido?
- ¿Cuánto tarda algo en pasar de **paper → producto**?
- ¿Qué **anuncian** las empresas vs. qué **adopta** la gente?

Eso define la elección de fuentes: **no una, sino varias que midan cosas distintas.**

---

## Las opciones

| Fuente | Qué mide **de verdad** | Endpoint | Formato |
|---|---|---|---|
| **Hacker News** (Algolia) | **Atención** de la comunidad técnica. Puntos y comentarios = interés real, no marketing | `hn.algolia.com/api/v1/search_by_date?query=AI+agent&tags=story` | JSON |
| **GitHub Search** | **Adopción**. Estrellas, forks, lenguaje — lo que la gente instala | `api.github.com/search/repositories?q=ai+agent&sort=stars` | JSON |
| **arXiv** | **Frontera de investigación**. Lo que se publica antes de ser producto | `export.arxiv.org/api/query?search_query=cat:cs.AI` | Atom/XML |
| **Hugging Face** | **Modelos concretos** en uso, por descargas y tendencia | `huggingface.co/api/models?sort=trendingScore` | JSON |
| **dev.to** | **Divulgación práctica** — tutoriales, adopción por devs | `dev.to/api/articles?tag=ai` | JSON |
| **RSS de medios** | **Narrativa corporativa** — anuncios, lanzamientos | feeds de TechCrunch, Ars Technica, The Verge | RSS |

> 💡 Para RSS **no hace falta el módulo HTTP**: Make tiene un módulo RSS nativo que parsea solo.

> ⚠️ Los endpoints están sin verificar en vivo — el entorno donde se armó esta guía tiene la salida a internet restringida por política de red. Confirmá la forma de cada respuesta en el primer run de Make.

---

## La recomendación: tres, no seis

```
Hacker News   ×   GitHub   ×   RSS de medios
 (atención)      (adopción)     (anuncios)
```

**Por qué esas tres:** porque el informe interesante **está en los huecos entre ellas**.

| Señal cruzada | Qué significa |
|---|---|
| Mucho ruido en HN + pocas estrellas en GitHub | **Hype sin sustancia** |
| Anuncio en medios + repo que explota | **Algo real está pasando** |
| Estrellas subiendo sin cobertura mediática | **Lo que viene**, todavía no descubierto |
| Paper en arXiv + repo semanas después | **Velocidad de transferencia** investigación → producto |

Esa es la **tesis del informe**. Con una sola fuente tenés una lista de titulares; con tres tenés un análisis.

---

## Sobre los límites

| Fuente | Límite conocido | Implicancia |
|---|---|---|
| GitHub API | 60 req/hora sin autenticar | Alcanza de sobra para 1 corrida diaria |
| HN Algolia | Sin key, sin límite documentado estricto | Ideal para empezar |
| arXiv | Pide no abusar; recomienda pausas | 1 corrida diaria está bien |

---

## Dónde entra la IA (de verdad, no de adorno)

La columna **`Tema`** (agentes · RAG · MCP · evals · multimodal) **no viene en ninguna API** — hay que deducirla del título. Ese es trabajo genuino para un modelo.

**La condición de diseño que hace que entre en el presupuesto:**

```
❌ 20 llamadas a la IA, una por ítem      →  20 ops
✅ 1 llamada que clasifica los 20 juntos  →   1 op
```

O sea: una sola llamada que devuelva un **JSON con los 20 temas**, y después Bulk Add Rows. **Nunca iterar.**

> ⚠️ Las llamadas de IA en Make consumen **créditos aparte** de las operaciones. Conviene arrancar con pocos ítems por corrida y medir antes de escalar.

---

[⬅️ Automatización](README.md) · [Índice](../README.md)
