import { plannedValue, sCurve } from '../../core/evm';
import type { EvmResult, Project, WorkPackage } from '../../core/types';
import { money } from '../format';
import { Panel, SectionHead } from './primitives';

const W = 760;
const H = 280;
const PAD = { top: 24, right: 120, bottom: 34, left: 16 };

function isoAtFraction(startIso: string, endIso: string, t: number): string {
  const start = Date.parse(startIso);
  const end = Date.parse(endIso);
  return new Date(start + t * (end - start)).toISOString().slice(0, 10);
}

/**
 * Curva S del proyecto: la línea de valor planificado (PV) acumulado a lo largo
 * del cronograma, con los puntos de EV (ganado) y AC (real) marcados a la fecha
 * de corte. Líneas y puntos, nunca gauges ni donuts. La identidad de cada serie
 * va por etiqueta directa, no solo por color.
 */
export function SCurveChart({
  project,
  workPackages,
  dataDate,
  evm,
}: {
  project: Project;
  workPackages: readonly WorkPackage[];
  dataDate: string;
  evm: EvmResult;
}) {
  const cur = project.moneda;
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const x = (t: number) => PAD.left + t * plotW;
  const y = (v: number) => PAD.top + (1 - v / project.bac) * plotH;

  // Muestreo de la curva S de PV a lo largo del cronograma.
  const N = 48;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const date = isoAtFraction(project.fechaInicio, project.fechaFinPlan, t);
    pts.push([x(t), y(plannedValue(workPackages, date, sCurve))]);
  }
  const pvPath = pts.map(([px, py], i) => `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`).join(' ');

  // Fracción temporal de la fecha de corte.
  const tNow =
    (Date.parse(dataDate) - Date.parse(project.fechaInicio)) /
    (Date.parse(project.fechaFinPlan) - Date.parse(project.fechaInicio));
  const nowX = x(tNow);

  const series = [
    { key: 'pv', label: 'PV · planificado', value: evm.pv, color: '#7EA5B0' },
    { key: 'ev', label: 'EV · ganado', value: evm.ev, color: '#E7EEF0' },
    { key: 'ac', label: 'AC · real', value: evm.ac, color: '#E8A33D' },
  ];

  // Reparto vertical de las etiquetas por su altura real, evitando solapes.
  const labelX = PAD.left + plotW + 12;
  const GAP = 30;
  const placed = [...series]
    .map((s) => ({ ...s, dotY: y(s.value), labelY: y(s.value) }))
    .sort((a, b) => a.labelY - b.labelY);
  for (let i = 1; i < placed.length; i++) {
    if (placed[i]!.labelY < placed[i - 1]!.labelY + GAP) {
      placed[i]!.labelY = placed[i - 1]!.labelY + GAP;
    }
  }

  return (
    <Panel>
      <SectionHead
        eyebrow="Curva S"
        title="Valor planificado, ganado y real"
        aside={`corte ${dataDate}`}
      />
      <div className="px-3 py-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Curva S del proyecto">
          {/* Línea de BAC (tope) y baseline, recesivas. */}
          <line x1={PAD.left} y1={y(project.bac)} x2={PAD.left + plotW} y2={y(project.bac)} stroke="#1E4351" strokeDasharray="3 4" />
          <text x={PAD.left} y={y(project.bac) - 6} className="num" fontSize="11" fill="#7EA5B0">
            BAC {money(project.bac, cur)}
          </text>
          <line x1={PAD.left} y1={y(0)} x2={PAD.left + plotW} y2={y(0)} stroke="#1E4351" />

          {/* Línea vertical de fecha de corte. */}
          <line x1={nowX} y1={PAD.top} x2={nowX} y2={y(0)} stroke="#1E4351" />
          <text x={nowX} y={H - PAD.bottom + 20} fontSize="11" fill="#7EA5B0" textAnchor="middle">
            hoy
          </text>

          {/* Curva S de PV. */}
          <path d={pvPath} fill="none" stroke="#7EA5B0" strokeWidth="2" />

          {/* Puntos a la fecha de corte, con etiqueta directa a la derecha
              y una línea guía desde el punto hasta su etiqueta. */}
          {placed.map((s) => (
            <g key={s.key}>
              <path
                d={`M${nowX},${s.dotY} L${labelX - 6},${s.labelY - 3}`}
                fill="none"
                stroke="#1E4351"
                strokeWidth="1"
              />
              <circle cx={nowX} cy={s.dotY} r="4.5" fill={s.color} stroke="#102A33" strokeWidth="2" />
              <text x={labelX} y={s.labelY - 3} fontSize="12" fill={s.color}>
                <tspan className="num" fontWeight="600">
                  {money(s.value, cur)}
                </tspan>
              </text>
              <text x={labelX} y={s.labelY + 10} fontSize="10" fill="#7EA5B0">
                {s.label}
              </text>
            </g>
          ))}
        </svg>
        <p className="px-2 text-[12px] leading-snug text-tech/80">
          La curva es el plan de devengamiento (perfil S). A la fecha de corte, EV por debajo de PV
          es atraso; AC por encima de EV es sobrecosto.
        </p>
      </div>
    </Panel>
  );
}
