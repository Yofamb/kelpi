/**
 * Reconnect backoff as an Effect `Schedule` (spike — see `docs/audit/effect-spike/`).
 *
 * This replaces the hand-rolled `nextDelay()` arithmetic that used to live in `socket.ts`
 * (capped exponential growth, mutate-an-attempt-counter, apply symmetric jitter) with the same
 * math expressed as a `Schedule<number>` and stepped with `Schedule.driver`. The formula is
 * unchanged on purpose — this is a like-for-like swap of *how the delay is computed*, not a
 * change to the backoff curve itself, so `jitter: 0` stays byte-for-byte deterministic for the
 * existing test suite.
 *
 * Deliberately NOT in scope for this spike: the actual `setTimeout`/`clearTimeout` scheduling
 * of the reconnect attempt. `KelpiConnection.resync()` and `.close()` require reconnect
 * cancellation to take effect synchronously (a stray attempt must never sneak in before the
 * method returns), which is exactly what a plain `clearTimeout` guarantees and what `Fiber`
 * interruption does not: `Fiber.interruptFork` schedules interruption onto the runtime rather
 * than completing it inline, and `Fiber.interrupt` (which does await completion) is not
 * synchronously drainable from `close()`'s non-async public signature. Driving the *timer*
 * itself with Effect would mean making `close()`/`resync()` async — a bigger, riskier change
 * than this spike is scoped for. See the write-up for the fuller tradeoff.
 */

import { Effect, Schedule } from 'effect';

export interface BackoffPolicy {
    readonly initialMs: number;
    readonly maxMs: number;
    readonly factor: number;
    /** Fractional jitter applied symmetrically (0.2 = ±20%). 0 disables it. */
    readonly jitter: number;
    readonly random: () => number;
}

/**
 * `initialMs, initialMs*factor, initialMs*factor^2, …` capped at `maxMs`, then (when
 * `jitter > 0`) perturbed by ±`jitter` fraction using the injected `random()` — the same
 * generator tests already inject to make backoff deterministic.
 */
export function backoffSchedule(policy: BackoffPolicy): Schedule.Schedule<number> {
    // `Schedule.exponential` folds in `Clock`-driven recurrence timing, which makes its driver
    // un-runnable via `Effect.runSync` (it throws `AsyncFiberException` even though nothing here
    // actually needs to wait). `Schedule.unfold` is the Clock-free primitive: pure state
    // transition (attempt count), no notion of elapsed real time — exactly what a value
    // generator sampled on demand needs. See the write-up for the underlying "when is a
    // `Schedule` free of `Clock`" question this surfaced.
    const capped = Schedule.unfold(0, (n) => n + 1).pipe(
        Schedule.map((attempt) => Math.min(policy.maxMs, policy.initialMs * Math.pow(policy.factor, attempt)))
    );
    if (policy.jitter <= 0) return capped;
    return capped.pipe(
        Schedule.mapEffect((base) =>
            Effect.sync(() => {
                const spread = base * policy.jitter;
                return Math.max(0, Math.round(base - spread + policy.random() * spread * 2));
            })
        )
    );
}

export interface BackoffDriver {
    /** The next delay in the sequence (ms), advancing the sequence one step. */
    next(): number;
    /** Back to the first delay in the sequence — call on every successful connect. */
    reset(): void;
    /** Steps taken since the last `reset()`; `0` means "the next `next()` is the first attempt". */
    readonly attempt: number;
}

/**
 * A stepper over `backoffSchedule`, driven synchronously: computing the next delay is pure
 * (no real waiting), so `Effect.runSync` is safe here — nothing in the schedule suspends.
 */
export function createBackoffDriver(policy: BackoffPolicy): BackoffDriver {
    const driver = Effect.runSync(Schedule.driver(backoffSchedule(policy)));
    let attempt = 0;
    return {
        next(): number {
            const delay = Effect.runSync(driver.next(undefined));
            attempt += 1;
            return delay;
        },
        reset(): void {
            Effect.runSync(driver.reset);
            attempt = 0;
        },
        get attempt(): number {
            return attempt;
        }
    };
}
