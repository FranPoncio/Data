# Prompt 05 · REVISAR — control de calidad (QA)

> Fase 5. El repaso final antes de dar el informe por terminado.

---

```
FASE 5 — REVISAR (QA).

Revisá críticamente todo lo que construimos (modelo + medidas + informe) y
devolveme una lista de hallazgos priorizados (🔴 alto / 🟡 medio / 🟢 bajo).
Chequeá específicamente:

1. COHERENCIA DE TOTALES: ¿las medidas suman lo que deberían? ¿algún DIVIDE
   puede dar resultados raros? ¿ranking con empates?

2. MODELO: ¿tablas sin relación? ¿relaciones bidireccionales peligrosas?
   ¿claves visibles que deberían estar ocultas? ¿falta marcar la tabla
   calendario?

3. MEDIDAS: ¿alguna sin usar en ningún visual? ¿nombres ambiguos? ¿faltan
   formatos? ¿duplicadas?

4. INFORME: ¿cada pregunta de negocio de la Fase 1 está respondida por algún
   visual? ¿sobra o falta algo? ¿los títulos comunican?

5. SEGURIDAD Y ACTUALIZACIÓN: ¿hace falta RLS? ¿el origen soporta
   actualización programada? ¿datos sensibles expuestos?

6. RENDIMIENTO: ¿columnas calculadas que deberían ser medidas? ¿tablas
   demasiado anchas?

Para cada hallazgo: problema, impacto y CÓMO SE ARREGLA (paso concreto).
Cerrá con un veredicto: ¿el informe está listo para publicar? sí/no y por qué.
```

---

✅ Cuando pases esta fase, seguí con [`docs/08`](../../docs/08-publicar-y-compartir.md) para publicar.
