# 06 · Medidas DAX

[⬅️ Anterior](05-modelo-estrella.md) · [Índice](../README.md) · [Siguiente: Visuales y diseño ➡️](07-visuales-y-diseno.md)

---

**DAX** (Data Analysis Expressions) es el lenguaje de las **medidas** y columnas calculadas. Una **medida** es un cálculo que **reacciona al contexto de filtros** del visual donde la ponés.

> Crear una medida: **Modelado → Nueva medida** (o botón derecho en la tabla → Nueva medida). Escribí el nombre y la fórmula. Dale formato con las opciones de "Herramientas de medición".

## Las que vas a usar siempre

```dax
Ventas totales = SUM(Hechos_Ventas[Importe])

Cantidad vendida = SUM(Hechos_Ventas[Cantidad])

Operaciones = COUNTROWS(Hechos_Ventas)

Ticket promedio = DIVIDE([Ventas totales], [Operaciones])

Costo total = SUMX(Hechos_Ventas, Hechos_Ventas[Cantidad] * RELATED(Dim_Producto[Costo]))

Margen $ = [Ventas totales] - [Costo total]

Margen % = DIVIDE([Margen $], [Ventas totales])
```

> 💡 Usá **`DIVIDE(a, b)`** en vez de `a / b`: maneja la división por cero sin romper.

## Time intelligence (necesita tabla calendario marcada)

```dax
Ventas YTD =
TOTALYTD([Ventas totales], Dim_Calendario[Date])

Ventas año anterior =
CALCULATE([Ventas totales], SAMEPERIODLASTYEAR(Dim_Calendario[Date]))

Variación % interanual =
DIVIDE([Ventas totales] - [Ventas año anterior], [Ventas año anterior])

Ventas últimos 12 meses =
CALCULATE([Ventas totales], DATESINPERIOD(Dim_Calendario[Date], MAX(Dim_Calendario[Date]), -12, MONTH))
```

## Ranking y Top N

```dax
Ranking de producto =
RANKX(ALL(Dim_Producto[Nombre]), [Ventas totales], , DESC)

Ventas Top 5 productos =
CALCULATE([Ventas totales], KEEPFILTERS(TOPN(5, ALL(Dim_Producto[Nombre]), [Ventas totales])))
```

## % del total (contribución)

```dax
% del total =
DIVIDE([Ventas totales], CALCULATE([Ventas totales], ALL(Dim_Producto)))
```

## Conceptos clave que evitan el 90% de los errores

- **Contexto de filtro:** una medida ve solo las filas que el visual dejó pasar. Un mismo `[Ventas totales]` da distinto en una tarjeta que en una tabla por producto.
- **`CALCULATE`** cambia el contexto de filtro. Es el corazón de DAX.
- **`ALL` / `REMOVEFILTERS`** quitan filtros (útil para totales y porcentajes).
- **`RELATED`** trae un valor de la dimensión hacia los hechos (necesita relación).
- **Medida ≠ columna calculada:** la columna se calcula fila por fila al cargar; la medida se calcula al vuelo según el filtro. Para KPIs → **medida**.

## Formato
En **Herramientas de medición** poné: `$ #,0` para moneda, `0.0%` para porcentajes, `#,0` para enteros. Un informe con formatos prolijos se lee 10 veces mejor.

---

[⬅️ Anterior](05-modelo-estrella.md) · [Índice](../README.md) · [Siguiente: Visuales y diseño ➡️](07-visuales-y-diseno.md)
