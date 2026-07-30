import type { Config } from 'tailwindcss';

/**
 * Tokens de diseño del brief de PMTool.
 * La paleta es sobria y técnica: fondo oscuro, paneles apenas más claros,
 * y tres acentos con semántica fija (ámbar = atención, desvío = fuera de plan,
 * dentro-de-plan = ok). No hay colores decorativos.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B1E25', // fondo de aplicación
        panel: '#102A33', // paneles / tarjetas
        line: '#1E4351', // líneas, bordes, divisores
        tech: '#7EA5B0', // acento técnico (neutro, datos secundarios)
        amber: '#E8A33D', // acento ámbar (requiere atención / decisión)
        deviation: '#C4623F', // desvío (fuera de plan)
        onplan: '#5D9E82', // dentro de plan
      },
      fontFamily: {
        // Archivo para la interfaz, IBM Plex Mono para cifras.
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
