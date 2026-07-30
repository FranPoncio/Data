import type { Status } from '../analytics/status';

export interface StatusStyle {
  /** Etiqueta legible del estado. */
  label: string;
  /** Color de acento (hex de la paleta). */
  color: string;
  /** Clases Tailwind para texto de acento. */
  text: string;
  /** Clases Tailwind para borde de acento. */
  border: string;
  /** Clases Tailwind para fondo tenue de acento. */
  bg: string;
}

export const STATUS_STYLE: Record<Status, StatusStyle> = {
  onplan: {
    label: 'Dentro de plan',
    color: '#5D9E82',
    text: 'text-onplan',
    border: 'border-onplan',
    bg: 'bg-onplan/10',
  },
  atencion: {
    label: 'Atención',
    color: '#E8A33D',
    text: 'text-amber',
    border: 'border-amber',
    bg: 'bg-amber/10',
  },
  desvio: {
    label: 'Desvío',
    color: '#C4623F',
    text: 'text-deviation',
    border: 'border-deviation',
    bg: 'bg-deviation/10',
  },
  'sin-dato': {
    label: 'Sin datos aún',
    color: '#7EA5B0',
    text: 'text-tech',
    border: 'border-tech',
    bg: 'bg-tech/10',
  },
};
