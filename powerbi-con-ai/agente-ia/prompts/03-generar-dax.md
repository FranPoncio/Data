# Prompt 03 · MEDIR — Power Query (M) + medidas DAX

> Fase 3. Corré esto después de aprobar el modelo.

---

```
FASE 3 — MEDIR.

Con el modelo aprobado, generá el código. Devolveme:

1. POWER QUERY (M) por tabla: el bloque `let ... in` para importar y limpiar
   cada tabla (promover encabezados, tipar columnas, filtrar basura).

2. TABLA CALENDARIO en DAX (CALENDAR + ADDCOLUMNS), lista para pegar.

3. MEDIDAS DAX: una por cada KPI de la Fase 1, MÁS las auxiliares que hagan
   falta (año anterior, YTD, % variación, ranking). Para CADA medida:
     - nombre
     - fórmula DAX
     - // comentario de qué hace
     - formato sugerido (ej. "$ #,0" o "0.0%")

4. Entregá además un único bloque `medidas.dax` con TODAS las medidas juntas,
   listo para copiar.

Reglas: usá DIVIDE en vez de /. Usá la tabla calendario para time intelligence.
No inventes columnas que no estén en el modelo; si falta algo, decilo.
Al terminar, preguntame si avanzamos a la Fase 4 (ARMAR).
```

---

**Cómo lo usás en Power BI:**
- El **M** va en el **Editor de Power Query** (Inicio → Transformar datos → Editor avanzado, pegás el bloque).
- Cada **medida** va en **Modelado → Nueva medida**.
- Ver teoría en [`docs/04`](../../docs/04-preparar-datos.md) y [`docs/06`](../../docs/06-medidas-dax.md).
