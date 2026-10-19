import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { JsonObject } from '@kelpi/protocol';
import { createStore } from '../store/store.js';
import { seededState } from '../store/testing.js';
import { PluginService } from './service.js';

const id = 'sample.warm';
const cleanups: Array<() => Promise<void>> = [];
afterEach(async () => { for (const stop of cleanups.splice(0).reverse()) await stop(); });

function harness() {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'kelpi-plugin-styles-'));
    const source = path.join(root, 'source'); fs.mkdirSync(path.join(source, 'ui'), { recursive: true });
    fs.writeFileSync(path.join(source, 'kelpi.plugin.json'), JSON.stringify({ id, name: 'Warm', version: '1.0.0', apiVersion: 1, trust: 'full', activation: 'startup', contributes: {
        styles: [{ id: `${id}.window`, entry: 'ui/theme.css' }, { id: `${id}.documents`, entry: 'ui/documents.css', target: 'documents' }] } }));
    fs.writeFileSync(path.join(source, 'ui/theme.css'), ':root { --kelpi-accent: #d97757 !important; }');
    fs.writeFileSync(path.join(source, 'ui/documents.css'), 'body { font-family: serif; }');
    const service = new PluginService({ directory: path.join(root, 'installed'), store: createStore(seededState()), command: vi.fn(async (): Promise<JsonObject> => ({ ok: true })), broadcast: vi.fn() });
    cleanups.push(async () => { await service.dispose(); fs.rmSync(root, { recursive: true, force: true }); });
    return { source, service };
}

describe('theme plugin stylesheets', () => {
    it('serves an enabled plugin’s sheets by the styles action, and none once it is disabled', async () => {
        const h = harness();
        await h.service.install(h.source, true);
        const [info] = h.service.list();
        // The list the CLI prints stays free of stylesheet text.
        expect(info).not.toHaveProperty('styles');
        expect(await h.service.request('styles', {})).toEqual([{ pluginID: id, revision: info!.revision, styles: [
            { id: `${id}.window`, target: 'window', css: ':root { --kelpi-accent: #d97757 !important; }' },
            { id: `${id}.documents`, target: 'documents', css: 'body { font-family: serif; }' }
        ] }]);
        await h.service.request('disable', { pluginID: id });
        expect(await h.service.request('styles', {})).toEqual([]);
        await h.service.request('enable', { pluginID: id });
        expect(await h.service.request('styles', {})).toHaveLength(1);
    });
});
