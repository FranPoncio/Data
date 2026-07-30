import { analyzeProject } from '../analytics/decisions';
import { DATA_DATE, progressByWp, project, workPackages } from '../fixtures/gasoducto';
import { buildConclusion } from './conclusion';
import { DecisionPanel } from './components/DecisionPanel';
import { EvmSummary } from './components/EvmSummary';
import { SCurveChart } from './components/SCurveChart';
import { WorkPackageTable } from './components/WorkPackageTable';
import { StatusPill } from './components/primitives';

const TIPO_LABEL: Record<string, string> = {
  obra_civil: 'Obra civil',
  industrial: 'Industrial',
  ti: 'TI',
  servicios: 'Servicios',
};

export function Dashboard() {
  const analysis = analyzeProject(project, workPackages, progressByWp, DATA_DATE);
  const conclusion = buildConclusion(analysis);
  const cur = project.moneda;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      {/* Cabecera del proyecto. */}
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5">
        <div>
          <div className="text-[11px] font-600 uppercase tracking-[0.16em] text-tech">
            PMTool · Tablero EVM
          </div>
          <h1 className="mt-1 text-[22px] font-700 leading-tight text-[#E7EEF0]">
            {project.nombre}
          </h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-tech">
            <span>{TIPO_LABEL[project.tipo]}</span>
            <span className="text-tech/40">·</span>
            <span className="num">{project.moneda}</span>
            <span className="text-tech/40">·</span>
            <span>Fecha de corte: <span className="num">{DATA_DATE}</span></span>
          </div>
        </div>
        <StatusPill status={analysis.status} />
      </header>

      {/* Regla de diseño: la pantalla abre con una conclusión escrita. */}
      <section className="mt-6 max-w-3xl">
        <h2 className="text-lg font-600 leading-snug text-[#E7EEF0]">{conclusion.titular}</h2>
        {conclusion.parrafos.map((p, i) => (
          <p key={i} className="mt-2 text-[14px] leading-relaxed text-[#B7C7CC]">
            {p}
          </p>
        ))}
      </section>

      <div className="mt-6 space-y-5">
        {/* Requiere decisión: arriba, ordenado por exposición. */}
        <DecisionPanel items={analysis.decisiones} currency={cur} />

        {/* Consolidado contra plan. */}
        <EvmSummary evm={analysis.evm} currency={cur} />

        {/* Curva S. */}
        <SCurveChart
          project={project}
          workPackages={workPackages}
          dataDate={DATA_DATE}
          evm={analysis.evm}
        />

        {/* Detalle por paquete. */}
        <WorkPackageTable packages={analysis.packages} currency={cur} />
      </div>

      <footer className="mt-8 border-t border-line pt-4 text-[12px] text-tech/70">
        Maqueta con datos de ejemplo. El motor de cálculo (PV/EV/AC, SPI/CPI, EAC, ETC, VAC, TCPI)
        vive en <span className="num">src/core/evm.ts</span> y está cubierto por tests.
      </footer>
    </div>
  );
}
