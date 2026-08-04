# 07 · Visuales y diseño

[⬅️ Anterior](06-medidas-dax.md) · [Índice](../README.md) · [Siguiente: Publicar ➡️](08-publicar-y-compartir.md)

---

## Elegir el visual según la pregunta

| Querés mostrar… | Usá | Evitá |
|-----------------|-----|-------|
| Un número clave | **Tarjeta (Card)** | tabla de 1 celda |
| Evolución en el tiempo | **Gráfico de líneas** | torta |
| Comparar categorías | **Barras / columnas** | líneas |
| Parte de un todo (pocas partes) | **Barras apiladas** | torta con 10 gajos |
| Ranking | **Barras ordenadas** | — |
| Distribución geográfica | **Mapa** | tabla de provincias |
| Detalle exacto | **Tabla / Matriz** | gráficos |
| Relación entre 2 métricas | **Dispersión (scatter)** | — |

> 🚫 **La torta casi nunca es la mejor opción.** Con más de 3-4 categorías, una barra ordenada se lee mucho mejor.

## Layout que funciona (patrón "Z")

<p align="center"><img src="../assets/img/mockup-dashboard-ventas.svg" alt="Ejemplo de layout" width="820"></p>

1. **Arriba: título + filtros** (segmentaciones / _slicers_).
2. **Fila de KPIs** (3-5 tarjetas con los números que importan).
3. **Centro: 1-2 visuales grandes** (la historia principal — ej. evolución).
4. **Costados/abajo: detalle** (barras, mapa, tabla).

El ojo lee de arriba-izquierda a abajo-derecha: poné lo más importante arriba a la izquierda.

## Reglas de oro
- **Menos es más:** 5-7 visuales por página. Si necesitás más, hacé otra página.
- **Alineá todo:** usá la cuadrícula y "Ver → Ajustar a cuadrícula". El desorden se nota.
- **Color con intención:** un color de marca + grises. El color fuerte se reserva para lo que querés destacar (ej. rojo = alerta).
- **Títulos que dicen algo:** "Ventas creciendo 12% en 2025" es mejor que "Ventas".
- **Filtros arriba y visibles:** que el usuario sepa qué está viendo.
- **Interacción:** al clic en una barra, el resto se filtra (_cross-filter_). Controlalo en **Formato → Editar interacciones**.

## Accesibilidad
- Contraste suficiente (texto oscuro sobre claro o viceversa).
- No dependas **solo** del color (agregá etiquetas o íconos ▲▼).
- Nombres de campos claros para el lector de pantalla.

## Tema visual
**Ver → Temas → Personalizar tema** o importá un JSON de tema. Definí paleta, fuentes y fondos una vez y aplicá a todo. Así todos tus informes se ven como un sistema.

---

[⬅️ Anterior](06-medidas-dax.md) · [Índice](../README.md) · [Siguiente: Publicar ➡️](08-publicar-y-compartir.md)
