import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { decodePluginManifest, type PluginInfo } from '@kelpi/protocol';

import { NO_PLUGIN_STYLES, PluginWindowStyles, pluginStyleSet, pluginStylesKey } from './styles';

const theme = (id: string, patch: Partial<PluginInfo> = {}): PluginInfo => ({
    manifest: decodePluginManifest({
        id, version: '1.0.0', apiVersion: 1, trust: 'full',
        contributes: { styles: [{ id: `${id}.window`, entry: 'ui/theme.css' }] }
    }),
    revision: 'r1', instanceID: '1:0', enabled: true, status: 'inactive', error: null, ...patch
});

afterEach(() => {
    cleanup();
});

describe('theme plugin styles', () => {
    it('keys the sheets on the active plugins that declare styles, and nothing else', () => {
        const plain = { ...theme('sample.plain'), manifest: decodePluginManifest({ id: 'sample.plain', version: '1.0.0', apiVersion: 1, trust: 'full' }) };
        expect(pluginStylesKey([plain])).toBe('');
        expect(pluginStylesKey([theme('sample.warm', { enabled: false, status: 'disabled' })])).toBe('');
        expect(pluginStylesKey([theme('sample.warm', { status: 'failed', error: 'boom' })])).toBe('');
        // A view-only plugin never reaches `running`; enabled and healthy is what counts.
        expect(pluginStylesKey([theme('sample.warm')])).toBe('sample.warm@r1@1:0');
        // A reload or a new revision is a new key, so the sheets are asked for again.
        expect(pluginStylesKey([theme('sample.warm', { instanceID: '1:1' })])).not.toBe(pluginStylesKey([theme('sample.warm')]));
    });

    it('splits the reply by target in plugin order, and ignores anything malformed', () => {
        const set = pluginStyleSet([
            { pluginID: 'sample.zeta', revision: 'r', styles: [{ id: 'sample.zeta.window', target: 'window', css: 'z{}' }] },
            { pluginID: 'sample.alpha', revision: 'r', styles: [
                { id: 'sample.alpha.window', target: 'window', css: 'a{}' },
                { id: 'sample.alpha.documents', target: 'documents', css: 'd{}' },
                { id: 'sample.alpha.broken', target: 'window', css: 7 }
            ] },
            'not a plugin'
        ]);
        expect(set).toEqual({ window: ['a{}', 'z{}'], documents: ['d{}'] });
        expect(pluginStyleSet(null)).toBe(NO_PLUGIN_STYLES);
        expect(pluginStyleSet([])).toBe(NO_PLUGIN_STYLES);
    });

    it('puts window sheets at the end of <head> and takes them out again', () => {
        const styles = ['body{color:red}', ':root{--kelpi-accent:#123456 !important}'];
        const view = render(<PluginWindowStyles styles={styles} />);
        const injected = [...document.head.querySelectorAll('style[data-kelpi-plugin-style]')];
        expect(injected.map((element) => element.textContent)).toEqual(styles);
        expect(document.head.lastElementChild).toBe(injected[1]);
        view.rerender(<PluginWindowStyles styles={[]} />);
        expect(document.head.querySelectorAll('style[data-kelpi-plugin-style]')).toHaveLength(0);
    });
});
