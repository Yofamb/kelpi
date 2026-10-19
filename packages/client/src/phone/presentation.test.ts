import { describe, expect, it } from 'vitest';

import { landingGreeting } from './PhoneLanding';
import { phonePaneName } from './ui';

describe('phonePaneName', () => {
    it('is the name a pane was given, so three panes in one directory are three different rows', () => {
        expect(phonePaneName({ label: 'coordinator' }, '~/acme-web')).toBe('coordinator');
    });

    it('falls back to the header title for a pane nobody named, or named with whitespace', () => {
        expect(phonePaneName({ label: null }, '~/acme-web')).toBe('~/acme-web');
        expect(phonePaneName({ label: '   ' }, '~/acme-web')).toBe('~/acme-web');
    });
});

describe('landingGreeting', () => {
    const at = (hour: number): Date => new Date(2026, 9, 19, hour, 30);

    it('follows the phone’s own clock through the day', () => {
        expect(landingGreeting(at(5))).toBe('Good morning');
        expect(landingGreeting(at(11))).toBe('Good morning');
        expect(landingGreeting(at(12))).toBe('Good afternoon');
        expect(landingGreeting(at(17))).toBe('Good afternoon');
        expect(landingGreeting(at(18))).toBe('Good evening');
        expect(landingGreeting(at(2))).toBe('Good evening');
    });
});
