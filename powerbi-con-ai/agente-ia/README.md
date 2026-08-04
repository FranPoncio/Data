# 🤖 El agente de IA

[⬅️ Volver al índice](../README.md)

---

Este **no es un programa que se instala**: es un **agente basado en prompts** que podés correr con cualquier LLM (Claude, ChatGPT, Copilot, Gemini). La gracia es la **secuencia**: cada prompt toma la salida del anterior, así el modelo no se pierde y vos controlás cada paso.

<p align="center"><img src="../assets/img/flujo-agente.svg" alt="Flujo del agente" width="880"></p>

## Cómo se usa (3 formas)

### A) Manual, copiando prompts (más simple)
1. Abrí tu LLM favorito.
2. Pegá el [system prompt](prompts/00-system-agente.md) primero.
3. Después seguí en orden: [`01`](prompts/01-lectura-proyecto.md) → [`02`](prompts/02-diseno-modelo.md) → [`03`](prompts/03-generar-dax.md) → [`04`](prompts/04-armar-informe.md) → [`05`](prompts/05-revision-qa.md).
4. En cada paso, pegás lo que te pide (datos, brief) y guardás lo que devuelve.

### B) Con Claude Code / un agente con herramientas
El [system prompt](prompts/00-system-agente.md) está pensado para que un agente con acceso a archivos **genere directamente** los `.csv`, el `.tmdl` y un `medidas.dax`. Ideal para versionar en Git.

### C) Dentro de Power BI (Copilot)
Si tenés **Copilot en Power BI** (Fabric), podés usar las _ideas_ de estos prompts para pedirle medidas y resúmenes directamente. Los prompts de acá te dan el **encuadre** que a Copilot le falta.

## Qué le tenés que dar al agente

| Entrada | Dónde | Obligatorio |
|---------|-------|:-----------:|
| Contexto del negocio | [plantilla brief-empresa](plantillas/brief-empresa.md) | ✅ |
| Muestra de datos (o esquema de tablas) | tu Excel/CSV/base | ✅ |
| Qué informe querés | [plantilla especificación](plantillas/especificacion-informe.md) | recomendado |

## Qué te devuelve

1. **Preguntas de negocio + KPIs** (fase 1)
2. **Modelo estrella** con relaciones (fase 2)
3. **Power Query (M) + medidas DAX** (fase 3)
4. **Plano del informe + narrativa** (fase 4)
5. **Checklist de QA** (fase 5)

## Principios (para que no alucine)
- **Un paso a la vez.** No le pidas todo junto.
- **Que muestre supuestos.** Si inventa una columna, que lo diga.
- **Que explique cada medida.** Vos firmás el informe.
- **Datos reales mandan.** Si la muestra contradice el brief, gana la muestra.

---

[⬅️ Índice](../README.md) · [Ver el flujo detallado ➡️](flujo.md)
