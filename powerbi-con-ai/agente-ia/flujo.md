# 🔄 El flujo de 5 fases (detallado)

[⬅️ Agente](README.md) · [Índice](../README.md)

---

```
        ENTRADA                         AGENTE                          SALIDA
  ┌───────────────────┐        ┌────────────────────────┐      ┌──────────────────────┐
  │ Brief de empresa  │        │ 1·LEER   entiende KPIs │  →   │ Preguntas + KPIs     │
  │ Muestra de datos  │  ───►  │ 2·MODELAR  estrella    │  →   │ Modelo + relaciones  │
  │ Qué informe querés│        │ 3·MEDIR   DAX + M      │  →   │ medidas.dax + M      │
  └───────────────────┘        │ 4·ARMAR   layout       │  →   │ Plano + narrativa    │
                               │ 5·REVISAR  QA          │  →   │ Checklist + fixes    │
                               └────────────────────────┘      └──────────────────────┘
```

## Fase 1 · 🔍 LEER
**Objetivo:** que el agente entienda el negocio antes de tocar nada.
**Entrada:** brief + muestra de datos.
**Salida esperada:**
- 5-8 **preguntas de negocio** ("¿qué producto crece más?", "¿qué cliente concentra riesgo?").
- Una lista de **KPIs** con su definición.
- La **audiencia** y la **periodicidad** del informe.
➡️ [`prompts/01-lectura-proyecto.md`](prompts/01-lectura-proyecto.md)

## Fase 2 · ⭐ MODELAR
**Objetivo:** definir el esquema estrella.
**Entrada:** salida de fase 1 + columnas reales de los datos.
**Salida esperada:**
- Lista de **tablas** clasificadas (hecho / dimensión).
- **Claves** y **relaciones** (cardinalidad y dirección).
- Necesidad de **tabla calendario**.
- Un diagrama en texto (o Mermaid).
➡️ [`prompts/02-diseno-modelo.md`](prompts/02-diseno-modelo.md)

## Fase 3 · 🔤 MEDIR
**Objetivo:** el código.
**Salida esperada:**
- **Power Query (M)** por tabla (limpieza y tipado).
- **Medidas DAX** para cada KPI, **con comentario** de qué hace cada una.
- Formato sugerido por medida.
➡️ [`prompts/03-generar-dax.md`](prompts/03-generar-dax.md)

## Fase 4 · 📐 ARMAR
**Objetivo:** el plano visual.
**Salida esperada:**
- Qué **visual** para cada pregunta y **dónde** ubicarlo (grilla).
- Qué **filtros/segmentaciones**.
- Un **texto narrativo** que interprete resultados (el "informe técnico").
➡️ [`prompts/04-armar-informe.md`](prompts/04-armar-informe.md)

## Fase 5 · ✅ REVISAR
**Objetivo:** control de calidad.
**Salida esperada:**
- ¿Los **totales cierran**?
- ¿Hay **medidas sin usar** o visuales redundantes?
- ¿Falta **seguridad (RLS)** o filtros?
- ¿Nombres claros y formatos correctos?
- Lista de **correcciones** priorizadas.
➡️ [`prompts/05-revision-qa.md`](prompts/05-revision-qa.md)

---

> 🔁 Es **iterativo**: si en la fase 4 descubrís que falta un KPI, volvés a la 3. Normal y esperable.

[⬅️ Agente](README.md) · [Ver los prompts ➡️](prompts/)
