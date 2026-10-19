/**
 * Theme plugins (`contributes.styles`): the stylesheets of every active plugin, fetched from the
 * window's own daemon and applied for as long as the plugin stays enabled.
 *
 * `window` sheets go into this page's `<head>`, after the app's own CSS; `documents` sheets ride
 * into every markdown and diff frame (`prepareContentDocument`'s `styles`), which a sheet on this
 * page cannot reach. The text comes from the `styles` action rather than on the plugin list, so
 * `kelpi plugin list` stays readable, and it is asked for again whenever the list changes in a way
 * that could change a sheet: a plugin with styles enabled, disabled, reloaded or moved to another
 * revision.
 */

import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { pluginRecord, type PluginInfo } from '@kelpi/protocol';

import type { KelpiRuntime } from '../state';
import { pluginRequest, usePlugins } from './client';

export interface PluginStyleSet {
    readonly window: readonly string[];
    readonly documents: readonly string[];
}

export const NO_PLUGIN_STYLES: PluginStyleSet = { window: [], documents: [] };

const PluginStylesContext = createContext<PluginStyleSet>(NO_PLUGIN_STYLES);
export const PluginStylesProvider = PluginStylesContext.Provider;

/** The active theme stylesheets, for anything below the app root. */
export function usePluginStyleSet(): PluginStyleSet {
    return useContext(PluginStylesContext);
}

/** What decides the sheets: each active plugin that declares styles, at its revision and instance. */
export function pluginStylesKey(plugins: readonly PluginInfo[]): string {
    return plugins
        .filter((plugin) => plugin.enabled && plugin.status !== 'failed' && (plugin.manifest.contributes.styles?.length ?? 0) > 0)
        .map((plugin) => `${plugin.manifest.id}@${plugin.revision}@${plugin.instanceID}`)
        .sort()
        .join('\n');
}

/** The `styles` reply split by target, in a stable order: plugin id, then manifest order. */
export function pluginStyleSet(reply: unknown): PluginStyleSet {
    if (!Array.isArray(reply)) return NO_PLUGIN_STYLES;
    const plugins = reply
        .filter(pluginRecord)
        .filter((plugin) => typeof plugin['pluginID'] === 'string' && Array.isArray(plugin['styles']))
        .sort((a, b) => String(a['pluginID']).localeCompare(String(b['pluginID'])));
    const window: string[] = [];
    const documents: string[] = [];
    for (const plugin of plugins) {
        for (const sheet of plugin['styles'] as unknown[]) {
            if (!pluginRecord(sheet) || typeof sheet['css'] !== 'string') continue;
            (sheet['target'] === 'documents' ? documents : window).push(sheet['css']);
        }
    }
    return window.length || documents.length ? { window, documents } : NO_PLUGIN_STYLES;
}

/**
 * The window's own daemon's theme stylesheets: empty while there are none, and the last ones
 * fetched until a changed set arrives, so a reload restyles in one step rather than flashing the
 * stock look in between.
 */
export function usePluginStyles(runtime: KelpiRuntime): PluginStyleSet {
    const { plugins } = usePlugins(runtime);
    const key = pluginStylesKey(plugins);
    const [fetched, setFetched] = useState<PluginStyleSet>(NO_PLUGIN_STYLES);
    useEffect(() => {
        if (key === '') {
            setFetched(NO_PLUGIN_STYLES);
            return;
        }
        let current = true;
        pluginRequest(runtime, 'styles').then(
            (reply) => {
                if (current) setFetched(pluginStyleSet(reply));
            },
            // A failed fetch keeps what is applied: no reason to unstyle the window over it.
            () => {}
        );
        return () => {
            current = false;
        };
    }, [runtime, key]);
    return key === '' ? NO_PLUGIN_STYLES : fetched;
}

/**
 * Puts the `window` sheets into this page's `<head>`, after the app's own CSS, and takes them out
 * again. A LAYOUT effect, so they are in place before any passive effect reads a computed style
 * (`App.tsx` resolves the terminal palette from `--kelpi-term-*` in one).
 */
export function PluginWindowStyles(props: { readonly styles: readonly string[] }): null {
    useLayoutEffect(() => {
        const elements = props.styles.map((css) => {
            const element = document.createElement('style');
            element.setAttribute('data-kelpi-plugin-style', '');
            element.textContent = css;
            document.head.append(element);
            return element;
        });
        return () => {
            for (const element of elements) element.remove();
        };
    }, [props.styles]);
    return null;
}
