/** Color token names – synchronized with globals.css and tailwind.config */
export type ColorToken =
    | 'background' | 'foreground' | 'surface' | 'surface-2' | 'border'
    | 'brand' | 'brand-300' | 'brand-600' | 'brand-700' | 'brand-foreground'
    | 'muted-foreground'
    | 'success' | 'warning' | 'error' | 'info';

/** Mapping from token → CSS variable */
export const cssVars: Record<ColorToken, string> = {
    background: '--background',
    foreground: '--foreground',
    surface: '--surface',
    'surface-2': '--surface-2',
    border: '--border',
    brand: '--brand',
    'brand-300': '--brand-300',
    'brand-600': '--brand-600',
    'brand-700': '--brand-700',
    'brand-foreground': '--brand-foreground',
    'muted-foreground': '--muted-foreground',
    success: '--success',
    warning: '--warning',
    error: '--error',
    info: '--info',
};

/** CSS string like hsl(var(--brand) / 0.2) – convenient for inline styles/React */
export const color = (name: ColorToken, alpha?: number) =>
    alpha != null
        ? `hsl(var(${cssVars[name]}) / ${alpha})`
        : `hsl(var(${cssVars[name]}))`;

/** Fonts as tokens – mapped in tailwind.config to var(--font-*) */
export const fonts = {
    sans: 'var(--font-geist-sans)',
    mono: 'var(--font-geist-mono)',
};

/** Typography (matches your scale) */
export const fontSizes = {
    display: '3.167rem', // ~38pt
    h1: '2.333rem',      // ~28pt
    h2: '2rem',          // 24pt
    h3: '1.667rem',      // ~20pt
    h4: '1.5rem',        // 18pt
    h5: '1.333rem',      // ~16pt
    h6: '1.167rem',      // ~14pt
    body: '1rem',
} as const;

/** Radii/shadows – optional, if using semantic tokens */
export const radii = { sm: 8, md: 12, lg: 16, xl: 24 } as const;

/* ---------------------- Converters/Readers (for Canvas, etc.) ---------------------- */

const isServer = typeof window === 'undefined';

/** Reads the raw value of a CSS variable (e.g., "169 100% 8%") after hydration */
export function readCssVar(varName: string, el: HTMLElement = document.documentElement) {
    if (isServer) return ''; // on the server CSS variables are not available
    return getComputedStyle(el).getPropertyValue(varName).trim();
}

/** Parses "H S% L%" → [h, s, l] */
function parseHslRaw(raw: string): [number, number, number] {
    // expected format "169 100% 8%"
    const [h, s, l] = raw.split(/\s+/);
    return [Number(h), Number(s.replace('%', '')) / 100, Number(l.replace('%', '')) / 100];
}

/** HSL → HEX (#rrggbb) */
function hslToHex(h: number, s: number, l: number): string {
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const c = l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
        const v = Math.round(255 * c);
        return v.toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

/** Returns the HEX value of the current token (after hydration) – useful for Canvas */
export function colorHex(name: ColorToken, el?: HTMLElement): string {
    const raw = readCssVar(cssVars[name], el);
    if (!raw) return '#000000';
    const [h, s, l] = parseHslRaw(raw);
    return hslToHex(h, s, l);
}
