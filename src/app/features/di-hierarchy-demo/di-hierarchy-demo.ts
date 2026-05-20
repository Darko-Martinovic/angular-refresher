import { ChangeDetectionStrategy, Component, Injectable, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Injectable({ providedIn: 'root' })
class CounterService {
  private static instanceCount = 0;
  readonly id: number;
  constructor() {
    this.id = ++CounterService.instanceCount;
  }
}

@Component({
  selector: 'app-di-leaf',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="leaf">
      <mat-icon fontSet="material-symbols-outlined">extension</mat-icon>
      <div>
        <strong>{{ label }}</strong>
        <small>injected CounterService → id <code>#{{ counter.id }}</code></small>
      </div>
    </div>
  `,
  styles: [`
    .leaf { display: flex; align-items: center; gap: 0.7rem; padding: 0.65rem 0.85rem;
            background: var(--surface-2); border: 1px solid var(--surface-border);
            border-radius: 10px; }
    mat-icon { color: var(--accent-strong); }
    strong { display: block; font-weight: 500; }
    small { color: var(--text-muted); font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; }
    code { color: var(--accent-strong); }
  `],
})
export class DILeaf {
  label = '';
  counter = inject(CounterService);
  constructor() {
    this.label = `Leaf (uses parent's CounterService instance)`;
  }
}

@Component({
  selector: 'app-di-scoped-host',
  imports: [DILeaf],
  providers: [CounterService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="host">
      <header>Component-scoped host · providers: [CounterService]</header>
      <p>This host overrides the service. Its children inherit the new instance.</p>
      <app-di-leaf />
    </div>
  `,
  styles: [`
    .host { background: color-mix(in srgb, var(--tertiary) 10%, transparent);
            border: 1px solid color-mix(in srgb, var(--tertiary) 30%, transparent);
            border-radius: 10px; padding: 0.85rem 1rem;
            display: flex; flex-direction: column; gap: 0.5rem; }
    header { font-family: 'JetBrains Mono', monospace; color: var(--tertiary); font-size: 0.85rem; }
    p { margin: 0; color: var(--text-secondary); font-size: 0.9rem; }
  `],
})
export class DIScopedHost {
  constructor(public local: CounterService) {}
}

@Component({
  selector: 'app-di-hierarchy-demo',
  imports: [DILeaf, DIScopedHost],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="hint">
      The root <code>CounterService</code> is a singleton. A component that declares
      <code>providers: [CounterService]</code> gets a fresh instance. Notice the id values.
    </p>

    <div class="root">
      <header>Root scope · providedIn: 'root'</header>
      <app-di-leaf />
      <app-di-leaf />
    </div>

    <app-di-scoped-host />
    <app-di-scoped-host />
  `,
  styles: [`
    :host { display: flex; flex-direction: column; gap: 0.85rem; }
    .hint { margin: 0; color: var(--text-secondary); line-height: 1.5; }
    .hint code { color: var(--accent-strong); font-family: 'JetBrains Mono', monospace; }
    .root { background: color-mix(in srgb, var(--accent) 8%, transparent);
            border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
            border-radius: 10px; padding: 0.85rem 1rem;
            display: flex; flex-direction: column; gap: 0.5rem; }
    .root header { font-family: 'JetBrains Mono', monospace; color: var(--accent-strong); font-size: 0.85rem; }
  `],
})
export class DiHierarchyDemo {}
