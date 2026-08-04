# 🏗️ Ejemplo · Proyecto EVM (Earned Value)

[⬅️ Volver a ejemplos](../README.md) · [Índice](../../README.md)

Un **informe técnico de control de proyecto** con la metodología **EVM (Earned Value Management)**: compara lo planificado, lo ejecutado y lo gastado, y proyecta el costo final. Ideal para obra, ingeniería o cualquier proyecto con presupuesto y cronograma.

<p align="center"><img src="../../assets/img/mockup-dashboard-evm.svg" alt="Dashboard EVM" width="900"></p>

> ℹ️ Maqueta de referencia del resultado. Los datos de ejemplo simulan un **gasoducto** con 6 paquetes de trabajo y corte en la semana 18 (hay atrasos y sobrecostos a propósito, para que el tablero muestre alertas).

---

## 📦 Qué incluye
```
proyecto-evm/
├── datos/
│   ├── evm.csv          ← PV, EV, AC por paquete y semana (156 filas) · HECHOS
│   ├── paquetes.csv     ← 6 paquetes de trabajo + BAC (presupuesto)  · dimensión
│   └── calendario.csv   ← 26 semanas de proyecto                     · dimensión
└── modelo/
    └── medidas.dax      ← todas las medidas EVM (CPI, SPI, EAC, etc.)
```

## 🔤 Los conceptos EVM en 30 segundos
| Sigla | Nombre | Qué es |
|-------|--------|--------|
| **PV** | Planned Value | Lo que **deberías** haber avanzado (valorizado) |
| **EV** | Earned Value | Lo que **realmente** avanzaste (valorizado) |
| **AC** | Actual Cost | Lo que **gastaste** de verdad |
| **BAC** | Budget At Completion | Presupuesto total |
| **CPI** | = EV/AC | Eficiencia de **costo** (>1 bien) |
| **SPI** | = EV/PV | Eficiencia de **plazo** (>1 bien) |
| **EAC** | = BAC/CPI | Costo **final estimado** |

La **curva S** superpone PV, EV y AC en el tiempo: de un vistazo ves si el proyecto va adelantado/atrasado y caro/barato.

## 🚶 Paso a paso en Power BI
1. **Obtener datos → Texto/CSV** → importá los 3 archivos de `datos/`. En `evm.csv`, PV/EV/AC como número decimal (las celdas vacías de EV/AC después del corte quedan como null — está bien).
2. **Relaciones** (vista Modelo):
   - `paquetes[PaqueteKey]` → `evm[PaqueteKey]`
   - `calendario[SemanaKey]` → `evm[SemanaKey]`
3. Cargá las medidas de [`modelo/medidas.dax`](modelo/medidas.dax).
4. Armá los visuales según el mockup:

| Zona | Visual | Campos |
|------|--------|--------|
| Fila superior | **Tarjetas** | `CPI`, `SPI`, `CV`, `EAC`, `% Avance` |
| Centro | **Gráfico de líneas** (curva S) | Eje: `calendario[Semana]` · Valores: `PV`, `EV`, `AC` |
| Derecha | **Tabla / Matriz** | `paquetes[Paquete]`, `CPI`, `SPI` + color por `Estado CPI` |
| Abajo | **Cuadro de texto** | narrativa (ver abajo) |

5. **Semáforo:** en la tabla, formato condicional del `CPI` con la medida `Color CPI` (verde/amarillo/rojo).

## 📝 Narrativa técnica (lo que acompaña al dashboard)
> "Al corte de la semana 18, el proyecto avanza al **61%** con un **SPI de 0,97** (leve atraso) y un **CPI de 0,92** (sobrecosto acumulado). Si el desempeño de costo se mantiene, el costo final estimado (**EAC**) supera el presupuesto en torno al **5–8%**. El paquete **'Tendido de caños'** concentra el riesgo (CPI más bajo): se recomienda reforzar cuadrilla y revisar rendimientos antes de que impacte en 'Soldadura'."

## 🔗 Conexión con tu repo
Tu proyecto `Data` ya tiene un **motor EVM con curva S** en [`pmtool/`](../../../pmtool/). Este ejemplo muestra cómo **llevar esos mismos indicadores a Power BI** para un tablero ejecutivo, en vez de (o además de) la app web.

---

[⬅️ Ejemplos](../README.md) · [Índice](../../README.md)
