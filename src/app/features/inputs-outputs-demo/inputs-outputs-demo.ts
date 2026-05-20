import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-iocounter',
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="counter">
      <header>{{ label() }}</header>
      <div class="row">
        <button mat-icon-button (click)="dec()"><mat-icon fontSet="material-symbols-outlined">remove</mat-icon></button>
        <span class="value">{{ count() }}</span>
        <button mat-icon-button (click)="inc()"><mat-icon fontSet="material-symbols-outlined">add</mat-icon></button>
      </div>
    </div>
  `,
  styles: [`
    .counter { background: var(--surface-2); border: 1px solid var(--surface-border);
               border-radius: 10px; padding: 0.7rem 0.95rem; display: flex; flex-direction: column; gap: 0.3rem; }
    header { font-family: 'JetBrains Mono', monospace; color: var(--accent-strong); font-size: 0.85rem; }
    .row { display: flex; align-items: center; gap: 0.5rem; }
    .value { font-size: 1.4rem; font-weight: 600; min-width: 2ch; text-align: center; }
  `],
})
export class IOCounter {
  label = input.required<string>();
  count = model(0);
  bumped = output<number>();

  inc() {
    this.count.update((c) => c + 1);
    this.bumped.emit(this.count());
  }
  dec() {
    this.count.update((c) => c - 1);
    this.bumped.emit(this.count());
  }
}

@Component({
  selector: 'app-inputs-outputs-demo',
  imports: [IOCounter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="hint">
      Parent state binds two-way via <code>[(count)]</code> (model signal).
      Child also emits an <code>output()</code> on every change.
    </p>

    <div class="row">
      <app-iocounter label="Items" [(count)]="items" (bumped)="onBump('Items', $event)" />
      <app-iocounter label="Pages" [(count)]="pages" (bumped)="onBump('Pages', $event)" />
    </div>

    <div class="parent">
      <small>Parent state:</small>
      <code>{{ '{ items: ' + items() + ', pages: ' + pages() + ' }' }}</code>
    </div>

    <div class="log">
      <header>output() emissions</header>
      <ol>
        @for (entry of log(); track $index) {
          <li>{{ entry }}</li>
        } @empty {
          <li class="empty">No emissions yet.</li>
        }
      </ol>
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; gap: 1rem; }
    .hint { color: var(--text-secondary); margin: 0; line-height: 1.5; }
    .hint code { color: var(--accent-strong); }
    .row { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .parent { background: var(--surface-2); border: 1px solid var(--surface-border);
              border-radius: 10px; padding: 0.55rem 0.85rem; display: flex; align-items: baseline; gap: 0.5rem; }
    .parent small { color: var(--text-muted); }
    .parent code { font-family: 'JetBrains Mono', monospace; color: var(--accent-strong); }
    .log { background: var(--surface-2); border: 1px solid var(--surface-border); border-radius: 10px; }
    .log header { padding: 0.4rem 0.85rem; border-bottom: 1px solid var(--surface-border);
                  color: var(--text-muted); font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; }
    ol { list-style: none; margin: 0; padding: 0.4rem 0.85rem; max-height: 120px; overflow-y: auto;
         font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--text-secondary); }
    li.empty { color: var(--text-muted); font-style: italic; }
  `],
})
export class InputsOutputsDemo {
  protected readonly items = signal(3);
  protected readonly pages = signal(7);
  protected readonly log = signal<string[]>([]);

  onBump(which: string, value: number) {
    const time = new Date().toLocaleTimeString();
    this.log.update((l) => [`[${time}] (bumped) ${which} = ${value}`, ...l].slice(0, 20));
  }
}
