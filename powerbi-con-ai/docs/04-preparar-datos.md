# 04 · Preparar los datos (Power Query / M)

[⬅️ Anterior](03-flujo-con-ia.md) · [Índice](../README.md) · [Siguiente: Modelo estrella ➡️](05-modelo-estrella.md)

---

> **Regla número uno:** los datos limpios se resuelven en **Power Query**, no en DAX. DAX es para cálculos; Power Query es para _traer y transformar_.

## Traer datos
**Inicio → Obtener datos** → elegí el origen:
- **Texto/CSV** (para los ejemplos de este repo)
- **Excel**
- **SQL Server / PostgreSQL / MySQL**
- **Web / API (JSON)**
- **SharePoint / OneDrive**

Se abre el **Editor de Power Query**. Ahí cada paso queda registrado (lo ves en "Pasos aplicados" a la derecha) y es **repetible**: cuando lleguen datos nuevos, se re-aplican solos.

## Limpiezas típicas (y su equivalente en M)

| Necesidad | En la interfaz | Código M |
|-----------|----------------|----------|
| Primera fila = encabezados | Usar la primera fila como encabezado | `Table.PromoteHeaders(Origen)` |
| Tipar columnas | Clic en el ícono de tipo | `Table.TransformColumnTypes(...)` |
| Quitar columnas | Botón derecho → Quitar | `Table.RemoveColumns(...)` |
| Filtrar filas | Menú del encabezado | `Table.SelectRows(...)` |
| Reemplazar valores | Reemplazar valores | `Table.ReplaceValue(...)` |
| Columna condicional | Agregar columna → Columna condicional | `Table.AddColumn(...)` |
| Dividir columna | Dividir columna | `Table.SplitColumn(...)` |
| Quitar duplicados | Quitar filas → duplicados | `Table.Distinct(...)` |

### Ejemplo de M — limpiar una tabla de ventas
```m
let
    Origen = Csv.Document(File.Contents("C:\datos\ventas.csv"),
                          [Delimiter=",", Encoding=65001]),
    Encabezados = Table.PromoteHeaders(Origen, [PromoteAllScalars=true]),
    Tipado = Table.TransformColumnTypes(Encabezados, {
        {"Fecha", type date},
        {"ProductoKey", Int64.Type},
        {"ClienteKey", Int64.Type},
        {"Cantidad", Int64.Type},
        {"Importe", Currency.Type}
    }),
    SinNulos = Table.SelectRows(Tipado, each [Importe] <> null and [Importe] > 0)
in
    SinNulos
```

## La tabla calendario (¡importante!)
Casi todo informe necesita una **dimensión de fecha propia** para poder hacer análisis por año/mes/trimestre y _time intelligence_ (YTD, año anterior). No uses la fecha de la tabla de hechos directamente. Podés crearla con DAX:

```dax
Dim_Calendario =
ADDCOLUMNS(
    CALENDAR(DATE(2023,1,1), DATE(2025,12,31)),
    "Año", YEAR([Date]),
    "MesNro", MONTH([Date]),
    "Mes", FORMAT([Date], "MMM"),
    "Trimestre", "T" & FORMAT([Date], "Q"),
    "AñoMes", FORMAT([Date], "YYYY-MM"),
    "DíaSemana", FORMAT([Date], "ddd")
)
```
Después marcala: **Modelado → Marcar como tabla de fechas**.

## Checklist antes de modelar
- [ ] Cada columna tiene el **tipo correcto** (fecha es fecha, número es número).
- [ ] No hay filas basura ni totales mezclados con datos.
- [ ] Las **claves** (`...Key`) existen en hechos y dimensiones y coinciden.
- [ ] Tenés una **tabla calendario** aparte.
- [ ] Los nombres de columnas son claros y en un solo idioma.

---

[⬅️ Anterior](03-flujo-con-ia.md) · [Índice](../README.md) · [Siguiente: Modelo estrella ➡️](05-modelo-estrella.md)
