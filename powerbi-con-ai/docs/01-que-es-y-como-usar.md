# 01 · Qué es y cómo usar este repo

[⬅️ Volver al índice](../README.md) · [Siguiente: Instalar Power BI ➡️](02-instalar-power-bi.md)

---

## La idea en una frase

**Un informe de Power BI = datos limpios + un modelo + medidas (DAX) + visuales.** Este repo usa un **agente de IA** para producir las primeras tres partes (que son texto y lógica) y te guía para armar la cuarta (los clics en Power BI).

## Los 3 caminos según quién sos

### 🟢 Nunca usé Power BI
1. [Instalá Power BI Desktop](02-instalar-power-bi.md) (gratis).
2. Abrí el ejemplo [Ventas Retail](../ejemplos/ventas-retail/) y seguilo tal cual.
3. Cuando te salga, leé [Preparar datos](04-preparar-datos.md) y [Modelo estrella](05-modelo-estrella.md) para entender el _por qué_.

### 🟡 Ya hice algún informe, quiero acelerar con IA
1. Leé [El flujo con IA](03-flujo-con-ia.md).
2. Usá los [prompts del agente](../agente-ia/prompts/) con tus propios datos.
3. Pegá las medidas DAX que te devuelva y ajustá visuales.

### 🔵 Quiero automatizar informes para una empresa/proyecto
1. Completá el [brief de empresa](../agente-ia/plantillas/brief-empresa.md).
2. Corré el [flujo de 5 fases](../agente-ia/flujo.md) completo.
3. Guardá el proyecto como **PBIP/TMDL** para versionarlo en Git (ver [doc 05](05-modelo-estrella.md)).

## Qué hace la IA y qué hacés vos

| Tarea | IA | Vos |
|-------|:--:|:---:|
| Entender el negocio y definir KPIs | ✅ | revisás |
| Diseñar el modelo (estrella) | ✅ | revisás |
| Escribir DAX y Power Query (M) | ✅ | pegás |
| Elegir y ubicar los visuales | ✅ (plan) | clics |
| Conectar orígenes de datos reales | guía | ✅ |
| Publicar y dar permisos | guía | ✅ |

## Glosario mínimo

- **Power BI Desktop**: la app gratis de Windows donde armás el informe.
- **Power BI Service**: la nube (`app.powerbi.com`) donde publicás y compartís.
- **DAX**: el lenguaje de fórmulas para medidas y columnas calculadas.
- **Power Query / M**: la herramienta y lenguaje para _traer y transformar_ datos.
- **Modelo estrella**: forma de organizar tablas (hechos + dimensiones) para que todo sea rápido y claro.
- **Medida**: un cálculo que reacciona a los filtros (ej. "Ventas totales").
- **PBIP / TMDL**: formato de proyecto en **archivos de texto**, versionable en Git.

---

[⬅️ Índice](../README.md) · [Siguiente: Instalar Power BI ➡️](02-instalar-power-bi.md)
