/** @param {import('../../../packages/plugin-sdk/index.js').BackendAPI} api */
export async function activate(api) {
    const id = 'example.geo-map-trainer';
    let stats = (await api.storage.get('stats')) ?? { streak: 0, bestStreak: 0, total: 0, correct: 0, misses: {} };

    const publish = () => {
        const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
        return api.contributions.update({
            context: { streak: stats.streak, accuracy },
            items: {
                [`${id}.status`]: {
                    badge: String(stats.streak),
                    tone: stats.streak > 0 ? 'success' : 'default',
                    tooltip: `Geo Map Trainer — streak ${stats.streak} (best ${stats.bestStreak}), ${stats.correct}/${stats.total} correct (${accuracy}%)`
                }
            }
        });
    };

    api.commands.register(`${id}.open`, () => api.openView(`${id}.trainer`));
    api.commands.register(`${id}.stats`, () => stats);

    api.commands.register(`${id}.record`, async (args) => {
        const code = String(args?.code ?? '');
        const correct = Boolean(args?.correct);
        if (!/^[A-Z]{2}$/.test(code)) throw new Error('code must be a two-letter ISO country code');
        const nextStreak = correct ? stats.streak + 1 : 0;
        stats = {
            total: stats.total + 1,
            correct: stats.correct + (correct ? 1 : 0),
            streak: nextStreak,
            bestStreak: Math.max(stats.bestStreak, nextStreak),
            // Missed countries get weighted back into rotation client-side — the trainer part
            // of "trainer": weak spots resurface more often instead of every country being
            // equally likely forever.
            misses: correct ? stats.misses : { ...stats.misses, [code]: (stats.misses[code] ?? 0) + 1 }
        };
        await api.storage.set('stats', stats);
        await publish();
        return stats;
    });

    api.commands.register(`${id}.reset`, async () => {
        stats = { streak: 0, bestStreak: 0, total: 0, correct: 0, misses: {} };
        await api.storage.set('stats', stats);
        await publish();
        return stats;
    });

    await publish();
}
