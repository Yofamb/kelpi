/**
 * Chrome theme tokens as CSS custom properties (shell-ui.md §2).
 *
 * The grid never resolves a palette itself: it reads `var(--kelpi-*)` with the dark preset
 * baked in as the fallback, so the module renders correctly standalone (tests, storybook)
 * and assembly can unify the whole app by defining the variables once on `:root`.
 * Fallback values are the dark column of the preset table in shell-ui.md §2.
 */

export const GRID_TOKEN_FALLBACKS = {
    '--kelpi-bg': '#1F1E1D', // windowBackground: gaps between panes / empty grid
    '--kelpi-header-bg': '#262624', // headerBackground: pane headers, overlays
    '--kelpi-surface-bg': '#2C2B28', // surfaceBackground: chips, popovers
    '--kelpi-fg': '#F0EEE6', // textPrimary
    '--kelpi-fg-secondary': '#B4B1A7', // textSecondary
    '--kelpi-fg-tertiary': '#85837B', // textTertiary
    '--kelpi-border': '#3A3935', // divider
    '--kelpi-accent': '#D97757', // accent
    /**
     * M13 — the macOS **system** accent, as its own name.
     *
     * `PaneHeaderView.swift:88,91`, `PaneGridView.swift:451-452` and `SplitDividerView.swift:20`
     * paint the label chip, the drop-zone overlay and the divider's drag tint with
     * `Color.accentColor`, and the shipped app ships no `AccentColor.colorset` — so those three
     * surfaces follow the **OS** accent and are untouched by Settings ▸ Appearance ▸ "Sidebar
     * highlight", which in the Swift recolours only `theme.accent` (the sidebar).
     *
     * The port cannot read the OS accent from the renderer: `systemPreferences.getAccentColor()`
     * is a main-process API, there is no preload bridge, and reaching it would mean a new wire
     * message through protocol → daemon → client. That is **ledgered as a standing divergence**
     * rather than built here. What this token buys is the seam: the three surfaces now read one
     * name, it falls back to `--kelpi-accent` so today's palette is byte-identical, and whoever
     * threads the OS accent through later defines this one variable and all three follow.
     */
    '--kelpi-system-accent': 'var(--kelpi-accent, #D97757)', // systemAccent (M13)
    '--kelpi-pane-focus': '#D97757', // paneFocus (independently themable)
    '--kelpi-status-running': '#8CBF7F', // statusRunning
    '--kelpi-status-waiting': '#D97757', // statusWaiting
    '--kelpi-status-inactive': '#87857E', // statusInactive
    '--kelpi-agent': '#D9A35B', // activeAgent (amber agent badge / elapsed timer)
    /**
     * L27 — the header's **one** orange.
     *
     * `PaneHeaderView.swift:109,112` (ZOOM) and `:134,137` (SYNC) are both `.orange`, the system
     * colour, and neither is part of `chromeTheme` — so in the shipped app the two badges are
     * always the same hue and always distinct from the agent amber. The port had drifted to two
     * different ambers: ZOOM on a hard-coded `#D08237` (the only colour in the grid that was not
     * a `--kelpi-*` name, so it survived the light/dark swap unchanged) and SYNC repainted with
     * `--kelpi-agent`, which made a synced pane read as a pane with a running agent.
     *
     * One name, both badges, and a light column so it actually swaps. The values are the warm
     * palette's orange, a step lighter and yellower than the clay accent so a zoomed pane never
     * reads as a focused one. Not repainted to SwiftUI's literal `Color.orange` (`#FF9F0A` dark /
     * `#FF9500` light) — that is a palette decision the preset table owns, and this row is about
     * the token, not the hue.
     */
    '--kelpi-orange': '#E08A5E'
} as const;

export type GridTokenName = keyof typeof GRID_TOKEN_FALLBACKS;

/** `var(--kelpi-x, <dark preset>)` — usable anywhere a CSS color string is. */
export function token(name: GridTokenName): string {
    return `var(${name}, ${GRID_TOKEN_FALLBACKS[name]})`;
}

/** Colors resolved once, so components read `tokens.headerBackground` rather than raw vars. */
export const tokens = {
    windowBackground: token('--kelpi-bg'),
    headerBackground: token('--kelpi-header-bg'),
    surfaceBackground: token('--kelpi-surface-bg'),
    textPrimary: token('--kelpi-fg'),
    textSecondary: token('--kelpi-fg-secondary'),
    textTertiary: token('--kelpi-fg-tertiary'),
    divider: token('--kelpi-border'),
    accent: token('--kelpi-accent'),
    systemAccent: token('--kelpi-system-accent'),
    paneFocus: token('--kelpi-pane-focus'),
    statusRunning: token('--kelpi-status-running'),
    statusWaiting: token('--kelpi-status-waiting'),
    statusInactive: token('--kelpi-status-inactive'),
    activeAgent: token('--kelpi-agent'),
    /** L27 — `.orange`: the ZOOM and SYNC badges, and nothing else. */
    orange: token('--kelpi-orange')
} as const;

/**
 * Badge pills are the token color at a percentage opacity. CSS custom properties can't be
 * alpha-composited with `color-mix` fallbacks reliably across the theme swap, so the pill fill
 * is expressed as `color-mix` with a literal fallback color.
 *
 * The default is the agent badge's 14% (agent-lifecycle.md §5.9,
 * `PaneHeaderView.swift:329,336`), which is the one the spec writes down. It is **not** the only
 * tone: M14 — `PaneHeaderView.swift` draws the label chip / ZOOM / SYNC at 12 (`:91`, `:112`,
 * `:137`) and SYNC OFF / the branch chip at 10 (`:153`, `:174`), so `PaneHeader`'s `Badge` names
 * its own `fill` at every call site rather than inheriting one flat recipe.
 */
export function pill(color: string, percent = 14): string {
    return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}
