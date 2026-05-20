import { CodeCase } from '../../core/features/feature.model';

export interface CaseResult {
  ok: boolean;
  actual?: unknown;
  expected: unknown;
  call: string;
  label?: string;
  error?: string;
}

export interface RunResult {
  passed: number;
  total: number;
  cases: CaseResult[];
  fatal?: string;
}

const WORKER_SOURCE = `
self.onmessage = function (e) {
  var code = e.data.code;
  var cases = e.data.cases;
  var results = [];
  for (var i = 0; i < cases.length; i++) {
    var c = cases[i];
    try {
      var fn = new Function('"use strict";\\n' + code + '\\nreturn (' + c.call + ');');
      var value = fn();
      results.push({ ok: true, actual: value });
    } catch (err) {
      results.push({ ok: false, error: String((err && err.message) || err) });
    }
  }
  self.postMessage({ results: results });
};
`;

export function runCode(
  code: string,
  cases: CodeCase[],
  timeoutMs = 3000,
): Promise<RunResult> {
  return new Promise((resolve) => {
    let resolved = false;
    let worker: Worker | null = null;
    let url: string | null = null;

    const finish = (result: RunResult) => {
      if (resolved) return;
      resolved = true;
      if (worker) {
        try {
          worker.terminate();
        } catch {
          /* ignore */
        }
      }
      if (url) {
        try {
          URL.revokeObjectURL(url);
        } catch {
          /* ignore */
        }
      }
      resolve(result);
    };

    const timer = setTimeout(() => {
      finish({
        passed: 0,
        total: cases.length,
        cases: cases.map((c) => ({
          ok: false,
          expected: c.expected,
          call: c.call,
          label: c.label,
          error: `Timed out after ${timeoutMs}ms — possible infinite loop`,
        })),
        fatal: `Execution timed out after ${timeoutMs}ms. Check for an infinite loop.`,
      });
    }, timeoutMs);

    try {
      const blob = new Blob([WORKER_SOURCE], { type: 'application/javascript' });
      url = URL.createObjectURL(blob);
      worker = new Worker(url);

      worker.onmessage = (e: MessageEvent<{ results: Array<{ ok: boolean; actual?: unknown; error?: string }> }>) => {
        clearTimeout(timer);
        const raw = e.data.results;
        const caseResults: CaseResult[] = raw.map((r, i) => {
          const c = cases[i];
          if (!r.ok) {
            return {
              ok: false,
              expected: c.expected,
              error: r.error,
              call: c.call,
              label: c.label,
            };
          }
          const ok = deepEqual(r.actual, c.expected);
          return {
            ok,
            actual: r.actual,
            expected: c.expected,
            call: c.call,
            label: c.label,
          };
        });
        finish({
          passed: caseResults.filter((r) => r.ok).length,
          total: caseResults.length,
          cases: caseResults,
        });
      };

      worker.onerror = (event) => {
        clearTimeout(timer);
        finish({
          passed: 0,
          total: cases.length,
          cases: cases.map((c) => ({
            ok: false,
            expected: c.expected,
            call: c.call,
            label: c.label,
            error: event.message || 'Worker error',
          })),
          fatal: event.message || 'Worker error',
        });
      };

      worker.postMessage({ code, cases });
    } catch (err) {
      clearTimeout(timer);
      finish({
        passed: 0,
        total: cases.length,
        cases: [],
        fatal: `Could not start runner: ${String(err)}`,
      });
    }
  });
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (typeof a !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((x, i) => deepEqual(x, b[i]));
  }
  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;
  const ak = Object.keys(aObj).sort();
  const bk = Object.keys(bObj).sort();
  if (ak.length !== bk.length) return false;
  if (ak.some((k, i) => k !== bk[i])) return false;
  return ak.every((k) => deepEqual(aObj[k], bObj[k]));
}

export function formatValue(v: unknown): string {
  if (v === undefined) return 'undefined';
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}
