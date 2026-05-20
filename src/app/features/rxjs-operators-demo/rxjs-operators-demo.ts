import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subject, of, timer, EMPTY } from 'rxjs';
import {
  switchMap,
  mergeMap,
  concatMap,
  exhaustMap,
  delay,
  map,
  catchError,
} from 'rxjs/operators';

type OpKind = 'switchMap' | 'mergeMap' | 'concatMap' | 'exhaustMap';

interface Lane {
  op: OpKind;
  description: string;
  log: string[];
}

@Component({
  selector: 'app-rxjs-operators-demo',
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo">
      <p class="hint">
        Each click emits a value into all four streams. Each "inner" Observable
        takes 1.2s to complete. Watch how each operator handles concurrency.
      </p>
      <div class="row">
        <button mat-raised-button color="primary" (click)="trigger()">
          <mat-icon fontSet="material-symbols-outlined">play_arrow</mat-icon>
          Trigger ({{ tick() }})
        </button>
        <button mat-stroked-button (click)="clear()">Clear logs</button>
      </div>

      <div class="lanes">
        @for (lane of lanes(); track lane.op) {
          <div class="lane">
            <header>
              <strong>{{ lane.op }}</strong>
              <span>{{ lane.description }}</span>
            </header>
            <ol>
              @for (entry of lane.log; track $index) {
                <li [class.complete]="entry.startsWith('✓')">{{ entry }}</li>
              } @empty {
                <li class="empty">No emissions yet.</li>
              }
            </ol>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .demo { display: flex; flex-direction: column; gap: 1rem; }
    .hint { color: var(--text-secondary); margin: 0; line-height: 1.5; }
    .row { display: flex; gap: 0.65rem; }
    .lanes { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0.75rem; }
    .lane { background: var(--surface-2); border: 1px solid var(--surface-border); border-radius: 10px; overflow: hidden; }
    header { padding: 0.55rem 0.85rem; background: var(--surface-3); border-bottom: 1px solid var(--surface-border);
             display: flex; flex-direction: column; gap: 0.15rem; }
    header strong { font-family: 'JetBrains Mono', monospace; color: var(--accent-strong); font-size: 0.95rem; }
    header span { color: var(--text-muted); font-size: 0.75rem; }
    ol { list-style: none; margin: 0; padding: 0.5rem 0.85rem; max-height: 150px; overflow-y: auto;
         font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; color: var(--text-secondary); }
    li { padding: 0.18rem 0; animation: fadeIn 0.2s ease; }
    li.complete { color: var(--success); }
    li.empty { color: var(--text-muted); font-style: italic; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `],
})
export class RxjsOperatorsDemo {
  protected readonly tick = signal(0);
  protected readonly lanes = signal<Lane[]>([
    { op: 'switchMap', description: 'Cancel previous inner', log: [] },
    { op: 'mergeMap',  description: 'Run all concurrently', log: [] },
    { op: 'concatMap', description: 'Queue, one at a time', log: [] },
    { op: 'exhaustMap', description: 'Ignore until inner completes', log: [] },
  ]);

  private input$ = new Subject<number>();

  constructor() {
    this.wire('switchMap',  (n) => this.input$.pipe(switchMap((v) => this.inner(v))));
    this.wire('mergeMap',   (n) => this.input$.pipe(mergeMap((v) => this.inner(v))));
    this.wire('concatMap',  (n) => this.input$.pipe(concatMap((v) => this.inner(v))));
    this.wire('exhaustMap', (n) => this.input$.pipe(exhaustMap((v) => this.inner(v))));
  }

  private wire(op: OpKind, build: (n: number) => any) {
    build(0)
      .pipe(catchError(() => EMPTY))
      .subscribe((label: string) => this.append(op, label));
  }

  private inner(n: number) {
    return timer(1200).pipe(
      map(() => `✓ inner #${n} completed`),
    );
  }

  trigger() {
    this.tick.update((t) => t + 1);
    const n = this.tick();
    for (const op of ['switchMap', 'mergeMap', 'concatMap', 'exhaustMap'] as OpKind[]) {
      this.append(op, `→ emit #${n}`);
    }
    this.input$.next(n);
  }

  private append(op: OpKind, entry: string) {
    this.lanes.update((lanes) =>
      lanes.map((l) => (l.op === op ? { ...l, log: [entry, ...l.log].slice(0, 30) } : l)),
    );
  }

  clear() {
    this.lanes.update((lanes) => lanes.map((l) => ({ ...l, log: [] })));
    this.tick.set(0);
  }
}
