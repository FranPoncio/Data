import type { ProgressEntry, Project, WorkPackage } from '../core/types';

/**
 * Datos de ejemplo para la maqueta: un tramo de gasoducto con planta
 * compresora. Los números están armados para contar una historia realista —
 * la obra viene atrasada y con sobrecosto, empujada por el tendido del ducto —
 * y así ejercitar el panel "requiere decisión".
 *
 * Nada de esto se persiste todavía; es el seed que después migra a Dexie.
 */

/** Fecha de corte del tablero (data date). */
export const DATA_DATE = '2026-07-30';

export const project: Project = {
  id: 'gc3',
  nombre: 'Gasoducto Regional Norte — Tramo Compresión GC-3',
  tipo: 'obra_civil',
  bac: 23_200_000,
  fechaInicio: '2025-09-01',
  fechaFinPlan: '2027-03-31',
  moneda: 'USD',
};

export const workPackages: WorkPackage[] = [
  {
    id: 'wp-ing',
    projectId: 'gc3',
    nombre: 'Ingeniería de detalle',
    presupuesto: 850_000,
    peso: 3.7,
    fechaInicioPlan: '2025-09-01',
    fechaFinPlan: '2026-03-31',
    responsable: 'M. Alcaraz',
  },
  {
    id: 'wp-adq',
    projectId: 'gc3',
    nombre: 'Adquisición de cañería y válvulas',
    presupuesto: 4_200_000,
    peso: 18.1,
    fechaInicioPlan: '2025-11-01',
    fechaFinPlan: '2026-09-30',
    responsable: 'S. Duarte',
  },
  {
    id: 'wp-civ',
    projectId: 'gc3',
    nombre: 'Obras civiles planta compresora',
    presupuesto: 3_100_000,
    peso: 13.4,
    fechaInicioPlan: '2026-01-15',
    fechaFinPlan: '2026-12-15',
    responsable: 'R. Ibáñez',
  },
  {
    id: 'wp-duc',
    projectId: 'gc3',
    nombre: 'Tendido y soldadura de ducto',
    presupuesto: 6_800_000,
    peso: 29.3,
    fechaInicioPlan: '2026-03-01',
    fechaFinPlan: '2026-12-31',
    responsable: 'J. Molina',
  },
  {
    id: 'wp-mon',
    projectId: 'gc3',
    nombre: 'Montaje electromecánico',
    presupuesto: 5_400_000,
    peso: 23.3,
    fechaInicioPlan: '2026-05-01',
    fechaFinPlan: '2027-01-31',
    responsable: 'L. Ferreyra',
  },
  {
    id: 'wp-scada',
    projectId: 'gc3',
    nombre: 'Instrumentación y SCADA',
    presupuesto: 1_650_000,
    peso: 7.1,
    fechaInicioPlan: '2026-08-01',
    fechaFinPlan: '2027-02-28',
    responsable: 'P. Sosa',
  },
  {
    id: 'wp-pru',
    projectId: 'gc3',
    nombre: 'Pruebas, precomisionado y habilitación',
    presupuesto: 1_200_000,
    peso: 5.2,
    fechaInicioPlan: '2026-11-01',
    fechaFinPlan: '2027-03-31',
    responsable: 'C. Vega',
  },
];

/** Avance vigente por paquete a la fecha de corte. */
export const progressByWp: ReadonlyMap<string, ProgressEntry> = new Map(
  (
    [
      // id WP,        % avance, costo real acum
      ['wp-ing', 1.0, 910_000], // terminado, sobrecosto leve
      ['wp-adq', 0.78, 3_150_000], // en plan, apenas mejor en costo
      ['wp-civ', 0.42, 1_650_000], // sobrecosto
      ['wp-duc', 0.35, 2_950_000], // atrasado y con sobrecosto — el peor
      ['wp-mon', 0.12, 780_000], // recién arranca, ya sobre costo
      // wp-scada y wp-pru todavía no arrancan → sin reporte (avance 0, costo 0)
    ] as const
  ).map(([id, avanceFisico, costoRealAcum]) => [
    id,
    {
      id: `${id}-pe`,
      workPackageId: id,
      fechaCorte: DATA_DATE,
      avanceFisico,
      costoRealAcum,
    } satisfies ProgressEntry,
  ])
);
