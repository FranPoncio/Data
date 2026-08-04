# 🛒 Ejemplo · Ventas Retail

[⬅️ Volver a ejemplos](../README.md) · [Índice](../../README.md)

Un ejemplo **completo y reproducible**: datos de ventas de un distribuidor mayorista → dashboard comercial. Seguilo tal cual para tu primer informe.

<p align="center"><img src="../../assets/img/mockup-dashboard-ventas.svg" alt="Dashboard de ventas" width="900"></p>

> ℹ️ La imagen es una **maqueta de referencia** del resultado. Cuando lo armes con los CSV de abajo, tu Power BI se va a ver así.

---

## 📦 Qué incluye

```
ventas-retail/
├── datos/
│   ├── ventas.csv       ← 5.572 ventas (2024–2025)  · tabla de HECHOS
│   ├── productos.csv    ← 25 productos              · dimensión
│   ├── clientes.csv     ← 40 clientes               · dimensión
│   └── vendedores.csv   ← 6 vendedores              · dimensión
└── modelo/
    ├── medidas.dax      ← todas las medidas listas para pegar
    └── modelo.tmdl      ← cómo se ve el modelo como texto (PBIP)
```

**Tablas y columnas:**

| Tabla | Columnas | Rol |
|-------|----------|-----|
| `ventas.csv` | VentaID, Fecha, ProductoKey, ClienteKey, VendedorKey, Cantidad, Importe | 📊 Hechos |
| `productos.csv` | ProductoKey, Nombre, Categoria, Marca, Costo | 📦 Dimensión |
| `clientes.csv` | ClienteKey, Nombre, Segmento, Provincia | 🙋 Dimensión |
| `vendedores.csv` | VendedorKey, Nombre, Sucursal | 🧑‍💼 Dimensión |

El modelo es un **esquema estrella**: `ventas` en el centro, las tres dimensiones alrededor + una tabla calendario. Ver el diagrama en [`docs/05`](../../docs/05-modelo-estrella.md).

---

## 🚶 Paso a paso en Power BI Desktop

### 1. Traer los datos
**Inicio → Obtener datos → Texto/CSV** e importá los 4 archivos de `datos/`. En cada uno, revisá que los **tipos** estén bien (Fecha = fecha, Importe = número decimal, las `...Key` = número entero). **Cargar**.

### 2. Crear la tabla calendario
**Modelado → Nueva tabla** y pegá:
```dax
Dim_Calendario =
ADDCOLUMNS(
    CALENDAR(DATE(2024,1,1), DATE(2025,12,31)),
    "Año", YEAR([Date]),
    "MesNro", MONTH([Date]),
    "Mes", FORMAT([Date], "MMM"),
    "AñoMes", FORMAT([Date], "YYYY-MM"),
    "Trimestre", "T" & FORMAT([Date], "Q"),
    "DíaSemana", FORMAT([Date], "ddd")
)
```
Después: **Modelado → Marcar como tabla de fechas → [Date]**.

### 3. Armar las relaciones
Vista **🔗 Modelo**. Arrastrá:
- `Dim_Producto[ProductoKey]` → `ventas[ProductoKey]`
- `Dim_Cliente[ClienteKey]` → `ventas[ClienteKey]`
- `vendedores[VendedorKey]` → `ventas[VendedorKey]`
- `Dim_Calendario[Date]` → `ventas[Fecha]`

Todas quedan **1 a muchos**, dirección única. Ocultá las columnas `...Key`.

### 4. Cargar las medidas
Abrí [`modelo/medidas.dax`](modelo/medidas.dax) y creá cada una con **Modelado → Nueva medida**. Dales formato ($ o %) en "Herramientas de medición".

### 5. Armar los visuales (según el mockup)
| Zona | Visual | Campos |
|------|--------|--------|
| Fila superior | 4 **Tarjetas** | `Ventas totales`, `Margen %`, `Ticket promedio`, `Operaciones` |
| Centro-izq | **Gráfico de líneas** | Eje: `Dim_Calendario[AñoMes]` · Valor: `Ventas totales` (+ `Ventas año anterior`) |
| Centro-der | **Barras horizontales** | Eje: `Dim_Producto[Categoria]` · Valor: `Ventas totales` (ordenado) |
| Abajo-izq | **Mapa** | Ubicación: `Dim_Cliente[Provincia]` · Tamaño: `Ventas totales` |
| Abajo-der | **Tabla** | `vendedores[Nombre]`, `Ventas totales`, `% del total` |
| Arriba | **Segmentaciones** | `Dim_Calendario[Año]`, `Dim_Cliente[Segmento]` |

### 6. Preguntas que responde el informe
- ¿Cómo evolucionan las ventas mes a mes y contra el año pasado?
- ¿Qué categorías y productos aportan más?
- ¿Qué provincias concentran la venta?
- ¿Qué vendedores rinden más?
- ¿Cómo está el margen?

---

## 🤖 Hacerlo con el agente
Querés que la IA arme todo esto sola? Pegale el [system prompt](../../agente-ia/prompts/00-system-agente.md), después la muestra de estos CSV, y corré las [5 fases](../../agente-ia/flujo.md). Debería reconstruir este mismo modelo y medidas — buen ejercicio para comparar.

---

[⬅️ Ejemplos](../README.md) · [Índice](../../README.md)
