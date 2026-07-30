# PMTool

Aplicación web de gestión de proyectos cuyo diferencial es un **motor completo
de Earned Value Management (EVM)**, configurable por tipo de proyecto (obra
civil, industrial, TI, servicios).

> Estado: en construcción. Esta primera etapa incluye el scaffolding del
> proyecto y el motor EVM con sus tests. La interfaz viene después.

## Stack

React + Vite + TypeScript · Zustand · Tailwind · Dexie (IndexedDB) · Vitest.

## Estructura

```
pmtool/
├─ src/
│  ├─ core/          Lógica pura, sin React (fuente de verdad)
│  │  ├─ types.ts    Modelo de datos + tipos del motor EVM
│  │  ├─ evm.ts      Motor EVM (funciones puras)
│  │  └─ evm.test.ts Tests del motor
│  ├─ db/            Persistencia con Dexie (IndexedDB)   [pendiente]
│  ├─ store/         Estado con Zustand                    [pendiente]
│  ├─ ui/            Interfaz                               [pendiente]
│  └─ test/setup.ts  Setup de testing-library
├─ tailwind.config.ts  Tokens de paleta y tipografías
└─ vite.config.ts      Vite + Vitest
```

## Motor EVM (`src/core/evm.ts`)

Funciones puras que calculan, a una fecha de corte:

| Indicador | Fórmula | Nota |
|-----------|---------|------|
| SV | EV − PV | variación de plazo |
| CV | EV − AC | variación de costo |
| SPI | EV / PV | `null` si PV = 0 |
| CPI | EV / AC | `null` si AC = 0 |
| EAC (`cpi`) | BAC / CPI | desvío sistémico |
| EAC (`budgetRate`) | AC + (BAC − EV) | desvío puntual |
| EAC (`cpiSpi`) | AC + (BAC − EV) / (CPI × SPI) | costo + plazo |
| ETC | EAC − AC | por variante |
| VAC | BAC − EAC | por variante |
| TCPI (BAC) | (BAC − EV) / (BAC − AC) | `null` si BAC = AC |
| TCPI (EAC) | (BAC − EV) / (EAC − AC) | `null` si EAC = null o EAC = AC |

**División por cero:** los indicadores indefinidos devuelven `null` (nunca
`Infinity` ni `NaN`). `null` significa "sin información suficiente todavía".

Las tres curvas (PV, EV, AC) se derivan del modelo de datos con
`plannedValue`, `earnedValue` y `actualCost`; `computeEvm()` agrega todo.

## Comandos

```bash
npm install
npm test         # corre la suite de Vitest
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run typecheck
```
