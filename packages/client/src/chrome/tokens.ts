/**
 * The chrome's CSS custom properties, with the dark preset baked in as a literal fallback.
 *
 * `theme.ts` RESOLVES a palette; this module is how components CONSUME one. Every color is
 * read as `var(--kelpi-x, <dark preset>)`, so a chrome component renders correctly even when it
 * is mounted without a `ThemeProvider` (unit tests, an embedder that owns `:root` itself), and
 * assembly can unify the whole app by defining the variables once.
 *
 * `CHROME_TOKEN_FALLBACKS` is asserted against `chromeThemeCssVars(DARK_CHROME_THEME)` in
 * `tokens.test.ts`, so the literals here cannot drift from the preset table.
 */

/** Dark-column fallbacks (shell-ui.md §2 preset table). */
export const CHROME_TOKEN_FALLBACKS = {
    '--kelpi-bg': '#1F1E1D',
    /**
     * §N17 — the window GROUND, `theme.ts`'s `WINDOW_FILL_CSS_VAR`.
     *
     * Same value as `--kelpi-bg` until the shell creates the window transparent, at which point
     * it becomes `transparent`: `RootChromeView.swift:32-39` skips its opaque backdrop below
     * `background-opacity` 1 so each pane's own fill is the single translucent layer. Only two
     * elements may read it — `<body>` and the app root. Everything else keeps `--kelpi-bg`.
     */
    '--kelpi-window-fill': '#1F1E1D',
    '--kelpi-sidebar-bg': '#1F1E1D',
    '--kelpi-surface': '#2C2B28',
    '--kelpi-header-bg': '#262624',
    '--kelpi-footer-bg': '#1F1E1D',
    '--kelpi-fg': '#F0EEE6',
    '--kelpi-fg-secondary': '#B4B1A7',
    '--kelpi-fg-tertiary': '#85837B',
    '--kelpi-border': '#3A3935',
    '--kelpi-selection-fill': 'rgba(217, 119, 87, 0.16)',
    '--kelpi-selection-stroke': '#D97757',
    '--kelpi-accent': '#D97757',
    '--kelpi-pane-focus': '#D97757',
    '--kelpi-status-running': '#8CBF7F',
    '--kelpi-status-waiting': '#D97757',
    '--kelpi-status-inactive': '#87857E',
    '--kelpi-active-agent': '#D9A35B',
    '--kelpi-group-band-opacity': '0.16'
} as const;

export type ChromeTokenName = keyof typeof CHROME_TOKEN_FALLBACKS;

/** `var(--kelpi-x, <dark preset>)` — usable anywhere a CSS color string is. */
export function token(name: ChromeTokenName): string {
    return `var(${name}, ${CHROME_TOKEN_FALLBACKS[name]})`;
}

/** Named reads, so components say `tokens.textSecondary` rather than a raw variable. */
export const tokens = {
    windowBackground: token('--kelpi-bg'),
    /** §N17: the ground. `<body>` and the app root only — see `CHROME_TOKEN_FALLBACKS`. */
    windowFill: token('--kelpi-window-fill'),
    sidebarBackground: token('--kelpi-sidebar-bg'),
    surfaceBackground: token('--kelpi-surface'),
    headerBackground: token('--kelpi-header-bg'),
    footerBackground: token('--kelpi-footer-bg'),
    textPrimary: token('--kelpi-fg'),
    textSecondary: token('--kelpi-fg-secondary'),
    textTertiary: token('--kelpi-fg-tertiary'),
    divider: token('--kelpi-border'),
    selectionFill: token('--kelpi-selection-fill'),
    selectionStroke: token('--kelpi-selection-stroke'),
    accent: token('--kelpi-accent'),
    paneFocus: token('--kelpi-pane-focus'),
    statusRunning: token('--kelpi-status-running'),
    statusWaiting: token('--kelpi-status-waiting'),
    statusInactive: token('--kelpi-status-inactive'),
    activeAgent: token('--kelpi-active-agent')
} as const;
