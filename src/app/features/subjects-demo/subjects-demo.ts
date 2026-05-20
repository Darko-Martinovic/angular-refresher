import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

interface SubjectRow {
  kind: 'Subject' | 'BehaviorSubject' | 'ReplaySubject(2)';
  description: string;
  initial: string[];
  late: string[];
}

@Component({
  selector: 'app-subjects-demo',
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="hint">
      "Initial" subscribed before the values were emitted; "Late" subscribed afterward.
      Watch what each variant replays to a late subscriber.
    </p>

    <div class="row">
      <button mat-raised-button color="primary" (click)="emit()">
        <mat-icon fontSet="material-symbols-outlined">send</mat-icon>
        Emit next value (#{{ counter() + 1 }})
      </button>
      <button mat-stroked-button (click)="subscribeLate()">
        <mat-icon fontSet="material-symbols-outlined">link</mat-icon>
        Subscribe a late observer
      </button>
      <button mat-stroked-button (click)="reset()">Reset</button>
    </div>

    <div class="grid">
      @for (row of rows(); track row.kind) {
        <div class="card">
          <header>
            <strong>{{ row.kind }}</strong>
            <span>{{ row.description }}</span>
          </header>
          <div class="cols">
            <div class="col">
              <small>Initial subscriber</small>
              @for (v of row.initial; track $index) { <span class="pill">{{ v }}</span> }
            </div>
            <div class="col">
              <small>Late subscriber</small>
              @for (v of row.late; track $index) { <span class="pill late">{{ v }}</span> }
              @if (!row.late.length) { <span class="hint">— not subscribed yet —</span> }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; gap: 1rem; }
    .row { display: flex; gap: 0.6rem; flex-wrap: wrap; }
    .hint { color: var(--text-muted); margin: 0; font-style: italic; }
    p.hint { color: var(--text-secondary); font-style: normal; line-height: 1.5; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 0.75rem; }
    .card { background: var(--surface-2); border: 1px solid var(--surface-border); border-radius: 10px; overflow: hidden; }
    header { padding: 0.55rem 0.85rem; background: var(--surface-3); border-bottom: 1px solid var(--surface-border);
             display: flex; flex-direction: column; }
    header strong { font-family: 'JetBrains Mono', monospace; color: var(--accent-strong); font-size: 0.95rem; }
    header span { color: var(--text-muted); font-size: 0.75rem; }
    .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; padding: 0.65rem 0.85rem; }
    .col { display: flex; flex-direction: column; gap: 0.3rem; }
    .col small { color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.04em; }
    .pill { display: inline-block; background: color-mix(in srgb, var(--accent) 16%, transparent);
            color: var(--accent-strong); padding: 0.15rem 0.55rem; border-radius: 999px;
            font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; margin-right: 0.25rem; margin-bottom: 0.25rem; }
    .pill.late { background: color-mix(in srgb, var(--tertiary) 18%, transparent); color: var(--tertiary); }
  `],
})
export class SubjectsDemo {
  protected readonly counter = signal(0);
  protected readonly rows = signal<SubjectRow[]>([
    { kind: 'Subject',           description: 'No initial, no replay',      initial: [], late: [] },
    { kind: 'BehaviorSubject',   description: 'Initial value, replays current', initial: ['0'], late: [] },
    { kind: 'ReplaySubject(2)',  description: 'Replays last 2 emissions',   initial: [], late: [] },
  ]);

  private plain = new Subject<string>();
  private behavior = new BehaviorSubject<string>('0');
  private replay = new ReplaySubject<string>(2);

  constructor() {
    this.plain.subscribe((v) => this.push('Subject', 'initial', v));
    this.behavior.subscribe((v) => this.push('BehaviorSubject', 'initial', v));
    this.replay.subscribe((v) => this.push('ReplaySubject(2)', 'initial', v));
  }

  emit() {
    const next = String(this.counter() + 1);
    this.counter.set(this.counter() + 1);
    this.plain.next(next);
    this.behavior.next(next);
    this.replay.next(next);
  }

  subscribeLate() {
    this.plain.subscribe((v) => this.push('Subject', 'late', v));
    this.behavior.subscribe((v) => this.push('BehaviorSubject', 'late', v));
    this.replay.subscribe((v) => this.push('ReplaySubject(2)', 'late', v));
  }

  reset() {
    this.plain.complete();
    this.behavior.complete();
    this.replay.complete();
    this.plain = new Subject();
    this.behavior = new BehaviorSubject<string>('0');
    this.replay = new ReplaySubject<string>(2);
    this.counter.set(0);
    this.rows.set([
      { kind: 'Subject',           description: 'No initial, no replay',      initial: [], late: [] },
      { kind: 'BehaviorSubject',   description: 'Initial value, replays current', initial: ['0'], late: [] },
      { kind: 'ReplaySubject(2)',  description: 'Replays last 2 emissions',   initial: [], late: [] },
    ]);
    this.plain.subscribe((v) => this.push('Subject', 'initial', v));
    this.behavior.subscribe((v) => this.push('BehaviorSubject', 'initial', v));
    this.replay.subscribe((v) => this.push('ReplaySubject(2)', 'initial', v));
  }

  private push(kind: SubjectRow['kind'], which: 'initial' | 'late', value: string) {
    this.rows.update((rows) =>
      rows.map((r) =>
        r.kind === kind ? { ...r, [which]: [...r[which], value] } : r,
      ),
    );
  }
}
